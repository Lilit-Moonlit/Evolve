import React, { useCallback, useRef, useState } from "react";
import { parseDNATest, DNAParseResult, STRProfile } from "../lib/dna-parser";
import { useTranslation } from "react-i18next";

interface DNAUploadProps {
  onParsed: (profile: STRProfile, rawText: string) => void;
  onVerify: () => void;
  isVerifying: boolean;
}

const DNAUpload: React.FC<DNAUploadProps> = ({
  onParsed,
  onVerify,
  isVerifying,
}) => {
  const { t } = useTranslation();
  const [parsedResult, setParsedResult] = useState<DNAParseResult | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      setParsedResult(null);
      setFileContent(null);

      if (acceptedFiles.length === 0) {
        setError(t("dna.upload.error"));
        return;
      }

      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        const text = e.target?.result as string;
        setFileContent(text);
        try {
          const result = parseDNATest(text);
          setParsedResult(result);
          if (result.valid && result.strProfile) {
            onParsed(result.strProfile, result.rawText);
          } else if (result.errors.length > 0) {
            setError(result.errors.join(", "));
          } else {
            setError(t("dna.upload.error"));
          }
        } catch (parseError) {
          setError(
            t("dna.upload.error") + ": " + (parseError as Error).message,
          );
        }
      };

      reader.onerror = () => {
        setError(t("dna.upload.error") + ": Failed to read file.");
      };

      reader.readAsText(file);
    },
    [onParsed, t],
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      onDrop(files);
    }
    // Reset so selecting the same file again still triggers onChange
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer border-gray-300 bg-gray-50"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.csv,.json"
          className="hidden"
          onChange={onFileChange}
        />
        <p>
          {t("dna.upload.dragDrop")} {t("dna.upload.or")}
          <span className="text-blue-600"> {t("dna.upload.browse")}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {t("dna.upload.supportedFormats")}
        </p>
      </div>

      {fileContent && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold">{t("dna.upload.parsing")}</h3>
          {parsedResult ? (
            parsedResult.valid && parsedResult.strProfile ? (
              <div className="mt-2 text-green-700">
                <p>{t("dna.upload.parsed")}</p>
                <pre className="mt-2 p-2 bg-gray-200 rounded text-sm overflow-auto max-h-40">
                  {JSON.stringify(parsedResult.strProfile, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="mt-2 text-red-700">
                <p>{t("dna.upload.error")}</p>
                {parsedResult.errors.length > 0 && (
                  <ul className="list-disc list-inside ml-4">
                    {parsedResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          ) : (
            <p className="mt-2 text-gray-600">{t("dna.upload.parsing")}</p>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}

      <button
        onClick={onVerify}
        disabled={!parsedResult?.valid || isVerifying}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
          ${
            parsedResult?.valid && !isVerifying
              ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              : "bg-gray-400 cursor-not-allowed"
          }
        `}
      >
        {isVerifying ? t("dna.upload.verifying") : t("dna.upload.verify")}
      </button>
    </div>
  );
};

export default DNAUpload;
