/**
 * Test helpers for Evolve
 */

/**
 * Wait for a specified amount of time
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for a condition to be true
 */
export async function waitForCondition(
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100,
): Promise<void> {
  const startTime = Date.now();
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error("Condition not met within timeout");
    }
    await waitFor(interval);
  }
}

/**
 * Mock console methods
 */
export function mockConsole() {
  const originalConsole = { ...console };
  const logs: { level: string; args: unknown[] }[] = [];

  const mockConsoleMethod = (level: string) => {
    return (...args: unknown[]) => {
      logs.push({ level, args });
    };
  };

  console.log = mockConsoleMethod("log");
  console.error = mockConsoleMethod("error");
  console.warn = mockConsoleMethod("warn");
  console.info = mockConsoleMethod("info");

  const restoreConsole = () => {
    Object.assign(console, originalConsole);
  };

  return { logs, restoreConsole };
}

/**
 * Mock localStorage
 */
export function mockLocalStorage() {
  const store: Record<string, string> = {};

  const mockLocalStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };

  const originalLocalStorage = global.localStorage;
  global.localStorage = mockLocalStorage as unknown as Storage;

  const restoreLocalStorage = () => {
    global.localStorage = originalLocalStorage;
  };

  return { mockLocalStorage, restoreLocalStorage };
}

/**
 * Mock sessionStorage
 */
export function mockSessionStorage() {
  const store: Record<string, string> = {};

  const mockSessionStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };

  const originalSessionStorage = global.sessionStorage;
  global.sessionStorage = mockSessionStorage as unknown as Storage;

  const restoreSessionStorage = () => {
    global.sessionStorage = originalSessionStorage;
  };

  return { mockSessionStorage, restoreSessionStorage };
}

/**
 * Mock fetch
 */
export function mockFetch(response: unknown, error?: Error) {
  const originalFetch = global.fetch;

  global.fetch = async () => {
    if (error) {
      throw error;
    }
    return {
      ok: true,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    } as Response;
  };

  const restoreFetch = () => {
    global.fetch = originalFetch;
  };

  return { restoreFetch };
}

/**
 * Setup test environment
 */
export function setupTestEnvironment() {
  const consoleMock = mockConsole();
  const localStorageMock = mockLocalStorage();
  const sessionStorageMock = mockSessionStorage();

  const teardown = () => {
    consoleMock.restoreConsole();
    localStorageMock.restoreLocalStorage();
    sessionStorageMock.restoreSessionStorage();
  };

  return { consoleMock, localStorageMock, sessionStorageMock, teardown };
}

/**
 * Create a spy function
 */
export function createSpy<T extends (...args: unknown[]) => unknown>(
  fn?: T,
): jest.Mock<ReturnType<T>, Parameters<T>> {
  const calls: Parameters<T>[] = [];
  const mock = (...args: Parameters<T>): ReturnType<T> => {
    calls.push(args);
    if (fn) {
      return fn(...args);
    }
    return undefined as ReturnType<T>;
  };

  (mock as any).mock = {
    calls,
    clear: () => {
      (mock as any).mock.calls = [];
    },
  };

  return mock as unknown as jest.Mock<ReturnType<T>, Parameters<T>>;
}

/**
 * Create a stub function
 */
export function createStub<T extends (...args: unknown[]) => unknown>(
  returnValue: ReturnType<T>,
): T {
  return ((...args: Parameters<T>) => returnValue) as T;
}

/**
 * Assert that a function throws an error
 */
export async function assertThrows(
  fn: () => Promise<unknown> | unknown,
  errorType?: new (...args: unknown[]) => Error,
): Promise<Error> {
  try {
    await fn();
    throw new Error("Expected function to throw");
  } catch (error) {
    if (errorType && !(error instanceof errorType)) {
      throw new Error(`Expected error to be instance of ${errorType.name}`);
    }
    return error as Error;
  }
}

/**
 * Assert that a value is truthy
 */
export function assertTruthy(value: unknown, message?: string): void {
  if (!value) {
    throw new Error(message || `Expected ${value} to be truthy`);
  }
}

/**
 * Assert that a value is falsy
 */
export function assertFalsy(value: unknown, message?: string): void {
  if (value) {
    throw new Error(message || `Expected ${value} to be falsy`);
  }
}

/**
 * Assert that two values are equal
 */
export function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
}

/**
 * Assert that two values are not equal
 */
export function assertNotEqual<T>(
  actual: T,
  expected: T,
  message?: string,
): void {
  if (actual === expected) {
    throw new Error(message || `Expected ${actual} to not equal ${expected}`);
  }
}

/**
 * Assert that a value is null
 */
export function assertNull(value: unknown, message?: string): void {
  if (value !== null) {
    throw new Error(message || `Expected ${value} to be null`);
  }
}

/**
 * Assert that a value is not null
 */
export function assertNotNull(value: unknown, message?: string): void {
  if (value === null) {
    throw new Error(message || `Expected ${value} to not be null`);
  }
}

/**
 * Assert that a value is undefined
 */
export function assertUndefined(value: unknown, message?: string): void {
  if (value !== undefined) {
    throw new Error(message || `Expected ${value} to be undefined`);
  }
}

/**
 * Assert that a value is not undefined
 */
export function assertNotUndefined(value: unknown, message?: string): void {
  if (value === undefined) {
    throw new Error(message || `Expected ${value} to not be undefined`);
  }
}

/**
 * Assert that a value is an instance of a class
 */
export function assertInstanceOf<T>(
  value: unknown,
  classType: new (...args: unknown[]) => T,
  message?: string,
): void {
  if (!(value instanceof classType)) {
    throw new Error(
      message || `Expected ${value} to be instance of ${classType.name}`,
    );
  }
}

/**
 * Assert that an array contains a value
 */
export function assertContains<T>(
  array: T[],
  value: T,
  message?: string,
): void {
  if (!array.includes(value)) {
    throw new Error(message || `Expected array to contain ${value}`);
  }
}

/**
 * Assert that an array does not contain a value
 */
export function assertNotContains<T>(
  array: T[],
  value: T,
  message?: string,
): void {
  if (array.includes(value)) {
    throw new Error(message || `Expected array to not contain ${value}`);
  }
}

/**
 * Assert that an object has a property
 */
export function assertHasProperty(
  obj: Record<string, unknown>,
  property: string,
  message?: string,
): void {
  if (!(property in obj)) {
    throw new Error(message || `Expected object to have property ${property}`);
  }
}

/**
 * Run async tests in parallel
 */
export async function runParallel<T>(
  tests: Array<() => Promise<T>>,
): Promise<T[]> {
  return Promise.all(tests.map((test) => test()));
}

/**
 * Run async tests in sequence
 */
export async function runSequence<T>(
  tests: Array<() => Promise<T>>,
): Promise<T[]> {
  const results: T[] = [];
  for (const test of tests) {
    results.push(await test());
  }
  return results;
}

/**
 * Measure execution time of a function
 */
export async function measureTime<T>(
  fn: () => Promise<T> | T,
): Promise<{ result: T; duration: number }> {
  const startTime = Date.now();
  const result = await fn();
  const duration = Date.now() - startTime;
  return { result, duration };
}

/**
 * Retry a test function
 */
export async function retryTest<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 100,
): Promise<T> {
  let lastError: Error;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      await waitFor(delay);
    }
  }
  throw lastError!;
}
