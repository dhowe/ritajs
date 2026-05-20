
import { expect } from 'chai';
import { RiTa } from './index.js';

const { BackoffModel, SuffixArray, RiMarkov } = RiTa;

let sample = "One reason people lie is to achieve personal power. Achieving personal power is helpful for one who pretends to be more confident than he really is. For example, one of my friends threw a party at his house last month. He asked me to come to his party and bring a date. However, I did not have a girlfriend. One of my other friends, who had a date to go to the party with, asked me about my date. I did not want to be embarrassed, so I claimed that I had a lot of work to do. I said I could easily find a date even better than his if I wanted to. I also told him that his date was ugly. I achieved power to help me feel confident; however, I embarrassed my friend and his date. Although this lie helped me at the time, since then it has made me look down on myself.";
let sample2 = "One reason people lie is to achieve personal power. Achieving personal power is helpful for one who pretends to be more confident than he really is. For example, one of my friends threw a party at his house last month. He asked me to come to his party and bring a date. However, I did not have a girlfriend. One of my other friends, who had a date to go to the party with, asked me about my date. I did not want to be embarrassed, so I claimed that I had a lot of work to do. I said I could easily find a date even better than his if I wanted to. I also told him that his date was ugly. I achieved power to help me feel confident; however, I embarrassed my friend and his date. Although this lie helped me at the time, since then it has made me look down on myself. After all, I did occasionally want to be embarrassed.";
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

describe('Markov.B1', () => {

  BackoffModel.SILENT = 1;

  let exampleStr = 'The brown fox jumps over the lazy dog. The brown dog wept over the treat.';

  // Remove redeclaration of exampleTokens to avoid shadowing the outer variable

  it('RiMarkov.constructor', () => {

    let lm1 = new BackoffModel();
    expect(lm1).to.be.an.instanceof(BackoffModel);
    expect(typeof lm1 === 'object').true;
    expect(lm1.size()).to.eq(0);

    // input: array of tokens with separator
    lm1 = new BackoffModel(exampleTokens);
    expect(lm1.suffixes).to.be.an.instanceof(SuffixArray);
    expect(lm1.size()).to.eq(21);

    // input: raw string (tokenized by RiTa)
    let lm2 = new BackoffModel(exampleStr);
    expect(lm2.suffixes).to.be.an.instanceof(SuffixArray);
    expect(lm2.size()).to.eq(21);

    expect(() => new BackoffModel(123)).to.throw();
    expect(() => new BackoffModel([RiTa.sentences(exampleStr)])).to.throw(); // 2d
  });

  it('should throw on generate for empty model', function () {
    let rm = new BackoffModel({ maxLengthMatch: 6 });
    expect(() => rm.generate(5)).to.throw;
  });

  it('should throw on failed generate', function () {
    let rm = new BackoffModel({ maxLengthMatch: 6 });
    rm.addText(sample);
    expect(() => rm.generate(5)).to.throw;

    rm = new BackoffModel({ maxLengthMatch: 5 });
    rm.addSentences(RiTa.sentences(sample));
    expect(() => rm.generate(5)).to.throw;

    rm = new BackoffModel({ maxAttempts: 1 });
    rm.addText("This is a text that is too short.");
    expect(() => rm.generate(5)).to.throw;
  });

  it('should call addText with string', function () {
    let rm = new BackoffModel({ maxLengthMatch: 6 });
    rm.addText(sample).build();
    expect(rm.size()).to.be.greaterThan(0);
    expect(rm).to.eql(new BackoffModel(sample, { maxLengthMatch: 6 }));
  });

  it('should call addText with token array', function () {
    let rm = new BackoffModel({ maxLengthMatch: 6 });
    rm.addTokens(exampleTokens).build();
    expect(rm.size()).to.be.greaterThan(0);
    expect(rm).to.eql(new BackoffModel(exampleTokens, { maxLengthMatch: 6 }));
  });

  it('should call addSentences with sentence array', function () {
    let rm = new BackoffModel({ maxLengthMatch: 6 });
    rm.addSentences(RiTa.sentences(sample)).build();
    expect(rm.size()).to.be.greaterThan(0);
    expect(rm).to.eql(new BackoffModel(sample, { maxLengthMatch: 6 }));
  });

  it('should split on custom tokenizers', function () {

    let start = SuffixArray.SEQ_START_TOKEN;
    let end = SuffixArray.SEQ_END_TOKEN;
    let sents = ['asdfasdf-', 'aqwerqwer+', 'asdfasdf*'];
    let chars = sents.reduce((acc, curr) => acc + curr.length, sents.length * 2);

    let tokenize = (sent) => sent.split("");
    let untokenize = (sents) => sents.join("");

    let rm = new BackoffModel({ tokenize, untokenize });
    rm.addSentences(sents).build();

    expect(rm.size()).eq(chars);
    let toks = sents.map(s => [start, ...s.split(""), end]).flat()
    expect(rm.size()).eq(new BackoffModel(toks).size());

  });
});

describe('Markov.B2', () => {

  BackoffModel.SILENT = 1;

  let exampleStr = 'The brown fox jumps over the lazy dog. The brown dog wept over the treat.';

  it('RiMarkov.constructor', () => {
    // text form (implicit n)
    const rm = new RiMarkov(exampleStr);
    expect(rm).to.be.an.instanceof(RiMarkov);
    expect(rm.model).to.be.an.instanceof(BackoffModel);
    expect(rm.size()).to.be.above(0);

    // legacy form: new RiMarkov(n, { text })
    const rm2 = new RiMarkov(3, { text: exampleStr });
    expect(rm2.n).to.equal(3);
    expect(rm2.model.size()).to.equal(rm.model.size());

    // opts-only form: new RiMarkov({ text })
    const rm3 = new RiMarkov({ text: exampleStr });
    expect(rm3.model.size()).to.equal(rm.model.size());

    // n stored via opts.n
    const rm4 = new RiMarkov(exampleStr, { n: 4 });
    expect(rm4.n).to.equal(4);
  });

  it('RiMarkov.addText / addSentences / addTokens / size', () => {
    // addText: builds same model as constructor string form
    const rm1 = new RiMarkov(exampleStr);
    const rm2 = new RiMarkov();
    rm2.addText(exampleStr);
    expect(rm2.size()).to.equal(rm1.size());

    // addSentences
    const rm3 = new RiMarkov();
    rm3.addSentences(RiTa.sentences(exampleStr));
    expect(rm3.size()).to.equal(rm1.size());

    // addTokens
    const rm4 = new RiMarkov();
    rm4.addTokens(exampleTokens);
    expect(rm4.size()).to.equal(rm1.size());

    // size() reflects token count
    expect(rm1.size()).to.equal(21);
    expect(new RiMarkov().size()).to.equal(0);

    // addText throws on non-string
    expect(() => rm2.addText(123)).to.throw();
  });

  it('RiMarkov.toJSON / fromJSON', () => {
    const rm = new RiMarkov(exampleStr);
    const json = rm.toJSON();
    expect(json).to.be.a('string');

    // fromJSON returns a proper RiMarkov with a BackoffModel (not a plain Object.assign copy)
    const copy = RiMarkov.fromJSON(json);
    expect(copy).to.be.an.instanceof(RiMarkov);
    expect(copy.size()).to.equal(rm.size());

    // static fromJSON
    const copy2 = RiMarkov.fromJSON(json);
    expect(copy2).to.be.an.instanceof(RiMarkov);
    expect(copy2.size()).to.equal(rm.size());

    // completions survive round-trip
    const orig = rm.completions(['The', 'brown']);
    const after = copy2.completions(['The', 'brown']);
    expect(after).to.deep.equal(orig);
  });

  it('RiMarkov.generate (numSentences)', () => {
    const rm = new RiMarkov(sample);
    rm.n = 3;
    const opts = { minTokens: 3, maxTokens: 20 };

    // numSentences=1 returns a single string (same as default)
    const norm = rm.generate(3, ['I'], opts);
    expect(norm).to.be.a('string').and.have.length.above(0);

    // numSentences=1 returns a single string (same as default)
    const one = rm.generate(3, ['I'], { ...opts, numSentences: 1 });
    expect(one).to.be.a('string').and.have.length.above(0);

    // numSentences=2 returns an array of 2 strings
    const two = rm.generate(3, ['I'], { ...opts, numSentences: 2 });
    expect(two).to.be.an('array').with.lengthOf(2);
    two.forEach(s => expect(s).to.be.a('string').and.have.length.above(0));

    // numSentences=3 returns an array of 3 strings
    const three = rm.generate(3, ['I'], { numSentences: 3 });
    expect(three).to.be.an('array').with.lengthOf(3);
  });

  it('RiMarkov.completions (single array)', () => {
    const rm = new RiMarkov(exampleStr);

    // next tokens after ['The', 'brown'] are 'fox' and 'dog'
    const nexts = rm.completions(['The', 'brown']);
    expect(nexts).to.be.an('array');
    expect(nexts).to.include('fox');
    expect(nexts).to.include('dog');
    // no special tokens in result by default
    nexts.forEach(t => expect(t).to.not.match(/^<.*>$/));
    expect(nexts.length).to.equal(2);

    expect(rm.completions(['brown', 'fox'])).to.deep.equal(['jumps']);

    // unknown context returns empty array
    expect(rm.completions(['never', 'seen'])).to.deep.equal([]);

    // allowSpecial: special tokens appear when at sentence end
    // 'dog .' is the last bigram before </s> in both sentences
    const nextsSpecial = rm.completions(['dog', '.'], undefined, { allowSpecial: true });
    expect(nextsSpecial).to.include(SuffixArray.SEQ_END_TOKEN);

    // allowSpecial: false (default) strips them
    rm.completions(['dog', '.']).forEach(t => expect(t).to.not.match(/^<.*>$/));

    // exact-value checks with sample corpus
    const rm2 = new RiMarkov(sample);
    rm2.n = 4;
    expect(rm2.completions('people lie is'.split(' '))).to.deep.equal(['to']);
    expect(rm2.completions('One reason people lie is'.split(' '))).to.deep.equal(['to']);
    expect(rm2.completions('personal power'.split(' '))).to.deep.equal(['.', 'is']);
    expect(rm2.completions(['to', 'be', 'more'])).to.deep.equal(['confident']);
    // 'I' has many followers — check set membership, not order (softmax shifts order)
    const iCompletions = rm2.completions(['I']);
    ['did', 'claimed', 'had', 'said', 'could', 'wanted', 'also', 'achieved', 'embarrassed']
      .forEach(w => expect(iCompletions).to.include(w));
    expect(rm2.completions(['XXX'])).to.deep.equal([]);
  });

  it('RiMarkov.completions (two arrays)', () => {
    const rm = new RiMarkov(exampleStr);
    rm.n = 4;

    // find w s.t. ['The', w, 'fox'] exists: 'brown' should be the answer
    const middle = rm.completions(['The'], ['fox']);
    expect(middle).to.be.an('array');
    expect(middle).to.include('brown');
    // no special tokens by default
    middle.forEach(t => expect(t).to.not.match(/^<.*>$/));

    // allowSpecial: include boundary tokens in results
    expect(rm.completions(['The'], ['fox'], { allowSpecial: true })).to.include('brown');

    // exact-value checks with sample2 corpus
    const rm2 = new RiMarkov(sample2);
    rm2.n = 4;
    expect(rm2.completions(['I'], ['not'])).to.deep.equal(['did']);
    expect(rm2.completions(['achieve'], ['power'])).to.deep.equal(['personal']);
    expect(rm2.completions(['to', 'achieve'], ['power'])).to.deep.equal(['personal']);
    expect(rm2.completions(['I', 'did'])).to.deep.equal(['not', 'occasionally']);
    expect(rm2.completions(['I', 'did'], ['want'])).to.deep.equal(['not', 'occasionally']);

    // throws when pre+post length >= n
    expect(() => rm2.completions(['I', 'did', 'not', 'occasionally'], ['want'])).to.throw();
  });


  it('RiMarkov.generate.restart', () => {
    let sents = ['asdfasdf-', 'asqwerqwer+', 'aqadaqdf*'];
    let tokenize = (sent) => sent.split("");
    let untokenize = (sents) => sents.join("");

    let rm = new RiMarkov(4, { tokenize, untokenize });
    rm.addSentences(sents).build();

    expect(Object.keys(rm.model.suffixes.startIndexDist())).eql(['a']);

    for (let i = 0; i < 10; i++) {
      let result = rm.generate(2, ['a', 's'], { maxTokens: 20 });
      //console.log(i, `'${result}'`);
      expect(/^as[a-z]+[-+*]$/.test(result)).to.be.true;
    }
  });

  it('RiMarkov.generate', () => {
    const rm = new RiMarkov(exampleStr);
    rm.n = 3;

    // returns a non-empty string
    const text = rm.generate(3, ['The', 'brown'], { minTokens: 2, maxTokens: 10 });
    expect(text).to.be.a('string').and.have.length.above(0);

    // starts with the prompt words
    expect(text.startsWith('The brown')).to.be.true;

    // two-arg form: generate(prompt, opts) — n from constructor
    rm.n = 3;
    const text2 = rm.generate(['The', 'brown'], { minTokens: 2, maxTokens: 10 });
    expect(text2).to.be.a('string').and.have.length.above(0);
    expect(text2.startsWith('The brown')).to.be.true;

    // throws when prompt is not an array
    expect(() => rm.generate(3, 'The brown', {})).to.throw();

    // throws when n is not set
    const rm2 = new RiMarkov(exampleStr);
    expect(() => rm2.generate(undefined, ['The'], {})).to.throw();
  });

  it('RiMarkov.probability', () => {
    const rm = new RiMarkov(exampleStr);

    // single-arg form: probability of a sequence (no prompt), unknown returns 0
    expect(rm.probability(['xyz'])).to.equal(0);

    // single-arg: known token has probability in (0, 1]
    expect(rm.probability(['the'])).to.be.above(0).and.be.at.most(1);

    // single-arg: more frequent token has higher probability
    expect(rm.probability(['the'])).to.be.above(rm.probability(['fox']));

    // single-arg sequence: P(['The', 'brown']) > P(['The', 'brown', 'fox'])
    const pSeq1 = rm.probability(['The', 'brown']);
    const pSeq2 = rm.probability(['The', 'brown', 'fox']);
    expect(pSeq1).to.be.above(0);
    expect(pSeq2).to.be.above(0);
    expect(pSeq1).to.be.above(pSeq2);

    // single-arg: non-existent sequence returns 0
    expect(rm.probability(['brown', 'fox', 'lazy'])).to.equal(0);

    // two-arg form: probability(prompt, next-string)
    expect(rm.probability(['The', 'brown'], 'fox')).to.be.closeTo(0.5, 0.01);
    expect(rm.probability(['The', 'brown'], 'dog')).to.be.closeTo(0.5, 0.01);

    // two-arg form: probability(prompt, next-array)
    expect(rm.probability(['The', 'brown'], ['fox', 'jumps'])).to.be.above(0).and.be.at.most(1);

    // unknown next returns 0
    expect(rm.probability(['The', 'brown'], 'xyz')).to.equal(0);

    // empty prompt falls back to unigram for first token
    expect(rm.probability([], ['The'])).to.be.above(0);

    // throws on bad prompt type
    expect(() => rm.probability('not-an-array', 'token')).to.throw();

    // exact-value unigram checks (simple corpus)
    // sa.length includes <s>/<s> tokens so denominator is total token array length
    const rm2 = new RiMarkov('the dog ate the boy the');
    expect(rm2.probability('the')).to.be.closeTo(3 / rm2.model.suffixes.length, 1e-9);
    expect(rm2.probability('dog')).to.be.closeTo(1 / rm2.model.suffixes.length, 1e-9);
    expect(rm2.probability('cat')).to.equal(0);

    const rm3 = new RiMarkov('the dog ate the boy that the dog found.');
    expect(rm3.probability('the')).to.be.closeTo(3 / rm3.model.suffixes.length, 1e-9);
    expect(rm3.probability('dog')).to.be.closeTo(2 / rm3.model.suffixes.length, 1e-9);
    expect(rm3.probability('cat')).to.equal(0);

    // exact-value unigram with sample corpus
    const rm4 = new RiMarkov(sample);
    expect(rm4.probability('power')).to.be.closeTo(
      rm4.model.suffixes.find(['power']).reduce((a, b) => b - a) / rm4.model.suffixes.length, 1e-9
    );
    expect(rm4.probability('Non-exist')).to.equal(0);

    // empty next returns 0
    expect(rm4.probability([])).to.equal(0);
    // sequence probability: non-zero for existing sequences
    expect(rm4.probability('personal power is'.split(' '))).to.be.above(0);
    expect(rm4.probability('personal powXer is'.split(' '))).to.equal(0);
  });

  it('RiMarkov.probabilities', () => {
    const rm = new RiMarkov(exampleStr);

    // both followers are present, probs sum to 1, no special tokens
    const dist = rm.probabilities(['The', 'brown']);
    expect(dist).to.have.property('fox');
    expect(dist).to.have.property('dog');
    Object.keys(dist).forEach(t => expect(t).to.not.match(/^<.*>$/));
    expect(Object.values(dist).reduce((s, p) => s + p, 0)).to.be.closeTo(1, 1e-9);
    Object.values(dist).forEach(p => expect(p).to.be.above(0));

    // deterministic context
    const dist2 = rm.probabilities(['brown', 'fox']);
    expect(Object.keys(dist2)).to.deep.equal(['jumps']);
    expect(dist2['jumps']).to.be.closeTo(1, 1e-9);

    // unknown context returns empty object
    expect(rm.probabilities(['never', 'seen'])).to.deep.equal({});

    // allowSpecial: includes endToken when it follows context
    expect(rm.probabilities(['dog', '.'], { allowSpecial: true }))
      .to.have.property(SuffixArray.SEQ_END_TOKEN);

    // allowSpecial: false (default) strips boundary tokens
    Object.keys(rm.probabilities(['dog', '.']))
      .forEach(t => expect(t).to.not.match(/^<.*>$/));

    // no-arg form returns sentence-starter distribution
    const startDist = rm.probabilities();
    expect(Object.keys(startDist).length).to.be.above(0);
    Object.keys(startDist).forEach(t => expect(t).to.not.match(/^<.*>$/));

    // throws on bad input
    expect(() => rm.probabilities('not-an-array')).to.throw();

    // exact-value checks with sample corpus (single-token context, deterministic result)
    const rm2 = new RiMarkov(sample);
    expect(rm2.probabilities(['reason'])).to.deep.equal({ people: 1.0 });
    expect(rm2.probabilities(['people'])).to.deep.equal({ lie: 1 });
    expect(rm2.probabilities(['personal'])).to.deep.equal({ power: 1.0 });
    // multi-token results go through softmax so use closeTo
    const theProbs = rm2.probabilities(['the']);
    expect(Object.keys(theProbs).sort()).to.deep.equal(['party', 'time']);
    expect(theProbs['time'] + theProbs['party']).to.be.closeTo(1, 1e-9);
    const isProbs = rm2.probabilities(['is']);
    expect(Object.keys(isProbs).sort()).to.deep.equal(['.', 'helpful', 'to']);
    expect(Object.values(isProbs).reduce((s, p) => s + p, 0)).to.be.closeTo(1, 1e-9);
    expect(rm2.probabilities(['XXX'])).to.deep.equal({});

    // exact-value checks with sample2 corpus
    const rm3 = new RiMarkov(sample2);
    expect(rm3.probabilities('people lie is'.split(' '))).to.deep.equal({ to: 1.0 });
    const pp = rm3.probabilities('personal power'.split(' '));
    expect(Object.keys(pp).sort()).to.deep.equal(['.', 'is']);
    expect(pp['.'] + pp['is']).to.be.closeTo(1, 1e-9);
    expect(rm3.probabilities(['to', 'be', 'more'])).to.deep.equal({ confident: 1.0 });
    expect(rm3.probabilities(['XXX'])).to.deep.equal({});
    expect(rm3.probabilities(['personal', 'XXX'])).to.deep.equal({});
    const didProbs = rm3.probabilities(['I', 'did']);
    expect(Object.keys(didProbs).sort()).to.deep.equal(['not', 'occasionally']);
    expect(didProbs['not'] + didProbs['occasionally']).to.be.closeTo(1, 1e-9);
    expect(didProbs['not']).to.be.above(didProbs['occasionally']); // 'not' is more frequent
  });

  it('RiMarkov.constructor (sentences option)', () => {
    // { sentences: [...] } form tokenizes each sentence and wraps in start/end tokens
    const sents = RiTa.sentences(exampleStr);
    const rm = new RiMarkov({ sentences: sents });
    expect(rm.size()).to.be.above(0);

    // should produce the same model as addSentences
    const rm2 = new RiMarkov();
    rm2.addSentences(sents);
    expect(rm.size()).to.equal(rm2.size());
  });

  it('RiMarkov.generate (opts-only form)', () => {
    const rm = new RiMarkov(sample);

    // generate({ n, prompt, minTokens, maxTokens }) — all in opts
    const result = rm.generate({ n: 3, prompt: ['I'], minTokens: 3, maxTokens: 20 });
    expect(result).to.be.a('string').and.have.length.above(0);

    // n defaults from opts.n
    const rm2 = new RiMarkov(exampleStr);
    const result2 = rm2.generate({ n: 3, prompt: ['The', 'brown'], minTokens: 2, maxTokens: 10 });
    expect(result2).to.be.a('string').and.have.length.above(0);
    expect(result2.startsWith('The brown')).to.be.true;

    // throws when n is not in opts and not set on instance
    const rm3 = new RiMarkov(exampleStr);
    expect(() => rm3.generate({ prompt: ['The'] })).to.throw();
  });

  it('RiMarkov.toString', () => {
    const rm = new RiMarkov(exampleStr);
    const str = rm.toString();
    expect(str).to.be.a('string').and.have.length.above(0);
  });

  it('RiMarkov.stream', () => {
    const rm = new RiMarkov(exampleStr);
    rm.n = 3;

    // returns a generator / iterable
    const gen = rm.stream(3, ['The', 'brown'], { maxTokens: 10 });
    expect(typeof gen[Symbol.iterator]).to.equal('function');

    // yields strings
    const tokens = [...rm.stream(3, ['The', 'brown'], { maxTokens: 10 })];
    expect(tokens.length).to.be.above(0);
    tokens.forEach(t => expect(t).to.be.a('string'));

    // does not include start/end boundary tokens by default (allowSpecial not set)
    const specials = new Set([SuffixArray.SEQ_START_TOKEN, SuffixArray.SEQ_END_TOKEN]);
    tokens.forEach(t => expect(specials.has(t)).to.be.false);

    // respects maxTokens
    const capped = [...rm.stream(3, ['The'], { maxTokens: 3 })];
    expect(capped.length).to.be.at.most(3);

    // prompt-only two-arg form: stream(prompt, opts) — n from constructor
    const tokens2 = [...rm.stream(['The', 'brown'], { maxTokens: 10 })];
    expect(tokens2.length).to.be.above(0);

    // opts-only form: stream({ n, prompt, maxTokens })
    const tokens3 = [...rm.stream({ n: 3, prompt: ['The', 'brown'], maxTokens: 10 })];
    expect(tokens3.length).to.be.above(0);

    // generateUntil string: stop on '.'
    const toStop = [...rm.stream(3, ['The', 'brown'], { maxTokens: 20, generateUntil: '.' })];
    expect(toStop[toStop.length - 1]).to.equal('.');

    // generateUntil function predicate
    const toPred = [...rm.stream(3, ['The', 'brown'], {
      maxTokens: 20,
      generateUntil: (t) => t === '.'
    })];
    expect(toPred[toPred.length - 1]).to.equal('.');

    // throws when prompt is not an array
    expect(() => [...rm.stream(3, 'not an array', {})]).to.throw();

    // throws when n is not set
    const rm2 = new RiMarkov(exampleStr);
    expect(() => [...rm2.stream({ prompt: ['The'] })]).to.throw();
  });
});
