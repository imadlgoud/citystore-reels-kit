import { Config } from "@remotion/cli/config";
import fs from "node:fs";

// Use the pre-installed headless shell in sandboxed environments (no Chrome download).
// (the installed version changes between containers, so look it up instead of hard-coding it)
const findShell = (): string | null => {
  const root = "/opt/pw-browsers";
  if (!fs.existsSync(root)) return null;
  for (const d of fs.readdirSync(root).filter((n) => n.startsWith("chromium_headless_shell-")).sort().reverse()) {
    for (const rel of ["chrome-headless-shell-linux64/chrome-headless-shell", "chrome-linux/headless_shell"]) {
      const p = `${root}/${d}/${rel}`;
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
};
const localShell = findShell();
if (localShell) {
  Config.setBrowserExecutable(localShell);
}

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
