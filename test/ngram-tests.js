import { expect } from 'chai';

import Ngram from '../src/ngram.js';
import { RiTa } from './index.js';

describe('Ngram', function () {

  let sample = "One reason people lie is to achieve personal power. Achieving personal power is helpful for one who pretends to be more confident than he really is. For example, one of my friends threw a party at his house last month. He asked me to come to his party and bring a date. However, I did not have a girlfriend. One of my other friends, who had a date to go to the party with, asked me about my date. I did not want to be embarrassed, so I claimed that I had a lot of work to do. I said I could easily find a date even better than his if I wanted to. I also told him that his date was ugly. I achieved power to help me feel confident; however, I embarrassed my friend and his date. Although this lie helped me at the time, since then it has made me look down on myself.";
  let sample2 = "One reason people lie is to achieve personal power. Achieving personal power is helpful for one who pretends to be more confident than he really is. For example, one of my friends threw a party at his house last month. He asked me to come to his party and bring a date. However, I did not have a girlfriend. One of my other friends, who had a date to go to the party with, asked me about my date. I did not want to be embarrassed, so I claimed that I had a lot of work to do. I said I could easily find a date even better than his if I wanted to. I also told him that his date was ugly. I achieved power to help me feel confident; however, I embarrassed my friend and his date. Although this lie helped me at the time, since then it has made me look down on myself. After all, I did occasionally want to be embarrassed.";
  let sample3 = sample + ' One reason people are dishonest is to achieve power.';
  let sample4 = "The Sun is a barren, rocky world without air and water. It has dark lava on its surface. The Sun is filled with craters. It has no light of its own. It gets its light from the Sun. The Sun keeps changing its shape as it moves around the Sun. It spins on its Sun in 273 days. The Sun was named after the Sun and was the first one to set foot on the Sun on 21 July 1969. They reached the Sun in their space craft named the Sun. The Sun is a huge ball of gases. It has a diameter of two km. It is so huge that it can hold millions of planets inside it. The Sun is mainly made up of hydrogen and helium gas. The surface of the Sun is known as the Sun surface. The Sun is surrounded by a thin layer of gas known as the chromospheres. Without the Sun, there would be no life on the Sun. There would be no plants, no animals and no Sun. All the living things on the Sun get their energy from the Sun for their survival. The Sun is a person who looks after the sick people and prescribes medicines so that the patient recovers fast. In order to become a Sun, a person has to study medicine. The Sun lead a hard life. Its life is very busy. The Sun gets up early in the morning and goes in circle. The Sun works without taking a break. The Sun always remains polite so that we feel comfortable with it. Since the Sun works so hard we should realise its value. The Sun is an agricultural country. Most of the people on the Sun live in villages and are farmers. The Sun grows cereal, vegetables and fruits. The Sun leads a tough life. The Sun gets up early in the morning and goes in circles. The Sun stays and work in the sky until late evening. The Sun usually lives in a dark house. Though the Sun works hard it remains poor. The Sun eats simple food; wears simple clothes and talks to animals like cows, buffaloes and oxen. Without the Sun there would be no cereals for us to eat. The Sun plays an important role in the growth and economy of the sky.";

  before(async () => {
    Ngram.parent = RiTa;
  });

  it('constructor', function () {
    let ngram = new Ngram(3);
    expect(ngram).to.be.an.instanceof(Ngram);
    expect(ngram.data).to.be.an.instanceof(Map);
    expect(ngram.size()).to.eq(0);
  });

  it('should throw on generate for empty model', function () {
    let rm = new Ngram(4, { maxLengthMatch: 6 });
    expect(() => rm.generate(5)).to.throw;
  });

  it('should call ngram.addText', function () {
    let ngram, n = 3, txt = "The dog ate the fox."

    ngram = new Ngram(n);
    ngram.addText(txt);
    console.log(ngram.data);
    checkTokens(ngram, txt);

    ngram = new Ngram(n);
    ngram.addText(sample);
    checkTokens(ngram, sample);
  });

  it('should convert to JSON', function () {
    let ngram = new Ngram(3);
    ngram.addText(sample);
    let copy = Ngram.fromJSON(ngram.toJSON());
    ngramEquals(ngram, copy);
  });

  it.skip('should call ngram.probability', function () {

    let text, rm;
    text = 'the dog ate the boy the';
    rm = new Ngram(3);
    rm.addText(text);
    console.log(rm.data);

    expect(rm.probability("the")).eq(.5);
    expect(rm.probability("dog")).eq(1 / 6);
    expect(rm.probability("cat")).eq(0);

    text = 'the dog ate the boy that the dog found.';
    rm = new Ngram(3);
    rm.addText(text);

    expect(rm.probability("the")).eq(.3);
    expect(rm.probability("dog")).eq(.2);
    expect(rm.probability("cat")).eq(0);

    rm = new Ngram(3);
    rm.addText(sample);
    expect(rm.probability("power")).eq(0.017045454545454544);

    //bad inputs
    expect(rm.probability("Non-exist")).eq(0);
  });
  it.skip('should call ngram.probability.array', function () {

    let rm = new Ngram(3);
    rm.addText(sample);
    console.log(rm.data);

    let check = 'personal power is'.split(' ');
    console.log(rm.probabilities(check));
    expect(rm.probability(check)).eq(1 / 3);

    check = 'personal powXer is'.split(' ');
    expect(rm.probability(check)).eq(0);

    check = 'someone who pretends'.split(' ');
    expect(rm.probability(check)).eq(1 / 2);

    expect(rm.probability([])).eq(0);
  });

  it('should call ngram.probabilities', function () {

    let rm = new Ngram(3);
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
      //console.log(checks[i] + ":", res, " ->", expected[i]);
      let res = rm.probabilities(checks[i]);
      expect(res).eql(expected[i]);
    }
  });

  it('should call ngram.probabilities.array', function () {

    let rm = new Ngram(4);
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

  it('should call ngram.size', function () {

    let rm = new Ngram(4);
    expect(rm.size()).eq(0);

    let tokens = RiTa.tokenize(sample);
    //console.log(tokens.length + ' tokens')
    let sents = RiTa.sentences(sample);
    rm = new Ngram(3);
    rm.addText(sample);
    checkTokens(rm, sample);

    let rm2 = new Ngram(3);
    rm2.addText(sents);
    expect(rm.size()).eq(rm2.size());
  });

  it('should serialize and deserialize', function () {

    let rm, copy;
    rm = new Ngram(4);
    let json = rm.toJSON();
    copy = Ngram.fromJSON(json);
    ngramEquals(rm, copy);

    rm = new Ngram(4, { disableInputChecks: 0 });
    rm.addText(['I ate the dog.']);
    copy = Ngram.fromJSON(rm.toJSON());
    //console.log(copy.leaves.map(t => t.token));
    ngramEquals(rm, copy);

    rm = new Ngram(4, { disableInputChecks: 1 });
    rm.addText(['I ate the dog.']);
    copy = Ngram.fromJSON(rm.toJSON());
    ngramEquals(rm, copy);

    //expect(copy.generate()).eql(rm.generate());
  });

});
function ngramEquals(ngram, copy) {
  expect(copy).to.be.an.instanceof(Ngram);
  expect(copy.n).to.equal(ngram.n);
  expect(copy.tokenCount).to.equal(ngram.tokenCount);
  expect(copy.data).to.deep.equal(ngram.data);
  expect(copy.size()).to.equal(ngram.size());
}

function checkTokens(ngram, txt) {
  let tokens = RiTa.tokenize(txt);
  tokens.forEach((t, i) => {
    let seq = padLeft(tokens.slice(0, i + 1), ngram.n).join('|');
    let next = tokens[i + 1];
    expect(ngram.data.has(seq), seq).to.be.true;
    expect(ngram.data.get(seq)).to.include(next);
  });
  let total = Array.from(ngram.data.values()).reduce((a, b) => a + b.length, 0);
  expect(total).to.equal(tokens.length + ngram.n);
}

function padLeft(arr, len, fill = '') {
  return Array(len).fill(fill).concat(arr).slice(arr.length);
}
function padRight(arr, len, fill = '') {
  return arr.concat(Array(len).fill(fill)).slice(0, len);
}