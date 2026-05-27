import SuffixArray from "./suffixes.js";

export default class SuffixGram {

  static SILENT = false;
  static RiTa = undefined; // for default tokenizer/untokenizer

  static defaults = { // default options
    debug: false,
    ready: false,
    suffixes: false,
    compressed: false,
    startToken: SuffixArray.SEQ_START_TOKEN,
    endToken: SuffixArray.SEQ_END_TOKEN,
    tokenize: undefined,
    untokenize: undefined
  };

  static __dict__ = [
    'ready',
    'startToken',
    'endToken',
    'tokenize',
    'untokenize',
    'tokens',
    'tokenCount',
    'suffixes',
  ]

  static options = Object.keys(SuffixGram.defaults);

  constructor(input, opts) {

    SuffixGram.defaults.tokenize ??= SuffixGram.RiTa.tokenize;
    SuffixGram.defaults.untokenize ??= SuffixGram.RiTa.untokenize;

    this.startToken = undefined;
    this.endToken = undefined;
    this.tokenize = undefined;
    this.untokenize = undefined;
    this.tokens = [];
    this.tokenCount = 0;

    // to be set in build()
    this.suffixes = undefined; 
    
    // only an options object
    if (SuffixGram.isObject(input) && typeof opts === 'undefined') {
      opts = input;
      input = undefined;
    }

    // initialize with options or default values
    SuffixGram.options.forEach(key => {
      this[key] = SuffixGram.defaults[key]; // default value
      if (typeof opts?.[key] !== 'undefined') {
        this[key] = opts?.[key]
      }
      //console.log(`Model.${key} = ${this[key]}`);
    });

    if (typeof input === 'undefined') {
      if (typeof opts?.text !== 'undefined') { // use text from options
        if (typeof opts.text !== 'string') {
          throw Error('String required for `text` option, got ' + typeof opts.text);
        }
        input = opts.text;
      }
      else if (typeof opts?.tokens !== 'undefined') { // use tokens from options
        if (!Array.isArray(opts.tokens)) {
          throw Error('Array of tokens required for `tokens` option');
        }
        input = opts.tokens;
      }
      else if (typeof opts?.sentences !== 'undefined') { // use sentences from options
        if (!Array.isArray(opts.sentences)) {
          throw Error('Array of sentences required for `sentences` option');
        }
        input = this._tokenizeSentences(opts.sentences);
      }
    }

    if (typeof input !== 'undefined') {
      // create the suffix array from tokens
      if (Array.isArray(input)) {
        this.addTokens(input);
      }
      // or from a raw input string
      else if (typeof input === 'string') {
        this.addText(input);
      }
      else {
        throw Error('String or array required');
      }
      this.build(); // build the model immediately by default
    }
  }

  toJSON() {
    return Object.assign({}, this);
  }

  build() {
    throw Error('Model.build() not implemented');
  }

  /**
   * Return the number of tokens in the model.
   * For character count, see model.suffixes.length
   */
  size() {
    if (!this.ready) this.build();
    return this.tokenCount; // count includes special tokens
  }

  toString(opts) {
    if (!this.ready) this.build();
    return this.suffixes.toString(opts);
  }

  /**
   * Loads raw text into the model. The text string will first be split into sentences
   * via RiTa.sentences(), then split into tokens using the model's tokenizer.
   * @param {string|string[]} rawText - a text string, or array of sentences, to add to the model
   * @see addSentences() for adding an array of sentences
   * @see addTokens() for adding an array of tokens
   * @return {SuffixGram} - the model instance
   */
  addText(rawText) {
    if (typeof rawText !== 'string') {
      throw Error('String required: if adding an array see addTokens() or addSentences()');
    }
    return rawText.length ? this.addSentences(SuffixGram.RiTa.sentences(rawText)) : this;
  }

  /**
    * Loads an array of sentences into the model, each to be split into tokens via the tokenizer
    * @param {string[]} sentences - an array of sentences to add to the model
    * @return {SuffixGram} - the model instance
    */
  addSentences(sentences) {
    let toks = this._tokenizeSentences(sentences);
    return this.addTokens(toks);
  }

  /**
   * Loads an array of individual tokens into the model
   * @param {string[]} tokens - an array of tokens to add to the model
   * @return {SuffixGram} - the model instance
   */
  addTokens(tokens) {
    this.ready = false;
    if (Array.isArray(tokens) && typeof tokens[0] === 'string') {
      this.tokens = (this.tokens || []).concat(tokens || []);
    }
    else {
      throw Error('Array of individual tokens required, got ' + typeof tokens);
    }
    return this;
  }

  /////////////////////// PRIVATES ////////////////////////

  _validateOptions(opts, validKeys, ignorableKeys = []) {
    if (typeof opts !== 'undefined' && !SuffixGram.isObject(opts)) {
      throw Error('Options must be an object');
    }
    for (let key in opts) {
      if (!validKeys.includes(key) && !ignorableKeys.includes(key)) {
        throw Error(`Invalid option key: ${key}`);
      }
    }
  }

  /**
   * Convert string[] of sentences to string[] of tokens with separators
   */
  _tokenizeSentences(sentences) {
    //if (this.verbose) ts = Date.now();
    let toks = sentences.reduce((acc, s) => {
      acc.push(this.startToken, ...this.tokenize(s), this.endToken);
      return acc;
    }, []);
    //if (opts.verbose) console.log(`Tokenized ${sentences.length} sentences in ${Date.now() - ts}ms`);
    return toks;
  }

  /////////////////////// STATICS ////////////////////////

  static cleanDist(dist, indent, nosort = false) {
    // dist is an object mapping tokens to probabilities
    // returns a max of 10 items, with ellipses if necessary
    let truncated = false, entries = Object.entries(dist);
    if (!nosort) entries.sort((a, b) => b[1] - a[1]);
    if (entries.length > 10) {
      entries = entries.slice(0, 15);
      truncated = true;
    }
    let str = entries.reduce((acc, [k, v], i) => {
      acc += ' '.repeat(indent + 2) + `${k}: ${v.toFixed(2)},`;
      if (i < entries.length - 1) acc += '\n';
      return acc;
    }, '');
    return (truncated ? (str + '\n' + ' '.repeat(indent + 2) + '...') : str);
  }

  static isObject(obj) {
    return typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
  }
}
