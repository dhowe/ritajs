import { parse, stringify } from '@ungap/structured-clone/json';

/**
 * See full set of options for RiMarkov (https://rednoise.org/rita/reference/RiTa/markov/index.html)
 * and RiMarkov.generate (https://rednoise.org/rita/reference/RiMarkov/generate/index.html)
 * 
 * @class RiMarkov
 * @memberof module:rita
 */
class RiMarkov {

  static parent; // RiTa

  /**
   * Creates a new RiMarkov object with functions for text-generation and other probabilistic functions, 
   * via Markov chains (or n-grams) with options to process words or tokens split by arbitrary regular expressions.
   * @param {number} [n] - the n-gram size (an integer >= 2)
   * @param {object} [options={}] - options for the model
   * @param {string|string[]} [options.text] - a text string, or array of sentences, to add to the model (same as via model.addText()
   * @param {boolean} [options.trace] - output trace info to the console
   * @param {number} [options.maxLengthMatch] - # of words allowed in result to match a sequence in the input, default=∞
   * @param {number} [options.maxAttempts=999] - max attempts before to complete one ore more generations before erroring, default=999
   * @param {object} [options.tokenize] - custom tokenize() function, defaults to RiTa.tokenize()
   * @param {function} [options.untokenize] - custom untokenize() function, defaults to RiTa.untokenize()
   * @param {boolean} [options.disableInputChecks=false] - if true, allow result to be present in the input, default
   * @memberof RiMarkov
   */
  constructor(n, options = {}) {

    this.n = n;
    this.root = new Node(null, 'ROOT');

    this.trace = options.trace;
    this.mlm = options.maxLengthMatch;
    this.maxAttempts = options.maxAttempts || 999;
    this.tokenize = options.tokenize || RiMarkov.parent.tokenize;
    this.untokenize = options.untokenize || RiMarkov.parent.untokenize;
    this.disableInputChecks = options.disableInputChecks;
    this.sentenceStarts = []; // allow duplicates for prob

    /** @type {Set<string>} */ this.sentenceEnds = new Set(); // no dups    

    if (this.n < 2) throw Error('minimum N is 2');

    if (this.mlm && this.mlm < this.n) throw Error('maxLengthMatch must be >= N');

    // we store inputs to verify we don't duplicate sentences
    if (!this.disableInputChecks || this.mlm) this.input = [];

    // add text if supplied as opt // 
    if (options.text) this.addText(options.text);
  }

  /**
   * Loads text into the model. If a raw string is provided, it will be split into sentences 
   * via RiTa.sentences(). If an array is provided, each string will be treated as an individual sentence.
   * @param {string|string[]} text - a text string, or array of sentences, to add to the model
   * @param {number} [multiplier=1] - number of times to add the text to the model
   * @return {RiMarkov} - the RiMarkov instance
   */
  addText(text, multiplier = 1) {

    let sents = Array.isArray(text) ? text : RiMarkov.parent.sentences(text);

    // add new tokens for each sentence start/end
    let allWords = [];
    for (let k = 0; k < multiplier; k++) {
      for (let i = 0; i < sents.length; i++) {
        let words = this.tokenize(sents[i]);
        this.sentenceStarts.push(words[0]);
        this.sentenceEnds.add(words[words.length - 1]);
        allWords.push(...words);
      }
      this.treeify(allWords);
    }

    if (!this.disableInputChecks || this.mlm) {
      for (let i = 0; i < allWords.length; i++) {
        this.input.push(allWords[i]);
      }
    }
    return this;
  }


  /** 
   * @overload
   * @param {number} count
   * @param {object} [options={}] - options for the generation
   * @param {number} [options.minLength=5] - minimum length of each sentence
   * @param {number} [options.maxLength=35] - maximum length of each sentence
   * @param {number} [options.temperature=1] - temperature acts as a knob to adjust the probability that input elements will be selected for the output. At higher values, infrequent words are more likely to be chosen, while at lower values the most frequent inputs are more likely to be output. If no value is provided, then tokens are chosen according to their relative frequency in the input.
   * @param {boolean} [options.allowDuplicates=false] - if true, allow duplicate sentences in the output
   * @param {string|string[]} [options.seed] - a seed string or array of tokens to start the generation
   * @returns {string[]}
   *
   * @overload
   * @param {object} [options={}] - options for the generation
   * @param {number} [options.minLength=5] - minimum length of each sentence
   * @param {number} [options.maxLength=35] - maximum length of each sentence
   * @param {number} [options.temperature=1] - temperature acts as a knob to adjust the probability that input elements will be selected for the output. At higher values, infrequent words are more likely to be chosen, while at lower values the most frequent inputs are more likely to be output. If no value is provided, then tokens are chosen according to their relative frequency in the input.
   * @param {boolean} [options.allowDuplicates=false] - if true, allow duplicate sentences in the output
   * @param {string|string[]} [options.seed] - a seed string or array of tokens to start the generation
   * @returns {string}
   */
  generate(count, options = {}) {

    let returnsArray = false; 
    if (typeof count === 'number') {
      if (count === 1) {
        throw Error("For one result, use generate() with no 'count' argument");
      }
      returnsArray = true;
    }

    if (arguments.length === 1 && typeof count === 'object') {
      options = count;
      count = 1;
    }

    const num = count || 1;
    const minLength = options.minLength || 5;
    const maxLength = options.maxLength || 35;

    if (typeof options.temperature !== 'undefined' && options.temperature <= 0) {
      throw Error("Temperature option must be greater than 0");
    }

    let tries = 0, tokens = [];//, usedStarts = [];
    let minIdx = 0, sentenceIdxs = [];
    let markedNodes = [];

    ////////////////////////// local functions /////////////////////////////

    const unmarkNodes = () => {
      markedNodes.forEach(n => n.marked = false);
    }

    const resultCount = () => {
      return tokens.filter(t => this._isEnd(t)).length;
    }

    const markNode = (node) => {
      if (node) {
        // save current tokens as a sort of hash of current state
        node.marked = tokens.reduce((acc, e) => acc + e.token, '');
        markedNodes.push(node);
      }
    }

    const notMarked = (cn) => {
      let tmap = tokens.reduce((acc, e) => acc + e.token, '');
      return cn.marked !== tmap;
    }

    const validateSentence = (next) => {

      markNode(next);
      let sentIdx = sentenceIdx();

      if (this.trace) console.log(1 + (tokens.length - sentIdx),
        next.token, '[' + next.parent.childNodes().filter
          (t => t !== next).map(t => t.token) + ']'); // print each child

      let sentence = tokens.slice(sentIdx).map(t => t.token);
      sentence.push(next.token);

      if (sentence.length < minLength) {
        fail('too-short (pop: ' + next.token + ')');
        //console.log('pop: ' + next.token);
        return false;
      }

      if (!this.disableInputChecks && isSubArray(sentence, this.input)) {
        fail('in-input (pop: ' + next.token + ')');
        return false;
      }

      let flatSent = this.untokenize(sentence);
      if (!options.allowDuplicates && isSubArray(sentence, tokens.slice(0, sentIdx))) {
        fail('duplicate (pop: ' + next.token + ')');
        return false;
      }

      tokens.push(next);
      sentenceIdxs.push(tokens.length);

      if (this.trace) console.log('OK (' + resultCount() + '/' + num + ') "' +
        flatSent + '" sidxs=[' + sentenceIdxs + ']\n');

      return true;
    }

    const fail = (msg, sentence, forceBacktrack) => {
      tries++;
      let sentIdx = sentenceIdx();
      sentence = sentence || this._flatten(tokens.slice(sentIdx));
      if (tries >= this.maxAttempts) throwError(tries, resultCount());
      //if (tokens.length >= this.maxAttempts) throwError(tries, resultCount()); // ???
      let parent = this._pathTo(tokens);
      let numChildren = parent ? parent.childNodes({ filter: notMarked }).length : 0;

      if (this.trace) console.log('Fail:', msg, '\n  -> "' + sentence + '" ',
        tries + ' tries, ' + resultCount() + ' successes, numChildren=' + numChildren
        + (forceBacktrack ? ' forceBacktrack*' : (' parent="' + parent.token
          + '" goodKids=[' + parent.childNodes({ filter: notMarked }).map(t => t.token) + ']'
          + '" allKids=[' + parent.childNodes().map(t => t.token) + ']')));

      if (forceBacktrack || numChildren === 0) {
        backtrack();
      }
    }

    // step back until we have a parent with children
    // or we have reached our start
    // if we find an option, return true
    const backtrack = () => {

      let parent, tc;
      for (let i = 0; i < 99; i++) { // tmp-remove?
        let last = tokens.pop();
        markNode(last);

        if (this._isEnd(last)) sentenceIdxs.pop();

        let sentIdx = sentenceIdx();
        let backtrackUntil = Math.max(sentIdx, minIdx);

        if (this.trace) console.log('backtrack#' + tokens.length,
          'pop "' + last.token + '" ' + (tokens.length - sentIdx)
          + "/" + backtrackUntil + ' ' + this._flatten(tokens));

        parent = this._pathTo(tokens);
        tc = parent.childNodes({ filter: notMarked });

        if (tokens.length <= backtrackUntil) {

          if (minIdx > 0) { // have seed
            if (tokens.length <= minIdx) { // back at seed
              if (!tc.length) throw Error('back at barren-seed1: case 0');
              if (this.trace) console.log('case 1');
              return true;
            }
            else { // back at sentence-start with seed
              if (!tc.length) {
                if (this.trace) console.log('case 2: back at SENT-START: "'
                  + this._flatten(tokens) + '" sentenceIdxs=' + sentenceIdxs
                  + ' ok=[' + parent.childNodes({ filter: notMarked }).map(t => t.token)
                  + '] all=[' + parent.childNodes().map(t => t.token) + ']');
                sentenceIdxs.pop();
              }
              else {  // continue
                if (this.trace) console.log('case 3');
              }
            }
          }
          else {             // TODO: recheck

            if (this.trace) console.log('case 4: back at start of sentence'
              + ' or 0: ' + tokens.length, sentenceIdxs);

            if (!tokens.length) {
              sentenceIdxs = [];
              return selectStart();
            }
          }

          return true;
        }

        if (tc.length) {
          sentIdx = sentenceIdx();

          if (this.trace) console.log((tokens.length - sentIdx)
            + ' ' + this._flatten(tokens) + '\n  ok=['
            + tc.map(t => t.token) + '] all=[' + parent.childNodes
              ({ filter: notMarked }).map(t => t.token) + ']');

          return parent;
        }
      }

      throw Error('Invalid state in backtrack() ['
        + tokens.map(t => t.token) + ']');
    }

    const sentenceIdx = () => {
      let len = sentenceIdxs.length;
      return len ? sentenceIdxs[len - 1] : 0;
    }

    const selectStart = () => {

      let seed = options.seed;

      if (seed && seed.length) {
        if (typeof seed === 'string') seed = this.tokenize(seed);
        let node = this._pathTo(seed, this.root);
        while (!node.isRoot()) {
          tokens.unshift(node);
          node = node.parent;
        }
      }

      // we need a new sentence-start
      else if (!tokens.length || this._isEnd(tokens[tokens.length - 1])) {

        let usableStarts = this.sentenceStarts.filter(ss => notMarked(this.root.child(ss)));
        if (!usableStarts.length) throw Error('No valid sentence-starts remaining');
        let start = RiMarkov.parent.random(usableStarts);
        let startTok = this.root.child(start);
        markNode(startTok);
        usableStarts = this.sentenceStarts.filter(ss => notMarked(this.root.child(ss)));
        tokens.push(startTok);
      }
      else {
        throw Error('Invalid call to selectStart: ' + this._flatten(tokens));
      }
    }

    ////////////////////////////////// code ////////////////////////////////////////

    selectStart();

    while (resultCount() < num) {

      let sentIdx = sentenceIdx();

      if (tokens.length - sentIdx >= maxLength) {
        fail('too-long', 0, true);
        continue;
      }

      let parent = this._pathTo(tokens);
      let next = this._selectNext(parent, options.temperature, tokens, notMarked);

      if (!next) { // no valid children, pop and continue;
        fail('mlm-fail(' + this.mlm + ')', this._flatten(tokens), true);
        continue;
      }

      if (this._isEnd(next)) {
        validateSentence(next);
        continue;
      }

      tokens.push(next);

      if (this.trace) console.log(tokens.length - sentIdx, next.token,
        '[' + parent.childNodes({ filter: notMarked }) // print unmarked kids
          .filter(t => t !== next).map(t => t.token) + ']');
    }

    unmarkNodes();

    let str = this.untokenize(tokens.map(t => t.token)).trim();
    return returnsArray ? this._splitEnds(str) : str;
  }

  /**
   * Converts the model to a JSON-formatted string for storage or serialization
   * @return {string} - the JSON string
   */
  toJSON() {
    let data = Object.keys(this).reduce
      ((acc, k) => Object.assign(acc, { [k]: this[k] }), {});
    // @ts-ignore
    data.sentenceEnds = [...data.sentenceEnds]; // set -> []
    return stringify(data);
  }

  /**
   * Creates a new model from one previously saved as JSON
   * @param {string} json - the JSON string to load
   * @return {RiMarkov} - the RiMarkov instance
   */
  static fromJSON(json) {

    // parse the json and merge with new object
    let parsed = parse(json);
    let rm = Object.assign(new RiMarkov(), parsed);

    // convert our json array back to a set
    rm.sentenceEnds = new Set(...parsed.sentenceEnds);

    // handle json converting undefined [] to empty []
    if (!parsed.input) rm.input = undefined;

    // then recreate the n-gram tree with Node objects
    let jsonRoot = rm.root;
    populate(rm.root = new Node(null, 'ROOT'), jsonRoot);

    return rm;
  }

  /**
   * Returns array of possible tokens after pre and (optionally) before post. If only one array parameter is provided, this function returns all possible next words, ordered by probability, for the given array. 
   * If two arrays are provided, it returns an unordered list of possible words w that complete the n-gram consisting of: pre[0]...pre[k], w, post[k+1]...post[n].
   * @param {string[]} pre - the list of tokens preceding the completion
   * @param {string[]} [post] - the (optional) list of tokens following the completion
   * @return {string[]} - an unordered list of possible next tokens 
   */
  completions(pre, post) {
    let tn, result = [];
    if (post) { // fill the center
      if (pre.length + post.length > this.n) throw Error
        ('Sum of pre.length && post.length must be <= N, was ' + (pre.length + post.length));
      if (!(tn = this._pathTo(pre))) {
        if (!RiMarkov.parent.SILENT) console.warn('Unable to find nodes in pre: ' + pre);
        return;
      }
      const nexts = tn.childNodes();
      for (let i = 0; i < nexts.length; i++) {
        let atest = pre.slice(0), next = nexts[i];
        atest.push(next.token, ...post);
        if (this._pathTo(atest)) {
          result.push(next.token);
        }
      }
    } else { // fill the end
      const pr = this.probabilities(pre);
      result = Object.keys(pr).sort((a, b) => pr[b] - pr[a]);
    }
    return result;
  }

  /**
   * Returns the full set of possible next tokens as a object, mapping tokens to probabilities,
   *  given an array of tokens representing the path down the tree (with length less than `n`).
   * @param {string|string[]} path - the path to the node as a string or an array of tokens
   * @param {number} [temperature=1] - temperature acts as a knob to adjust the probability that input elements will be selected for the output. At higher values, infrequent words are more likely to be chosen, while at lower values the most frequent inputs are more likely to be output. If no value is provided, then tokens are chosen according to their relative frequency in the input.
   * @return {object} - a map of tokens to probabilities
   */
  probabilities(path, temperature) {
    if (!Array.isArray(path)) path = this.tokenize(path);
    const probs = {};
    const parent = this._pathTo(path);
    if (parent) {
      const children = parent.childNodes();
      const weights = children.map(n => n.count);
      const pdist = RiMarkov.parent.randomizer.ndist(weights, temperature);
      children.forEach((c, i) => probs[c.token] = pdist[i]);
    }
    return probs;
  }

  /**
   * Returns either the raw (unigram) probability for a single token in the model 
   * (0 if it does not exist), OR the probability of a sequence of K tokens where K is <= `n`
   * @param {string|string[]} data - the token or array of tokens to check
   * @return {number} - the probability of the token or sequence
   */
  probability(data) {
    let p = 0;
    if (data && data.length) {
      let tn = (typeof data === 'string') ?
        this.root.child(data) : this._pathTo(data);
      if (tn) p = tn.nodeProb(true); // no meta
    }
    return p;
  }

  /**
   * Returns a string representation of the model or a subtree of the model, optionally ordered by probability.
   * @param {object} root - the root node of the subtree to print
   * @param {boolean} sort - if true, sort the nodes by probability
   * @return {string} - the string representation of the model 
   */
  toString(root, sort) {
    root = root || this.root;
    return root.asTree(sort).replace(/{}/g, '');
  }

  /**
   * Returns the number of tokens currently in the model.
   * @return {number} - number of tokens
   */
  size() {
    return this.root.childCount(true);
  }

  ////////////////////////////// end API ////////////////////////////////

  // selects child based on temp, filter and probability (throws)
  _selectNext(parent, temp, tokens, filter) {

    if (!parent) throw Error('no parent:' + this._flatten(tokens));

    let children = parent.childNodes({ filter });
    if (!children.length) {
      if (this.trace) console.log('No children to select, parent=' + parent.token
        + ' children=ok[], all=[' + parent.childNodes().map(t => t.token) + ']');
      return;
    }

    // basic case: just prob. select from children
    if (!this.mlm || this.mlm > tokens.length) {
      return parent.pselect(filter);
    }

    const validateMlms = (word, nodes) => {
      let check = nodes.slice(-this.mlm).map(n => n.token);
      check.push(word.token);
      return !isSubArray(check, this.input);
    }

    const rand = RiMarkov.parent.randomizer;
    const weights = children.map(n => n.count);
    const pdist = rand.ndist(weights, temp);
    const tries = children.length * 2;
    const selector = rand.random();

    // loop 2x here as we may skip earlier nodes
    // but keep track of tries to avoid duplicates
    const tried = [];
    for (let i = 0, pTotal = 0; i < tries; i++) {
      let idx = i % children.length;
      pTotal += pdist[idx];
      let next = children[idx];
      if (selector < pTotal) {
        if (!tried.includes(next.token)) {
          tried.push(next.token);
          return validateMlms(next, tokens) ? next : false;
        }
      }
    }
  }

  /*
   * Returns true if node (or string) is a sentence end
   */
  _isEnd(node) {
    if (node) {
      let check = node;
      if ('token' in node) check = node.token; // needed?
      return this.sentenceEnds.has(check);
    }
    return false;
  }

  /*
   * Follows 'path' (using only the last n-1 tokens) from root and returns
   * the node for the last element if it exists, otherwise undefined
   * @param  {Node[]} path
   * @param  {node} root of tree to search
   * @return {node} or undefined
   */
  _pathTo(path, root) {
    root = root || this.root;
    if (typeof path === 'string') path = [path];
    if (!path || !path.length || this.n < 2) return root;
    let idx = Math.max(0, path.length - (this.n - 1));
    let node = root.child(path[idx++]);
    for (let i = idx; i < path.length; i++) {
      if (node) node = node.child(path[i]);
    }
    return node; // can be undefined
  }

  /* add tokens to tree */
  treeify(tokens) {
    let root = this.root;
    for (let i = 0; i < tokens.length; i++) {
      let node = root;
      let words = tokens.slice(i, i + this.n);
      let wrap = 0;
      for (let j = 0; j < this.n; j++) {
        let hidden = false;
        if (j >= words.length) {
          words[j] = tokens[wrap++];
          hidden = true;
        }
        node = node.addChild(words[j]);
        if (hidden) node.hidden = true;
      }
    }
  }

  /*
   * Split string of sentences on sentence-ends, keeping delims
   * hack: there _must_ be a better way to do thisn
   */
  _splitEnds(str) {

    let se = [...this.sentenceEnds];
    let re = '(' + se.reduce((acc, w) => acc + w + '|', '')
      .slice(0, -1).replace(/[.*+?^${}()[\]\\]/g, '\\$&') + ")";
    let arr = [], parts = str.split(new RegExp(re, 'g'));
    for (let i = 0; i < parts.length; i++) {
      if (!parts[i].length) continue;
      if ((i % 2) === 0) {
        arr.push(parts[i]);
      }
      else {
        arr[arr.length - 1] += parts[i];
      }
    }
    return arr.map(a => a.trim());
  }

  /* create a sentence string from an array of nodes */
  _flatten(nodes) {
    if (!nodes || (Array.isArray(nodes) && !nodes.length)) return '';
    if (nodes.token) return nodes.token; // single-node 
    let arr = nodes.map(n => n ? n.token : '[undef]');
    let sent = this.untokenize(arr);
    return sent.replace(MULTI_SP_RE, ' ');
  }

}

/**  @memberof module:rita */
class Node {

  constructor(parent, word, count) {
    this.children = {};
    this.parent = parent;
    this.token = word;
    this.count = count || 0;
    this.numChildren = -1; // for cache
    this.marked = false;
    this.hidden = false; // hidden
  }

  // Find a (direct) child node with matching token, given a word or node
  child(word) {
    let lookup = word;
    if (word.token) lookup = word.token;
    return this.children[lookup];
  }

  pselect(filter) {
    const rand = RiMarkov.parent.randomizer;
    const children = this.childNodes({ filter });
    if (!children.length) {
      throw Error('No eligible child for "' + this.token
        + "\" children=[" + this.childNodes().map(t => t.token) + "]");
    }
    const weights = children.map(n => n.count);
    const pdist = rand.ndist(weights);
    const idx = rand.pselect(pdist);
    return children[idx];
  }

  isLeaf(ignoreHidden) { return this.childCount(ignoreHidden) < 1; }

  isRoot() { return !this.parent; }

  childNodes(opts) {
    let sort = opts && opts.sort;
    let filter = opts && opts.filter;
    let kids = Object.values(this.children);
    if (filter) kids = kids.filter(filter);
    if (sort) kids.sort((a, b) => b.count !== a.count
      ? b.count - a.count
      : b.token.localeCompare(a.token));
    return kids;
  }

  childCount(ignoreHidden) {
    if (this.numChildren === -1) {
      let opts = {};
      if (ignoreHidden) opts.filter = (t => !t.hidden);
      this.numChildren = this.childNodes(opts)
        .reduce((a, c) => a + c.count, 0);
    }
    return this.numChildren;
  }

  nodeProb(excludeMetaTags) {
    if (!this.parent) throw Error('no parent');
    return this.count / this.parent.childCount(excludeMetaTags);
  }

  // Increments count for a child node and returns it
  addChild(word, count) {
    this.numChildren = -1; // invalidate cache
    count = count || 1;
    let node = this.children[word];
    if (!node) {
      node = new Node(this, word);
      this.children[word] = node;
    }
    node.count += count;
    return node;
  }

  toString() {
    return this.parent ? '\'' + this.token + '\' [' + this.count
      + ',p=' + this.nodeProb().toFixed(3) + ']' : 'Root'
  }

  asTree(sort, showHiddenNodes) {
    let s = this.token + ' ';
    if (this.parent) s += '(' + this.count + ')->';
    s += '{';
    return this.childCount(true) ? stringulate(this, s, 1, sort, !showHiddenNodes) : s + '}';
  }
}

// --------------------------------------------------------------

function stringulate(mn, str, depth, sort, ignoreHidden) {

  sort = sort || false;
  let indent = '\n';
  let l = mn.childNodes({ sort: true, filter: t => !t.hidden });
  if (!l.length) return str;
  for (let j = 0; j < depth; j++) indent += "  ";
  for (let i = 0; i < l.length; i++) {
    let node = l[i];
    if (node && node.token) {
      str += indent + "'" + encode(node.token) + "'";
      if (!node.isRoot()) str += " [" + node.count
        + ",p=" + node.nodeProb().toFixed(3) + "]";
      if (!node.isLeaf(ignoreHidden)) {
        //console.log('appending "{" for '+node.token, node.childNodes());
        str += '  {';
      }
      str = mn.childCount(ignoreHidden) ? stringulate(node, str, depth + 1, sort) : str + '}';
    }
  }
  indent = '\n';
  for (let j = 0; j < depth - 1; j++) indent += "  ";
  return str + indent + "}";
}

function encode(tok) {
  if (tok === '\n') tok = '\\n';
  if (tok === '\r') tok = '\\r';
  if (tok === '\t') tok = '\\t';
  if (tok === '\r\n') tok = '\\r\\n';
  return tok;
}

function populate(objNode, jsonNode) {
  if (!jsonNode) return;
  let children = Object.values(jsonNode.children);
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    let newNode = objNode.addChild(child.token, child.count);
    populate(newNode, child); // recurse
  }
}

function throwError(tries, oks) {
  throw Error('Failed after ' + tries + ' tries'
    + (oks ? ' and ' + oks + ' successes' : '')
    + ', you may need to adjust options or add more text');
}

function isSubArray(find, arr) {
  if (!arr || !arr.length) return false;
  OUT: for (let i = find.length - 1; i < arr.length; i++) {
    for (let j = 0; j < find.length; j++) {
      if (find[find.length - j - 1] !== arr[i - j]) continue OUT;
      if (j === find.length - 1) return true;
    }
  }
  return false;
}

const MULTI_SP_RE = / +/g;

export default RiMarkov;