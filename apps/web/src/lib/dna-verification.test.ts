import { describe, it, expect } from 'vitest';
import { verifyDNA, getVerificationCount, getProjectEmail } from './dna-verification';

describe('DNA Verification', () => {
  it('successfully verifies matching DNA', () => {
    const testDNA = 'ATCGATCGATCG';
    const result = verifyDNA({
      userId: 'user1',
      verifierId: 'verifier1',
      testResult: testDNA
    });
    expect(result.match).toBe(false); // First upload, no match yet
    expect(result.confidence).toBe(0);
    expect(result.counter).toBe(0);

    // Second verification with same DNA should match
    const result2 = verifyDNA({
      userId: 'user1',
      verifierId: 'verifier1',
      testResult: testDNA
    });
    expect(result2.match).toBe(true);
    expect(result2.confidence).toBe(100);
    expect(result2.counter).toBe(1);
  });

  it('fails verification with non-matching DNA', () => {
    const result = verifyDNA({
      userId: 'user2',
      verifierId: 'verifier1',
      testResult: 'ATCGATCGATCG'
    });
    expect(result.match).toBe(false);
    expect(result.confidence).toBe(0);
    expect(result.counter).toBe(0);

    // Try with different DNA
    const result2 = verifyDNA({
      userId: 'user2',
      verifierId: 'verifier1',
      testResult: 'GCTAGCTAGCTA'
    });
    expect(result2.match).toBe(false);
    expect(result2.confidence).toBe(0);
    expect(result2.counter).toBe(0);
  });

  it('increments counter on successful verification', () => {
    const testDNA = 'ATCGATCGATCG';
    // First verification (sets profile)
    verifyDNA({
      userId: 'user3',
      verifierId: 'verifier1',
      testResult: testDNA
    });

    // Second verification (should match)
    let result = verifyDNA({
      userId: 'user3',
      verifierId: 'verifier1',
      testResult: testDNA
    });
    expect(result.counter).toBe(1);

    // Third verification (should increment counter)
    result = verifyDNA({
      userId: 'user3',
      verifierId: 'verifier1',
      testResult: testDNA
    });
    expect(result.counter).toBe(2);
  });

  it('generates correct project email', () => {
    expect(getProjectEmail('testuser')).toBe('testuser@evolve.com');
    expect(getProjectEmail('john_doe')).toBe('john_doe@evolve.com');
  });

  it('handles empty test result', () => {
    const result = verifyDNA({
      userId: 'user4',
      verifierId: 'verifier1',
      testResult: ''
    });
    expect(result.match).toBe(false);
    expect(result.confidence).toBe(0);
    expect(result.counter).toBe(0);
  });
});