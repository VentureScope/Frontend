import fs from "fs";
import path from "path";

const roots = ["app", "components"];
const reps = [
  [/rounded-lg border border-border bg-card p-6 shadow-sm sm:rounded-xl/g, "vs-surface p-6 sm:p-8"],
  [/rounded-lg border border-border bg-card p-6 shadow-sm/g, "vs-surface p-6"],
  [/shadow-lg shadow-primary\/\d+/g, ""],
  [/shadow-xl shadow-primary\/\d+/g, ""],
  [/shadow-primary\/\d+/g, ""],
  [/bg-primary\/15/g, "bg-muted"],
  [/bg-primary\/10/g, "bg-muted"],
  [/bg-secondary\/15/g, "bg-muted"],
  [/bg-accent\/15/g, "bg-muted"],
  [/text-secondary sm:text-xl/g, "text-foreground sm:text-xl"],
  [/text-lg font-semibold text-secondary/g, "text-lg font-semibold text-foreground"],
  [/bg-secondary p-6/g, "vs-surface p-6"],
  [/bg-primary p-6 sm:p-8 lg:p-10 text-primary-foreground/g, "vs-surface p-6 sm:p-8 lg:p-10"],
  [/from-primary\/10 via-background/g, "from-muted/50 via-background"],
  [/from-primary\/20/g, "from-muted/30"],
  [/decoration-primary\/30/g, "decoration-muted-foreground/30"],
  [/border-primary\/30/g, "border-border"],
  [/border-primary\/20/g, "border-border"],
  [/hover:bg-primary\/15/g, "hover:bg-muted"],
  [/hover:bg-primary\/10/g, "hover:bg-muted"],
  [/focus:ring-2 focus:ring-primary\/20/g, "focus:ring-1 focus:ring-ring/20"],
  [/color: "bg-primary"/g, 'color: "bg-muted-foreground/50"'],
  [/color: "bg-secondary"/g, 'color: "bg-muted-foreground/40"'],
];

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next" || ent.name === "scripts")
      continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (/\.tsx$/.test(ent.name) && !ent.name.endsWith(".bak")) files.push(p);
  }
  return files;
}

let n = 0;
for (const root of roots) {
  for (const file of walk(root)) {
    let c = fs.readFileSync(file, "utf8");
    const o = c;
    for (const [re, sub] of reps) c = c.replace(re, sub);
    if (c !== o) {
      fs.writeFileSync(file, c);
      n++;
    }
  }
}
console.log(`Muted accents in ${n} files`);
