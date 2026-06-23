import { describe, it, expect, vi, beforeEach } from "vitest";

const mockEncryptString = vi.fn();
const mockDecryptString = vi.fn();
const mockUpload = vi.fn();
const mockUploadJSON = vi.fn();
let idCounter = 0;

vi.mock("@evolve/core", () => ({
  generateId: vi.fn(() => `id-${++idCounter}`),
  EncryptedData: {},
}));

vi.mock("./lit-encryption", () => ({
  LitEncryption: vi.fn().mockImplementation(() => ({
    encryptString: mockEncryptString,
    decryptString: mockDecryptString,
  })),
  getLitEncryption: vi.fn(),
  resetLitEncryption: vi.fn(),
  AuthSig: {},
}));

vi.mock("./ipfs-client", () => ({
  getIPFSClient: vi.fn(() => ({
    upload: mockUpload,
    uploadJSON: mockUploadJSON,
  })),
}));

vi.mock("@lit-protocol/encryption", () => ({}));
vi.mock("@lit-protocol/lit-node-client", () => ({
  LitNodeClient: vi.fn(),
}));
vi.mock("@lit-protocol/types", () => ({}));

import { DocumentManager } from "./document-manager";

describe("DocumentManager", () => {
  let manager: DocumentManager;
  const mockLit = {
    encryptString: mockEncryptString,
    decryptString: mockDecryptString,
  } as any;
  const mockAuthSig = {
    sig: "0xsig",
    derivedVia: "web3",
    signedMessage: "msg",
    address: "0xowner",
  };

  beforeEach(() => {
    idCounter = 0;
    vi.clearAllMocks();
    manager = new DocumentManager(mockLit);
    mockEncryptString.mockResolvedValue({
      encryptedString: "encrypted-content",
      accessControlConditions: [],
    });
    mockUploadJSON.mockResolvedValue({
      cid: "QmTestCid",
      size: 100,
      timestamp: Date.now(),
    });
  });

  describe("createDocument", () => {
    it("should create a document encrypted with owner address condition", async () => {
      const doc = await manager.createDocument(
        "health data",
        "health",
        "DNA Report",
        "0xowner",
        mockAuthSig,
      );

      expect(doc.id).toBe("id-1");
      expect(doc.owner).toBe("0xowner");
      expect(doc.type).toBe("health");
      expect(doc.title).toBe("DNA Report");
      expect(doc.authorizedUsers).toEqual(["0xowner"]);
      expect(doc.ipfsCid).toBe("QmTestCid");
      expect(mockEncryptString).toHaveBeenCalledTimes(1);
      expect(mockUploadJSON).toHaveBeenCalledTimes(1);
    });

    it("should create a DNA type document", async () => {
      const doc = await manager.createDocument(
        "dna sequence",
        "dna",
        "DNA Profile",
        "0xowner",
        mockAuthSig,
      );

      expect(doc.type).toBe("dna");
      expect(doc.title).toBe("DNA Profile");
    });

    it("should store the document for retrieval", async () => {
      const doc = await manager.createDocument(
        "data",
        "health",
        "Test",
        "0xowner",
        mockAuthSig,
      );
      const retrieved = manager.getDocument(doc.id);

      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe(doc.id);
    });
  });

  describe("decryptDocument", () => {
    it("should decrypt document content via Lit", async () => {
      mockDecryptString.mockResolvedValue("decrypted health data");

      const doc = await manager.createDocument(
        "health data",
        "health",
        "Test",
        "0xowner",
        mockAuthSig,
      );
      const content = await manager.decryptDocument(doc, mockAuthSig);

      expect(content).toBe("decrypted health data");
      expect(mockDecryptString).toHaveBeenCalledWith(
        doc.encryptedData,
        mockAuthSig,
        undefined,
      );
    });
  });

  describe("requestAccess", () => {
    it("should create a pending access request", async () => {
      const doc = await manager.createDocument(
        "data",
        "health",
        "Test",
        "0xowner",
        mockAuthSig,
      );

      const request = await manager.requestAccess(doc.id, "0xrequester");

      expect(request.documentId).toBe(doc.id);
      expect(request.requesterAddress).toBe("0xrequester");
      expect(request.status).toBe("pending");
    });

    it("should throw if document not found", async () => {
      await expect(
        manager.requestAccess("nonexistent", "0xrequester"),
      ).rejects.toThrow("Document nonexistent not found");
    });

    it("should throw if user already has access", async () => {
      const doc = await manager.createDocument(
        "data",
        "health",
        "Test",
        "0xowner",
        mockAuthSig,
      );

      await expect(manager.requestAccess(doc.id, "0xowner")).rejects.toThrow(
        "already has access",
      );
    });

    it("should return existing pending request instead of creating duplicate", async () => {
      const doc = await manager.createDocument(
        "data",
        "health",
        "Test",
        "0xowner",
        mockAuthSig,
      );

      const first = await manager.requestAccess(doc.id, "0xrequester");
      const second = await manager.requestAccess(doc.id, "0xrequester");

      expect(first.id).toBe(second.id);
    });

    it("should fire callback if registered", async () => {
      const doc = await manager.createDocument(
        "data",
        "health",
        "Test",
        "0xowner",
        mockAuthSig,
      );
      const cb = vi.fn();
      manager.onAccessRequest(doc.id, cb);

      await manager.requestAccess(doc.id, "0xrequester");

      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveBeenCalledWith(
        expect.objectContaining({ status: "pending" }),
      );
    });
  });

  describe("approveAccess", () => {
    it("should re-encrypt document with both users in conditions", async () => {
      const doc = await manager.createDocument(
        "data",
        "health",
        "Test",
        "0xowner",
        mockAuthSig,
      );
      const request = await manager.requestAccess(doc.id, "0xrequester");
      const originalEncryptedData = { ...doc.encryptedData };

      mockDecryptString.mockResolvedValue("data");
      mockEncryptString.mockResolvedValue({
        encryptedString: "re-encrypted-content",
        accessControlConditions: [],
      });
      mockUploadJSON.mockResolvedValue({
        cid: "QmNewCid",
        size: 120,
        timestamp: Date.now(),
      });

      const updatedDoc = await manager.approveAccess(request.id, mockAuthSig);

      expect(updatedDoc.authorizedUsers).toContain("0xrequester");
      expect(updatedDoc.authorizedUsers).toContain("0xowner");
      expect(updatedDoc.ipfsCid).toBe("QmNewCid");
      expect(mockDecryptString).toHaveBeenCalledWith(
        originalEncryptedData,
        mockAuthSig,
        undefined,
      );
      expect(mockEncryptString).toHaveBeenCalledTimes(2);
      expect(mockEncryptString.mock.calls[1][0]).toBe("data");
      expect(Array.isArray(mockEncryptString.mock.calls[1][1])).toBe(true);
    });

    it("should mark request as approved", async () => {
      const doc = await manager.createDocument(
        "data",
        "health",
        "Test",
        "0xowner",
        mockAuthSig,
      );
      const request = await manager.requestAccess(doc.id, "0xrequester");
      mockDecryptString.mockResolvedValue("data");

      await manager.approveAccess(request.id, mockAuthSig);

      const updated = manager.getAccessRequest(request.id);
      expect(updated!.status).toBe("approved");
      expect(updated!.resolvedAt).toBeDefined();
    });

    it("should throw for unknown request", async () => {
      await expect(
        manager.approveAccess("nonexistent", mockAuthSig),
      ).rejects.toThrow("Access request nonexistent not found");
    });

    it("should throw for already resolved request", async () => {
      const doc = await manager.createDocument(
        "data",
        "health",
        "Test",
        "0xowner",
        mockAuthSig,
      );
      const request = await manager.requestAccess(doc.id, "0xrequester");
      mockDecryptString.mockResolvedValue("data");
      await manager.approveAccess(request.id, mockAuthSig);

      await expect(
        manager.approveAccess(request.id, mockAuthSig),
      ).rejects.toThrow("already approved");
    });
  });

  describe("rejectAccess", () => {
    it("should mark request as rejected", async () => {
      const doc = await manager.createDocument(
        "data",
        "health",
        "Test",
        "0xowner",
        mockAuthSig,
      );
      const request = await manager.requestAccess(doc.id, "0xrequester");

      manager.rejectAccess(request.id);

      const updated = manager.getAccessRequest(request.id);
      expect(updated!.status).toBe("rejected");
      expect(updated!.resolvedAt).toBeDefined();
    });

    it("should throw for unknown request", () => {
      expect(() => manager.rejectAccess("nonexistent")).toThrow(
        "Access request nonexistent not found",
      );
    });
  });

  describe("query helpers", () => {
    it("should list pending requests", async () => {
      const doc = await manager.createDocument(
        "data",
        "health",
        "Test",
        "0xowner",
        mockAuthSig,
      );
      await manager.requestAccess(doc.id, "0xreq1");
      await manager.requestAccess(doc.id, "0xreq2");

      const pending = manager.getPendingRequests();
      expect(pending.length).toBe(2);
    });

    it("should filter pending requests by document", async () => {
      const doc1 = await manager.createDocument(
        "data1",
        "health",
        "Doc1",
        "0xowner",
        mockAuthSig,
      );
      const doc2 = await manager.createDocument(
        "data2",
        "dna",
        "Doc2",
        "0xowner",
        mockAuthSig,
      );
      await manager.requestAccess(doc1.id, "0xreq");
      await manager.requestAccess(doc2.id, "0xreq");

      const filtered = manager.getPendingRequests(doc1.id);
      expect(filtered.length).toBe(1);
      expect(filtered[0].documentId).toBe(doc1.id);
    });

    it("should get documents for a user", async () => {
      const doc1 = await manager.createDocument(
        "data1",
        "health",
        "Doc1",
        "0xowner",
        mockAuthSig,
      );
      const doc2 = await manager.createDocument(
        "data2",
        "dna",
        "Doc2",
        "0xother",
        mockAuthSig,
      );

      const userDocs = manager.getDocumentsForUser("0xowner");
      expect(userDocs.length).toBe(1);
      expect(userDocs[0].id).toBe(doc1.id);
    });

    it("should return documents that user is authorized on", async () => {
      const doc = await manager.createDocument(
        "data",
        "health",
        "Test",
        "0xowner",
        mockAuthSig,
      );
      manager.loadDocument({ ...doc, authorizedUsers: ["0xowner", "0xguest"] });

      const guestDocs = manager.getDocumentsForUser("0xguest");
      expect(guestDocs.length).toBe(1);
    });

    it("should list all documents", async () => {
      await manager.createDocument(
        "data1",
        "health",
        "Doc1",
        "0xowner",
        mockAuthSig,
      );
      await manager.createDocument(
        "data2",
        "dna",
        "Doc2",
        "0xowner",
        mockAuthSig,
      );

      expect(manager.getAllDocuments().length).toBe(2);
    });

    it("should clear all state", async () => {
      await manager.createDocument(
        "data",
        "health",
        "Test",
        "0xowner",
        mockAuthSig,
      );
      manager.clear();
      expect(manager.getAllDocuments().length).toBe(0);
      expect(manager.getPendingRequests().length).toBe(0);
    });
  });
});
