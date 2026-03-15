const fs = require('fs');
const path = require('path');

let globals = fs.readFileSync('styles/globals.css', 'utf8');

const processFile = (file, cssVarName, startSig, endSig) => {
  let content = fs.readFileSync(file, 'utf8');
  const indexStr = `const ${cssVarName} = \``;
  const startIdx = content.indexOf(indexStr);
  if (startIdx !== -1) {
    const endIdx = content.indexOf('`;', startIdx);
    if (endIdx !== -1) {
      const css = content.slice(startIdx + indexStr.length, endIdx);
      globals += '\n\n/* ' + file + ' */\n' + css;
      // remove the css declaration and injection
      const afterCss = content.slice(endIdx + 2);
      
      let newContent;
      const injectStart = content.indexOf(startSig);
      if (injectStart !== -1) {
        const injectEnd = content.indexOf(endSig, injectStart);
        if (injectEnd !== -1) {
           newContent = content.slice(0, startIdx) + content.slice(endIdx + 2, injectStart) + content.slice(injectEnd + endSig.length);
        }
      }
      
      if (newContent) {
         fs.writeFileSync(file, newContent, 'utf8');
         console.log('Processed', file);
      }
    }
  }
};

processFile('Components/Card.jsx', 'CARD_CSS', '/* Inject card styles once into <head> */', '}\n');
processFile('pages/index.js', 'sectionHeadStyles', '/* Inject section-head styles once */', '}\n');
processFile('pages/index.js', 'gridStyles', 'useEffect(() => {', '}, []);\n');

// Also Hero.jsx has `<style>{\``
let heroContent = fs.readFileSync('Components/Hero.jsx', 'utf8');
const heroStart = heroContent.indexOf('<style>{`');
if (heroStart !== -1) {
   const heroEnd = heroContent.indexOf('`}</style>', heroStart);
   if (heroEnd !== -1) {
      const heroCss = heroContent.slice(heroStart + 9, heroEnd);
      globals += '\n\n/* Hero.jsx */\n' + heroCss;
      heroContent = heroContent.slice(0, heroStart) + heroContent.slice(heroEnd + 10);
      fs.writeFileSync('Components/Hero.jsx', heroContent, 'utf8');
      console.log('Processed Hero.jsx');
   }
}

fs.writeFileSync('styles/globals.css', globals, 'utf8');
console.log('Globals updated.');
