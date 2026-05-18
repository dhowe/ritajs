import { Model } from './model.js';
import { BackoffModel } from './backoff.js';

export default class RiMarkov {

  static RiTa = undefined;

  /**
   * Creates an instance of RiMarkov.
   * @param {*} input
   * @param {*} [opts]
   * @memberof RiMarkov
   */
  constructor(input, opts) {
    this.n = -1;
    if (typeof input === 'number') {
      // for compatibility with v3.x constructor
      this.n = input;
      input = opts ? opts?.text || opts?.tokens : undefined;
    }
    else if (Model.isObject(input) && typeof opts === 'undefined') {
      opts = input;
      input = opts?.text || opts?.tokens;
    }

    if (isFinite(opts?.n)) this.n = opts.n;

    this.model = new BackoffModel(input, opts);
  }

  /**
   * Stream tokens one-by-one from the model, yielding each token as it is sampled.
   * Delegates to {@link BackoffModel#streamTokens}.
   *
   * @param {number}   n       - n-gram order
   * @param {string[]} prompt  - initial context tokens
   * @param {Object}   [opts]
   * @param {number}   [opts.minTokens]      - minimum tokens before a stop condition is honoured
   * @param {number}   [opts.maxLength]      - hard cap on tokens yielded
   * @param {number}   [opts.temp]           - sampling temperature
   * @param {string|function} [opts.generateUntil] - stop token or predicate `(token, tokensSoFar) => boolean`
   * @yields {string} one token at a time
   */
  * stream(n, prompt = [], opts = {}) {

    ({ prompt, opts } = this._resolveArgs(n, prompt, opts));

    if (!this.model.ready) this.model.build(); // ensure model is built before generating

    yield* this.model.streamTokens(this.n, prompt, opts);
  }

  /**
   * Generate one or more sentences from the model.
   *
   * Supports several call signatures:
   *   generate(n, prompt, opts)   — explicit n-gram order, prompt array, options
   *   generate(n, opts)           — n-gram order + options (empty prompt)
   *   generate(prompt, opts)      — prompt array + options (n via opts.n or constructor)
   *   generate(opts)              — all parameters in opts.n / opts.prompt
   *
   * @param {number|string[]|Object} n      - n-gram order, or prompt array, or opts object
   * @param {string[]|Object}        prompt - prompt tokens, or opts object
   * @param {Object}                 [opts]
   * @param {number}  [opts.n]            - n-gram order (alternative to positional arg)
   * @param {string[]}[opts.prompt]       - prompt tokens (alternative to positional arg)
   * @param {number}  [opts.numSentences] - number of sentences to generate (default: 1)
   * @param {number}  [opts.minTokens]    - minimum tokens per sentence
   * @param {number}  [opts.maxLength]    - maximum tokens per sentence
   * @param {number}  [opts.temp]         - sampling temperature
   * @returns {string|string[]} a single string when numSentences=1, otherwise an array of strings
   */
  generate(n, prompt = [], opts = {}) {

    ({ prompt, opts } = this._resolveArgs(n, prompt, opts));

    if (!this.model.ready) this.model.build();

    const numSentences = opts.numSentences ?? 1;
    const result = this.model.generateSentences(this.n, prompt, { ...opts, numSentences });

    // return a plain string for the single-sentence case
    return (numSentences === 1) ? result[0] : result;
  }

  addText() {
    return this.model.addText.apply(this.model, arguments);
  }

  addSentences() {
    return this.model.addSentences.apply(this.model, arguments);
  }

  addTokens() {
    return this.model.addTokens.apply(this.model, arguments);
  }

  /*
   * If only one array parameter is provided, this function returns all possible next words, ordered by probability, for the given array.
   *  
   * If two arrays are provided, it returns an unordered array of possible words w that complete the n-gram consisting of: pre[0]...pre[k], w, post[k+1]...post[n].
   * 
   *       result = rm.completions([ "the" ], [ "red", "ball" ]);
   * 
   * The line above will return all the single words that occur between 'the' and 'red ball' in the current model (assuming n > 3), eg [ 'round', 'big', 'bouncy' ]).
   */
  completions(pre, post, opts = {}) {
    if (!Array.isArray(pre)) throw Error('Array required for pre');

    let allowSpecial = opts?.allowSpecial ?? false;

    if (!this.model.ready) this.model.build();

    // single-array form: return next-token distribution (ordered by prob)
    if (typeof post === 'undefined') {
      const dist = this.model.suffixes.pdist(pre);
      if (!dist) return [];
      return Object.entries(dist)
        .sort(([, a], [, b]) => b - a)
        .map(([t]) => t)
        .filter(t => allowSpecial || (t !== this.model.startToken && t !== this.model.endToken));
    }

    // 3-arg form: find all w where [...pre, w, ...post] exists in corpus
    if (!Array.isArray(post)) throw Error('Array required for post');
    if (pre.length + post.length >= (this.n ?? 3)) {
      throw Error(`pre.length + post.length must be less than n (${this.n ?? 3})`);
    }

    // collect every token that follows `pre` and is followed by `post`
    const dist = this.model.suffixes.pdist(pre);
    if (!dist) return [];
    return Object.keys(dist).filter(w => {
      if (!allowSpecial && (w === this.model.startToken || w === this.model.endToken)) {
        return false;
      }
      return this.model.suffixes.hasPrefix([...pre, w, ...post]);
    });
  }

  /**
   * Returns the probability of `next` following sequence of tokens in `prompt`. For example:
   * 
   *  rm.probability(['the', 'cat'], 'sat') -> returns the probability of 'sat' following the sequence 'the cat' in the model.
   * 
   * If `next` is an array, returns the probability of the entire sequence following `prompt`, 
   * e.g. rm.probability(['the', 'cat'], ['sat', 'on', 'the', 'mat'])
   * 
   * If only one argument is provided, it is treated as the `next` array and `prompt` is assumed
   * to be empty, eg rm.probability(['the', 'cat']) returns the raw probability of the sequence 'the cat' in the model.
   */
  probability(prompt, next) {

    if (!this.model.ready) this.model.build();

    // single-argument form: probability(['the', 'cat']) — treat array as the 'next' sequence
    if (typeof next === 'undefined') {
      next = prompt;
      prompt = [];
    }

    if (!Array.isArray(prompt)) throw Error('Array required for prompt');
    if (typeof next === 'string') next = [next];
    if (!Array.isArray(next)) throw Error('String or array required for next');
    if (next.length === 0) return 0;

    const sa = this.model.suffixes;

    // chain rule: P(next[0] | prompt) * P(next[1] | prompt+next[0]) * ...
    let prob = 1;
    let context = [...prompt];
    for (const token of next) {
      if (context.length === 0) {
        // unigram: count(token) / total corpus length
        const [min, max] = sa.find([token]);
        const count = max - min;
        prob *= count > 0 ? count / sa.length : 0;
      } else {
        const dist = sa.pdist(context);
        prob *= dist?.[token] ?? 0;
      }
      if (prob === 0) return 0;
      context.push(token);
    }

    return prob;
  }

  /**
   * Returns the full set of possible next tokens as an object, 
   * given an array of tokens as prompt. 
   * 
   * For example, rm.probabilities(['the', 'cat']) might return { sat: 0.5, jumped: 0.3, meowed: 0.2 }.
   * 
   * If no tokens are provided, returns the distribution of next words following the start token.
   */
  probabilities(tokens, opts = {}) {

    if (!this.model.ready) this.model.build();

    if (typeof tokens === 'undefined') {
      tokens = [this.model.startToken];
    }

    if (!Array.isArray(tokens)) throw Error('tokens[] required');

    const dist = this.model.suffixes.pdist(tokens);
    if (!dist) return {};

    // strip special tokens from result unless allowSpecial
    const allowSpecial = opts?.allowSpecial ?? false;
    return Object.fromEntries(Object.entries(dist).filter(([t]) =>
      allowSpecial || (t !== this.model.startToken && t !== this.model.endToken)));
  }

  /**
   * Return the number of tokens in the model.
   * For character count, see model.suffixes.length
   */
  size() {
    return this.model.size();
  }

  toString(opts) {
    return this.model.toString(opts);
  }

  toJSON() {
    if (!this.model.ready) this.model.build();
    let data = { n: this.n || -1, ...this.model.toJSON() };
    let s = JSON.stringify(data);
    return s;
  }

  static fromJSON(json) {
    if (typeof json !== 'string') throw Error('String required for fromJSON()');
    let rm = new RiMarkov();
    let parsed = JSON.parse(json);
    rm.model = BackoffModel.fromJSON(parsed.model);
    rm.n = parsed.n;
    return rm;
  }

  /**
   * Normalise the polymorphic (n, prompt, opts) argument patterns shared by
   * stream() and generate() into a canonical { n, prompt, opts } object.
   *
   * Supported call patterns:
   *   (n, prompt, opts)  — all positional
   *   (n, opts)          — n + options, empty prompt
   *   (prompt, opts)     — prompt array + options, n via opts.n or constructor
   *   (opts)             — everything in opts.n / opts.prompt
   */
  _resolveArgs(n, prompt, opts) {

    if (Model.isObject(n)) {
      // single-argument form: fn(opts)
      opts = { ...n };
      prompt = opts.prompt ?? [];
      n = opts.n;
      delete opts.n;
      delete opts.prompt;
    } else if (Array.isArray(n)) {
      // two-argument form: fn(prompt, opts?)
      opts = prompt ?? {};
      prompt = n;
      n = opts.n;
    } else if (Model.isObject(prompt)) {
      // two-argument form: fn(n, opts)
      opts = { ...prompt };
      prompt = opts.prompt ?? [];
      delete opts.prompt;
    }

    if (!Array.isArray(prompt)) throw Error('Array required for prompt');

    this.n = n ?? opts?.n ?? this.n;
    if (this.n < 2) {
      throw Error('n must be specified before calling generate() or stream()');
    }

    return { prompt, opts: opts ?? {} };
  }
}



