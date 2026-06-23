import { describe, it, expect, vi, beforeEach } from "vitest";

const mockConnect = vi.fn().mockResolvedValue(undefined);

const mockAuthSig = {
  sig: "0xabc",
  derivedVia: "web3.eth.personal.sign",
  signedMessage: "msg",
  address: "0x123",
};

vi.mock("@lit-protocol/lit-node-client", () => ({
  LitNodeClient: vi.fn().mockImplementation(function MockLitNodeClient(
    this: any,
  ) {
    this.connect = mockConnect;
  }),
}));

vi.mock("@lit-protocol/encryption", () => ({
  encryptString: vi.fn().mockResolvedValue({
    ciphertext: "encrypted-text-123",
  }),
  decryptToString: vi.fn().mockResolvedValue("decrypted text"),
  encryptFile: vi.fn().mockResolvedValue({
    ciphertext: "encrypted-file-123",
  }),
  decryptToFile: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
}));

vi.mock("@lit-protocol/types", () => ({}));

vi.mock("@evolve/core", () => ({
  EncryptedData: {},
}));

import { LitEncryption, getLitEncryption } from "./lit-encryption";
import {
  encryptString,
  decryptToString,
  encryptFile,
  decryptToFile,
} from "@lit-protocol/encryption";
import { LitNodeClient } from "@lit-protocol/lit-node-client";

describe("LitEncryption", () => {
  let lit: LitEncryption;

  beforeEach(async () => {
    vi.clearAllMocks();
    lit = new LitEncryption();
    await lit.initialize();
  });

  describe("initialize", () => {
    it("should connect to Lit Network", async () => {
      expect(LitNodeClient).toHaveBeenCalledWith({ litNetwork: "cayenne" });
      expect(mockConnect).toHaveBeenCalled();
    });

    it("should not reconnect if already initialized", async () => {
      mockConnect.mockClear();
      const lit2 = new LitEncryption();
      await lit2.initialize();
      await lit2.initialize(); // second call should be no-op
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });

    it("should use custom network", async () => {
      vi.clearAllMocks();
      const customLit = new LitEncryption({ litNetwork: "manzano" });
      await customLit.initialize();
      expect(LitNodeClient).toHaveBeenCalledWith({ litNetwork: "manzano" });
    });
  });

  describe("encryptString", () => {
    it("should encrypt a string", async () => {
      const conditions = [
        {
          contractAddress: "0x123",
          chain: "ethereum",
          method: "balanceOf",
          parameters: [":userAddress"],
          returnValueTest: { comparator: ">", value: "0" },
        },
      ];
      const result = await lit.encryptString("hello world", conditions);
      expect(result.encryptedString).toBe("encrypted-text-123");
      expect(result.accessControlConditions).toEqual(conditions);
      expect(encryptString).toHaveBeenCalledWith(
        { dataToEncrypt: "hello world", accessControlConditions: conditions },
        expect.anything(),
      );
    });

    it("should throw on encryption failure", async () => {
      (encryptString as any).mockRejectedValueOnce(new Error("Encrypt error"));
      await expect(lit.encryptString("test", [])).rejects.toThrow(
        "Failed to encrypt data with Lit Protocol",
      );
    });
  });

  describe("decryptString", () => {
    it("should decrypt encrypted data", async () => {
      const encryptedData = {
        encryptedString: "encrypted-text-123",
        accessControlConditions: [
          {
            contractAddress: "0x123",
            chain: "ethereum",
            method: "balanceOf",
            parameters: [":userAddress"],
            returnValueTest: { comparator: ">", value: "0" },
          },
        ],
      };
      const authSig = {
        sig: "0xabc",
        derivedVia: "web3.eth.personal.sign",
        signedMessage: "msg",
        address: "0x123",
      };
      const result = await lit.decryptString(encryptedData, authSig);
      expect(result).toBe("decrypted text");
      expect(decryptToString).toHaveBeenCalledWith(
        expect.objectContaining({
          ciphertext: "encrypted-text-123",
          authSig,
          chain: "ethereum",
        }),
        expect.anything(),
      );
    });

    it("should use custom chain", async () => {
      const encryptedData = {
        encryptedString: "enc",
        accessControlConditions: [],
      };
      await lit.decryptString(encryptedData, mockAuthSig, "polygon");
      expect(decryptToString).toHaveBeenCalledWith(
        expect.objectContaining({ chain: "polygon" }),
        expect.anything(),
      );
    });

    it("should throw on decryption failure", async () => {
      (decryptToString as any).mockRejectedValueOnce(
        new Error("Decrypt error"),
      );
      await expect(
        lit.decryptString(
          { encryptedString: "enc", accessControlConditions: [] },
          mockAuthSig,
        ),
      ).rejects.toThrow("Failed to decrypt data with Lit Protocol");
    });
  });

  describe("encryptFile", () => {
    it("should encrypt a file", async () => {
      const file = new File(["content"], "test.txt");
      const conditions = [
        {
          contractAddress: "0x123",
          chain: "ethereum",
          method: "balanceOf",
          parameters: [":userAddress"],
          returnValueTest: { comparator: ">", value: "0" },
        },
      ];
      const authSig = {
        sig: "0xabc",
        derivedVia: "web3.eth.personal.sign",
        signedMessage: "msg",
        address: "0x123",
      };
      const result = await lit.encryptFile(file, conditions, authSig);
      expect(result.encryptedString).toBe("encrypted-file-123");
      expect(result.accessControlConditions).toEqual(conditions);
      expect(encryptFile).toHaveBeenCalledWith(
        {
          file,
          accessControlConditions: conditions,
          authSig,
          chain: "ethereum",
        },
        expect.anything(),
      );
    });

    it("should use custom chain", async () => {
      const file = new File(["content"], "test.txt");
      await lit.encryptFile(file, [], mockAuthSig, "polygon");
      expect(encryptFile).toHaveBeenCalledWith(
        expect.objectContaining({ chain: "polygon" }),
        expect.anything(),
      );
    });

    it("should throw on file encryption failure", async () => {
      (encryptFile as any).mockRejectedValueOnce(
        new Error("File encrypt error"),
      );
      await expect(
        lit.encryptFile(new File(["c"], "f.txt"), [], mockAuthSig),
      ).rejects.toThrow("Failed to encrypt file with Lit Protocol");
    });
  });

  describe("decryptFile", () => {
    it("should decrypt a file", async () => {
      const encryptedData = {
        encryptedString: "encrypted-file-123",
        accessControlConditions: [],
      };
      const authSig = {
        sig: "0xabc",
        derivedVia: "web3.eth.personal.sign",
        signedMessage: "msg",
        address: "0x123",
      };
      const result = await lit.decryptFile(encryptedData, authSig);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result).toEqual(new Uint8Array([1, 2, 3]));
      expect(decryptToFile).toHaveBeenCalledWith(
        expect.objectContaining({
          ciphertext: "encrypted-file-123",
          authSig,
          chain: "ethereum",
        }),
        expect.anything(),
      );
    });

    it("should throw on file decryption failure", async () => {
      (decryptToFile as any).mockRejectedValueOnce(
        new Error("File decrypt error"),
      );
      await expect(
        lit.decryptFile(
          { encryptedString: "enc", accessControlConditions: [] },
          mockAuthSig,
        ),
      ).rejects.toThrow("Failed to decrypt file with Lit Protocol");
    });
  });

  describe("createAddressAccessCondition", () => {
    it("should create address-based access condition", () => {
      const condition = lit.createAddressAccessCondition("0xABC");
      expect(condition).toHaveLength(1);
      expect(condition[0].method).toBe("getBalanceOf");
      expect(condition[0].parameters).toEqual([":userAddress", "0xABC"]);
      expect(condition[0].returnValueTest).toEqual({
        comparator: ">",
        value: "0",
      });
    });
  });

  describe("createNFTAccessCondition", () => {
    it("should create NFT-based access condition", () => {
      const condition = lit.createNFTAccessCondition("0xContract", "1");
      expect(condition).toHaveLength(1);
      expect(condition[0].standardContractType).toBe("ERC721");
      expect(condition[0].contractAddress).toBe("0xContract");
      expect(condition[0].parameters).toEqual([":userAddress"]);
    });
  });

  describe("createTokenAccessCondition", () => {
    it("should create token-based access condition", () => {
      const condition = lit.createTokenAccessCondition("0xToken", "1000");
      expect(condition).toHaveLength(1);
      expect(condition[0].standardContractType).toBe("ERC20");
      expect(condition[0].contractAddress).toBe("0xToken");
      expect(condition[0].returnValueTest).toEqual({
        comparator: ">=",
        value: "1000",
      });
    });
  });
});

describe("getLitEncryption", () => {
  it("should return same instance on multiple calls", () => {
    const lit1 = getLitEncryption();
    const lit2 = getLitEncryption();
    expect(lit1).toBe(lit2);
  });

  it("should return a LitEncryption instance", () => {
    const lit = getLitEncryption();
    expect(lit).toBeInstanceOf(LitEncryption);
  });
});
