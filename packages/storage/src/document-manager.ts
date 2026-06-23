import type { AccessControlConditions } from "@lit-protocol/types";
import type { EncryptedData } from "@evolve/core";
import { LitEncryption, type AuthSig } from "./lit-encryption";
import { getIPFSClient } from "./ipfs-client";
import { generateId } from "@evolve/core";

export type DocumentType = "health" | "dna" | "general";

export type DocumentAccessStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired";

export interface DocumentAccessRequest {
  id: string;
  documentId: string;
  requesterAddress: string;
  ownerAddress: string;
  status: DocumentAccessStatus;
  createdAt: number;
  resolvedAt?: number;
}

export interface EvolveDocument {
  id: string;
  owner: string;
  type: DocumentType;
  title: string;
  ipfsCid: string;
  encryptedData: EncryptedData;
  createdAt: number;
  authorizedUsers: string[];
}

export class DocumentManager {
  private documents: Map<string, EvolveDocument> = new Map();
  private accessRequests: Map<string, DocumentAccessRequest> = new Map();
  private requestCallbacks: Map<
    string,
    (request: DocumentAccessRequest) => void
  > = new Map();

  constructor(
    private lit: LitEncryption,
    private logger: {
      info: (msg: string, ...args: unknown[]) => void;
      warn: (msg: string, ...args: unknown[]) => void;
      error: (msg: string, ...args: unknown[]) => void;
    } = console,
  ) {}

  private ownerAddressCondition(owner: string): AccessControlConditions {
    return [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: owner,
        },
      },
    ];
  }

  private multiUserCondition(users: string[]): AccessControlConditions {
    const conditions: AccessControlConditions = users.map((user) => ({
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: user,
      },
    }));

    return [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: users[0],
        },
      },
      ...conditions.slice(1).map((c, i) => ({
        operator: "OR" as const,
        ...c,
      })),
    ] as unknown as AccessControlConditions;
  }

  async createDocument(
    content: string,
    type: DocumentType,
    title: string,
    owner: string,
    authSig: AuthSig,
  ): Promise<EvolveDocument> {
    const id = generateId();
    const conditions = this.ownerAddressCondition(owner);

    const encryptedData = await this.lit.encryptString(content, conditions);

    const ipfs = getIPFSClient();
    const stored = await ipfs.uploadJSON({
      id,
      type,
      title,
      owner,
      encryptedData,
      authorizedUsers: [owner],
      createdAt: Date.now(),
    });

    const doc: EvolveDocument = {
      id,
      owner,
      type,
      title,
      ipfsCid: stored.cid,
      encryptedData,
      createdAt: Date.now(),
      authorizedUsers: [owner],
    };

    this.documents.set(id, doc);
    this.logger.info(`Document ${id} (${type}) created by ${owner}`);
    return doc;
  }

  async decryptDocument(
    doc: EvolveDocument,
    authSig: AuthSig,
    chain?: string,
  ): Promise<string> {
    return this.lit.decryptString(doc.encryptedData, authSig, chain);
  }

  async requestAccess(
    documentId: string,
    requesterAddress: string,
  ): Promise<DocumentAccessRequest> {
    const doc = this.documents.get(documentId);
    if (doc === undefined) {
      throw new Error(`Document ${documentId} not found`);
    }
    if (doc.authorizedUsers.includes(requesterAddress)) {
      throw new Error(`User ${requesterAddress} already has access`);
    }

    const existing = Array.from(this.accessRequests.values()).find(
      (r) =>
        r.documentId === documentId &&
        r.requesterAddress === requesterAddress &&
        r.status === "pending",
    );
    if (existing !== undefined) {
      return existing;
    }

    const request: DocumentAccessRequest = {
      id: generateId(),
      documentId,
      requesterAddress,
      ownerAddress: doc.owner,
      status: "pending",
      createdAt: Date.now(),
    };

    this.accessRequests.set(request.id, request);

    const cb = this.requestCallbacks.get(documentId);
    if (cb !== undefined) {
      cb(request);
    }

    this.logger.info(
      `Access request ${request.id} for document ${documentId} by ${requesterAddress}`,
    );
    return request;
  }

  async approveAccess(
    requestId: string,
    ownerAuthSig: AuthSig,
    chain?: string,
  ): Promise<EvolveDocument> {
    const request = this.accessRequests.get(requestId);
    if (request === undefined) {
      throw new Error(`Access request ${requestId} not found`);
    }
    if (request.status !== "pending") {
      throw new Error(
        `Access request ${requestId} is already ${request.status}`,
      );
    }

    const doc = this.documents.get(request.documentId);
    if (doc === undefined) {
      throw new Error(`Document ${request.documentId} not found`);
    }

    const content = await this.lit.decryptString(
      doc.encryptedData,
      ownerAuthSig,
      chain,
    );

    const updatedUsers = [...doc.authorizedUsers, request.requesterAddress];
    const newConditions = this.multiUserCondition(updatedUsers);

    const newEncryptedData = await this.lit.encryptString(
      content,
      newConditions,
    );

    const ipfs = getIPFSClient();
    const stored = await ipfs.uploadJSON({
      ...doc,
      encryptedData: newEncryptedData,
      authorizedUsers: updatedUsers,
    });

    doc.ipfsCid = stored.cid;
    doc.encryptedData = newEncryptedData;
    doc.authorizedUsers = updatedUsers;

    request.status = "approved";
    request.resolvedAt = Date.now();

    this.logger.info(
      `Access granted: user ${request.requesterAddress} can now decrypt document ${doc.id}`,
    );
    return doc;
  }

  rejectAccess(requestId: string): void {
    const request = this.accessRequests.get(requestId);
    if (request === undefined) {
      throw new Error(`Access request ${requestId} not found`);
    }
    request.status = "rejected";
    request.resolvedAt = Date.now();
    this.logger.info(`Access rejected for request ${requestId}`);
  }

  getDocument(documentId: string): EvolveDocument | undefined {
    return this.documents.get(documentId);
  }

  getAccessRequest(requestId: string): DocumentAccessRequest | undefined {
    return this.accessRequests.get(requestId);
  }

  getPendingRequests(documentId?: string): DocumentAccessRequest[] {
    const all = Array.from(this.accessRequests.values()).filter(
      (r) => r.status === "pending",
    );
    if (documentId !== undefined) {
      return all.filter((r) => r.documentId === documentId);
    }
    return all;
  }

  getDocumentsForUser(address: string): EvolveDocument[] {
    return Array.from(this.documents.values()).filter(
      (d) => d.owner === address || d.authorizedUsers.includes(address),
    );
  }

  getAllDocuments(): EvolveDocument[] {
    return Array.from(this.documents.values());
  }

  onAccessRequest(
    documentId: string,
    callback: (request: DocumentAccessRequest) => void,
  ): void {
    this.requestCallbacks.set(documentId, callback);
  }

  offAccessRequest(documentId: string): void {
    this.requestCallbacks.delete(documentId);
  }

  clear(): void {
    this.documents.clear();
    this.accessRequests.clear();
    this.requestCallbacks.clear();
  }

  loadDocument(doc: EvolveDocument): void {
    this.documents.set(doc.id, doc);
  }
}
