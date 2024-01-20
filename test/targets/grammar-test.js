import { RiTa } from '../../dist/rita.js';

console.log('RiTa v' + RiTa.VERSION + '\n\n');

let rhyme = function (word) {
  let res = RiTa.rhymesSync(word);    // get the rhymes
  return res.length ? RiTa.random(res) : RiTa.randomWord()
}

RiTa.addTransform('rhyme', rhyme);
//console.log(RiTa.riscript.transforms);

let rg = RiTa.grammar({ start: 'dog rhymes with [dog].rhyme().s' });

console.log(rg.expand());
