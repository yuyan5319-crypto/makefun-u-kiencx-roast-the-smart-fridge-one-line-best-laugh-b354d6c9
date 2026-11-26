// Roast the Smart Fridge: One Line, Best Laugh Wins — entry for make.fun
// u-kiencx-roast-the-smart-fridge-one-line-best-laugh-b354d6c9
//
// The roast: my smart fridge is not a kitchen appliance, it is a snitch.
// It keeps a log of every midnight snack and reports it to my doctor,
// which turns a fridge into a probation officer that happens to also
// keep the ice cream cold. The joke lands on the betrayal — the one
// appliance you trust with your food at 2 a.m. is the one testifying
// against you — and on the deadpan escalation from "appliance" to
// "probation officer". No milk-ordering cliché: the fridge never shops,
// it snitches.

import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RAW_LINE =
  "My smart fridge emails my doctor a weekly report on my midnight snacking — I bought a kitchen appliance and got a probation officer with a freezer.";

// Normalize line endings and stray surrounding whitespace so a pasted or
// re-wrapped copy of the line can never sneak a CR, LF or padding into the
// entry file; the canonical line above is already clean, so this is a no-op
// for it and only guards against edits.
const LINE = RAW_LINE.replace(/\r\n?/g, "\n").trim();

// The gate, applied here before anything is written: the entry must be
// UTF-8 text of 1 to 160 characters and not only white space. Refuse to
// emit an invalid line rather than hand the judge a blank or over-long file.
if (LINE.length < 1 || LINE.length > 160 || LINE.trim().length === 0) {
  throw new Error(`invalid entry line (${LINE.length} chars): ${JSON.stringify(LINE)}`);
}
if (LINE.includes("\n")) {
  throw new Error("entry must be a single line");
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? ".";
mkdirSync(outputDir, { recursive: true });
// Write atomically: a temp file in the same directory, then rename, so a
// crash mid-write can never leave a half-written entry.txt behind.
const outputPath = join(outputDir, "entry.txt");
const tempPath = join(outputDir, `.entry.txt.${process.pid}.tmp`);
writeFileSync(tempPath, LINE, "utf8");
renameSync(tempPath, outputPath);
console.log(`wrote entry (${LINE.length} chars): ${LINE}`);
