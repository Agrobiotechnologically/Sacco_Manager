import { mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const webDirectory = path.join(projectRoot, "www");

await mkdir(webDirectory, { recursive: true });
for (const file of ["index.html", "styles.css", "app.js"]) {
  await copyFile(path.join(projectRoot, file), path.join(webDirectory, file));
}
