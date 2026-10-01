/**
 * One-off asset generator: derives the PWA + mobile app icons/splash from the
 * existing `apps/web/public/logo.jpg` (square-ish source).
 *
 * Run: node scripts/generate-icons.mjs
 *
 * Outputs:
 *   apps/web/public/icon-192.png / icon-512.png   (PWA manifest icons)
 *   apps/mobile/assets/icon.png                   (1024 iOS/Play)
 *   apps/mobile/assets/adaptive-icon.png          (1024 Android foreground, safe-zone)
 *   apps/mobile/assets/splash.png                 (iOS splash, white bg + centered logo)
 *   apps/mobile/assets/favicon.png                (64 web favicon)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const source = path.join(repoRoot, "apps/web/public/logo.jpg");
const webPublic = path.join(repoRoot, "apps/web/public");
const mobileAssets = path.join(repoRoot, "apps/mobile/assets");

async function main() {
  const image = await loadImage(fs.readFileSync(source));

  // Center-crop the source to a square.
  const side = Math.min(image.width, image.height);
  const sx = (image.width - side) / 2;
  const sy = (image.height - side) / 2;

  const renderSquare = (size, dst) => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, sx, sy, side, side, 0, 0, size, size);
    fs.writeFileSync(dst, canvas.toBuffer("image/png"));
    console.log("wrote", path.relative(repoRoot, dst));
  };

  // PWA + app icons (square, full-bleed).
  renderSquare(192, path.join(webPublic, "icon-192.png"));
  renderSquare(512, path.join(webPublic, "icon-512.png"));
  renderSquare(1024, path.join(mobileAssets, "icon.png"));
  renderSquare(64, path.join(mobileAssets, "favicon.png"));

  // PWA maskable icon — solid background + logo in the ~80% safe zone (so
  // Android's launcher can mask it without cropping edges).
  const maskable = (size) => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, size, size);
    const logo = Math.round(size * 0.8);
    const off = (size - logo) / 2;
    ctx.drawImage(image, sx, sy, side, side, off, off, logo, logo);
    return canvas.toBuffer("image/png");
  };
  fs.writeFileSync(path.join(webPublic, "icon-maskable-512.png"), maskable(512));
  console.log("wrote apps/web/public/icon-maskable-512.png");
  fs.writeFileSync(path.join(webPublic, "icon-maskable-192.png"), maskable(192));
  console.log("wrote apps/web/public/icon-maskable-192.png");

  // Android adaptive foreground — logo centered in the ~66% safe zone,
  // transparent background.
  const adaptive = createCanvas(1024, 1024);
  const actx = adaptive.getContext("2d");
  const logoSize = 640;
  const offset = (1024 - logoSize) / 2;
  actx.drawImage(image, sx, sy, side, side, offset, offset, logoSize, logoSize);
  fs.writeFileSync(path.join(mobileAssets, "adaptive-icon.png"), adaptive.toBuffer("image/png"));
  console.log("wrote apps/mobile/assets/adaptive-icon.png");

  // iOS splash — white background, centered logo.
  const splash = createCanvas(1284, 2778);
  const sctx = splash.getContext("2d");
  sctx.fillStyle = "#ffffff";
  sctx.fillRect(0, 0, 1284, 2778);
  const splashLogo = 600;
  const splashOffset = (1284 - splashLogo) / 2;
  const splashY = (2778 - splashLogo) / 2;
  sctx.drawImage(image, sx, sy, side, side, splashOffset, splashY, splashLogo, splashLogo);
  fs.writeFileSync(path.join(mobileAssets, "splash.png"), splash.toBuffer("image/png"));
  console.log("wrote apps/mobile/assets/splash.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
