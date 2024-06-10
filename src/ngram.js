
/**
 * @class Ngram
 * @memberof module:rita
 */
class Ngram {

  static parent; // RiTa
  static separator = '|';//\u0001';

  constructor(n, options = {}) {

    this.n = n;
    this.tokenCount = 0;
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
    this.tokenCount += tokens.length;

    let that = this;
    let pads = 0;
    let addSeq = function (start, end, next, pad) {
      if (pad) pads++;
      let toks = tokens.slice(start, end);
      if (pad === 'left') toks = padLeft(toks, that.n);
      if (pad === 'right') toks = padRight(toks, that.n);
      let seq = toks.join(Ngram.separator)
      if (!that.data.has(seq)) that.data.set(seq, []);
      //console.log(seq, '-> ' + next);//, pad ? 'pad-'+pad : '-');
      that.data.get(seq).push(next);
    }

    // for (let i = 0; i < this.n - 1; i++) {
    //   addSeq(0, i + 1, tokens[i + 1], 'left');
    // }

    addSeq(0, 0, tokens[0], 'left');
    for (let i = 0; i < tokens.length; i++) {
      if (i < this.n - 1) { // first n-1, pad left
        addSeq(0, i + 1, tokens[i + 1], 'left');
      }
      if (i + this.n <= tokens.length) {  // no pad
        addSeq(i, i + this.n, tokens[i + this.n]);
      }
      else {// last n-1, pad right 
        addSeq(i, i + this.n, tokens[i + this.n - 1], 'right');
      }
    }
    return this;
  }

  generate(count, options = {}) {
    if (this.tokenCount === 0) throw Error('No data in model');

    let returnArr = (typeof count === 'number' && count > 1) ? true : false;

    if (arguments.length === 1 && typeof count === 'object') {
      options = count;
      count = 1;
    }
    const num = count ?? 1;
    const rand = Ngram.parent.randomChoice;
    const minLength = options.minLength || 5;
    const maxLength = options.maxLength || 35;
    
    // WORKING HERE -- pick first token....

    let firstToken = rand(Array.from(this.data.keys()).filter());
    let sofar = [firstToken];
    while (sofar.length < num) {
      let next = this.probabilities(sofar, options.temperature);
      let choice = Ngram.parent.randomChoice(next);
      // NEXT:
      if (attempts++ > this.maxAttempts) throw Error('Max attempts exceeded');
    }
  }

  toJSON() {
    return {
      n: this.n,
      mlm: this.mlm,
      tokenCount: this.tokenCount,
      maxAttempts: this.maxAttempts,
      // options
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
    ngram.tokenCount = json.tokenCount;
    return ngram;
  }

  completions(pre, post) {
  }

  probabilities(path, temperature) {

    if (!Array.isArray(path)) path = this.tokenize(path);
    if (path.length > this.n) path = path.slice(0, this.n);

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

    
    return Ngram.normalizeDist(pdist, temperature);
  }

  // probability(path) {
  //   if (!Array.isArray(path)) path = [path];//throw Error('data must be an array');

  //   if (path.length > this.n) path = path.slice(0, this.n);

  //   let choices;
  //   if (path.length === this.n) {
  //     let seq = path.join(Ngram.separator);
  //     let hits = this.data.get(seq).length;
  //     return hits / this.tokenCount;
  //   }
  //   else if (path.length === 1) {
  //     let vals = Array.from(this.data.values()).flat();
  //     let hits = countInArray(path[0], vals);
  //     return hits / this.tokenCount;
  //   }
  //   else {
  //     let seq = path.length > 1 ? path.join(Ngram.separator) : Ngram.separator + path[0];
  //     let matches = Array.from(this.data.keys()).filter(k => k.endsWith(seq));
  //     choices = matches.map(k => this.data.get(k)).flat();
  //   }

  //   let pdist = choices.reduce((acc, k) => {
  //     acc[k] = (acc[k] || 0) + 1;
  //     return acc;
  //   });

  //   return Ngram.normalizeDist(pdist);
  // }

  toString(root, sort) {
    root = root || this.root;
    return root.asTree(sort).replace(/{}/g, '');
  }

  size() {
    return this.tokens().length;
  }

  tokens() {
    return Array.from(this.data.values()).flat();
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

// function countInArray(ele, array) {
//   return array.reduce((a, b) => {
//     if (ele === b) a++;
//     return a;
//   }, 0);
// }

function padLeft(arr, len, fill = '') {
  return Array(len).fill(fill).concat(arr).slice(arr.length);
}

function padRight(arr, len, fill = '') {
  return arr.concat(Array(len).fill(fill)).slice(0, len);
}

export default Ngram;