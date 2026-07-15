const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      let content = fs.readFileSync(full, 'utf8');
      if (content.match(/import\s+\{.*authOptions.*\}\s+from\s+['"].*auth\/\[\.\.\.nextauth\]\/route['"]/)) {
        content = content.replace(/import\s+\{([^}]*authOptions[^}]*)\}\s+from\s+['"].*auth\/\[\.\.\.nextauth\]\/route['"]/g, "import { $1 } from '@/lib/auth'");
        fs.writeFileSync(full, content);
        console.log("Updated", full);
      }
    }
  }
}
walk('./src');
