import { expect } from 'chai';
import { readFileSync } from 'fs';
import { RiTa } from './index.js';
import { syllablesToIpa } from './arpabet-ipa.js';

// Load harvard data [sentence, tokens, tags, ipa, phones]
const data = JSON.parse(readFileSync(new URL('./harvard-data.json', import.meta.url)));
const sentences = data.map(d => d[0]);

describe('Harvard', function () { // tests on Harvard sentences

  it('should tokenize and untokenize all sentences without loss', function () {
    let mismatches = 0;
    for (const s of sentences) {
      const result = RiTa.untokenize(RiTa.tokenize(s));
      if (result !== s) {
        console.warn(`  MISMATCH:\n    expected: ${s}\n    got:      ${result}`);
        mismatches++;
      }
    }
    expect(mismatches, `${mismatches} tokenize/untokenize mismatches`).to.equal(0);
  });

  it('should assign correct POS tags to all sentences', function () {
    let mismatches = 0;
    for (let i = 0; i < sentences.length; i++) {
      const s = sentences[i];
      const [, expectedToks, expectedTags] = data[i];
      const actualToks = RiTa.tokenize(s);
      const actualTags = RiTa.pos(actualToks);

      // verify tokens 
      expect(actualToks, `sentence ${i + 1} tokens`).to.deep.equal(expectedToks);

      // verify tags
      if (JSON.stringify(actualTags) !== JSON.stringify(expectedTags)) {
        console.warn(`  TAG MISMATCH [${i + 1}]: ${s}`);
        console.warn(`    expected: ${JSON.stringify(expectedTags)}`);
        console.warn(`    got:      ${JSON.stringify(actualTags)}`);
        mismatches++;
      }
    }
    expect(mismatches, `${mismatches} POS tag mismatches`).to.equal(0);
  });

  it('should produce correct phonemes for all sentences', function () {
    let mismatches = 0, skipped = 0;
    RiTa.SILENCE_LTS = true;
    for (let i = 0; i < sentences.length; i++) {
      const [sentence, , , expectedIpa] = data[i];
      const s = sentence.replace(/[.!?,]+$/, '');
      const actualIpa = '/' + syllablesToIpa(RiTa.syllables(s), RiTa.stresses(s)) + '/';
      if (actualIpa !== expectedIpa) {
        console.warn(`  PHONE MISMATCH [${i + 1}]: ${sentence}`);
        console.warn(`    expected: ${expectedIpa}`);
        console.warn(`    got:      ${actualIpa}`);
        mismatches++;
      }
    }
    expect(mismatches, `${mismatches} phoneme mismatches`).to.equal(0);
    RiTa.SILENCE_LTS = false;
  });

});
