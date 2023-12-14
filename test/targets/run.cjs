let { RiTa } = require('../../dist/rita.cjs');

let str = '\nRiTa v' + RiTa.VERSION + '\n\n';
Object.getOwnPropertyNames(RiTa)
  .filter(p => !p.startsWith('_')
    && typeof RiTa[p] === "function")
  .forEach(p => str += `RiTa.${p}()\n`);
console.log(str);
