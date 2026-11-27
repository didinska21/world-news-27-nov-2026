// Copy the prepared front page into make.fun's output folder (27 November 2026).
import { copyFile, mkdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "entry.png");
const outputDirectory = resolve(process.env.MAKEFUN_OUTPUT_DIR || "/output");
const destination = resolve(outputDirectory, "entry.png");
const maximumBytes = 1_048_576;

const sourceDetails = await stat(source);
if (!sourceDetails.isFile() || sourceDetails.size === 0) {
  throw new Error(`Bundled entry.png must be a non-empty regular file; actual size: ${sourceDetails.size} bytes.`);
}

await mkdir(outputDirectory, { recursive: true });

if (source !== destination) {
  await copyFile(source, destination);
}

const details = await stat(destination);
if (!details.isFile() || details.size === 0 || details.size > maximumBytes) {
  throw new Error(
    `Output entry.png must be a non-empty regular file of at most ${maximumBytes} bytes; actual size: ${details.size} bytes.`,
  );
}
