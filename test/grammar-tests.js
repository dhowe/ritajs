import { expect } from 'chai';

import { RiTa } from './index.js';

describe('Grammar', () => {

  const T = { trace: 1 };


  it('Should call RiTa.grammar.expand()', function () {
    const context = {
      lucy: {
        name: 'Lucy',
        pronoun: 'she',
        car: 'Acura'
      },
      sam: {
        name: 'Sam',
        pronoun: 'he',
        car: 'Subaru'
      }
    }
    const rules = {
      start: "Meet $person.name. $person.pronoun.cap() drives $person.car.art().",
      "#person": "$sam | $lucy"
    }
    let result = RiTa.grammar(rules, context).expand();
    expect(result).to.be.oneOf([
      'Meet Lucy. She drives an Acura.',
      'Meet Sam. He drives a Subaru.',
    ]);
  });

  /*LTR*/0 && it('Should reference context from transforms', function () {
    const context = {
      characters: [{
        name: 'Lucy',
        pronoun: 'she',
        car: 'Acura'
      },
      {
        name: 'Sam',
        pronoun: 'he',
        car: 'Subaru'
      }],
      chooseChar: function () {
        console.log('chooseChar:', typeof this);
        return "OK";//RiTa.random(this.context.characters);
      }
    }
    const rules = {
      start: "$person=$chooseChar() $sentence",
      sentence: "$Meet $person.name. $person.pronoun.cap() drives $person.car.art().",
      "#person": "$sam | $lucy"
    }
    let result = RiTa.grammar(rules, context).expand();
    expect(result).to.be.oneOf([
      'Meet Lucy. She drives an Acura.',
      'Meet Sam. He drives a Subaru.',
    ]);
  });
});
