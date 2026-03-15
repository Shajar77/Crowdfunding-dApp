const fs = require('fs');
const data = JSON.parse(fs.readFileSync('localhost_3000-20260314T194946.json', 'utf8'));
console.log('Performance Score:', data.categories.performance?.score * 100);

const audits = Object.values(data.audits)
  .filter(a => a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'informative')
  .sort((a, b) => (a.score || 0) - (b.score || 0));

console.log('\nTop Issues:');
audits.slice(0, 10).forEach(a => {
  console.log(`- ${a.title} (Score: ${a.score}): ${a.displayValue || ''}`);
  if (a.details && a.details.items) {
    const items = a.details.items.slice(0, 3);
    items.forEach(item => {
      if (item.url) console.log(`  * URL: ${item.url}`);
      if (item.node?.snippet) console.log(`  * Node: ${item.node.snippet}`);
      const size = item.totalBytes || item.wastedBytes || item.transferSize;
      if (size) console.log(`  * Size/Wasted: ${Math.round(size / 1024)} KB`);
    });
  }
});
