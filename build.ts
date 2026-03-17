import { cpSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");

function copy(src: string, dest: string) {
  if (!existsSync(src)) return;
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: statSync(src).isDirectory() });
}

mkdirSync(join(dist, "inject"), { recursive: true });

copy(join(root, "manifest.json"), join(dist, "manifest.json"));
copy(join(root, "_locales"), join(dist, "_locales"));
copy(join(root, "src", "inject", "inject.css"), join(dist, "inject", "inject.css"));
copy(join(root, "src", "inject", "icon.svg"), join(dist, "inject", "icon.svg"));

if (existsSync(join(root, "icons"))) {
  copy(join(root, "icons"), join(dist, "icons"));
}

console.log("Assets copied to dist/");
