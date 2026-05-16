/**
 * Flags legacy hardcoded colors in app/ and components/.
 * Intentional exceptions are listed in ALLOWED_PATTERNS (regex).
 *
 * Run: npm run check:theme
 */
import fs from "fs";
import path from "path";

const SCAN_ROOTS = ["app", "components"];
const SKIP_DIRS = new Set(["node_modules", ".next"]);
const SKIP_FILES = /\.(bak|test|spec)\./;

const FORBIDDEN = [
  /\bbg-white\b/,
  /\btext-\[#0f172a\]/i,
  /\btext-\[#2563eb\]/i,
  /\btext-\[#1d59db\]/i,
  /style=\{\{\s*color:\s*["']#/,
  /\btext-slate-\d+/,
  /\bbg-slate-50\b/,
  /\bbg-slate-100\b/,
  /\bborder-slate-\d+/,
  /\btext-blue-600\b/,
  /\bbg-blue-600\b/,
  /\bbg-\[#1d59db\]/i,
  /\bbg-\[#f8fafc\]/i,
  /\bhover:bg-blue-700\b/,
];

/** Patterns allowed in feature code (dark cards, overlays, marketing panels). */
const ALLOWED_PATTERNS = [
  /\bbg-slate-900\b/,
  /\bbg-slate-800\b/,
  /\bbg-slate-700\b/,
  /\bborder-slate-700\b/,
  /\btext-slate-100\b/,
  /\btext-slate-200\b/,
  /\bfrom-slate-900\b/,
  /\bbg-\[#020617\]/i,
  /\bbg-\[#020817\]/i,
  /\bprint:text-slate-/,
  /\bprint:bg-/,
  /\bbg-white\/\d+/,
  /\btext-white\b/,
  /settings_page\.tsx$/,
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (/\.(tsx|ts|css)$/.test(ent.name) && !SKIP_FILES.test(ent.name)) {
      files.push(p);
    }
  }
  return files;
}

function isAllowed(file, line) {
  if (ALLOWED_PATTERNS.some((re) => re.test(file) || re.test(line))) {
    return true;
  }
  return false;
}

const violations = [];

for (const root of SCAN_ROOTS) {
  for (const file of walk(root)) {
    const rel = file.replace(/\\/g, "/");
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (isAllowed(rel, line)) return;
      for (const re of FORBIDDEN) {
        if (re.test(line)) {
          violations.push({ file: rel, line: i + 1, match: line.trim().slice(0, 120) });
          break;
        }
      }
    });
  }
}

if (violations.length === 0) {
  console.log("check:theme — no forbidden color utilities found.");
  process.exit(0);
}

console.error(`check:theme — ${violations.length} issue(s):\n`);
for (const v of violations.slice(0, 40)) {
  console.error(`  ${v.file}:${v.line}`);
  console.error(`    ${v.match}\n`);
}
if (violations.length > 40) {
  console.error(`  … and ${violations.length - 40} more`);
}
process.exit(1);
