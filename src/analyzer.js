import Util from "./util.js";
import LetterToSound from "./rita_lts.js";

const SP = ' ', E = '';

/**
 * @class Analyzer
 * @memberof module:rita
 */
class Analyzer {

  constructor(parent) {
    this.cache = {};
    this.RiTa = parent;
    this.lts = undefined;
  }

  analyze(text, opts) {
    let words = this.RiTa.tokenizer.tokenize(text);
    let tags = this.RiTa.pos(text, opts); // tags are not cached
    let features = {
      phones: E,
      stresses: E,
      syllables: E,
      pos: tags.join(SP),
      tokens: words.join(SP)
    }

    for (let i = 0; i < words.length; i++) {
      let { phones, stresses, syllables } = this.analyzeWord(words[i], opts);
      features.phones += SP + phones;
      features.stresses += SP + stresses;
      features.syllables += SP + syllables;
    }
    Object.keys(features).forEach(k => features[k] = features[k].trim());

    return features;
  }

  computePhones(word, opts) {
    this.lts = this.lts || new LetterToSound(this.RiTa);
    return this.lts.buildPhones(word, opts);
  }

  phonesToStress(phones) {
    if (!phones) return;
    let stress = E, syls = phones.split(SP);
    for (let j = 0; j < syls.length; j++) {
      if (!syls[j].length) continue;
      stress += syls[j].includes('1') ? '1' : '0';
      if (j < syls.length - 1) stress += '/';
    }
    return stress;
  }

  analyzeWord(word, opts = {}) {

    // check the cache first
    let result = this.RiTa.CACHING && this.cache[word];
    if (typeof result === 'undefined') {

      let slash = '/', delim = '-';
      let lex = this.RiTa.lexicon
      let phones = word, syllables = word, stresses = word;
      let rawPhones = lex.rawPhones(word, { noLts: true })
        || this._computeRawPhones(word, lex, opts);

      if (rawPhones) {

        // compute phones, syllables and stresses
        if (typeof rawPhones === 'string') {
          let sp = rawPhones.replace(/1/g, E).replace(/ /g, delim) + SP;
          phones = (sp === 'dh ') ? 'dh-ah ' : sp; // special case
          let ss = rawPhones.replace(/ /g, slash).replace(/1/g, E) + SP;
          syllables = (ss === 'dh ') ? 'dh-ah ' : ss;
          stresses = this.phonesToStress(rawPhones);
        }
        else {
          // hyphenated #HWF
          let ps = [], syls = [], strs = [];
          rawPhones.forEach(p => {
            let sp = p.replace(/1/g, E).replace(/ /g, delim);
            ps.push((sp === 'dh ') ? 'dh-ah ' : sp); // special case
            let ss = p.replace(/ /g, slash).replace(/1/g, E);
            syls.push((ss === 'dh ') ? 'dh-ah ' : ss);
            strs.push(this.phonesToStress(p));
          });
          phones = ps.join("-");
          syllables = syls.join("/");
          stresses = strs.join("-");
          // end of #HWF
        }
      }

      result = { phones, stresses, syllables };
      Object.keys(result).forEach(k => result[k] = result[k].trim());

      // add to cache if enabled
      if (this.RiTa.CACHING) this.cache[word] = result;
    }

    return result;
  }

  _computeRawPhones(word, lex, opts) {
    return word.includes("-")  // #HWF
      ? this._computePhonesHyph(word, lex, opts)
      : this._computePhonesWord(word, lex, opts);
  }

  //#HWF
  _computePhonesHyph(word, lex, opts) {
    let rawPhones = [];
    word.split("-").forEach(p => {
      let part = this._computePhonesWord(p, lex, opts, true);
      if (part && part.length > 0) rawPhones.push(part);
    });
    return rawPhones;
  }

  //#HWF this part is unchanged but move to a separated function
  _computePhonesWord(word, lex, opts, isPart) {
    let rawPhones, RiTa = this.RiTa;
    if (isPart) rawPhones = lex.rawPhones(word, { noLts: true });
    // if its a simple plural ending in 's',
    // and the singular is in the lexicon, add '-z' to end
    if (!rawPhones && word.endsWith('s')) {
      let sing = RiTa.singularize(word);
      rawPhones = lex.rawPhones(sing, { noLts: true });
      rawPhones && (rawPhones += '-z'); // add 's' phone
    }

    // TODO: what about verb forms here?? Need test cases
    let silent = RiTa.SILENT || RiTa.SILENCE_LTS || (opts && opts.silent);

    // if no phones yet, try the lts-engine
    if (!rawPhones) {
      let ltsPhones = this.computePhones(word, opts);
      if (ltsPhones && ltsPhones.length) {
        if (!silent && lex.size()) {// && word.match(HAS_LETTER_RE)) {
          console.log("[RiTa] Used LTS-rules for '" + word + "'");
        }
        rawPhones = Util.syllablesFromPhones(ltsPhones);
      }
    }

    return rawPhones;
  }
}

const HAS_LETTER_RE = /[a-zA-Z]+/;

/**
 * Mapping from Arpabet phonemes (lowercase in RiTa) to IPA symbols.
 * Source: https://en.wikipedia.org/wiki/ARPABET
 *
 * Notes:
 *  - RiTa emits lowercase Arpabet without stress digits (e.g. "ah" not "AH0")
 *  - "ah" = ʌ (canonical Arpabet AH); unstressed occurrences (schwa) are also
 *    represented as "ah", so the conversion is approximate for those cases
 *  - "er" is context-sensitive: stressed → ɜr (bird), unstressed → ər (butter)
 */
Analyzer.arpabetToIpa = {
  // Vowels
  aa: 'ɑ',   // balm, bot
  ae: 'æ',   // bat
  ah: 'ʌ',   // buck  (also used for unstressed ə in RiTa)
  ao: 'ɔ',   // caught, story
  aw: 'aʊ',  // bout
  ax: 'ə',   // comma (explicit schwa)
  ay: 'aɪ',  // bite
  eh: 'ɛ',   // bet
  er: 'ɜr',  // bird (default; use syllablesToIpa for context-sensitive ər/ɜr)
  ey: 'eɪ',  // bait
  ih: 'ɪ',   // bit
  ix: 'ɨ',   // roses, rabbit
  iy: 'i',   // beat
  ow: 'oʊ',  // boat
  oy: 'ɔɪ',  // boy
  uh: 'ʊ',   // book
  uw: 'u',   // boot

  // Consonants
  b:  'b',
  ch: 'tʃ',
  d:  'd',
  dh: 'ð',
  dx: 'ɾ',   // butter (flap)
  el: 'l̩',   // bottle (syllabic l)
  em: 'm̩',   // rhythm (syllabic m)
  en: 'n̩',   // button (syllabic n)
  f:  'f',
  g:  'ɡ',
  hh: 'h',
  jh: 'dʒ',
  k:  'k',
  l:  'l',
  m:  'm',
  n:  'n',
  ng: 'ŋ',
  p:  'p',
  q:  'ʔ',   // uh-oh (glottal stop)
  r:  'ɹ',   // voiced alveolar approximant (AmE)
  s:  's',
  sh: 'ʃ',
  t:  't',
  th: 'θ',
  v:  'v',
  w:  'w',
  wh: 'ʍ',   // why (without wine-whine merger)
  y:  'j',
  z:  'z',
  zh: 'ʒ',
};

/**
 * Convert a RiTa phones string to an approximate IPA string (without stress markers).
 * RiTa format: phonemes within a word joined by "-", words joined by " "
 * e.g. "dh-ah b-er-ch k-ah-n-uw" → "ðʌ bɜrtʃ kʌnu"
 *
 * @param {string} phones - RiTa phones string (from RiTa.phones())
 * @returns {string} IPA approximation without stress markers
 */
Analyzer.phonesToIpa = function(phones) {
  const map = Analyzer.arpabetToIpa;
  return phones
    .split(' ')
    .map(word => word.split('-').map(p => map[p] ?? p).join(''))
    .join(' ');
};

/**
 * Convert RiTa syllables + stress strings to IPA with primary stress markers (ˈ).
 * Uses ə for unstressed 'ah' (schwa) and ʌ for stressed 'ah'.
 * Uses ər for unstressed 'er' and ɜr for stressed 'er'.
 * Adds length mark ː to stressed aa/iy/ao/uw (e.g. beat→biː, caught→kɔː).
 * Monosyllabic words never receive a stress marker.
 *
 * @param {string} syllables - from RiTa.syllables(), e.g. "dh-ah b-er-ch k-ah/n-uw"
 * @param {string} stresses  - from RiTa.stresses(), e.g. "0 1 0/1"
 * @param {boolean} [keepBoundaries=false] - if true, preserve '/' syllable boundaries in output
 * @returns {string} IPA string with ˈ before each primary-stressed syllable of polysyllabic words
 */
Analyzer.syllablesToIpa = function(syllables, stresses, keepBoundaries = false) {
  const map = Analyzer.arpabetToIpa;
  const sylWords = syllables.split(' ');
  const strWords = stresses.split(' ');
  const ipaWords = [];
  let strIdx = 0;
  for (let wi = 0; wi < sylWords.length; wi++) {
    const word = sylWords[wi];
    // Skip punctuation tokens (single non-alphanumeric characters like ',')
    if (/^[^a-z/-]$/.test(word)) { strIdx++; continue; }
    const syls = word.split('/');
    const strs = (strWords[strIdx] || '0').split('/');
    strIdx++;
    const isMonosyllable = syls.length === 1;
    const ipaSyls = syls.map((syl, si) => {
      const stressed = strs[si] === '1';
      const phones = syl.split('-').map(p => {
        if (p === 'ah') return stressed ? 'ʌ' : 'ə';
        if (p === 'er') return stressed ? 'ɜr' : 'ər';
        const ipa = map[p] ?? p;
        if (stressed && (p === 'aa' || p === 'iy' || p === 'ao' || p === 'uw')) return ipa + 'ː';
        return ipa;
      }).join('');
      return (stressed && !isMonosyllable) ? 'ˈ' + phones : phones;
    });
    ipaWords.push(keepBoundaries ? ipaSyls.join('/') : ipaSyls.join(''));
  }
  return ipaWords.join(' ');
};

export default Analyzer;