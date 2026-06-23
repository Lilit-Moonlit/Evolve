# @evolve/storage

Decentralized storage layer for Evolve. Wraps IPFS, Arweave, and Lit Protocol encryption.

## Features

- **IPFS** — content-addressed file and JSON storage via `ipfs-http-client`
- **Arweave** — permanent storage with transaction confirmation polling
- **Lit Protocol** — access-controlled encryption (NIP, ERC-20, ERC-721 conditions)
- **TypeScript** — full type safety with strict mode
- **Error causes** — every error preserves the original cause for debugging

## Quick Start

```typescript
import {
  getIPFSClient,
  getArweaveClient,
  getLitEncryption,
} from "@evolve/storage";

const ipfs = getIPFSClient({ url: "http://localhost:5001" });
const arweave = getArweaveClient();
const lit = getLitEncryption({ litNetwork: "cayenne" });
await lit.initialize();

// Upload to IPFS
const { cid } = await ipfs.uploadJSON({ message: "hello" });
console.log(`https://ipfs.io/ipfs/${cid}`);

// Upload to Arweave (permanent)
const { cid: txId } = await arweave.uploadJSON({ message: "hello" });
await arweave.waitForConfirmation(txId);

// Encrypt with Lit
const condition = lit.createAddressAccessCondition("0xAlice");
const encrypted = await lit.encryptString("secret", condition);
const decrypted = await lit.decryptString(encrypted, authSig);
```

## API

### `IPFSClient`

```typescript
const client = getIPFSClient({ url?, gateway? });

// Upload
await client.upload(data: string | Buffer | object);
await client.uploadJSON(data: object);
await client.uploadFile(file: File);

// Download
const buffer: Buffer = await client.download(cid);
const data: T = await client.downloadJSON<T>(cid);

// Pin
await client.pin(cid);
await client.unpin(cid);

// URLs
const url: string = client.getGatewayUrl(cid);
```

### `ArweaveClient`

```typescript
const client = getArweaveClient({ gateway?, port?, protocol? });

// Upload
await client.upload(data: string | Buffer | object);
await client.uploadJSON(data: object);

// Download
const buffer: Buffer = await client.download(txId);
const data: T = await client.downloadJSON<T>(txId);

// Status
const status = await client.getTransactionStatus(txId);
// { confirmed: boolean, blockHeight?: number }

// Wait for confirmation (default timeout: 5 minutes)
await client.waitForConfirmation(txId, timeoutMs?);

// URLs
const url: string = client.getGatewayUrl(txId);
```

### `LitEncryption`

```typescript
const lit = getLitEncryption({ litNetwork?: 'cayenne' | 'manzano' | 'habanero' | 'custom' });
await lit.initialize();

// Encrypt / decrypt strings
const encrypted: EncryptedData = await lit.encryptString(text, conditions);
const decrypted: string = await lit.decryptString(encrypted, authSig, chain?);

// Encrypt / decrypt files
const encryptedFile: EncryptedData = await lit.encryptFile(file, conditions, authSig, chain?);
const decryptedFile: Uint8Array = await lit.decryptFile(encrypted, authSig, chain?);

// Access control condition builders
const addrCondition = lit.createAddressAccessCondition('0xAddress');
const nftCondition = lit.createNFTAccessCondition('0xNFTContract', 'tokenId');
const tokenCondition = lit.createTokenAccessCondition('0xTokenContract', '1000');
```

## Singleton Management

Each client is a lazy singleton. Use `reset*` functions in tests to get fresh instances:

```typescript
import { resetAllSingletons, getIPFSClient } from "@evolve/storage";

const client1 = getIPFSClient();
resetAllSingletons();
const client2 = getIPFSClient();
console.log(client1 !== client2); // true
```

Individual resets:

- `resetIPFSClient()`
- `resetArweaveClient()`
- `resetLitEncryption()`

## Error Handling

All errors preserve the original cause:

```typescript
try {
  await ipfs.upload(badData);
} catch (e) {
  console.log(e.message); // "Failed to upload data to IPFS"
  console.log(e.cause); // original IPFS error
}
```

## Scripts

```bash
npm run build           # Compile to dist/
npm run clean           # Remove dist/
npm run type-check      # tsc --noEmit
npm test                # vitest run
npm run test:watch      # vitest
npm run test:coverage   # vitest run --coverage
```

## Testing

78 unit tests covering upload, download, pinning, JSON parsing, encryption, access conditions, singleton management, and document verification.

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

**Coverage: 100%** for all client modules.

### `DocumentManager`

Store and verify documents via IPFS + Lit Protocol encryption.

```typescript
import { DocumentManager, DocumentType } from "@evolve/storage";

const dm = new DocumentManager(ipfsClient, litEncryption);

// Create a document
const doc = await dm.createDocument(
  '{ "name": "Alice", "bloodType": "A+" }',
  DocumentType.Health,
  "lab-result-001",
  "0xAlice",
  authSig,
);
// { id, cid, type, title, owner, createdAt }

// Request access
dm.onAccessRequest((requestId, docId, requester) => {
  console.log(`${requester} wants access to ${docId}`);
});

await dm.requestAccess(doc.id, "0xDoctor");

// Approve/deny
await dm.approveAccess(requestId, ownerAuthSig);
await dm.rejectAccess(requestId);
```

Events: `onAccessRequest` callback for real-time access requests. Each document's access conditions use OR logic (owner OR approved requester).

## Configuration

### `IPFSConfig`

```typescript
{
  url?: string;      // default: 'http://localhost:5001'
  gateway?: string;  // default: 'https://ipfs.io/ipfs/'
}
```

### `ArweaveConfig`

```typescript
{
  gateway?: string;   // default: 'arweave.net'
  port?: number;      // default: 443
  protocol?: string;  // default: 'https'
}
```

### `LitConfig`

```typescript
{
  litNetwork?: 'cayenne' | 'manzano' | 'habanero' | 'custom';
  // default: 'cayenne'
}
```

## Security Notes

- `decryptString` and `decryptFile` require an `authSig` signed by the user — never log or persist this
- Encrypted data is round-tripped through storage and direct messages; validate the shape of incoming `EncryptedData` at your application boundary before passing to Lit
- `getTransactionStatus` returns only `blockHeight`; the Arweave SDK does not expose `block_timestamp` in the current type definitions

## License

UNLICENSED — internal Evolve project.
