/**
 * Companion-mode backend API client.
 *
 * Patients register/update their profile on the server (so a lab on another
 * device can fetch it by QR id), and Search lists every registered patient.
 * All calls resolve gracefully to null/[] on failure so the localStorage
 * fallback in each screen keeps working when the API server is unavailable.
 */
import { CompanionPatientRecord } from "./companion-storage";

export interface CompanionPatientPayload {
  id: string;
  name?: string | null;
  photo?: string | null;
  additionalPhotos?: string[] | null;
  location?: string | null;
  stdCompatible?: boolean;
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}`);
  }
  return (await res.json()) as T;
}

/** Register/update a patient profile on the server. */
export const upsertCompanionPatient = async (
  patient: CompanionPatientPayload,
): Promise<CompanionPatientRecord> => {
  const data = await apiFetch<{ patient: CompanionPatientRecord }>("/api/companion/patients", {
    method: "POST",
    body: JSON.stringify(patient),
  });
  return data.patient;
};

/** Fetch a single patient by QR id. Returns null when absent or on error. */
export const fetchCompanionPatient = async (id: string): Promise<CompanionPatientRecord | null> => {
  try {
    const data = await apiFetch<{ patient: CompanionPatientRecord }>(
      `/api/companion/patients/${encodeURIComponent(id)}`,
    );
    return data.patient || null;
  } catch {
    return null;
  }
};

/** List every registered patient. Returns [] when absent or on error. */
export const listCompanionPatients = async (): Promise<CompanionPatientRecord[]> => {
  try {
    const data = await apiFetch<{ patients: CompanionPatientRecord[] }>("/api/companion/patients");
    return Array.isArray(data.patients) ? data.patients : [];
  } catch {
    return [];
  }
};
