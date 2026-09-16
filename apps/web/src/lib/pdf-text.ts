// PDF → text extraction with OCR fallback for scanned lab reports.
// Server-only module: consumed by apiServer (Node). pdf-parse and
// tesseract.js are loaded lazily (via injectable loaders) so the browser
// bundle and the vitest suite never pull pdfjs/tesseract into memory.

/**
 * Minimum number of characters for a successful native (pdf-parse)
 * extraction. Below this we treat the PDF as scanned/image-only and
 * fall back to OCR.
 */
export const MIN_PDF_TEXT_CHARS = 100;

export interface PdfTextResult {
  text: string;
  /** "pdf" = extracted via pdf-parse text layer, "ocr" = tesseract.js */
  source: "pdf" | "ocr" | "none";
  pages: number;
}

export interface OcrWorker {
  recognize(image: Uint8Array): Promise<{ data: { text: string | null } }>;
  terminate(): Promise<unknown>;
}

export interface OcrModule {
  createWorker(
    langs?: string | string[],
    oem?: number,
    options?: Record<string, unknown>,
  ): Promise<OcrWorker>;
}

/** Structural shape of the pdf-parse class we consume (v2 API). */
export interface PdfParser {
  getText(): Promise<{ text: string; total: number }>;
  getScreenshot(params: {
    first?: number;
    imageDataUrl?: boolean;
  }): Promise<{ pages: Array<{ data: Uint8Array }>; total: number }>;
  destroy(): Promise<void>;
}

export type PdfParseModule = {
  PDFParse: new (params: { data: Uint8Array }) => PdfParser;
};

/**
 * Injectable lazy loaders. Defaults load the real packages; tests pass
 * stubs so no canvas / native binaries / network are required.
 */
export interface PdfTextLoaders {
  loadPdfParse?: () => Promise<PdfParseModule>;
  loadTesseract?: () => Promise<OcrModule>;
}

type LoadTesseract = NonNullable<PdfTextLoaders["loadTesseract"]>;

/** Languages used by the OCR fallback (avoids false negatives on UA/RU labs). */
const OCR_LANGS = ["eng", "ukr", "rus"];

/** Default lazy loader for pdf-parse (v2 ESM). */
async function defaultLoadPdfParse(): Promise<PdfParseModule> {
  return await import("pdf-parse");
}

/** Default lazy loader for tesseract.js (v7 CJS). */
async function defaultLoadTesseract(): Promise<OcrModule> {
  return (await import("tesseract.js")) as unknown as OcrModule;
}

/**
 * Extract plain text from a PDF (or image) buffer.
 *
 * Strategy:
 *   1. Try pdf-parse (text layer). If it yields >= MIN_PDF_TEXT_CHARS → done.
 *   2. Otherwise render the first pages to PNG (pdf-parse screenshot) and
 *      OCR them with tesseract.js (eng+ukr+rus).
 *   3. If the buffer is not a PDF at all (e.g. a PNG/JPG upload), OCR it
 *      directly.
 *
 * Never throws: on any failure returns { text: "", source: "none" }.
 */
export async function extractPdfText(
  data: Uint8Array,
  loaders: PdfTextLoaders = {},
): Promise<PdfTextResult> {
  const loadPdfParse = loaders.loadPdfParse ?? defaultLoadPdfParse;
  const loadTesseract = loaders.loadTesseract ?? defaultLoadTesseract;

  if (!data || data.byteLength === 0) {
    return { text: "", source: "none", pages: 0 };
  }

  // 1) Native text layer extraction.
  try {
    const { PDFParse } = await loadPdfParse();
    const parser = new PDFParse({ data });
    try {
      const res = await parser.getText();
      const text = (res?.text ?? "").trim();
      const pages = res?.total ?? 0;
      if (text.length >= MIN_PDF_TEXT_CHARS) {
        return { text, source: "pdf", pages };
      }
      // Too little text — try rendering the pages and OCR-ing them.
      const ocr = await ocrPdfScreenshots(parser, loadTesseract);
      if (ocr.text.trim().length > text.length) {
        return { text: ocr.text.trim(), source: "ocr", pages: ocr.pages };
      }
      return { text, source: "pdf", pages };
    } finally {
      try {
        await parser.destroy();
      } catch {
        // ignore destroy errors
      }
    }
  } catch (err) {
    console.error("[pdf-text] pdf-parse failed:", err);
  }

  // 2) Not a parseable PDF (or pdf-parse errored) → OCR the raw buffer.
  const text = await ocrImage(data, loadTesseract);
  if (text.trim()) {
    return { text: text.trim(), source: "ocr", pages: 1 };
  }

  return { text: "", source: "none", pages: 0 };
}

/**
 * Render up to the first MAX_OCR_PAGES pages of an already-loaded PDF to PNG
 * and OCR each of them. Requires a canvas implementation available to
 * pdf-parse in the current Node runtime; if rendering is unsupported it
 * falls back to OCR-ing the raw buffer instead of throwing.
 */
const MAX_OCR_PAGES = 3;

async function ocrPdfScreenshots(
  parser: PdfParser,
  loadTesseract: LoadTesseract,
): Promise<{ text: string; pages: number }> {
  try {
    const shots = await parser.getScreenshot({
      first: MAX_OCR_PAGES,
      imageDataUrl: false,
    });
    const parts: string[] = [];
    for (const page of shots.pages) {
      const text = await ocrImage(page.data, loadTesseract);
      if (text.trim()) parts.push(text.trim());
    }
    return { text: parts.join("\n"), pages: shots.total };
  } catch (err) {
    console.error("[pdf-text] PDF screenshot rendering failed:", err);
    return { text: "", pages: 0 };
  }
}

/**
 * Run tesseract.js OCR on a single image buffer (PNG/JPEG). Loads the
 * tesseract module lazily via the provided loader. Never throws — returns
 * "" on failure.
 */
async function ocrImage(image: Uint8Array, loadTesseract: LoadTesseract): Promise<string> {
  try {
    const mod = await loadTesseract();
    const worker = await mod.createWorker(OCR_LANGS);
    try {
      const res = await worker.recognize(image);
      return res?.data?.text ?? "";
    } finally {
      try {
        await worker.terminate();
      } catch {
        // ignore terminate errors
      }
    }
  } catch (err) {
    console.error("[pdf-text] tesseract OCR failed:", err);
    return "";
  }
}
