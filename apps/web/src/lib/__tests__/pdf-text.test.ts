// Tests for pdf-text.ts — PDF → text extraction with OCR fallback.
// We inject stub loaders (loadPdfParse / loadTesseract) directly into
// extractPdfText, so no real pdf-parse / tesseract.js / canvas / network
// is ever touched in the test environment.

import { describe, it, expect, vi, type Mock } from "vitest";
import {
  extractPdfText,
  MIN_PDF_TEXT_CHARS,
  OcrModule,
  OcrWorker,
  PdfParseModule,
  PdfTextLoaders,
} from "../pdf-text";

// ─── helpers ────────────────────────────────────────────────────────────

/** Create a minimal fake "PDF" header so the buffer looks non-empty. */
const FAKE_PDF_HEADER = new Uint8Array([
  0x25,
  0x50,
  0x44,
  0x46,
  0x2d,
  0x31,
  0x2e,
  0x37,
  0x0a, // %PDF-1.7\n
  0x30,
  0x20,
  0x30,
  0x20,
  0x6f,
  0x62,
  0x6a,
  0x0a, // 0 0 obj\n
  0x0a,
  0x74,
  0x72,
  0x61,
  0x69,
  0x6c,
  0x65,
  0x72,
  0x0a, // trailer\n
]);

/** Add enough trailing text to pass MIN_PDF_TEXT_CHARS (100+). */
function textPdf(extra: string): Uint8Array {
  const suffix = new TextEncoder().encode(extra.padEnd(120, "x"));
  const buf = new Uint8Array(FAKE_PDF_HEADER.length + suffix.length);
  buf.set(FAKE_PDF_HEADER);
  buf.set(suffix, FAKE_PDF_HEADER.length);
  return buf;
}

/** Minimal PNG header (not a real PDF — used to test image-OCR fallback). */
const FAKE_PNG = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
]);

// ─── mock factories (DI) ────────────────────────────────────────────────

interface MockParser {
  getText: Mock<() => Promise<{ text: string; total: number }>>;
  getScreenshot: Mock<
    (params: { first?: number; imageDataUrl?: boolean }) => Promise<{
      pages: Array<{ data: Uint8Array }>;
      total: number;
    }>
  >;
  destroy: Mock<() => Promise<void>>;
}

interface MockWorker {
  recognize: Mock<() => Promise<{ data: { text: string } }>>;
  terminate: Mock<() => Promise<void>>;
}

/**
 * Build a fake pdf-parse module. `opts.getText` controls text-layer output,
 * `opts.throwGetText` makes getText reject (buffer not a parseable PDF),
 * `opts.pages` feeds parser.getScreenshot().
 */
function makePdfParse(opts: {
  getText?: () => Promise<{ text: string; total: number }>;
  throwGetText?: boolean;
  pages?: Array<{ data: Uint8Array }>;
}) {
  const parser: MockParser = {
    getText: vi.fn<() => Promise<{ text: string; total: number }>>(
      opts.throwGetText
        ? () => Promise.reject(new Error("Invalid PDF"))
        : (opts.getText ?? (() => Promise.resolve({ text: "", total: 0 }))),
    ),
    getScreenshot: vi.fn<
      (params: {
        first?: number;
        imageDataUrl?: boolean;
      }) => Promise<{ pages: Array<{ data: Uint8Array }>; total: number }>
    >(() => Promise.resolve({ pages: opts.pages ?? [], total: opts.pages?.length ?? 0 })),
    destroy: vi.fn<() => Promise<void>>(() => Promise.resolve()),
  };

  // The PDFParse stub delegates to the mocks above using explicit method
  // signatures so it structurally matches PdfParser (Mock<Procedure> would
  // not satisfy the callable shape).
  const loader: PdfTextLoaders["loadPdfParse"] = vi.fn(async (): Promise<PdfParseModule> => ({
    PDFParse: class {
      constructor(_params: { data: Uint8Array }) {}
      getText(): Promise<{ text: string; total: number }> {
        return parser.getText();
      }
      getScreenshot(params: {
        first?: number;
        imageDataUrl?: boolean;
      }): Promise<{ pages: Array<{ data: Uint8Array }>; total: number }> {
        return parser.getScreenshot(params);
      }
      destroy(): Promise<void> {
        return parser.destroy();
      }
    },
  }));

  return { loader, parser };
}

/**
 * Build a fake tesseract module. `opts.recognize` controls the OCR result.
 */
function makeTesseract(opts: {
  recognize?: () => Promise<{ data: { text: string } }>;
  recognizeReject?: boolean;
}) {
  const worker: MockWorker = {
    recognize: vi.fn<() => Promise<{ data: { text: string } }>>(
      opts.recognizeReject
        ? () => Promise.reject(new Error("worker crashed"))
        : (opts.recognize ?? (() => Promise.resolve({ data: { text: "" } }))),
    ),
    terminate: vi.fn<() => Promise<void>>(() => Promise.resolve()),
  };

  const loader: PdfTextLoaders["loadTesseract"] = vi.fn(async (): Promise<OcrModule> => ({
    createWorker: async () => worker as unknown as OcrWorker,
  }));

  return { loader, worker };
}

// ─── tests ──────────────────────────────────────────────────────────────

describe("extractPdfText", () => {
  it("returns empty for zero-length input", async () => {
    const { loader: loadPdfParse } = makePdfParse({});
    const { loader: loadTesseract } = makeTesseract({});

    const loaders: PdfTextLoaders = { loadPdfParse, loadTesseract };
    const result = await extractPdfText(new Uint8Array(0), loaders);
    expect(result).toEqual({ text: "", source: "none", pages: 0 });
    // zero-length short-circuits before any loader is invoked
    expect(loadPdfParse).not.toHaveBeenCalled();
    expect(loadTesseract).not.toHaveBeenCalled();
  });

  it("returns native text when pdf-parse yields >= 100 chars", async () => {
    const LONG_TEXT = "Chlamydia trachomatis, ДНК, количественное определение\n".repeat(10);
    const { loader: loadPdfParse, parser } = makePdfParse({
      getText: () => Promise.resolve({ text: LONG_TEXT, total: 3 }),
    });
    const { loader: loadTesseract } = makeTesseract({});

    const loaders: PdfTextLoaders = { loadPdfParse, loadTesseract };
    const result = await extractPdfText(textPdf("pad"), loaders);

    expect(result.source).toBe("pdf");
    expect(result.pages).toBe(3);
    expect(result.text.trim()).toBe(LONG_TEXT.trim());
    expect(parser.destroy).toHaveBeenCalled();
    // native path never touches OCR
    expect(loadTesseract).not.toHaveBeenCalled();
  });

  it("falls back to OCR when pdf-parse returns too little text", async () => {
    const OCR_TEXT =
      "Chlamydia trachomatis, ДНК, количественное определение ПЦР\nРезультат: не виявлено";
    const { loader: loadPdfParse } = makePdfParse({
      getText: () => Promise.resolve({ text: "Результат: не виявлено", total: 1 }),
      pages: [{ data: new Uint8Array([1, 2, 3]) }],
    });
    const { loader: loadTesseract, worker } = makeTesseract({
      recognize: () => Promise.resolve({ data: { text: OCR_TEXT } }),
    });

    const loaders: PdfTextLoaders = { loadPdfParse, loadTesseract };
    const result = await extractPdfText(textPdf("pad"), loaders);

    expect(result.source).toBe("ocr");
    expect(result.text).toContain("Chlamydia");
    expect(loadTesseract).toHaveBeenCalled();
    expect(worker.terminate).toHaveBeenCalled();
  });

  it("returns source='pdf' when both layers are short (OCR also short)", async () => {
    const SHORT = "Result: unclear";
    const { loader: loadPdfParse } = makePdfParse({
      getText: () => Promise.resolve({ text: SHORT, total: 1 }),
      pages: [{ data: new Uint8Array([9]) }],
    });
    const { loader: loadTesseract } = makeTesseract({
      recognize: () => Promise.resolve({ data: { text: "only 3" } }),
    });

    const loaders: PdfTextLoaders = { loadPdfParse, loadTesseract };
    const result = await extractPdfText(textPdf("pad"), loaders);

    expect(result.source).toBe("pdf");
    expect(result.text.trim()).toBe(SHORT);
  });

  it("falls back to image-OCR when the buffer is not a parseable PDF", async () => {
    const { loader: loadPdfParse } = makePdfParse({
      throwGetText: true, // PDF header is missing → getText rejects
    });
    const { loader: loadTesseract } = makeTesseract({
      recognize: () => Promise.resolve({ data: { text: "HIV-1/2 Positive" } }),
    });

    const loaders: PdfTextLoaders = { loadPdfParse, loadTesseract };
    const result = await extractPdfText(FAKE_PNG, loaders);

    expect(result.source).toBe("ocr");
    expect(result.text).toContain("HIV");
  });

  it("returns source='none' when pdf-parse throws and OCR returns empty", async () => {
    const { loader: loadPdfParse } = makePdfParse({ throwGetText: true });
    const { loader: loadTesseract } = makeTesseract({});

    const loaders: PdfTextLoaders = { loadPdfParse, loadTesseract };
    const result = await extractPdfText(textPdf("pad"), loaders);

    expect(result.source).toBe("none");
    expect(result.text).toBe("");
  });

  it("terminates the OCR worker even when recognize throws", async () => {
    const { loader: loadPdfParse } = makePdfParse({
      getText: () => Promise.resolve({ text: "short", total: 1 }),
      pages: [{ data: new Uint8Array([9, 9]) }],
    });
    const { loader: loadTesseract, worker } = makeTesseract({
      recognizeReject: true,
    });

    const loaders: PdfTextLoaders = { loadPdfParse, loadTesseract };
    const result = await extractPdfText(textPdf("pad"), loaders);

    expect(worker.terminate).toHaveBeenCalled();
    // recognize threw → ocr text empty → falls back to the (short) PDF text
    expect(result.source).toBe("pdf");
  });

  it("never calls OCR when the native text layer is already rich", async () => {
    const { loader: loadPdfParse } = makePdfParse({
      getText: () => Promise.resolve({ text: "All results are negative.\n".repeat(40), total: 1 }),
    });
    const { loader: loadTesseract } = makeTesseract({});

    const loaders: PdfTextLoaders = { loadPdfParse, loadTesseract };
    const result = await extractPdfText(textPdf("pad"), loaders);

    expect(result.source).toBe("pdf");
    expect(loadTesseract).not.toHaveBeenCalled();
  });
});

describe("MIN_PDF_TEXT_CHARS constant", () => {
  it("equals 100", () => {
    expect(MIN_PDF_TEXT_CHARS).toBe(100);
  });
});
