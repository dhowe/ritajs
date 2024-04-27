import Util from './util.js';
import dict from './rita_dict.js';

/**
 * @class Lexicon
 * @memberof module:rita
 */
class Lexicon {

  constructor(parent, custom) {

    this.RiTa = parent;
    this.data = custom || dict;
    this.analyzer = parent.analyzer;
    this.lexWarned = false;
  }

  hasWord(word, opts = {}) {

    if (!word || !word.length) return false;

    let token = word.toLowerCase();
    let exists = this.data.hasOwnProperty(token);
    let noDerivations = opts.noDerivations;

    if (noDerivations || exists) return exists;

    // Not strict - check for plurals forms and conjugations

    // 1) Check if word might be a plural form of a noun
    // in the lexicon - for example, 'dogs' or 'oxen'
    let sing = this.RiTa.singularize(token);
    if (this.data.hasOwnProperty(sing)) {
      let tags = this.RiTa.tagger.allTags(sing);
      if (tags.includes('nn')) return true;
    }

    // 2) Check if word might be a conjugated form of a verb 
    // in the lexicon - for example, 'changed' or 'changes'
    let vlemma = this.RiTa.conjugator.unconjugate(token, opts);
    if (vlemma && this.data.hasOwnProperty(vlemma)) {
      let tags = this.RiTa.tagger.allTags(vlemma);
      if (tags.includes('vb')) return true;
    }

    return false;
  }

  async alliterations(word, options = {}) {
    return this._promise(this.alliterationsSync, [word, options]);
  }

  alliterationsSync(theWord, opts = {}) {

    this._parseArgs(opts);
    if (!theWord || typeof theWord !== 'string' || theWord.length < 2) {
      return [];
    }

    // only allow consonant inputs
    if (this.RiTa.isVowel(theWord.charAt(0))) {
      if (!opts.silent && !this.RiTa.SILENT) console.warn
        ('Expects a word starting with a consonant, got: ' + theWord);
      return [];
    }

    const dict = this.data;
    const fss = this._firstStressedSyl(theWord);
    if (!fss) return [];

    let phone = this._firstPhone(fss);
    let words = Object.keys(dict);

    // make sure we parsed first phoneme
    if (!phone) {
      if (!opts.silent && !this.RiTa.SILENT) console.warn
        ('Failed parsing first phone in "' + theWord + '"');
      return [];
    }

    // randomize list order if shuffle is true
    if (opts.shuffle) words = this.RiTa.randomizer.shuffle(words);

    let result = [];
    for (let i = 0; i < words.length; i++) {

      let word = words[i];
      // check word length and syllables
      if (word === theWord || !this._checkCriteria(word, dict[word], opts)) {
        continue;
      }

      let data = dict[word];
      if (opts.targetPos) {
        word = this._matchPos(word, data, opts);
        if (!word) continue;
        // Note: we may have changed the word here (e.g. via conjugation)
        //       and it is also may no longer be in the dictionary
        if (word !== words[i]) data = dict[word];
      }

      // TODO: use 'data' here unless we've changed 
      // to a new word not in dict
      let c2 = this._firstPhone(this._firstStressedSyl(word));
      if (phone === c2) result.push(word);

      if (result.length === opts.limit) break;
    }

    return result;
  }

  async rhymes(word, options = {}) {
    return this._promise(this.rhymesSync, [word, options]);

  }

  rhymesSync(theWord, opts = {}) {

    this._parseArgs(opts);

    if (!theWord || !theWord.length || theWord.length < 2) return [];

    const dict = this.data;
    let phone = this._lastStressedPhoneToEnd(theWord);
    let words = Object.keys(dict);

    if (!phone) return [];

    // randomize list order if 'shuffle' is true
    if (opts.shuffle) words = this.RiTa.randomizer.shuffle(words);

    let result = []; let i = 0
    for (; i < words.length; i++) {

      let word = words[i], data = dict[word];

      // check word length and syllables
      if (word === theWord || !this._checkCriteria(word, data, opts)) {
        continue;
      }

      if (opts.targetPos) {
        word = this._matchPos(word, data, opts);
        if (!word) continue;
        // Note: we may have changed the word here (e.g. via conjugation)
        // and it is also may no longer be in the dictionary
        if (word !== words[i]) data = dict[word];
      }

      // recompute phones if not in dict (see note above)
      let phones = data ? data[0] : this.rawPhones(word);

      // check for the rhyme
      if (phones.endsWith(phone)) {
        result.push(word);
      }

      if (result.length === opts.limit) {
        break;
      }
    }
    return result;
  }

  async spellsLike(word, options = {}) {
    return this._promise(this.spellsLikeSync, [word, options]);
  }

  spellsLikeSync(word, options = {}) {
    if (!word || !word.length) return [];
    options.type = 'letter';
    return this._byTypeSync(word, options);
  }

  async soundsLike(word, options = {}) {
    return this._promise(this.soundsLikeSync, [word, options]);
  }

  /**
   * A synchronous version of RiTa.lexicon.soundsLike().
   * @param {string} word 
   * @param {object} [opts]
   * @returns {string[]} An array of words that sound like the input word
   */
  soundsLikeSync(word, opts = {}) {
    if (!word || !word.length) return [];
    return (opts.matchSpelling)
      ? this._bySoundAndLetterSync(word, opts)
      : this._byTypeSync(word, { ...opts, type: 'sound' });
  }

  randomWord(pattern, opts) {

    // no arguments, just return
    if (!pattern && !opts) {
      return this.RiTa.random(Object.keys(this.data));
    }

    // handle different parameter options
    if (!(pattern instanceof RegExp)) {
      if (typeof pattern === 'object' && !opts) {
        opts = pattern;  // single argument which is opts
        pattern = undefined;
      }
    }

    // delegate to search {limit=1, shuffle=true, strictPos=true, minLength=4}  
    opts = opts || {}; // keep
    opts.limit = 1;
    opts.shuffle = true;
    opts.strictPos = true;
    opts.minLength = Util.numOpt(opts, 'minLength', 4);

    let result = this.searchSync(pattern, opts);

    // relax our pos constraints if we got nothing
    if (result.length < 1 && opts.hasOwnProperty('pos')) {
      opts.strictPos = false;
      result = this.searchSync(pattern, opts);
    }

    // we've still got nothing, throw
    if (result.length < 1) {
      ['strictPos', 'shuffle', 'targetPos'].forEach(k => delete opts[k]);
      throw Error("No words matching constraints:\n" + JSON.stringify(opts, undefined, 2));
    }

    return result[0];
  }

  async search(pattern, options) {
    return this._promise(this.searchSync, [pattern, options]);
  }

  searchSync(pattern, options) {

    let words = Object.keys(this.data);

    // no arguments, just return
    if (!pattern && !options) return words;

    let { regex, opts } = this._parseRegex(pattern, options);
    this._parseArgs(opts);

    // randomize list order if shuffle is true
    if (opts.shuffle) words = this.RiTa.randomizer.shuffle(words);

    let result = [];
    //console.time('search: '+pattern);
    for (let i = 0; i < words.length; i++) {

      let word = words[i], data = this.data[word];
      if (!this._checkCriteria(word, data, opts)) continue;

      if (opts.targetPos) {
        word = this._matchPos(word, data, opts, opts.strictPos);
        if (!word) continue;
        if (word !== words[i]) data = this.data[word];
        /* Note: a) may have changed the word here via conjugation
                 and b) it may no longer be in the dictionary  */
      }

      if (!regex || this._regexMatch(word, data, regex, opts.type)) {
        result.push(word);
        if (result.length === opts.limit) break;
      }
    }
    //console.timeEnd('search: '+pattern);

    return result;
  }

  isAlliteration(word1, word2) {
    if (!word1 || !word2 || !word1.length) return false;
    let c1 = this._firstPhone(this._firstStressedSyl(word1)),
      c2 = this._firstPhone(this._firstStressedSyl(word2));
    return c1 && c2 && !this.RiTa.isVowel(c1.charAt(0)) && c1 === c2;
  }

  isRhyme(word1, word2) {
    if (!word1 || !word2 || word1.toUpperCase() === word2.toUpperCase()) {
      return false;
    }
    if (this.rawPhones(word1) === this.rawPhones(word2)) {
      return false;
    }
    let p1 = this._lastStressedVowelPhonemeToEnd(word1),
      p2 = this._lastStressedVowelPhonemeToEnd(word2);
    return p1 && p2 && p1 === p2;
  }

  size() {
    let dict = this.data;
    return dict ? Object.keys(dict).length : 0;
  }

  //////////////////////////// helpers /////////////////////////////////

  _byTypeSync(theWord, opts) {

    this._parseArgs(opts); // TODO: add minLimit (minResultCount) ?

    const dict = this.data;
    const input = theWord.toLowerCase();
    const matchSound = opts.type === 'sound'; // default: letter
    const variations = [input, input + 's', input + 'es'];
    const phonesA = matchSound ? this._toPhoneArray(this.rawPhones(input)) : input;

    if (!phonesA) return [];

    let minVal = Number.MAX_VALUE, words = Object.keys(dict);

    // randomize list order if shuffle is true
    if (opts.shuffle) words = this.RiTa.randomizer.shuffle(words);

    let result = [];
    for (let i = 0; i < words.length; i++) {

      let word = words[i], data = dict[word];

      if (variations.includes(word)) continue;

      if (!this._checkCriteria(word, data, opts)) continue;

      if (opts.targetPos) {
        word = this._matchPos(word, data, opts);
        if (!word) continue;
        // Note: we may have changed the word here (e.g. via conjugation)
        // and it is also may no longer be in the dictionary
        if (word !== words[i]) data = dict[word];
      }

      let phonesB = word;
      if (matchSound) {
        let phones = data ? data[0] : this.rawPhones(word);
        phonesB = phones.replace(/1/g, '').replace(/ /g, '-').split('-');
      }

      let med = this.minEditDist(phonesA, phonesB);

      // found something even closer
      if (med >= opts.minDistance && med < minVal) {
        minVal = med;
        result = [word];
      }
      // another best to add
      else if (med === minVal && result.length < opts.limit) {
        result.push(word);
      }
    }

    return result.slice(0, opts.limit);
  }

  _matchPos(word, rdata, opts, strict) {

    let posArr = rdata[1].split(' ');

    // check the pos here (based on strict flag)
    if (!posArr.includes(opts.targetPos) || (strict && opts.targetPos !== posArr[0])) {
      return;
    }

    // we've matched our pos, pluralize or inflect if needed
    let result = word;
    if (opts.pluralize) { // looking for an 'nns'
      if (word.endsWith("ness") || word.endsWith("ism")) return;

      result = this.RiTa.pluralize(word);
      if (!this.RiTa.isNoun(result)) return; // make sure its still a noun
    }
    else if (opts.conjugate) { // inflect
      result = this._reconjugate(word, opts.pos);
    }

    // verify we haven't changed syllable count
    if (result !== word) {
      if (opts.numSyllables) {

        // TODO: use rdata here if possible
        let syls = this.analyzer.analyzeWord(result, { silent: true }).syllables;
        let num = syls.split(this.RiTa.SYLLABLE_BOUNDARY).length;

        // reject if syllable count has changed
        if (num !== opts.numSyllables) return;
      }
      // reject if length no longer matches
      if (result.length < opts.minLength || result.length > opts.maxLength) {
        return;
      }
    }

    return result;
  }

  _checkCriteria(word, rdata, opts) {

    // check word length
    if (word.length > opts.maxLength) return false;
    if (word.length < opts.minLength) return false;

    // match numSyllables if supplied
    if (opts.numSyllables) {
      let syls = rdata[0].split(' ').length;
      if (opts.numSyllables !== syls) return false;
    }
    return true;
  }

  // Handles: pos, limit, numSyllables, minLength, maxLength
  // potentially appends pluralize, conjugate, targetPos
  _parseArgs(opts) {

    opts.limit = Util.numOpt(opts, 'limit', 10);
    opts.minDistance = Util.numOpt(opts, 'minDistance', 1);
    opts.numSyllables = Util.numOpt(opts, 'numSyllables', 0);
    opts.maxLength = Util.numOpt(opts, 'maxLength', Number.MAX_SAFE_INTEGER);
    opts.minLength = Util.numOpt(opts, 'minLength', 3);

    if (opts.limit < 1) opts.limit = Number.MAX_SAFE_INTEGER;

    let tpos = opts.pos || false;
    if (tpos && tpos.length) {
      opts.pluralize = (tpos === "nns");
      opts.conjugate = (tpos[0] === "v" && tpos.length > 2);
      if (tpos[0] === "n") tpos = "nn";
      else if (tpos[0] === "v") tpos = "vb";
      else if (tpos === "r") tpos = "rb";
      else if (tpos === "a") tpos = "jj";
    }

    opts.targetPos = tpos;
  }

  _reconjugate(word, pos) {
    const RiTa = this.RiTa;
    switch (pos) {
      /*  VBD 	Verb, past tense
          VBG 	Verb, gerund or present participle
          VBN 	Verb, past participle
          VBP 	Verb, non-3rd person singular present
          VBZ 	Verb, 3rd person singular present */
      case 'vbd':
        return RiTa.conjugate(word, {
          number: RiTa.SINGULAR,
          person: RiTa.FIRST,
          tense: RiTa.PAST
        });
      case 'vbg':
        return RiTa.presentPart(word);
      case 'vbn':
        return RiTa.pastPart(word);
      case 'vbp':
        return word;
      case 'vbz':
        return RiTa.conjugate(word, {
          number: RiTa.SINGULAR,
          person: RiTa.THIRD,
          tense: RiTa.PRESENT
        });
      default: throw Error('Unexpected pos: ' + pos);
    }
  }

  _bySoundAndLetterSync(word, opts) {
    let bySound = this._byTypeSync(word, { ...opts, type: 'sound' });
    let byLetter = this._byTypeSync(word, { ...opts, type: 'letter' });
    if (bySound.length < 1 || byLetter.length < 1) return [];
    return this._intersect(bySound, byLetter).slice(0, opts.limit);
  }

  async _bySoundAndLetter(word, opts) {
    let types = ['sound', 'letter']; // in parallel
    let promises = types.map(type => this._promise
      (this._byTypeSync, [word, { ...opts, type }]));

    let results = await Promise.allSettled(promises);
    // @ts-ignore
    let [bySound, byLetter] = results.map(r => r.value);
    if (bySound.length < 1 || byLetter.length < 1) return [];

    return this._intersect(bySound, byLetter).slice(0, opts.limit);
  }


  rawPhones(word, opts) {

    let noLts = opts && opts.noLts;
    let fatal = opts && opts.fatal;
    let rdata = this._lookupRaw(word, fatal);
    if (rdata && rdata.length) return rdata[0];

    if (!noLts) {
      let phones = this.RiTa.analyzer.computePhones(word);
      return Util.syllablesFromPhones(phones); // TODO: bad name
    }
  }

  // med for 2 strings (or 2 arrays)
  minEditDist(source, target) {

    let cost; // cost
    let i, j;
    /**
     * @type {number[][]}
     */
    let matrix = []; // matrix
    let sI; // ith character of s
    let tJ; // jth character of t

    // Step 1 ----------------------------------------------

    for (i = 0; i <= source.length; i++) {
      matrix[i] = [];
      matrix[i][0] = i;
    }

    for (j = 0; j <= target.length; j++) {
      matrix[0][j] = j;
    }

    // Step 2 ----------------------------------------------

    for (i = 1; i <= source.length; i++) {
      sI = source[i - 1];

      // Step 3 --------------------------------------------

      for (j = 1; j <= target.length; j++) {
        tJ = target[j - 1];

        // Step 4 ------------------------------------------

        cost = (sI == tJ) ? 0 : 1;

        // Step 5 ------------------------------------------
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    // Step 6 ----------------------------------------------

    return matrix[source.length][target.length];
  }

  isMassNoun(w) {
    return w.endsWith("ness")
      || w.endsWith("ism")
      || this.RiTa.MASS_NOUNS.includes(w);
  }

  // helpers ---------------------------------------------------------------

  _promise(fun, args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(fun.apply(this, args));
      } catch (e) {
        reject(e);
      }
    });
  }

  _parseRegex(regex, opts) {
    // handle regex passed as part of opts
    if (typeof regex === 'string') {
      if (opts && opts.type === 'stresses') {
        if (/^\^?[01]+\$?$/.test(regex)) { // keep ^ and $ in regex like "^101$"
          /* if we have a stress string without slashes, add them
             010 -> 0/1/0, ^010$ -> ^0/1/0$, etc. */
          regex = regex.replace(/([01])(?=([01]))/g, "$1/");
        }
      }
      regex = new RegExp(regex);
    }
    else if (regex instanceof RegExp) {
      // RegExp object;
    }
    else if (typeof regex === 'object' || (regex === undefined && typeof opts === 'object')) {
      if (!opts) {
        opts = regex;  // have one argument that is opts
      }
      regex = opts.regex; // do we have regex in opts?
      if (typeof regex === 'string') {
        if (opts && /^stress(es)?$/.test(opts.type)) {
          if (/^\^?[01]+\$?$/.test(regex)) {
            regex = regex.replace(/([01])(?=([01]))/g, "$1/");
          }
        }
        regex = new RegExp(regex);
      }
    }
    return { regex, opts: opts || {} };
  }

  _regexMatch(word, data, regex, type) {

    if (type === 'stresses') {
      let phones = data ? data[0] : this.rawPhones(word);
      let stresses = this.analyzer.phonesToStress(phones);
      if (regex.test(stresses)) return true;
    }
    else if (type === 'phones') {
      let phones = data ? data[0] : this.rawPhones(word);
      phones = phones.replace(/1/g, '').replace(/ /g, '-');// + ' ';
      if (regex.test(phones)) return true;
    }
    else {
      if (regex.test(word)) return true;
    }
  }

  _toPhoneArray(raw) {
    return raw.replace(/[01]/g, '').replace(/ /g, '-').split('-');
  }

  _firstPhone(rawPhones) {
    if (rawPhones && rawPhones.length) {
      let phones = rawPhones.split(this.RiTa.PHONE_BOUNDARY);
      if (phones) return phones[0];
    }
  }

  _intersect(a1, a2) {
    return [a1, a2].reduce((a, b) => a.filter(e => b.includes(e)))
  }

  _lastStressedPhoneToEnd(word) {
    if (word && word.length) {
      let raw = this.rawPhones(word);
      if (raw) {
        let idx = raw.lastIndexOf(this.RiTa.STRESS);
        if (idx >= 0) {
          let c = raw.charAt(--idx);
          while (c != '-' && c != ' ') {
            if (--idx < 0) return raw; // single-stressed syllable
            c = raw.charAt(idx);
          }
        }
        return raw.substring(idx + 1);
      }
    }
  }

  _lastStressedVowelPhonemeToEnd(word) {
    if (word && word.length) {
      let raw = this._lastStressedPhoneToEnd(word);
      if (raw) {
        let idx = -1, syllables = raw.split(' ');
        let lastSyllable = syllables[syllables.length - 1];
        lastSyllable = lastSyllable.replace('[^a-z-1 ]', '');
        for (let i = 0; i < lastSyllable.length; i++) {
          let c = lastSyllable.charAt(i);
          if (this.RiTa.VOWELS.includes(c)) {
            idx = i;
            break;
          }
        }
        return lastSyllable.substring(idx);
      }
    }
  }

  _firstStressedSyl(word) {
    let raw = this.rawPhones(word);
    if (raw) {
      let idx = raw.indexOf(this.RiTa.STRESS);
      if (idx >= 0) {
        let c = raw.charAt(--idx);
        while (c != ' ') {
          if (--idx < 0) {  // single-stressed syllable
            idx = 0;
            break;
          }
          c = raw.charAt(idx);
        }
        let firstToEnd = idx === 0 ? raw : raw.substring(idx).trim();
        idx = firstToEnd.indexOf(' ');
        return idx < 0 ? firstToEnd : firstToEnd.substring(0, idx);
      }
    }
  }

  _posData(word, fatal) {
    let rdata = this._lookupRaw(word, fatal);
    if (rdata && rdata.length === 2) return rdata[1];
  }

  _posArr(word, fatal) {
    let rdata = this._lookupRaw(word, fatal);
    if (rdata && rdata.length === 2) return rdata[1].split(' ');
  }

  _lookupRaw(word, fatal) {
    word = word && word.toLowerCase();
    return this.data[word];
  }
}



export default Lexicon;
