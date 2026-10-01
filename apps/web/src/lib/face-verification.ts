/**
 * Face Verification Library
 *
 * Decentralized, zero-cost face similarity verification using MediaPipe Face Mesh.
 * Runs entirely on-device in the browser via WebAssembly — no server calls.
 *
 * Architecture:
 * 1. MediaPipe Face Mesh detects 468 facial landmarks
 * 2. Landmarks are normalized and flattened into a fixed-size embedding vector
 * 3. Embedding is hashed (SHA-256) for compact storage on-chain/off-chain
 * 4. Similarity is computed via cosine distance between two embeddings
 *
 * Used for:
 * - Registration: verify uploaded photo matches live selfie
 * - Liveness: periodic challenges during chat to confirm ongoing identity
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** Raw 3D landmark from MediaPipe Face Mesh (x, y, z in [0,1] normalized coords) */
interface Landmark {
  x: number;
  y: number;
  z: number;
}

/** Face embedding: flattened, normalized landmark vector (fixed 468×3 = 1404 dims) */
export type FaceEmbedding = number[];

/** Compact hash of a face embedding for storage */
export type FaceHash = string;

/** Result of a face verification check */
export interface FaceVerificationResult {
  /** Whether the faces match above the threshold */
  match: boolean;
  /** Cosine similarity score in [0, 1] */
  similarity: number;
  /** Number of faces detected in the source image */
  facesDetected: number;
  /** Error message if verification failed */
  error?: string;
}

/** Liveness challenge types */
export type LivenessChallenge =
  "smile" | "blink" | "turn_left" | "turn_right" | "look_up" | "look_down";

/** Result of a liveness check */
export interface LivenessCheckResult {
  /** Whether liveness was confirmed */
  confirmed: boolean;
  /** The challenge that was issued */
  challenge: LivenessChallenge;
  /** Face verification result */
  faceResult: FaceVerificationResult;
  /** Timestamp of the check */
  timestamp: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Similarity threshold: above this = same person */
const SIMILARITY_THRESHOLD = 0.75;

/** Number of face landmarks from MediaPipe Face Mesh */
const LANDMARK_COUNT = 468;

/** Dimensions per landmark (x, y, z) */
const DIMS_PER_LANDMARK = 3;

/** Total embedding size */
export const EMBEDDING_SIZE = LANDMARK_COUNT * DIMS_PER_LANDMARK;

/** Liveness challenge interval: 5-15 minutes (randomized) */
const LIVENESS_INTERVAL_MIN_MS = 5 * 60 * 1000;
const LIVENESS_INTERVAL_MAX_MS = 15 * 60 * 1000;

/** All available liveness challenges */
const LIVENESS_CHALLENGES: LivenessChallenge[] = [
  "smile",
  "blink",
  "turn_left",
  "turn_right",
  "look_up",
  "look_down",
];

// ─── Model Loading ────────────────────────────────────────────────────────────

let faceMeshInstance: any = null;
let modelLoading = false;
let modelLoadPromise: Promise<any> | null = null;

/**
 * Loads the MediaPipe Face Mesh model.
 * Uses CDN-hosted WASM binaries for Vite compatibility.
 * Singleton: only loads once, returns cached instance.
 */
export async function loadFaceMesh(): Promise<any> {
  if (faceMeshInstance) return faceMeshInstance;
  if (modelLoadPromise) return modelLoadPromise;

  modelLoadPromise = (async () => {
    try {
      // Dynamic import to avoid SSR issues
      const vision = await import("@mediapipe/tasks-vision");
      const { FaceLandmarker, FilesetResolver } = vision;

      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      );

      faceMeshInstance = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "IMAGE",
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      return faceMeshInstance;
    } catch (err) {
      modelLoadPromise = null;
      throw new Error(
        `Failed to load Face Mesh model: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  })();

  return modelLoadPromise;
}

// ─── Embedding Extraction ─────────────────────────────────────────────────────

/**
 * Extracts face embedding from an image (data URL, file, or HTMLImageElement).
 * Returns a normalized 1404-dimensional vector, or null if no face detected.
 */
export async function extractFaceEmbedding(
  source: string | HTMLImageElement | HTMLCanvasElement,
): Promise<FaceEmbedding | null> {
  const faceMesh = await loadFaceMesh();

  // Convert to HTMLImageElement if needed
  let img: HTMLImageElement;
  if (source instanceof HTMLImageElement) {
    img = source;
  } else if (source instanceof HTMLCanvasElement) {
    // Canvas → data URL → Image
    const dataUrl = source.toDataURL("image/jpeg");
    img = await loadImage(dataUrl);
  } else {
    img = await loadImage(source);
  }

  // Detect face landmarks
  const result = faceMesh.detect(img);
  if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
    return null;
  }

  // Use first (most confident) face
  const landmarks: Landmark[] = result.faceLandmarks[0];

  if (landmarks.length !== LANDMARK_COUNT) {
    console.warn(`Expected ${LANDMARK_COUNT} landmarks, got ${landmarks.length}. Using available.`);
  }

  // Normalize and flatten landmarks
  return normalizeLandmarks(landmarks);
}

/**
 * Normalizes face landmarks into a fixed-size embedding vector.
 *
 * Normalization steps:
 * 1. Center the face (subtract nose tip position)
 * 2. Scale to unit distance (inter-ocular distance = 1)
 * 3. Flatten to 1D array
 * 4. L2-normalize the vector
 */
function normalizeLandmarks(landmarks: Landmark[]): FaceEmbedding {
  // Nose tip is landmark index 1 (MediaPipe convention)
  const noseTip = landmarks[1] || landmarks[0];

  // Center: subtract nose tip from all landmarks
  const centered = landmarks.map((lm) => ({
    x: lm.x - noseTip.x,
    y: lm.y - noseTip.y,
    z: lm.z - noseTip.z,
  }));

  // Scale: use inter-ocular distance (landmarks 33 and 263)
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];
  const interOcular = Math.sqrt(
    (rightEye.x - leftEye.x) ** 2 + (rightEye.y - leftEye.y) ** 2 + (rightEye.z - leftEye.z) ** 2,
  );

  const scale = interOcular > 0.001 ? 1 / interOcular : 1;
  const scaled = centered.map((lm) => ({
    x: lm.x * scale,
    y: lm.y * scale,
    z: lm.z * scale,
  }));

  // Flatten to 1D
  const flat: number[] = [];
  for (const lm of scaled) {
    flat.push(lm.x, lm.y, lm.z);
  }

  // L2-normalize
  const norm = Math.sqrt(flat.reduce((sum, v) => sum + v * v, 0));
  if (norm > 0) {
    for (let i = 0; i < flat.length; i++) {
      flat[i] /= norm;
    }
  }

  return flat;
}

// ─── Hashing ──────────────────────────────────────────────────────────────────

/**
 * Computes a compact hash of a face embedding for storage.
 * Uses SHA-256 to produce a 64-character hex string.
 */
export async function computeFaceHash(embedding: FaceEmbedding): Promise<FaceHash> {
  const bytes = new Float32Array(embedding).buffer;
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Similarity Comparison ─────────────────────────────────────────────────────

/**
 * Computes cosine similarity between two face embeddings.
 * Returns a value in [0, 1] where 1 = identical faces.
 */
export function computeSimilarity(a: FaceEmbedding, b: FaceEmbedding): number {
  if (a.length !== b.length) {
    throw new Error(`Embedding size mismatch: ${a.length} vs ${b.length}`);
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return Math.max(0, Math.min(1, dotProduct / denominator));
}

/**
 * Verifies if two face images belong to the same person.
 * Returns a FaceVerificationResult with match status and similarity score.
 */
export async function verifyFaceMatch(
  storedEmbedding: FaceEmbedding,
  liveImageSource: string | HTMLImageElement | HTMLCanvasElement,
  threshold: number = SIMILARITY_THRESHOLD,
): Promise<FaceVerificationResult> {
  try {
    const liveEmbedding = await extractFaceEmbedding(liveImageSource);

    if (!liveEmbedding) {
      return {
        match: false,
        similarity: 0,
        facesDetected: 0,
        error: "No face detected in live image",
      };
    }

    const similarity = computeSimilarity(storedEmbedding, liveEmbedding);

    return {
      match: similarity >= threshold,
      similarity,
      facesDetected: 1,
    };
  } catch (err) {
    return {
      match: false,
      similarity: 0,
      facesDetected: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ─── Liveness Challenges ──────────────────────────────────────────────────────

/**
 * Selects a random liveness challenge.
 */
export function getRandomChallenge(): LivenessChallenge {
  const idx = Math.floor(Math.random() * LIVENESS_CHALLENGES.length);
  return LIVENESS_CHALLENGES[idx];
}

/**
 * Returns the localized text for a liveness challenge.
 */
export function getChallengeText(challenge: LivenessChallenge): string {
  const texts: Record<LivenessChallenge, string> = {
    smile: "Please smile for the camera",
    blink: "Please blink your eyes",
    turn_left: "Please turn your head slightly left",
    turn_right: "Please turn your head slightly right",
    look_up: "Please look up",
    look_down: "Please look down",
  };
  return texts[challenge];
}

/**
 * Checks if a liveness challenge is satisfied based on face landmarks.
 *
 * Simplified heuristic checks:
 * - smile: mouth corner distance increases
 * - blink: eye aspect ratio decreases
 * - turn_left/right: nose x-offset shifts
 * - look_up/down: nose y-offset shifts
 */
export function checkLivenessChallenge(
  challenge: LivenessChallenge,
  landmarks: Landmark[],
): boolean {
  if (landmarks.length < LANDMARK_COUNT) return false;

  switch (challenge) {
    case "smile": {
      // Mouth corners: 61 (left), 291 (right)
      // Mouth center: 13 (top), 14 (bottom)
      const leftCorner = landmarks[61];
      const rightCorner = landmarks[291];
      const mouthWidth = Math.sqrt(
        (rightCorner.x - leftCorner.x) ** 2 + (rightCorner.y - leftCorner.y) ** 2,
      );
      // Smile: mouth width > 0.05 (relative to face)
      return mouthWidth > 0.05;
    }

    case "blink": {
      // Left eye: 33 (outer), 133 (inner), 159 (top), 145 (bottom)
      const leftOuter = landmarks[33];
      const leftInner = landmarks[133];
      const leftTop = landmarks[159];
      const leftBottom = landmarks[145];

      const eyeWidth = Math.sqrt(
        (leftInner.x - leftOuter.x) ** 2 + (leftInner.y - leftOuter.y) ** 2,
      );
      const eyeHeight = Math.sqrt(
        (leftTop.x - leftBottom.x) ** 2 + (leftTop.y - leftBottom.y) ** 2,
      );

      const ear = eyeHeight / (eyeWidth || 0.001);
      // Blink: EAR < 0.15 (eye nearly closed)
      return ear < 0.15;
    }

    case "turn_left": {
      // Nose tip: 1, face center: average of all landmarks
      const nose = landmarks[1];
      const centerX = landmarks.reduce((sum, lm) => sum + lm.x, 0) / landmarks.length;
      // Turned left: nose.x > centerX + 0.02
      return nose.x > centerX + 0.02;
    }

    case "turn_right": {
      const nose = landmarks[1];
      const centerX = landmarks.reduce((sum, lm) => sum + lm.x, 0) / landmarks.length;
      // Turned right: nose.x < centerX - 0.02
      return nose.x < centerX - 0.02;
    }

    case "look_up": {
      const nose = landmarks[1];
      const centerY = landmarks.reduce((sum, lm) => sum + lm.y, 0) / landmarks.length;
      // Looking up: nose.y < centerY - 0.02
      return nose.y < centerY - 0.02;
    }

    case "look_down": {
      const nose = landmarks[1];
      const centerY = landmarks.reduce((sum, lm) => sum + lm.y, 0) / landmarks.length;
      // Looking down: nose.y > centerY + 0.02
      return nose.y > centerY + 0.02;
    }

    default:
      return false;
  }
}

// ─── Liveness Schedule ────────────────────────────────────────────────────────

/**
 * Returns a randomized delay until the next liveness check.
 * Between 5-15 minutes to make prediction difficult.
 */
export function getNextLivenessDelayMs(): number {
  return (
    LIVENESS_INTERVAL_MIN_MS + Math.random() * (LIVENESS_INTERVAL_MAX_MS - LIVENESS_INTERVAL_MIN_MS)
  );
}

// ─── Full Liveness Check Flow ─────────────────────────────────────────────────

/**
 * Performs a complete liveness check:
 * 1. Captures current frame from camera
 * 2. Extracts face embedding
 * 3. Compares to stored embedding
 * 4. Checks if liveness challenge is satisfied
 *
 * @param storedEmbedding - The user's registered face embedding
 * @param cameraFrame - Current frame from camera (canvas or image)
 * @param challenge - The liveness challenge to verify
 */
export async function performLivenessCheck(
  storedEmbedding: FaceEmbedding,
  cameraFrame: HTMLCanvasElement | HTMLImageElement,
  challenge: LivenessChallenge,
): Promise<LivenessCheckResult> {
  const faceMesh = await loadFaceMesh();

  // Extract landmarks from camera frame
  let img: HTMLImageElement;
  if (cameraFrame instanceof HTMLCanvasElement) {
    const dataUrl = cameraFrame.toDataURL("image/jpeg");
    img = await loadImage(dataUrl);
  } else {
    img = cameraFrame;
  }

  const result = faceMesh.detect(img);
  const landmarks = result.faceLandmarks?.[0];

  if (!landmarks || landmarks.length === 0) {
    return {
      confirmed: false,
      challenge,
      faceResult: {
        match: false,
        similarity: 0,
        facesDetected: 0,
        error: "No face detected",
      },
      timestamp: Date.now(),
    };
  }

  // Check face similarity
  const liveEmbedding = normalizeLandmarks(landmarks);
  const similarity = computeSimilarity(storedEmbedding, liveEmbedding);

  // Check liveness challenge
  const challengeSatisfied = checkLivenessChallenge(challenge, landmarks);

  return {
    confirmed: similarity >= SIMILARITY_THRESHOLD && challengeSatisfied,
    challenge,
    faceResult: {
      match: similarity >= SIMILARITY_THRESHOLD,
      similarity,
      facesDetected: result.faceLandmarks.length,
    },
    timestamp: Date.now(),
  };
}

// ─── Utility ──────────────────────────────────────────────────────────────────

/**
 * Loads an image from a data URL or URL.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src.substring(0, 50)}...`));
    img.src = src;
  });
}

/**
 * Captures a frame from the user's camera.
 * Returns a canvas element with the captured frame.
 */
export async function captureCameraFrame(): Promise<HTMLCanvasElement> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user", width: 640, height: 480 },
  });

  const video = document.createElement("video");
  video.srcObject = stream;
  video.autoplay = true;

  await new Promise<void>((resolve) => {
    video.onloadedmetadata = () => {
      video.play();
      resolve();
    };
  });

  // Wait a bit for camera to stabilize
  await new Promise((r) => setTimeout(r, 500));

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(video, 0, 0);

  // Stop camera
  stream.getTracks().forEach((t) => t.stop());

  return canvas;
}
