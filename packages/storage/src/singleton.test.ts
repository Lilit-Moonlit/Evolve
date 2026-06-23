import { describe, it, expect } from "vitest";
import {
  resetAllSingletons,
  getIPFSClient,
  getArweaveClient,
  getLitEncryption,
} from "./index";
import { resetIPFSClient } from "./ipfs-client";
import { resetArweaveClient } from "./arweave-client";
import { resetLitEncryption } from "./lit-encryption";
import { IPFSClient } from "./ipfs-client";
import { ArweaveClient } from "./arweave-client";
import { LitEncryption } from "./lit-encryption";

describe("Singleton reset", () => {
  it("should reset IPFS client singleton", () => {
    const client1 = getIPFSClient();
    const client2 = getIPFSClient();
    expect(client1).toBe(client2);

    resetIPFSClient();

    const client3 = getIPFSClient();
    expect(client3).not.toBe(client1);
    expect(client3).toBeInstanceOf(IPFSClient);
  });

  it("should reset Arweave client singleton", () => {
    const client1 = getArweaveClient();
    const client2 = getArweaveClient();
    expect(client1).toBe(client2);

    resetArweaveClient();

    const client3 = getArweaveClient();
    expect(client3).not.toBe(client1);
    expect(client3).toBeInstanceOf(ArweaveClient);
  });

  it("should reset Lit encryption singleton", () => {
    const lit1 = getLitEncryption();
    const lit2 = getLitEncryption();
    expect(lit1).toBe(lit2);

    resetLitEncryption();

    const lit3 = getLitEncryption();
    expect(lit3).not.toBe(lit1);
    expect(lit3).toBeInstanceOf(LitEncryption);
  });

  it("should reset all singletons at once", () => {
    const ipfs1 = getIPFSClient();
    const arweave1 = getArweaveClient();
    const lit1 = getLitEncryption();

    expect(getIPFSClient()).toBe(ipfs1);
    expect(getArweaveClient()).toBe(arweave1);
    expect(getLitEncryption()).toBe(lit1);

    resetAllSingletons();

    expect(getIPFSClient()).not.toBe(ipfs1);
    expect(getArweaveClient()).not.toBe(arweave1);
    expect(getLitEncryption()).not.toBe(lit1);
  });
});
