import { expect } from 'chai';

import { RiTa } from './index.js';

describe('Markov.A', function () {

  let sample = "One reason people lie is to achieve personal power. Achieving personal power is helpful for one who pretends to be more confident than he really is. For example, one of my friends threw a party at his house last month. He asked me to come to his party and bring a date. However, I did not have a girlfriend. One of my other friends, who had a date to go to the party with, asked me about my date. I did not want to be embarrassed, so I claimed that I had a lot of work to do. I said I could easily find a date even better than his if I wanted to. I also told him that his date was ugly. I achieved power to help me feel confident; however, I embarrassed my friend and his date. Although this lie helped me at the time, since then it has made me look down on myself.";
  let sample2 = "One reason people lie is to achieve personal power. Achieving personal power is helpful for one who pretends to be more confident than he really is. For example, one of my friends threw a party at his house last month. He asked me to come to his party and bring a date. However, I did not have a girlfriend. One of my other friends, who had a date to go to the party with, asked me about my date. I did not want to be embarrassed, so I claimed that I had a lot of work to do. I said I could easily find a date even better than his if I wanted to. I also told him that his date was ugly. I achieved power to help me feel confident; however, I embarrassed my friend and his date. Although this lie helped me at the time, since then it has made me look down on myself. After all, I did occasionally want to be embarrassed.";
  let sample3 = sample + ' One reason people are dishonest is to achieve power.';
  let sample4 = "The Sun is a barren, rocky world without air and water. It has dark lava on its surface. The Sun is filled with craters. It has no light of its own. It gets its light from the Sun. The Sun keeps changing its shape as it moves around the Sun. It spins on its Sun in 273 days. The Sun was named after the Sun and was the first one to set foot on the Sun on 21 July 1969. They reached the Sun in their space craft named the Sun. The Sun is a huge ball of gases. It has a diameter of two km. It is so huge that it can hold millions of planets inside it. The Sun is mainly made up of hydrogen and helium gas. The surface of the Sun is known as the Sun surface. The Sun is surrounded by a thin layer of gas known as the chromospheres. Without the Sun, there would be no life on the Sun. There would be no plants, no animals and no Sun. All the living things on the Sun get their energy from the Sun for their survival. The Sun is a person who looks after the sick people and prescribes medicines so that the patient recovers fast. In order to become a Sun, a person has to study medicine. The Sun lead a hard life. Its life is very busy. The Sun gets up early in the morning and goes in circle. The Sun works without taking a break. The Sun always remains polite so that we feel comfortable with it. Since the Sun works so hard we should realise its value. The Sun is an agricultural country. Most of the people on the Sun live in villages and are farmers. The Sun grows cereal, vegetables and fruits. The Sun leads a tough life. The Sun gets up early in the morning and goes in circles. The Sun stays and work in the sky until late evening. The Sun usually lives in a dark house. Though the Sun works hard it remains poor. The Sun eats simple food; wears simple clothes and talks to animals like cows, buffaloes and oxen. Without the Sun there would be no cereals for us to eat. The Sun plays an important role in the growth and economy of the sky.";

  let RiMarkov, Random;
  before(async () => {
    RiMarkov = RiTa.RiMarkov;
    Random = RiTa.randomizer;
  });

  it('should call RiMarkov', function () {
    let rm = RiTa.markov(3);
    expect(typeof rm).eq('object');
    expect(rm.size()).eq(0);
  });

  it('should call RiTa.markov', function () {
    let rm = RiTa.markov(3);
    expect(typeof rm).eq('object');
    expect(rm.size()).eq(0);

    rm = RiTa.markov(3, { text: "The dog ran away" });
    expect(rm.size()).eq(6); // includes start/end tokens

    rm = RiTa.markov(3, { text: "" });
    expect(rm.size()).eq(0);
    expect(function () { rm.generate() }).to.throw();

    rm = RiTa.markov(3, { text: sample });
    console.log(rm.generate());

    expect(rm.generate().length).to.be.greaterThan(0);

    rm = RiTa.markov(3, { text: "Too short." });
    expect(function () { rm.generate() }).to.throw();

    expect(function () { rm = RiTa.markov(3, { text: 1 }); }).to.throw();

    expect(function () { RiTa.markov(3, { text: false }) }).to.throw();

    rm = RiTa.markov(3, { sentences: ["Sentence one.", "Sentence two."] });
    expect(rm.size()).eq(10);

    rm = RiTa.markov(3, { sentences: RiTa.sentences(sample) });
    expect(rm.generate().length).to.be.greaterThan(0);
  });

  it('should call Random.pSelect', function () {

    // should throw when options conflict
    expect(function () { Random.pselect() }).to.throw();
    expect(Random.pselect([1])).equal(0);

    //////////////////////////////////////////
    let weights = [1.0, 2, 6, -2.5, 0];
    let expected = [2, 2, 1.75, 1.55];
    let temps = [.5, 1, 2, 10];
    let distrs = [], results = [];
    temps.forEach(t => distrs.push(Random.ndist(weights, t)));
    let i, numTests = 100;
    distrs.forEach(sm => {
      let sum = 0;
      for (let j = 0; j < numTests; j++) {
        sum += Random.pselect(sm);
      }
      results.push(sum / numTests);
    });

    expect(results[i = 0], 'failed #' + i + ' temp=' + temps[i]).to.be.closeTo(expected[i], .1);
    expect(results[i = 1], 'failed #' + i + ' temp=' + temps[i]).to.be.closeTo(expected[i], .2);
    expect(results[i = 2], 'failed #' + i + ' temp=' + temps[i]).to.be.closeTo(expected[i], .4);
    expect(results[i = 3], 'failed #' + i + ' temp=' + temps[i]).to.be.closeTo(expected[i], 1);
    //expect(results[i = 4], 'failed #' + i + ' temp=' + temps[i]).to.be.closeTo(expected[i], .75);

    let distr = [[1, 2, 3, 4], [0.1, 0.2, 0.3, 0.4], [0.2, 0.3, 0.4, 0.5]];
    expected = [3, 0.3, 0.3857];
    //should pselect2 return index or return the value (which is what is returned now)
    for (let k = 0; k < 10; k++) {
      let results = [];
      distr.forEach(sm => {
        let sum = 0;
        for (let j = 0; j < 1000; j++) {
          sum += Random.pselect2(sm);
        }
        results.push(sum / 1000);
      });
      expect(results[0]).to.be.closeTo(expected[0], .5);
      expect(results[1]).to.be.closeTo(expected[1], .05);
      expect(results[2]).to.be.closeTo(expected[2], .05);
    }
  });

  it('should call Random.ndist', function () {
    expect(() => Random.ndist([1.0, 2, 6, -2.5, 0])).to.throw;

    let weights, expected, results;
    weights = [2, 1];
    expected = [.666, .333];
    results = Random.ndist(weights);
    for (let i = 0; i < results.length; i++) {
      expect(results[i]).to.be.closeTo(expected[i], 0.01);
    }
    weights = [7, 1, 2];
    expected = [.7, .1, .2];
    results = Random.ndist(weights);
    for (let i = 0; i < results.length; i++) {
      expect(results[i]).to.be.closeTo(expected[i], 0.01);
    }
  });

  it('should call Random.ndist.temp', function () {
    let weights, expected, results;
    weights = [1.0, 2, 6, -2.5, 0];
    expected = [
      [0, 0, 1, 0, 0],
      [0.0066, 0.018, 0.97, 0.0002, 0.0024],
      [0.064, 0.11, 0.78, 0.011, 0.039],
      [0.19, 0.21, 0.31, 0.13, 0.17],
    ]
    results = [
      Random.ndist(weights, 0.5),
      Random.ndist(weights, 1),
      Random.ndist(weights, 2),
      Random.ndist(weights, 10)
    ];
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      for (let j = 0; j < result.length; j++) {
        expect(result[j]).to.be.closeTo(expected[i][j], 0.01);
      }
    }
  });

  0 && it('should call createSeed', function () { // no longer used
    let rm, toks;

    rm = new RiMarkov(3);
    rm.addText(sample);
    expect(rm._flatten(rm.createSeed(['I', 'also']))).eq("I also");

    rm = new RiMarkov(4);
    rm.addText(sample);
    expect(rm._flatten(rm.createSeed('I also'))).eq("I also told");
    expect(rm._flatten(rm.createSeed('I also told'))).eq("I also told");
    expect(rm._flatten(rm.createSeed(['I', 'also']))).eq("I also told");
    expect(rm._flatten(rm.createSeed(['I', 'also', 'told']))).eq("I also told");

    ////////////////////////////////////////////////////////

    rm = new RiMarkov(4);
    rm.addText("The young boy ate it. The young girl gave up.");

    toks = rm.createSeed('The');
    expect(toks.length).eq(rm.n - 1);
    expect(["The young boy", "The young girl"]
      .includes(rm._flatten(toks))).true;

    toks = rm.createSeed('The young');
    expect(toks.length).eq(rm.n - 1);
    expect(["The young boy", "The young girl"]
      .includes(rm._flatten(toks))).true;

    toks = rm.createSeed(['The', 'young']);
    expect(toks.length).eq(rm.n - 1);
    expect(["The young boy", "The young girl"]
      .includes(rm._flatten(toks))).true;

    toks = rm.createSeed('The young boy');
    expect(toks.length).eq(rm.n - 1);
    expect(rm._flatten(toks)).eq('The young boy');

    toks = rm.createSeed('The young girl');
    expect(toks.length).eq(rm.n - 1);
    expect(rm._flatten(toks)).eq('The young girl');
  });

  it('should throw on generate for empty model', function () {
    let rm = new RiMarkov(4, { maxLengthMatch: 6 });
    expect(() => rm.generate(5)).to.throw;
  });

  it('should throw on failed generate', function () {
    let rm = new RiMarkov(4, { maxLengthMatch: 6 });
    rm.addSentences(RiTa.sentences(sample));
    expect(() => rm.generate(5)).to.throw;

    rm = new RiMarkov(4, { maxLengthMatch: 5 });
    rm.addSentences(RiTa.sentences(sample));
    expect(() => rm.generate(5)).to.throw;

    rm = new RiMarkov(4, { maxAttempts: 1 });
    rm.addText("This is a text that is too short.");
    expect(() => rm.generate(5)).to.throw;
  });

  it('should apply custom tokenizers', function () {

    let sents = ['asdfasdf-', 'aqwerqwer+', 'asdfasdf*'];
    let tokenize = (sent) => sent.split("");
    let untokenize = (sents) => sents.join("");

    let rm = new RiMarkov(4, { tokenize, untokenize });
    rm.addSentences(sents);
    //console.log(rm);

    expect(rm.size()).eq(sents.reduce((sum, s) => sum + s.length, 0) + (2 * sents.length));
  });

  it('should compute start distrib', function () {

    let sents = ['asdfasdf-', 'asqwerqwer+', 'aqadaqdf*'];
    let tokenize = (sent) => sent.split("");
    let untokenize = (sents) => sents.join("");

    let rm = new RiMarkov(4, { tokenize, untokenize });
    rm.addSentences(sents).build();

    expect(Object.keys(rm.model.suffixes.startIndexDist())).eql(['a']);
  });

  it('RiMarkov.generate.restart', () => {
    let sents = ['asdfasdf-', 'asqwerqwer+', 'aqadaqdf*'];
    let tokenize = (sent) => sent.split("");
    let untokenize = (sents) => sents.join("");

    let rm = new RiMarkov(4, { tokenize, untokenize });
    rm.addSentences(sents).build();

    expect(Object.keys(rm.model.suffixes.startIndexDist())).eql(['a']);

    for (let i = 0; i < 10; i++) {
      let result = rm.generate(2, ['a', 's'], { maxLength: 20 });
      //console.log(i, `'${result}'`);
      expect(/^as[a-z]+[-+*]$/.test(result)).to.be.true;
    }
  });

  it('should generate non-english sentences', function () {

    let text = '家 安 春 夢 家 安 春 夢 ！ 家 安 春 夢 德 安 春 夢 ？ 家 安 春 夢 安 安 春 夢 。';
    let sentArray = text.match(/[^，；。？！]+[，；。？！]/g);
    let rm = new RiMarkov(4);
    rm.addSentences(sentArray);
    let result = rm.generate({ prompt: ['家'], numSentences: 5 });
    expect(result.length).eq(5);
    expect(/^[^，；。？！]+[，；。？！]$/.test(result[0]), "FAIL: '" + result[0] + "'").is.true;
    result.forEach(r => expect(/^[^，；。？！]+[，；。？！]$/.test(r), "FAIL: '" + r + "'").to.be.true);
  });

  it('should apply custom chinese tokenizers ', function () {
    let text = '家安春夢家安春夢！家安春夢德安春夢？家安春夢安安春夢。';
    let sents = text.match(/[^，；。？！]+[，；。？！]/g);

    let tokenize = (sent) => sent.split("");
    let untokenize = (sents) => sents.join("");

    let rm = new RiMarkov(4, { tokenize, untokenize });
    rm.addSentences(sents);
    let result = rm.generate({ prompt: ['家'], numSentences: 5 });

    expect(result.length).eq(5);
    expect(/^[^，；。？！]+[，；。？！]$/.test(result[0]), "FAIL: '" + result[0] + "'").is.true;
    result.forEach(r => expect(/^[^，；。？！]+[，；。？！]$/.test(r), "FAIL: '" + r + "'").to.be.true);
  });

  it('should call generate1', function () {

    let rm;
    rm = new RiMarkov(4);
    rm.addText(sample);

    let sent = rm.generate();
    expect(typeof sent).eq('string');
    expect(sent[0]).eq(sent[0].toUpperCase());
    expect(/[!?.]$/.test(sent)).to.be.true;
  });

  it('should call generate2', function () {
    let rm;
    rm = new RiMarkov(4, { disableInputChecks: true });
    rm.addText(sample);
    let sent = rm.generate({ prompt: ["I"] });
    expect(typeof sent).eq('string');
    expect(sent[0]).eq("I");
    expect(/[!?.]$/.test(sent)).to.be.true;
  });

  it('should call generate3', function () {

    let rm;
    rm = new RiMarkov(4);
    rm.addText(sample);
    let sents = rm.generate({ numSentences: 3 });
    expect(sents.length).eq(3);
    for (let i = 0; i < sents.length; i++) {
      let s = sents[i];
      //console.log(i + ") " + s);
      expect(s[0]).eq(s[0].toUpperCase()); // "FAIL: bad first char in '" + s + "' -> " + s[0]);
      expect(/[!?.]$/.test(s), "FAIL: bad last char in '" + s + "'").to.be.true;
    }
  });

  it('should call generate4', function () {
    let rm = new RiMarkov(3); // 3 is max for sample, with input checking
    rm.addText(sample);
    let s = rm.generate();
    expect(s && s[0] === s[0].toUpperCase(), "FAIL: bad first char in '" + s + "'").to.be.true;
    expect(/[!?.]$/.test(s), "FAIL: bad last char in '" + s + "'").to.be.true;
    let num = RiTa.tokenize(s).length;
    expect(num >= 5 && num <= 35).to.be.true;
  });

  it('should call generate5', function () { // misc

    let rm = new RiMarkov(3)//, { maxLengthMatch: 2, trace: 0 });
    rm.addText(sample2);

    let res = rm.generate({ prompt: ["One", "reason"] })//, maxLength: 20 });
    console.log(res);
    expect(res.startsWith("One reason")).to.be.true;
    expect(/^[A-Z][a-z ,I]+[.?!]$/.test(res)).to.be.true;
    expect(/[!?.]$/.test(res)).to.be.true;

    rm = new RiMarkov(3, { trace: 0 });
    rm.addText(sample2);
    res = rm.generate();
    expect(/^[A-Z]/.test(res)).to.be.true;
    expect(/[!?.]$/.test(res)).to.be.true;

    rm = new RiMarkov(3, { trace: 0 });
    rm.addText(sample2);
    res = rm.generate({ maxLength: 20, numSentences: 2 });
    expect(res.length).eq(2);
    res.forEach((r, i) => {
      //console.log(i, r);
      expect(/^[A-Z]/.test(r)).to.be.true;
      expect(/[!?.]$/.test(r)).to.be.true;
    });
  });

  it('should call generate.minMaxLength', function () {

    let rm = new RiMarkov(3), minLength = 7, maxLength = 20;
    rm.addText(sample);
    let sents = rm.generate(3, { minLength, maxLength, numSentences: 3 });
    expect(sents.length).eq(3);
    for (let i = 0; i < sents.length; i++) {
      let s = sents[i];
      //console.log(i + ") " + s);
      expect(s[0]).eq(s[0].toUpperCase());
      expect(/[!?.]$/.test(s), "FAIL: bad last char in '" + s + "'").to.be.true;
      let num = RiTa.tokenize(s).length;
      expect(num >= minLength && num <= maxLength,
        (num + ' not within ' + minLength + '-' + maxLength)).to.be.true;
    }
  });

  it('should call generate.minMaxLengthDIC', function () {

    let rm = new RiMarkov(4);
    rm.addText(sample);
    for (let i = 0; i < 3; i++) {
      let minLength = (3 + i), maxLength = (10 + i);
      let s = rm.generate({ minLength, maxLength });
      //console.log(i + ") " + s);
      expect(s && s[0] === s[0].toUpperCase(), "FAIL: bad first char in '" + s + "'").to.be.true;
      expect(/[!?.]$/.test(s), "FAIL: bad last char in '" + s + "'").to.be.true;
      let num = RiTa.tokenize(s).length;
      expect(num >= minLength && num <= maxLength, (num + ' not within '
        + minLength + '-' + maxLength)).to.be.true;
    }
  });

  it('should call generate.prompt', function () {

    let rm = new RiMarkov(4);
    let start = ['One'];
    rm.addText(sample);
    let s = rm.generate({ prompt: start });
    expect(s.startsWith(start)).to.be.true;

    start = ['Achieving'];
    let res = rm.generate({ prompt: start });
    expect(typeof res).eq('string');
    expect(res.startsWith(start)).to.be.true;

    start = ['I'];
    let arr = rm.generate({ prompt: start, numSentences: 2 });
    expect(Array.isArray(arr)).to.be.true;
    expect(arr.length).eq(2);
    expect(arr[0].startsWith(start)).to.be.true;

    // should throw when sentence start is not found
    start = ["Not-exist"];
    // console.log(rm.generate({ prompt: start }));
    // console.log(rm.generate({ prompt: start, numSentences: 1 }));
    // console.log(rm.generate({ prompt: start, numSentences: 2 }));
    // return;
    expect(function () { rm.generate({ prompt: start }) }).to.throw();
    expect(function () { rm.generate({ prompt: start, numSentences: 1 }) }).to.throw();
    expect(function () { rm.generate({ prompt: start, numSentences: 2 }) }).to.throw();

    start = ["I and she"];
    expect(function () { rm.generate({ prompt: start, numSentences: 2 }) }).to.throw();
    // if startToken is empty string, equal to not have start token
    start = [""];
    expect(rm.generate({ prompt: start, numSentences: 2 }).length).eq(2);
    // if startToken is just space, throw
    start = [" "];
    expect(function () { rm.generate({ prompt: start, numSentences: 2 }) }).to.throw();
  });

  it('should call generate.promptArray', function () {

    let rm = new RiMarkov(4);
    let start = ['One'];
    rm.addText(sample);
    for (let i = 0; i < 5; i++) {
      let s = rm.generate({ prompt: start });
      //console.log(i + ") " + s);
      expect(s.startsWith(start)).to.be.true;
    }

    start = ['Achieving'];
    for (let i = 0; i < 5; i++) {
      let res = rm.generate({ prompt: start });
      expect(typeof res).eq('string');
      expect(res.startsWith(start)).to.be.true;
    }

    start = ['I'];
    for (let i = 0; i < 5; i++) {
      let arr = rm.generate(2, { prompt: start, numSentences: 2 });
      expect(arr.length).eq(2);
      expect(arr[0].startsWith(start)).to.be.true;
    }

    rm = new RiMarkov(4);
    rm.addText(sample);
    start = ['One', 'reason'];
    for (let i = 0; i < 1; i++) {
      let s = rm.generate({ prompt: start });
      expect(s.startsWith(start.join(' '))).to.be.true;
    }

    start = ['Achieving', 'personal'];
    for (let i = 0; i < 5; i++) {
      let res = rm.generate({ prompt: start });
      expect(typeof res).eq('string');
      expect(res.startsWith(start.join(' '))).to.be.true;
    }

    start = ['I', 'also'];
    for (let i = 0; i < 5; i++) {
      let res = rm.generate({ prompt: start });
      expect(typeof res).eq('string');
      expect(res.startsWith(start.join(' '))).to.be.true;
    }
  });

  it.skip('Should call generate.allowDuplicates', function () {
    let rm = RiTa.markov(3, { text: sample3 });
    let res;
    for (let index = 0; index < 10; index++) {
      res = rm.generate({ allowDuplicates: false });
      expect(!sample3.includes(res)).to.be.true;
    }
  });

  it('Should call generate.temp', function () {
    let rm = RiTa.markov(3, { text: sample3 });
    for (let index = 0; index < 1; index++) {
      let res = rm.generate({ temperature: 0 });
      expect(res.length).to.be.greaterThan(0);
      res = rm.generate({ temperature: 1 });
      expect(res.length).to.be.greaterThan(0);
      res = rm.generate({ temperature: 0.1 });
      expect(res.length).to.be.greaterThan(0);
      res = rm.generate({ temperature: 100 });
      expect(res.length).to.be.greaterThan(0);
    }
  });

  it('should generate across sentences', function () {

    let rm = new RiMarkov(3, { trace: 0 });
    rm.addText(sample2);
    expect(rm.n).eq(3);

    let sents = rm.generate({ numSentences: 3 });
    expect(sents.length).eq(3);

    // All within-sentence n-grams must be in the corpus
    for (const sent of sents) {
      let toks = RiTa.tokenize(sent);
      for (let j = 0; j <= toks.length - rm.n; j++) {
        let part = toks.slice(j, j + rm.n);
        let res = RiTa.untokenize(part);
        expect(sample2.includes(res), 'output not found in text: "' + res + '"').to.be.true;
      }
    }

    // Each sentence must start and end at a corpus sentence boundary
    let corpusSents = RiTa.sentences(sample2);
    let validStarts = new Set(corpusSents.map(s => RiTa.tokenize(s)[0]));
    let validEnds = new Set(corpusSents.map(s => { let t = RiTa.tokenize(s); return t[t.length - 1]; }));
    for (const sent of sents) {
      let toks = RiTa.tokenize(sent);
      expect(validStarts.has(toks[0]), 'bad sentence start: "' + toks[0] + '"').to.be.true;
      expect(validEnds.has(toks[toks.length - 1]), 'bad sentence end: "' + toks[toks.length - 1] + '"').to.be.true;
    }
  })

  function includesWithWrap(part, whole) {
    let wrappedCheck = whole + ' ' + whole; // handle wrapping case
    return whole.includes(part);
  }

  it('should call generate.mlm1', function () {

    let mlms = 8, theText = sample4, rm;

    rm = new RiMarkov(3, { maxLengthMatch: mlms, trace: 0 });
    rm.addText(RiTa.sentences(theText));

    let sents = rm.generate(2);
    for (let i = 0; i < sents.length; i++) {
      let sent = sents[i];
      let toks = RiTa.tokenize(sent);
      //console.log(i, sent);

      // All sequences of len=N are (by def.) in the input text
      for (let j = 0; j <= toks.length - rm.n; j++) {
        let part = toks.slice(j, j + rm.n);
        let res = RiTa.untokenize(part);
        expect(theText.indexOf(res) > -1, 'output not found in text: "' + res + '"').to.be.true;
      }

      // All sequences of len=mlms+1 must NOT  be in text
      for (let j = 0; j <= toks.length - (mlms + 1); j++) {
        let part = toks.slice(j, j + (mlms + 1));
        let res = RiTa.untokenize(part);
        expect(theText.indexOf(res) < 0, 'Got "' + sent + '"\n\nBut "'
          + res + '" was found in input:\n\n' + sample + '\n\n' + rm.input).to.be.true;
      }
    }
  });

  it('should call generate.mlm2', function () {

    let mlms = 9;
    let rm = new RiMarkov(3, { maxLengthMatch: mlms, trace: 0 });
    expect(typeof rm.input === 'object').to.be.true;
    rm.addText(sample2);
    let sents = rm.generate(3);
    for (let i = 0; i < sents.length; i++) {
      let sent = sents[i];
      //console.log(i, sent);
      let toks = RiTa.tokenize(sent);
      for (let j = 0; j <= toks.length - rm.n; j++) {
        let part = toks.slice(j, j + rm.n);
        let res = RiTa.untokenize(part);
        expect(sample2.indexOf(res) > -1, 'output not found in text: "' + res + '"').to.be.true;
      }
      for (let j = 0; j <= toks.length - (mlms + 1); j++) {
        let part = toks.slice(j, j + (mlms + 1));
        let res = RiTa.untokenize(part);
        expect(sample2.indexOf(res) < 0, 'Got "' + sent + '"\n\nBut "'
          + res + '" was found in input:\n\n' + sample + '\n\n' + rm.input).to.be.true;
      }
    }
  });

  it('should call completions', function () {

    let rm = new RiMarkov(4);
    rm.addText((sample));

    let res = rm.completions("people lie is".split(' '));
    expect(res).eql(["to"]);

    res = rm.completions("One reason people lie is".split(' '));
    expect(res).eql(["to"]);

    res = rm.completions("personal power".split(' '));
    expect(res).eql(['.', 'is']);

    res = rm.completions(['to', 'be', 'more']);
    expect(res).eql(['confident']);

    res = rm.completions(["I"]); // testing the sort
    console.log(res);
    
    let expec = ["did", "claimed", "had", "said", "could",
      "wanted", "also", "achieved", "embarrassed"
    ];
    expect(res.sort()).eql(expec.sort());

    res = rm.completions(["XXX"]);
    expect(res).eql([]);

    ///////////////////// ///////////////////// /////////////////////

    rm = new RiMarkov(4);
    rm.addText((sample2));

    res = rm.completions(['I'], ['not']);
    expect(res).eql(["did"]);

    res = rm.completions(['achieve'], ['power']);
    expect(res).eql(["personal"]);

    res = rm.completions(['to', 'achieve'], ['power']);
    expect(res).eql(["personal"]);

    res = rm.completions(['achieve'], ['power']);
    expect(res).eql(["personal"]);

    res = rm.completions(['I', 'did']);
    expect(res).eql(["not", "occasionally"]);

    res = rm.completions(['I', 'did'], ['want']);
    expect(res).eql(["not", "occasionally"]);

    //should throw with bad inputs
    expect(function () {
      rm.completions(['I', 'did', 'not', 'occasionally'], ['want']);
    }).to.throw();

    let tmp = RiTa.SILENT;
    RiTa.SILENT = true;

    // should return undefined if no completions are found
    res = rm.completions(['I', 'non-exist'], ['want']);
    expect(res).eql([]);

    res = rm.completions(['I', 'non-exist'], ['want']);
    expect(res).eql([]);

    RiTa.SILENT = tmp;
  });

  it('should call probabilities', function () {

    let rm = new RiMarkov(3);
    rm.addText((sample));

    let checks = ["reason", "people", "personal", "the", "is", "XXX"];
    let expected = [{
      people: 1.0
    }, {
      lie: 1
    }, {
      power: 1.0
    }, {
      time: 0.5,
      party: 0.5
    }, {
      to: 0.3333333333333333,
      '.': 0.3333333333333333,
      helpful: 0.3333333333333333
    }, {}];

    for (let i = 0; i < checks.length; i++) {
      let res = rm.probabilities(checks[i]);
      //console.log(checks[i] + ":", res, " ->", expected[i]);
      expect(res).eql(expected[i]);
    }
  });

  it('should call probabilities.array', function () {

    let rm = new RiMarkov(4);
    rm.addText(sample2);

    let res = rm.probabilities("the".split(" "));
    let expec = {
      time: 0.5,
      party: 0.5
    };
    expect(res).eql(expec);

    res = rm.probabilities("people lie is".split(" "));
    expec = {
      to: 1.0
    };
    expect(res).eql(expec);

    res = rm.probabilities("is");
    expec = {
      to: 0.3333333333333333,
      '.': 0.3333333333333333,
      helpful: 0.3333333333333333
    };
    expect(res).eql(expec);

    res = rm.probabilities("personal power".split(' '));
    expec = {
      '.': 0.5,
      is: 0.5
    };
    expect(res).eql(expec);

    res = rm.probabilities(['to', 'be', 'more']);
    expec = {
      confident: 1.0
    };
    expect(res).eql(expec);

    res = rm.probabilities("XXX");
    expec = {};
    expect(res).eql(expec);

    res = rm.probabilities(["personal", "XXX"]);
    expec = {};
    expect(res).eql(expec);

    res = rm.probabilities(['I', 'did']);
    expec = {
      "not": 0.6666666666666666,
      "occasionally": 0.3333333333333333
    };
    expect(res).eql(expec);
  });

  it.skip('should call probability', function () {

    let text, rm;
    text = 'the dog ate the boy the';
    rm = new RiMarkov(3);
    rm.addText(text);

    expect(rm.probability("the")).eq(.5);
    expect(rm.probability("dog")).eq(1 / 6);
    expect(rm.probability("cat")).eq(0);

    text = 'the dog ate the boy that the dog found.';
    rm = new RiMarkov(3);
    rm.addText(text);

    expect(rm.probability("the")).eq(.3);
    expect(rm.probability("dog")).eq(.2);
    expect(rm.probability("cat")).eq(0);

    rm = new RiMarkov(3);
    rm.addText(sample);
    expect(rm.probability("power")).eq(0.017045454545454544);

    //bad inputs
    expect(rm.probability("Non-exist")).eq(0);
  });

  it('should call probability.array', function () {

    let rm = new RiMarkov(3);
    rm.addText(sample);

    let check = 'personal power is'.split(' ');
    expect(rm.probability(check)).eq(1 / 3);

    check = 'personal powXer is'.split(' ');
    expect(rm.probability(check)).eq(0);

    check = 'someone who pretends'.split(' ');
    expect(rm.probability(check)).eq(1 / 2);

    expect(rm.probability([])).eq(0);
  });

  it('should call addText', function () {
    let rm = new RiMarkov(4);
    let sents = RiTa.sentences(sample);
    let count = 0;
    for (let i = 0; i < sents.length; i++) {
      let words = RiTa.tokenize(sents[i]);
      count += words.length + 2; // add 2 for start and end tokens
    }
    rm.addSentences(sents);

    expect(rm.size()).eq(count);
  });


  it('should call size', function () {

    let rm = new RiMarkov(4);
    expect(rm.size()).eq(0);

    let tokens = RiTa.tokenize(sample);
    //console.log(tokens.length + ' tokens')
    let sents = RiTa.sentences(sample);
    rm = new RiMarkov(3);
    rm.addText(sample);
    expect(rm.size()).eq(tokens.length + (2 * sents.length)); // add 2 for start and end tokens

    let rm2 = new RiMarkov(4);
    rm2 = new RiMarkov(3);
    rm2.addSentences(sents);
    expect(rm.size()).eq(rm2.size());
  });

  it('should serialize and deserialize', function () {

    let rm, copy;
    rm = new RiMarkov(4);
    let json = rm.toJSON();
    copy = RiMarkov.fromJSON(json);
    markovEquals(rm, copy);

    rm = new RiMarkov(4);
    rm.addText('I ate the dog.');
    copy = RiMarkov.fromJSON(rm.toJSON());
    //console.log(copy.leaves.map(t => t.token));
    markovEquals(rm, copy);

    rm = new RiMarkov(4);
    rm.addText('I ate the dog.');
    copy = RiMarkov.fromJSON(rm.toJSON());
    markovEquals(rm, copy);

    expect(copy.generate(4)).eql(rm.generate(4));
  });

  0 && it('Should output log with trace option', function () {
    let rm = new RiMarkov(4, { maxAttempts: 2, trace: true });
    rm.addText("This is a text that is too short.");
    expect(() => rm.generate(5)).to.throw;

    rm = new RiMarkov(3, { trace: true, maxLengthMatch: 10 });
    rm.addText(sample3);
    expect(rm.generate(2).length).eq(2);
  });

  /////////////////////////// helpers ////////////////////////////

  function distribution(res, dump) {
    let dist = {};
    for (var i = 0; i < res.length; i++) {
      if (!dist[res[i]]) dist[res[i]] = 0;
      dist[res[i]]++;
    }
    let keys = Object.keys(dist);//.sort(function(a, b) { return dist[b] - dist[a] });
    keys.forEach(k => {
      dist[k] = dist[k] / res.length
      dump && console.log(k, dist[k]);
    });
    dump && console.log();
    return dist;
  }

  function markovEquals(rm, copy) {

    expect(rm.size()).eql(copy.size());
    return;
  }
});
