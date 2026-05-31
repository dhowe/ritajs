import { expect } from 'chai';
import { readFileSync } from 'fs';
import { RiTa } from './index.js';
import { syllablesToIpa } from './arpabet-ipa.js';

// Load pre-computed expected [sentence, tokens, tags, ipa, phones] tuples
const expectedData = JSON.parse(
  readFileSync(new URL('./harvard-data.json', import.meta.url))
);
const sentences = expectedData.map(d => d[0]);

describe('Harvard Sentences', function () {

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
      const [, expectedToks, expectedTags] = expectedData[i];
      const actualToks = RiTa.tokenize(s);
      const actualTags = RiTa.pos(actualToks);

      // verify tokens match expected
      expect(actualToks, `sentence ${i + 1} tokens`).to.deep.equal(expectedToks);

      // verify tags match expected
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
      const [sentence,,, expectedIpa] = expectedData[i];
      if (!expectedIpa) { skipped++; continue; } // no IPA for this variant
      const s = sentence.replace(/[.!?,]+$/, '');
      const actualIpa = '/' + syllablesToIpa(RiTa.syllables(s), RiTa.stresses(s)) + '/';
      if (actualIpa !== expectedIpa) {
        console.warn(`  PHONE MISMATCH [${i + 1}]: ${sentence}`);
        console.warn(`    expected: ${expectedIpa}`);
        console.warn(`    got:      ${actualIpa}`);
        mismatches++;
      }
    }
    if (skipped) console.log(`  (skipped ${skipped} sentences with no IPA reference)`);
    expect(mismatches, `${mismatches} phoneme mismatches`).to.equal(0);
    RiTa.SILENCE_LTS = false;
  });

});
