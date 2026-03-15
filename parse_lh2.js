const fs = require('fs');
const data = JSON.parse(fs.readFileSync('localhost_3000-20260314T194946.json', 'utf8'));
let out = '';
out += 'Performance Score: ' + data.categories.performance?.score * 100 + '\n';
const audits = Object.values(data.audits)
  .filter(a => a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'informative')
  .sort((a, b) => (a.score || 0) - (b.score || 0));

out += '\nTop Issues:\n';
audits.slice(0, 15).forEach(a => {
  out += `- ${a.title} (Score: ${a.score}): ${a.displayValue || ''}\n`;
  if (a.details && a.details.items) {
    const items = a.details.items.slice(0, 3);
    items.forEach(item => {
      if (item.url) out += `  * URL: ${item.url}\n`;
      if (item.node?.snippet) out += `  * Node: ${item.node.snippet}\n`;
    });
  }
});
fs.writeFileSync('out_node.txt', out, 'utf8');
