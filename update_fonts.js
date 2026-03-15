const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
};

const files = walk(__dirname);
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque"))") || content.includes('var(--font-bricolage, "Bricolage Grotesque")')) {
    content = content.replace(/var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque"))/g, 'var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque"))');
    content = content.replace(/var(--font-bricolage, "Bricolage Grotesque")/g, 'var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque"))');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
