
import { expect } from 'chai';
import { RiTa } from './index.js';

const { BackoffModel, SuffixArray } = RiTa;

let exampleStr = 'The brown fox jumps over the lazy dog. The brown dog wept over the treat.'

let exampleTokens = [
  SuffixArray.SEQ_START_TOKEN,
  'The', 'brown',
  'fox', 'jumps',
  'over', 'the',
  'lazy', 'dog',
  '.', SuffixArray.SEQ_END_TOKEN,
  SuffixArray.SEQ_START_TOKEN,
  'The', 'brown',
  'dog', 'wept',
  'over', 'the',
  'treat', '.',
  SuffixArray.SEQ_END_TOKEN,
];

let sample = "One reason people lie is to achieve personal power. Achieving personal power is helpful for one who pretends to be more confident than he really is. For example, one of my friends threw a party at his house last month. He asked me to come to his party and bring a date. However, I did not have a girlfriend. One of my other friends, who had a date to go to the party with, asked me about my date. I did not want to be embarrassed, so I claimed that I had a lot of work to do. I said I could easily find a date even better than his if I wanted to. I also told him that his date was ugly. I achieved power to help me feel confident; however, I embarrassed my friend and his date. Although this lie helped me at the time, since then it has made me look down on myself.";

describe('Backoff', () => {

  BackoffModel.SILENT = 1;

  //it('BackoffModel.oneoff', () => {});

  it('BackoffModel.constructor', () => {

    // input: array of tokens with separator
    let lm1 = new BackoffModel(exampleTokens);
    //console.log(lm1.toString());
    expect(lm1).to.be.an.instanceof(BackoffModel);
    expect(lm1.suffixes).to.be.an.instanceof(SuffixArray);
    expect(lm1.size()).to.eq(21);

    // input: raw string (tokenized by RiTa)
    let lm2 = new BackoffModel(exampleStr);
    expect(lm2).to.be.an.instanceof(BackoffModel);
    expect(lm2.suffixes).to.be.an.instanceof(SuffixArray);
    expect(lm2.size()).to.eq(21);

    expect(() => new BackoffModel(4)).to.throw();
    expect(() => new BackoffModel([RiTa.sentences(exampleStr)])).to.throw(); // 2d
  });

  it('BackoffModel.suffixes.find', () => {
    let lm = new BackoffModel(exampleStr + ' Then we ate.');
    let sa = lm.suffixes, min, max;
    //console.log(sa.toString());
    ([min, max] = sa.find(["T"], { debug: 0 }));
    //console.log(min, max); 
    expect(max - min).to.equal(0);
    //return;

    ([min, max] = sa.find(["The"], { debug: 0 }));
    expect(max - min).to.equal(2);
  }).timeout(3000);


  it('BackoffModel.to/fromJSON()', function () {
    let bom = new BackoffModel(exampleStr);
    //console.log(bom.tokens.toString());

    let copy = BackoffModel.fromJSON(bom.toJSON());

    expect(bom.tokenCount).to.equal(copy.tokenCount);
    expect(bom.tokens).to.deep.equal(copy.tokens);

    expect(copy).to.be.an.instanceof(BackoffModel);
    expect(Object.keys(bom.suffixes).sort()).to.deep.equal(Object.keys(copy.suffixes).sort());

    BackoffModel.options.forEach(f => {
      expect(copy[f], f).not.to.be.undefined;
      expect(copy[f], f).to.deep.equal(bom[f]);
    });

    SuffixArray.__dict__.forEach(f => {
      expect(copy.suffixes[f], f).not.to.be.undefined;
      expect(copy.suffixes[f], f).to.deep.equal(bom.suffixes[f]);
      //expect(copy.prefixes[f], f).to.deep.equal(bom.prefixes[f]);
    });
  });

  it.skip('BackoffModel.nextToken.cache', () => {
    let lm = new BackoffModel(exampleStr);
    let results = { fox: 0, dog: 0 };
    for (let i = 0; i < 10; i++) {
      let res = lm.nextToken(["The", "brown"]);
      expect(res.query).to.deep.equal(["The", "brown"]);
      expect(res.choices).to.deep.equal({ fox: .5, dog: .5 });
      expect(res.token).to.satisfy(t => t === 'fox' || t === 'dog');
      expect(res.n).to.equal(3);
      results[res.token]++;
    }

    lm = new BackoffModel(sample);
    results = lm.nextToken('I did not'.split(' '), { debug: 0, debugCache: 0 });

    expect(results.query).to.deep.equal('I did not'.split(' '));
    expect(results.choices).to.deep.equal({ have: 0.5, want: 0.5 });
    expect(results.token).to.satisfy(t => t === 'have' || t === 'want');
    expect(results.n).to.equal(4);
  });

  it.skip('BackoffModel.nextToken', () => {
    let lm = new BackoffModel(exampleStr);
    let results = { fox: 0, dog: 0 };
    for (let i = 0; i < 10; i++) {
      let res = lm.nextToken(["The", "brown"]);
      expect(res.query).to.deep.equal(["The", "brown"]);
      expect(res.choices).to.deep.equal({ fox: .5, dog: .5 });
      expect(res.token).to.satisfy(t => t === 'fox' || t === 'dog');
      expect(res.n).to.equal(3);
      results[res.token]++;
    }
    //console.log(results);
    expect(results.dog).to.be.above(0);
    expect(results.fox).to.be.above(0);

    let res = lm.nextToken(["brown", "fox"]);
    expect(res.choices).to.deep.equal({ jumps: 1 });
    expect(res.query).to.deep.equal(["brown", "fox"]);
    expect(res.token).to.equal('jumps');


    res = lm.nextToken(["Miss", "brown", "fox"], { n: 2 });
    expect(res?.token).to.equal('jumps');

    res = lm.nextToken(["Miss", "brown", "fox"]);
    expect(res?.token).to.equal(undefined);

  });

  it.skip('BackoffModel.nextToken.start', () => {
    let inp = [...exampleTokens, SuffixArray.SEQ_START_TOKEN, 'The', 'brown', 'dog', 'leapt', 'over', 'the', 'fence', '.', SuffixArray.SEQ_END_TOKEN, SuffixArray.SEQ_START_TOKEN, 'A', 'brown', 'dog', '.', SuffixArray.SEQ_END_TOKEN];
    let lm = new BackoffModel(inp);
    let next = lm.nextToken(['<s>'], { debug: 0 });
    //console.log(next);

    expect(next).to.satisfy(res => {
      return (res.token === 'The' || res.token === 'A')
        && res.choices['A'] === 0.25
        && res.choices['The'] === 0.75
        && res.query[0] === '<s>';
    });
  });

  it('BackoffModel.generationPaths', () => {
    const lm = new BackoffModel(exampleStr);
    const prompt = ['The', 'brown'];
    const opts = { minLength: 1, maxLength: 10 };

    // returns an array
    const paths = lm.generationPaths(3, prompt, opts);
    expect(paths).to.be.an('array');
    expect(paths.length).to.be.above(0);

    // each entry has {tokens, prob, inInput}
    paths.forEach(({ tokens, prob, inInput }) => {
      expect(tokens).to.be.an('array');
      expect(tokens.length).to.be.above(prompt.length);
      expect(prob).to.be.a('number').and.be.above(0);
      expect(inInput).to.be.a('boolean');
      // prompt tokens are always at start
      prompt.forEach((t, i) => expect(tokens[i].token).to.equal(t));
    });

    // normalised: probs sum to 1
    const total = paths.reduce((s, p) => s + p.prob, 0);
    expect(total).to.be.closeTo(1, 1e-9);

    // 'fox' and 'dog' are completions from 'The brown'
    const firstGenTokens = paths.map(p => p.tokens[prompt.length].token);
    expect(firstGenTokens).to.include('fox');
    expect(firstGenTokens).to.include('dog');

    // sortByProb orders descending
    const sorted = lm.generationPaths(3, prompt, { ...opts, sortByProb: true });
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].prob).to.be.at.least(sorted[i].prob);
    }

    // forceOriginal: only returns paths that don't exist in input
    const origPaths = lm.generationPaths(3, prompt, { ...opts, forceOriginal: true });
    origPaths.forEach(({ inInput }) => expect(inInput).to.be.false);
  });

  it('BackoffModel.pathGenerator', () => {
    const lm = new BackoffModel(exampleStr);
    const prompt = ['The', 'brown'];
    const opts = { minLength: 1, maxLength: 10 };

    // collects same paths as generationPaths
    const generated = [];
    for (const entry of lm.pathGenerator(3, prompt, opts)) {
      generated.push(entry);
    }
    expect(generated.length).to.be.above(0);

    // same number of paths as generationPaths
    const allPaths = lm.generationPaths(3, prompt, opts);
    expect(generated.length).to.equal(allPaths.length);

    generated.forEach(({ tokens, prob }) => {
      expect(tokens).to.be.an('array').with.length.above(prompt.length);
      expect(prob).to.be.a('number').and.be.above(0);
      prompt.forEach((t, i) => expect(tokens[i].token).to.equal(t));
    });

    // yields first valid entry available before emptying the generator
    const gen = lm.pathGenerator(3, prompt, opts);
    const first = gen.next();
    expect(first.done).to.be.false;
    expect(first.value.tokens).to.be.an('array');

    // forceOriginal: throws when no original paths exist
    const lm2 = new BackoffModel(sample);
    const samplePrompt = 'I did not'.split(' ');
    // should not throw — there are original continuations
    expect(() => {
      const g = lm2.pathGenerator(3, samplePrompt, { ...opts, forceOriginal: true });
      g.next();
    }).to.not.throw();
  });

  it('BackoffModel.streamTokens', () => {
    const lm = new BackoffModel(sample);
    const prompt = 'I did not'.split(' ');
    const opts = { minLength: 4, maxLength: 20 };

    let tokens = [...lm.streamTokens(3, prompt, opts)];
    expect(tokens).to.be.an('array');
    expect(tokens.length).to.be.at.least(opts.minLength);
    expect(tokens.length).to.be.at.most(opts.maxLength);
    tokens.forEach(t => expect(t).to.be.a('string'));

    // no special tokens in default output
    let specials = new Set([SuffixArray.SEQ_START_TOKEN, SuffixArray.SEQ_END_TOKEN]);
    tokens.forEach(t => expect(specials.has(t)).to.be.false);

    // allowSpecial: endToken appears at end
    tokens = [...lm.streamTokens(3, prompt, { ...opts, allowSpecial: true })];
    expect(tokens[tokens.length - 1]).to.equal(SuffixArray.SEQ_END_TOKEN);

    // generateUntil: stream ends exactly on the target token
    tokens = [...lm.streamTokens(3, prompt, { ...opts, generateUntil: '.' })];
    expect(tokens[tokens.length - 1]).to.equal('.');

    // generateUntil: predicate function — ends on the same token as string form
    tokens = [...lm.streamTokens(3, prompt, { ...opts, generateUntil: t => t === '.' })];
    expect(tokens[tokens.length - 1]).to.equal('.');

    // generateUntil: predicate function — ends on the same token as string form
    tokens = [...lm.streamTokens(3, prompt, {
      ...opts, minLength: 3,
      generateUntil: t => t === 'be' || t === 'girlfriend'
    })];
    expect(tokens[tokens.length - 1]).to.be.oneOf(['be', 'girlfriend']);

    const validFollowers = new Set(['have', 'want']);
    for (let i = 0; i < 5; i++) {
      tokens = [...lm.streamTokens(3, prompt, { minLength: 1, maxLength: 5 })];
      expect(tokens.length).to.be.at.most(5); // never exceeds maxLength
      // result starts with a token following the prompt incorpus
      expect(validFollowers.has(tokens[0])).to.be.true;
    }
  });

  it('BackoffModel.streamTokens.maxLengthMatch', () => {
    const lm = new BackoffModel(sample);
    const prompt = 'I did not'.split(' ');
    const opts = { minLength: 4, maxLength: 20 };

    // throws when maxLengthMatch < n
    expect(() => [...lm.streamTokens(4, prompt, { ...opts, maxLengthMatch: 3 })]).to.throw();

    // with maxLengthMatch=Infinity (default), verbatim sequences are allowed
    const free = [...lm.streamTokens(3, prompt, { ...opts, maxLengthMatch: Infinity })];
    expect(free.length).to.be.at.least(opts.minLength);

    // with a tight maxLengthMatch, no verbatim window longer than mlm should appear
    // (generation may stop early before minLength if candidate space is exhausted)
    const n = 3, mlm = 5;
    for (let i = 0; i < 10; i++) {
      const tokens = [...lm.streamTokens(n, prompt, { ...opts, maxLengthMatch: mlm })];
      expect(tokens).to.be.an('array');

      // no window of (mlm+1) consecutive tokens starting from the prompt boundary
      // should exist verbatim in the corpus
      const full = [...prompt, ...tokens];
      for (let j = prompt.length - 1; j <= full.length - (mlm + 1); j++) {
        const window = full.slice(j, j + mlm + 1);
        const windowStr = window.join(' ');
        expect(sample.includes(windowStr),
          `verbatim window found: "${windowStr}"`).to.be.false;
      }
    }
  });

  it('BackoffModel.generateSentences', () => {
    const lm = new BackoffModel(sample);
    const prompt = ['I'];
    const opts = { minLength: 3, maxLength: 20 };

    // returns an array of strings, default numSentences=2
    const three = lm.generateSentences(3, prompt, opts);
    expect(three).to.be.an('array').with.lengthOf(2);
    three.forEach(s => expect(s).to.be.a('string').and.have.length.above(0));

    // numSentences: 2
    const two = lm.generateSentences(3, prompt, { ...opts, numSentences: 2 });
    expect(two).to.be.an('array').with.lengthOf(2);
    two.forEach(s => expect(s).to.be.a('string').and.have.length.above(0));

    // numSentences: 1
    const one = lm.generateSentences(3, prompt, { ...opts, numSentences: 1 });
    expect(one).to.be.an('array').with.lengthOf(1);
    expect(one[0]).to.be.a('string').and.have.length.above(0);

    // generated sentences should not contain boundary tokens
    const specials = new Set([SuffixArray.SEQ_START_TOKEN, SuffixArray.SEQ_END_TOKEN]);
    three.forEach(s => RiTa.tokenize(s).forEach(t => expect(specials.has(t)).to.be.false));
  });

  it('BackoffModel.generationPaths.options', () => {
    const lm = new BackoffModel(exampleStr);
    const prompt = ['The', 'brown'];
    const base = { minLength: 1, maxLength: 10 };

    // topK=1: only the top-ranked token at each step — still produces valid paths
    const narrow = lm.generationPaths(3, prompt, { ...base, topK: 1 });
    expect(narrow).to.be.an('array').with.length.above(0);
    narrow.forEach(({ tokens, prob }) => {
      expect(tokens).to.be.an('array');
      expect(prob).to.be.a('number').above(0);
    });

    // depth limits tree recursion → shallower trees have fewer/shorter paths
    const shallow = lm.generationPaths(3, prompt, { ...base, depth: 2 });
    const deep    = lm.generationPaths(3, prompt, { ...base, depth: 20 });
    expect(shallow).to.be.an('array');
    expect(shallow.length).to.be.at.most(deep.length + 1);

    // temp: valid values do not throw
    expect(() => lm.generationPaths(3, prompt, { ...base, temp: 0.5 })).to.not.throw();
    expect(() => lm.generationPaths(3, prompt, { ...base, temp: 2.0 })).to.not.throw();

    // invalid option key throws via resolveOpts
    expect(() => lm.generationPaths(3, prompt, { ...base, badKey: true })).to.throw();
    expect(() => lm.streamTokens(3, prompt, { ...base, badKey: true }).next()).to.throw();
  });

  it.skip('BackoffModel.generate.history', () => {
    let lm = new BackoffModel(exampleStr);
    let query = ['The', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy'];
    let expected = 'The brown fox jumps over the lazy dog.';

    for (let n = 2; n < 5; n++) {
      let res = lm.generate(n, query, { debug: 0 });
      expect(res.text.startsWith('The')).is.true;
      expect(res.text.endsWith('.')).is.true;
    }

    let n = 6;
    let { text, history } = lm.generate(n, query, { debug: 0 });
    expect(text.startsWith('The')).is.true;
    expect(text.endsWith('.')).is.true;

    // check history output
    let first = history[0];
    expect(first.token).eq(0);
    expect(first.query).deep.equal(query);
    expect(first.n).eq(6);

    let second = history[1];
    expect(second.query).deep.equal(query.slice(-n + 1));;
    expect(second.token).eq('dog');
    expect(second.n).eq(6);

    let last = history[history.length - 1];
    expect(last.query).deep.equal(['jumps', 'over', 'the', 'lazy', 'dog']);
    expect(last.token).eq('.');
    expect(last.n).eq(6);
    let tokens = history.reduce((acc, h) => {
      if (h.token) acc.push(h.token);
      else acc.push(...h.query);
      return acc;
    }, []);

    //console.log(tokens);
    expect(RiTa.untokenize(tokens)).eql(expected);
  });


  // TODO: skip for now
  /*it.skip('BackoffModel.generate.forceOriginal2', () => {
    let lm, text;

    ////////////////////////////////////////////////////////////

    lm = new BackoffModel(); // default
    lm.addText(sample);
    ({ text } = lm.generate({ forceOriginal: false }));
    //console.log(text);
    expect(typeof text === 'string').is.true;
    expect(text[0]).eq(text[0].toUpperCase());
    expect(/[!?.]$/.test(text)).is.true;

    ////////////////////////////////////////////////////////////

    //return;// TEMP

    lm = new BackoffModel();
    lm.addText(sample);
    ({ text } = lm.generate('I did not'.split(' '), { forceOriginal: true, debug: 1 }));
    // console.log(sample);
    console.log(text);


    //console.log(text, sample.includes(text), sample.indexOf(text));
    expect(typeof text === 'string').is.true;
    expect(text[0]).eq(text[0].toUpperCase());
    expect(/[!?.]$/.test(text)).is.true;
    expect(sample.includes(text)).is.false;
  });*/

  it.skip('BackoffModel.generate.maxN', () => {

    let lm = new BackoffModel();
    lm.addText(sample);
    let result = lm.generate(3, 'I did not'.split(' '), { debug: 0 });

    if (0) console.log("'" + result.text + '"\n' + result.history.map((h, i) => i + ': ' + JSON.stringify({
      query: h.query.join(','),
      choices: h.choices,
      token: h.token,
      n: h.n
    }, 0, 2)).join('\n'));

    //  verify each n in history is <= maxN
    result.history.forEach(h => expect(h.n).to.be.at.most(3));

    let text = result.text;
    // //console.log(text, sample.includes(text), sample.indexOf(text));
    expect(typeof text === 'string').is.true;
    expect(text[0]).eq(text[0].toUpperCase());
    expect(/[!?.]$/.test(text)).is.true;
    //expect(sample.includes(text)).is.false;
  });

  it.skip('BackoffModel.generate.forceOriginal', () => {

    // NEXT: WORKING HERE -> need a method to visualise the generation tree
    // is it useful to set min/maxN to control the search space? or just use n as normal?

    let lm = new BackoffModel();
    lm.addText(sample);
    //expect(() => 
    let result = lm.generate('I did not'.split(' '), { forceOriginal: true, minN: 4, debug: 1 });
    console.log(result.history.map((h, i) => i + ': ' + JSON.stringify({
      query: h.query.join('|'),
      choices: h.choices,
      token: h.token,
      n: h.n
    }, 0, 2)).join('\n') + "\n'" + result.text + "'");
    //).to.throw();
    return;
    result = lm.generate('I did not'.split(' '), { maxN: 3, forceOriginal: true, debug: 0 });
    //console.log(result);
    let text = result.text;
    console.log(text, sample.includes(text), sample.indexOf(text));
    expect(typeof text === 'string').is.true;
    expect(text[0]).eq(text[0].toUpperCase());
    expect(/[!?.]$/.test(text)).is.true;
    expect(sample.includes(text)).is.false;
  });


});
