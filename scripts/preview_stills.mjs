// Renders preview stills of chosen frames (bundles once). Usage:
//   node scripts/preview_stills.mjs Reel9x16 0.5 20,60,95 [outDir]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [id = "Reel9x16", scale = "0.5", frames = "60", outDir = "out/preview"] = process.argv.slice(2);
const findShell = () => {
  const root = "/opt/pw-browsers";
  if (!fs.existsSync(root)) return undefined;
  for (const d of fs.readdirSync(root).filter((n) => n.startsWith("chromium_headless_shell-")).sort().reverse()) {
    for (const rel of ["chrome-headless-shell-linux64/chrome-headless-shell", "chrome-linux/headless_shell"]) {
      if (fs.existsSync(`${root}/${d}/${rel}`)) return `${root}/${d}/${rel}`;
    }
  }
  return undefined;
};
const browserExecutable = findShell();
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const f of frames.split(",").map(Number)) {
  const output = path.join(outDir, `${id}_${String(f).padStart(3, "0")}.png`);
  await renderStill({ serveUrl, composition, frame: f, output, scale: Number(scale), browserExecutable, overwrite: true });
  console.log(output);
}
