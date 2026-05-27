import SuffixGram from "./model.js";
import SuffixArray from "./suffixes.js";

/*
 * TODO:
 *    -- checkpointing load
 */
export default class BackoffModel extends SuffixGram {

  static generationDefaults = {
    debug: false, debugCache: false, minLength: 5, maxLength: 999, prompt: 0,
    maxAttempts: 999, forceOriginal: false, maxLengthMatch: Infinity,
    temp: 1, topK: 20, depth: 50, allowSpecial: false, sortByProb: false,
    strictBackoff: false
  }

  static generationAliases = {
    dbug: 'debug', dbugCache: 'debugCache', minTokens: 'minLength',
    maxTokens: 'maxLength', seed: 'prompt', temperature: 'temp',
    mlm: 'maxLengthMatch'
  }

  /**
   * Creates a new BackoffModel instance
   * @param {string|string[]} input - text for the model; If a raw string is provided, 
   * it will first be split into sentences via RiTa.sentences(), then tokenized. 
   * If an array is provided, each string will be treated as an individual token.
   * @param {Object} opts - options object
   * @param {string} opts.startToken - token to mark the start of a sentence
   * @param {string} opts.endToken - token to mark the end of a sentence
   * @param {function} opts.tokenize - function to tokenize sentences
   * @param {function} opts.untokenize - function to untokenize sentences
   * @param {boolean} opts.compressed - whether to use a compressed suffix array
   */
  constructor(input, opts) {
    super(input, opts);
  }

  static fromJSON(json) {
    let obj = typeof json === 'string' ? JSON.parse(json) : json;
    let model = Object.assign(new BackoffModel(undefined, undefined), obj);
    // restore suffixes as a proper SuffixArray instance (plain array after JSON round-trip)
    if (model.suffixes && !(model.suffixes instanceof SuffixArray)) {
      model.suffixes = SuffixArray.fromJSON(model.suffixes);
    }
    return model;
  }

  /**
   * Generate `numSentences` sentences using a single continuous streamTokens call.
   * Uses a stateful `generateUntil` that stops after seeing `numSentences` end tokens,
   * so cross-sentence transitions are natural corpus n-gram transitions — no manual
   * reseeding required.
   *
   * @param {number}   n            - n-gram order
   * @param {string[]} prompt       - initial prompt tokens
   * @param {Object}   opts
   * @param {number}   [opts.numSentences=1] - number of sentences to generate
   * @param {number}   [opts.temp=1]         - sampling temperature
   * @param {number}   [opts.minLength=5]    - minimum tokens before stopping a sentence
   * @param {number}   [opts.maxLength=999]  - max tokens to generate per sentence before giving up
   * @param {number}   [opts.maxAttempts=999]   - max attempts before giving up
   * @param {boolean}  [opts.allowSpecial=false] - whether to allow special tokens in the output
   * @param {number}   [opts.maxLengthMatch=Infinity] - max length of sequence allowed to match training data
   * @param {boolean}  [opts.debug=false] - whether to log debug info during generation
   * @returns {string | string[]} string if count = 1, else array of sentences, length = numSentences
   */
  generateSentences(n, prompt, opts = {}) {
    const numSentences = opts.numSentences ?? 2;

    const dbug = opts.debug ? (...args) => console.log('[generateSentences]', ...args) : () => {};
    const perSentenceMax = opts.maxLength ?? BackoffModel.generationDefaults.maxLength;
    const perSentenceMin = opts.minLength ?? BackoffModel.generationDefaults.minLength;
    const maxAttempts = opts.maxAttempts ?? BackoffModel.generationDefaults.maxAttempts;

    // validate that the prompt exists in the corpus
    const nonEmptyPrompt = prompt.filter(t => t && t.length > 0);
    const validPrompt = nonEmptyPrompt.filter(t => t.trim().length > 0);
    if (nonEmptyPrompt.length > 0 && validPrompt.length === 0) {
      throw Error(`generate() failed: prompt contains only whitespace tokens`);
    }

    const randomStarter = () => {
      if (validPrompt && validPrompt.length > 0) return [...validPrompt];
      return [SuffixGram.RiTa.randomizer.pselectObj(this.suffixes.startIndexDist())];
    };

    if (validPrompt.length > 0) {
      const dist = this.suffixes.pdist(validPrompt, { n });
      if (!dist || Object.keys(dist).length === 0) {
        throw Error(`generate() failed: prompt [${validPrompt.join(', ')}] not found in model`);
      }
      if (numSentences === 1) {
        const startDist = this.suffixes.startIndexDist();
        if (!startDist[validPrompt[0]]) {
          throw Error(`generate() failed: prompt token '${validPrompt[0]}' is not a sentence start`);
        }
      }
    }

    let attempts = 0;
    while (++attempts <= maxAttempts) {
      // Fresh counter each attempt — stops the stream after numSentences end tokens
      let endsSeen = 0;
      const options = {
        ...opts,
        allowSpecial: true,
        maxLength: perSentenceMax * numSentences,
        generateUntil: (t) => t === this.endToken && ++endsSeen >= numSentences,
      };

      const initialPrompt = randomStarter();
      const allTokens = [...initialPrompt]; // streamTokens doesn't yield the prompt itself
      for (const token of this.streamTokens(n, initialPrompt, options)) {
        allTokens.push(token);
      }

      // Split token stream on endToken boundaries into individual sentences
      const sentences = [];
      let current = [];
      for (const tok of allTokens) {
        if (tok === this.endToken) {
          if (current.length > 0) {
            if (current.length > perSentenceMax || current.length < perSentenceMin) {
              break; // sentence too short/long — retry
            }
            sentences.push(this.untokenize(current));
          }
          current = [];
        } else if (tok !== this.startToken) {
          current.push(tok);
        }
      }

      if (sentences.length === numSentences) return sentences;

      // Stream hit maxLength before producing enough sentences — retry
    }

    throw Error(`generateSentences() failed after ${maxAttempts} attempts`);
  }

  /**
   * Return all valid generation paths sorted by normalised joint probability.
   * @returns {{ tokens: {token,prob}[], prob: number }[]}
   */
  generationPaths(n, prompt, options = {}) {
    const opts = BackoffModel.resolveOpts(n, options, ['numSentences']);
    const tree = this.buildTree(n, prompt, opts, opts.depth);

    const paths = [];
    BackoffModel.collectPaths(tree, prompt
      .map(t => ({ token: t, prob: 1 })), paths);

    if (opts.sortByProb) paths.sort((a, b) => {
      const pa = a.slice(prompt.length).reduce((p, nd) => p * nd.prob, 1);
      const pb = b.slice(prompt.length).reduce((p, nd) => p * nd.prob, 1);
      return pb - pa;
    });

    const raw = paths
      .map(tokens => tokens.slice(prompt.length)
        .reduce((p, nd) => p * nd.prob, 1));
    const total = raw.reduce((s, p) => s + p, 0);

    let result = paths.map((tokens, i) => ({
      tokens, prob: raw[i] / total,
      inInput: this.suffixes.hasPrefix(tokens.map(t => t.token))
    }));

    return result;
  }

  /**
   * Generator yielding the complete generation paths depth-first
   * @yields {{ tokens: {token,prob}[], prob: number }}
   */
  * pathGenerator(n, prompt, options = {}) {

    const opts = BackoffModel.resolveOpts(n, options);
    const promptNodes = prompt.map(t => ({ token: t, prob: 1 }));

    const tree = this.buildTree(n, prompt, opts);
    if (tree.length === 0) {
      if (opts.forceOriginal) throw Error(`forceOriginal: no original `
        + `completions found for prompt [${prompt.join(' ')}]`);
      return;
    }

    function* walk(nodes, currentPath) {
      for (const node of nodes) {
        if (node.isEnd) continue;
        const path = [...currentPath, { token: node.token, prob: node.prob }];
        if (node.children.length === 0 || node.children.every(c => c.isEnd)) {
          const prob = path.slice(prompt.length).reduce((p, nd) => p * nd.prob, 1);
          yield { tokens: path, prob };
        } else {
          yield* walk(node.children, path);
        }
      }
    }

    yield* walk(tree, promptNodes);
  }

  /**
   * Stream tokens one-by-one, sampling from pdist each step.
   * @param {number}   n
   * @param {string[]} prompt
   * @param {Object}   options
   * @param {string|function} [options.generateUntil] - stop condition: a token string to
   *   match (inclusive), or a predicate `(token, tokensSoFar) => boolean`.
   *   Defaults to the model's endToken.
   *   Examples:
   *     '.'                                     — stop on first '.'
   *     (t, ts) => t===';' && ts.filter(x=>x===';').length >= 2  — stop after 2nd ';'
   * @param {number}   [options.temp]            - sampling temperature
   * @param {number}   [options.maxLength]       - max tokens to generate
   * @param {boolean}  [options.allowSpecial]    - whether to allow special tokens in output
   * @param {number}   [options.maxLengthMatch]  - max length of sequence allowed to match training data
   * @param {number}   [options.minLength]       - minimum tokens before stopping
   * @yields {string}
   */
  * streamTokens(n, prompt, options = {}) {
    const opts = BackoffModel.resolveOpts(n, options, ['generateUntil', 'numSentences']);

    let { minLength, maxLength, maxLengthMatch, temp, allowSpecial, debug } = opts;

    if (opts?.forceOriginal) throw Error('`forceOriginal` invalid for streamTokens');

    // generateUntil can be a string token to match, or a predicate function(token, tokensSoFar) => boolean.
    const generateUntil = opts.generateUntil ?? this.endToken;
    const isUntil = typeof generateUntil === 'function' ? generateUntil
      : token => token === generateUntil;
    const isSpecial = token => token.startsWith('<') && token.endsWith('>');

    const saOpts = { temp, n };
    let context = [...prompt], generated = 0; // tokens generated _after_ the prompt
    while (generated < maxLength) {

      // If context is longer than n-1 (e.g. a cross-boundary reseed),
      // try the full context first for a richer n-gram match, then back off.
      let query = context.slice(-(n - 1));
      let dist = context.length > n - 1
        ? (this.suffixes.pdist(context, saOpts) || this.suffixes.pdist(query, saOpts))
        : this.suffixes.pdist(query, saOpts);

      // backoff: shorten the query until we get a distribution
      while ((!dist || Object.keys(dist).length === 0) && query.length > 1) {
        query = query.slice(1);
        dist = this.suffixes.pdist(query, saOpts);
      }
      if (!dist) break;

      let chosenToken = null, weightSum = 0;
      const checkLength = isFinite(maxLengthMatch);

      // total sentence length including prompt
      const totalSoFar = prompt.length + generated; 

      for (const [token, prob] of Object.entries(dist)) {

        if (isSpecial(token)) { // filter
          if (totalSoFar < minLength) {
            // violates minLength constraint — skip token and try again
            continue;
          }
        } else if (checkLength) {
          const nonSpecial = context.filter(t => !(t.startsWith('<') && t.endsWith('>')));
          const seq = [...nonSpecial.slice(-maxLengthMatch), token];
          const hp = this.suffixes.hasPrefix(seq);
          if (debug) console.log(`[MLM] token="${token}" seq.len=${seq.length} mlm=${maxLengthMatch} seqGtMlm=${seq.length > maxLengthMatch} hasPrefix=${hp} seq=[${seq.join(',')}]`);
          if (seq.length > maxLengthMatch && hp) {
            // violates maxLengthMatch constraint — skip and try again
            if (debug) console.log('[FAIL] '+`skipping token "${token}" due to maxLengthMatch constraint: `
              + `sequence [${seq.join(', ')}] found in training data`);
            
            continue;
          }
        }
        // weighted select using BackoffModel's pselect method ??
        weightSum += prob;
        if (Math.random() * weightSum < prob) {
          chosenToken = token;
        }
      }

      if (chosenToken === null) break;
      const token = chosenToken;

      // stop on non-special generateUntil match (e.g. '.') once minLength reached
      if (!isSpecial(token) && isUntil(token, context.slice(prompt.length)) && totalSoFar + 1 >= minLength) {
        yield token;
        break;
      }

      // hard stop at maxLength
      if (generated >= maxLength) break;

      // special tokens: stop if they match generateUntil, otherwise advance context
      if (isSpecial(token)) {
        if (isUntil(token, context.slice(prompt.length)) && totalSoFar + 1 >= minLength) {
          if (allowSpecial) yield token;
          break;
        }
        if (allowSpecial) yield token;
        context.push(token);
        generated++;
        continue;
      }

      yield token;
      context.push(token);
      generated++;
    }
  }

  /////////////////////// PRIVATE //////////////////////////

  build(opts = {}) {
    //if (opts.verbose) ts = Date.now();
    this.tokenCount = 0;
    if (this.tokens && this.tokens.length > 0) {
      this.suffixes = new SuffixArray(this.tokens, opts);
      this.tokenCount = this.tokens.length; // include start/end
      this.tokens = undefined; // free up memory
      this.ready = true;
      // if (opts.verbose) {
      //   console.log(`BackoffModel loaded ${this.size()} tokens in ${Date.now() - ts}ms`);
      // }
    }
    return this;
  }

  pselect(dist) { // map: token -> probability

    if (typeof dist !== 'object') throw Error('object required');

    let cutoff = 0;
    let point = Math.random();
    let keys = Object.keys(dist);
    for (let i = 0; i < keys.length - 1; ++i) {
      let tok = keys[i], prob = dist[tok];
      cutoff += prob;
      if (point < cutoff) return tok;
    }
    return keys[keys.length - 1];
  }

  static resolveOpts(n, options, ignorableKeys = []) {
    if (typeof options !== 'undefined' && !SuffixGram.isObject(options)) {
      throw Error('Options must be an object');
    }
    let resolved = { ...options };

    // resolve any aliases to their canonical names
    const aliases = BackoffModel.generationAliases;
    Object.keys(resolved).forEach(key => {
      if (aliases.hasOwnProperty(key)) {
        const canonical = aliases[key];
        resolved[canonical] ??= resolved[key];
        delete resolved[key];
      }
    });
    Object.keys(BackoffModel.generationDefaults).forEach(o => {
      resolved[o] ??= BackoffModel.generationDefaults[o];
    });
    Object.keys(resolved).forEach(key => {
      if (!BackoffModel.generationDefaults.hasOwnProperty(key) && !ignorableKeys.includes(key)) {
        throw Error(`Invalid option key: ${key}`);
      }
    });
    if (isFinite(resolved.maxLengthMatch) && resolved.maxLengthMatch < n) {
      throw Error(`maxLengthMatch (${resolved.maxLengthMatch}) must be >= n (${n})`)
    }
    if (isFinite(n) && n > 1) {
      resolved.n = n;
    }
    return resolved;
  }

  /**
   * Recursively build a generation tree from this model.
   * Each node: { token, prob, isEnd, children }
   */
  buildTree(n, prompt = [], opts = {}, depth = opts.depth, tokensSoFar = 0) {
    if (depth === 0) return [];
    const { topK, temp, minLength, maxLength, maxLengthMatch, forceOriginal } = opts;
    if (!this.ready) this.build();
    const saOpts = { temp, n };
    const query = prompt.slice(-(n - 1));
    let dist = this.suffixes.pdist(query, saOpts);
    if (!dist || Object.keys(dist).length === 0) {
      if (query.length > 1) dist = this.suffixes.pdist(query.slice(1), saOpts);
    }
    if (!dist) return [];

    let entries = Object.entries(dist)
      .sort(([, a], [, b]) => b - a)
      .slice(0, topK);
    const entryTotal = entries.reduce((s, [, p]) => s + p, 0);
    entries = entries.map(([t, p]) => [t, p / entryTotal]);

    return entries.map(([token, prob]) => {
      const isEnd = token === this.endToken || token === this.startToken;
      if (isEnd && tokensSoFar < minLength) return null;
      if (!isEnd && tokensSoFar >= maxLength) return null;
      if (!isEnd && isFinite(maxLengthMatch)) {
        const seq = [...prompt.slice(-maxLengthMatch), token];
        if (seq.length > maxLengthMatch && this.suffixes.hasPrefix(seq)) return null;
      }
      if (isEnd && forceOriginal && this.suffixes.hasPrefix(prompt)) return null;

      const children = (isEnd || depth <= 1) ? []
        : this.buildTree(n, [...prompt, token], opts, depth - 1, tokensSoFar + 1);

      if (!isEnd && children.length === 0) return null;

      return { token, prob, isEnd, children };

    }).filter(Boolean);
  }

  static collectPaths(nodes, currentPath, accumulator, promptLength = currentPath.length) {
    for (const node of nodes) {
      if (node.isEnd) continue;
      const path = [...currentPath, { token: node.token, prob: node.prob }];
      if (node.children.length === 0 || node.children.every(c => c.isEnd)) {
        accumulator.push(path);
      } else {
        BackoffModel.collectPaths(node.children, path, accumulator, promptLength);
      }
    }
  }
}