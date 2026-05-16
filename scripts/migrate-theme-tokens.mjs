import fs from "fs";
import path from "path";

const roots = [
  "components/data-hub",
  "components/market",
  "components/new-roadmap",
  "components/roadmap-view",
  "components/mfa",
];

const replacements = [
  ["bg-[#f8fafc]", "bg-background"],
  ["ring-[#f8fafc]", "ring-background"],
  ["ring-[#fcfdff]", "ring-background"],
  ["bg-[#fcfdff]", "bg-muted/40"],
  ["bg-[#f4f7ff]", "bg-primary/5"],
  ["bg-[#eff6ff]", "bg-primary/10"],
  ["bg-[#e1eeff]", "bg-primary/15"],
  ["bg-[#1d59db]", "bg-primary"],
  ["bg-[#0052cc]", "bg-primary"],
  ["text-[#1d59db]", "text-primary"],
  ["border-[#1d59db]", "border-primary"],
  ["hover:bg-blue-700", "hover:bg-primary/90"],
  ["hover:text-blue-700", "hover:text-primary/90"],
  ["hover:text-blue-600", "hover:text-primary"],
  ["text-blue-700", "text-primary"],
  ["text-blue-600", "text-primary"],
  ["text-blue-500", "text-primary"],
  ["bg-blue-600", "bg-primary"],
  ["bg-blue-50/50", "bg-primary/10"],
  ["bg-blue-50/30", "bg-primary/10"],
  ["bg-blue-50", "bg-primary/10"],
  ["border-blue-100", "border-primary/20"],
  ["border-blue-200", "border-primary/30"],
  ["border-l-blue-600", "border-l-primary"],
  ["border-2 border-blue-600", "border-2 border-primary"],
  ["border-blue-600", "border-primary"],
  ["shadow-blue-200", "shadow-primary/20"],
  ["shadow-blue-500/20", "shadow-primary/20"],
  ["shadow-blue-500/5", "shadow-primary/10"],
  ["focus:ring-blue-100", "focus:ring-primary/20"],
  ["focus:border-blue-500", "focus:border-primary"],
  ["focus:bg-white", "focus:bg-card"],
  ["placeholder-slate-500", "placeholder:text-muted-foreground"],
  ["divide-slate-50", "divide-border"],
  ["text-slate-900", "text-foreground"],
  ["text-slate-800", "text-foreground"],
  ["text-slate-700", "text-muted-foreground"],
  ["text-slate-600", "text-muted-foreground"],
  ["text-slate-500", "text-muted-foreground"],
  ["text-slate-400", "text-muted-foreground"],
  ["text-slate-300", "text-muted-foreground/50"],
  ["border-slate-50", "border-border"],
  ["border-slate-100", "border-border"],
  ["border-slate-200", "border-border"],
  ["border-slate-300", "border-border"],
  ["bg-slate-50/50", "bg-muted/50"],
  ["bg-slate-50/30", "bg-muted/30"],
  ["min-h-screen bg-slate-50/30", "min-h-screen bg-background"],
  ["bg-slate-50", "bg-muted"],
  ["bg-slate-100", "bg-muted"],
  ["hover:bg-slate-50", "hover:bg-muted"],
  ["hover:bg-slate-100", "hover:bg-muted"],
  ["hover:text-slate-900", "hover:text-foreground"],
  ["hover:border-slate-300", "hover:border-border"],
  ["bg-white", "bg-card"],
  ["text-gray-600", "text-muted-foreground"],
  ["text-gray-500", "text-muted-foreground"],
  ["bg-gray-50", "bg-muted"],
  ["bg-[#f0f4ff]", "bg-muted"],
  ["focus-visible:ring-blue-600", "focus-visible:ring-primary"],
  ["hover:bg-[#1748b3]", "hover:bg-primary/90"],
  ["bg-blue-100", "bg-primary/15"],
  ["bg-blue-200", "bg-primary/30"],
  ["hover:bg-blue-100", "hover:bg-primary/15"],
  ["border-white", "border-background"],
  ["border-slate-800", "border-border"],
  ["from-blue-50/50 via-white to-white", "from-primary/10 via-background to-background"],
  ["decoration-blue-100", "decoration-primary/30"],
  ["from-blue-600/20", "from-primary/20"],
  ["bg-blue-100/50", "bg-primary/15"],
  ["border-primary/30/50", "border-primary/30"],
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory() && ent.name !== "node_modules") walk(p, files);
    else if (/\.(tsx|ts)$/.test(ent.name)) files.push(p);
  }
  return files;
}

let changed = 0;
for (const root of roots) {
  for (const file of walk(root)) {
    let src = fs.readFileSync(file, "utf8");
    const orig = src;
    for (const [from, to] of replacements) {
      src = src.split(from).join(to);
    }
    if (src !== orig) {
      fs.writeFileSync(file, src);
      changed++;
      console.log("updated", file);
    }
  }
}
console.log("files changed:", changed);
