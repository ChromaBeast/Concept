import fs from 'fs';
import path from 'path';

const srcDir = 'c:/Projects/Concept/web_app/src';

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // Look for border without paper-border or with white / harsh colors
        if (
          line.includes('border-white') ||
          line.includes('border-zinc') ||
          line.includes('border-gray') ||
          line.includes('border-neutral') ||
          line.includes('border-slate') ||
          (line.includes(' border ') && !line.includes('border-paper') && !line.includes('border-ochre') && !line.includes('border-teal')) ||
          line.includes('border-obsidian') ||
          line.includes('border-dark') ||
          line.includes('border-border')
        ) {
          console.log(`${path.relative(srcDir, fullPath)}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

scanDir(srcDir);
