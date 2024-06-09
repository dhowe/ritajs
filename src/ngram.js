
/**
 * @class Ngram
 * @memberof module:rita
 */
class Ngram {

  static parent; // RiTa
  static separator = '|';//\u0001';

  constructor(n, options = {}) {

    this.n = n;
    this.data = new Map();
    this.trace = options.trace ?? false;
    this.mlm = options.maxLengthMatch ?? 999;
    this.maxAttempts = options.maxAttempts || 999;
    this.tokenize = options.tokenize || Ngram.parent.tokenize;
    this.untokenize = options.untokenize || Ngram.parent.untokenize;

    if (this.n < 2) throw Error('minimum N is 2');

    if (this.mlm && this.mlm < this.n) throw Error('maxLengthMatch must be >= N');

    // add text if supplied as opt // 
    if (options.text) this.addText(options.text);
  }

  addText(text, multiplier = 1) {

    let sents = Array.isArray(text) ? text : Ngram.parent.sentences(text);

    // create an array of all tokens
    let tokens = [];
    for (let k = 0; k < multiplier; k++) {
      for (let i = 0; i < sents.length; i++) {
        let words = this.tokenize(sents[i]);
        tokens = tokens.concat(words);
        //tokens.push(Ngram.separator); // sentence-end
      }
    }
    console.log('found ' + tokens.length + ' tokens');
    for (let i = 0; i < tokens.length; i++) {
      let toks;
      if (i < this.n) {
        toks = padLeft(tokens.slice(0, i + 1), this.n);
      }
      else if (i + this.n > tokens.length) {
        toks = padRight(tokens.slice(i, i + this.n), this.n);
      }
      else {
        toks = tokens.slice(i, i + this.n)
      }
      let seq = toks.join(Ngram.separator);
      console.log(i, seq);

      let next;
      if (i < this.n) {
        next = tokens[i + 1];
      }
      else if (i + this.n > tokens.length) {
        next = tokens[i + this.n - 1];
      }
      else {
        next = tokens[i + this.n];
      }
      if (!this.data.has(seq)) this.data.set(seq, []);
      if (next) this.data.get(seq).push(next);
    }
    return this;
  }

  generate(count, options = {}) {
  }

  toJSON() {
    return {
      n: this.n,
      mlm: this.mlm,
      maxAttempts: this.maxAttempts,
      data: Array.from(this.data)
    };
  }

  static fromJSON(json) {
    let ngram = new Ngram(json.n, {
      maxLengthMatch: json.mlm,
      maxAttempts: json.maxAttempts
    });
    for (let [k, v] of json.data) {
      ngram.data.set(k, v);
    }
    return ngram;
  }

  completions(pre, post) {
  }

  probabilities(path, temperature) {
    if (!Array.isArray(path)) path = this.tokenize(path);

    if (path.length < this.n) path = path.slice(0, this.n);

    let choices;
    if (path.length === this.n) {
      let seq = path.join(Ngram.separator);
      choices = this.data.get(seq);
    }
    else {
      let seq = path.length > 1 ? path.join(Ngram.separator) : Ngram.separator + path[0];
      let matches = Array.from(this.data.keys()).filter(k => k.endsWith(seq));
      choices = matches.map(k => this.data.get(k)).flat();
    }
    let pdist = choices.reduce((acc, k) => {
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    return Ngram.normalizeDist(pdist);
  }

  probability(data) {
    if (!Array.isArray(data)) throw Error('data must be an array');
    let choices;
    if (data.length === this.n) {
      let seq = data.join(Ngram.separator);
      choices = this.data.get(seq);
    }
    else {
      let seq = data.length > 1 ? data.join(Ngram.separator) : data[0];
      choices = Object.keys(this.data).filter(k => k.startsWith());
    }
    let pdist = choices.reduce((acc, k) => {
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    });

    return Ngram.normalizeDist(pdist);
  }

  toString(root, sort) {
    root = root || this.root;
    return root.asTree(sort).replace(/{}/g, '');
  }

  size() {
    return this.data.size;
  }

  static normalizeDist(mapping, temp = 0) {

    if (Object.keys(mapping).length === 0) return {}; // empty

    let total = 0, tdist = {};
    if (temp === 0) {
      // normalize counts as probabilities (sum to 1)
      total = Object.values(mapping).reduce((a, b) => a + b, 0);
      Object.keys(mapping).forEach(tok => {
        if (mapping[tok] < 0) throw Error('Negative count');
        tdist[tok] = mapping[tok] / total
      });
    }
    else {
      // normalize counts via softmax with temperature
      temp = Math.max(temp, 0.01); // avoid NaN result
      for (const [token, count] of Object.entries(mapping)) {
        if (count < 0) throw Error('Negative count');
        let pr = Math.exp(count / temp);
        tdist[token] = pr;
        total += pr;
      }
      Object.keys(tdist).forEach(tok => tdist[tok] /= total);
    }
    return tdist;
  }
}

function padLeft(arr, len, fill = '') {
  return Array(len).fill(fill).concat(arr).slice(arr.length);
}
function padRight(arr, len, fill = '') {
  return arr.concat(Array(len).fill(fill)).slice(0, len);
}

export default Ngram;