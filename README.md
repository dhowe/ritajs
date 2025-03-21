<!--![ritajs](pen.jpg)-->


<a href="https://github.com/dhowe/rjs3/actions"><img src="https://github.com/dhowe/rjs3/actions/workflows/node.js.yml/badge.svg" alt="ci tests"></a> <a href="https://www.npmjs.com/package/rita"><img src="https://img.shields.io/npm/v/rita.svg" alt="npm version"></a> <a href="https://www.gnu.org/licenses/gpl-3.0.en.html"><img src="https://img.shields.io/badge/license-GPL-orange.svg" alt="license"></a>


## RiTa: tools for computational writing

RiTa is implemented in JavaScript and Java, with a common [API](https://github.com/dhowe/rita4j/blob/master/README.md#api) for both, and is free/libre/open-source.

### Features in v3.0

* Smart lexicon search for words matching part-of-speech, syllable, stress and rhyme patterns
* Fast, heuristic algorithms for inflection, conjugation, stemming, tokenization, and more
* Letter-to-sound engine for feature analysis of arbitrary words (with/without lexicon)
* Integration of the [RiScript](https://observablehq.com/@dhowe/riscript) scripting language, designed for writers, now built with the blazing fast [Chevrotain](https://chevrotain.io/) parser
* New options for generation via grammars and Markov chains
* Published in ESM, CommonJS and as an IIFE

Note: version 3.0 contains breaking changes -- please check the [release notes](https://rednoise.org/rita/#whats-new)

### Installation

* For [esm](#an-esm-browser-sketch): ```import { RiTa } from "https://esm.sh/rita";```
* For [node](#with-nodejs-and-npm): `$ npm install rita`  
   ```let { RiTa }  = require('rita');```
* For [browsers](#a-simple-browser-sketch): ```<script src="https://cdn.jsdelivr.net/npm/rita"></script>```
* For [p5.js](#with-p5js): ```<script src="https://cdn.jsdelivr.net/npm/rita"></script>```
* For [developers](#developing)


### Example

```javascript
import { RiTa } from "https://esm.sh/rita";

// to analyze a sentence
let data = RiTa.analyze("The elephant took a bite!");
console.log(data);

// to load a grammar
let grammar = RiTa.grammar(rulesObjectOrJSON);
console.log(grammar.expand());
```

## API

  <table cellspacing="0" cellpadding="0" style="vertical-align: top;">
   <tr>
    <th colspan=2 style="vertical-align: top;text-align: left; padding-left: 12px">RiTa
    </th>
    <th colspan=1 style="vertical-align: top;text-align: left;">RiMarkov</th>
    <th colspan=1 style="vertical-align: top;text-align: left;">RiGrammar</th>
   </tr>
   <tr>
    <td style="vertical-align: top; padding-top: 15px">
      <a href="https://rednoise.org/rita/reference/RiTa/addTransform/index.html">RiTa.addTransform()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/alliterations/index.html">RiTa.alliterations()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/analyze/index.html">RiTa.analyze()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/concordance/index.html">RiTa.concordance()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/conjugate/index.html">RiTa.conjugate()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/evaluate/index.html">RiTa.evaluate()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/grammar/index.html">RiTa.grammar()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/hasWord/index.html">RiTa.hasWord()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/isAbbrev/index.html">RiTa.isAbbrev()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/isAdjective/index.html">RiTa.isAdjective()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/isAdverb/index.html">RiTa.isAdverb()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/isAlliteration/index.html">RiTa.isAlliteration()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/isNoun/index.html">RiTa.isNoun()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/isPunct/index.html">RiTa.isPunct()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/isQuestion/index.html">RiTa.isQuestion()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/isStopWord/index.html">RiTa.isStopWord()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/isRhyme/index.html">RiTa.isRhyme()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/isVerb/index.html">RiTa.isVerb()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/kwic/index.html">RiTa.kwic()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/markov/index.html">RiTa.markov()</a><br/>
    </td>
    <td style="vertical-align: top; padding-top: 15px">
      <a href="https://rednoise.org/rita/reference/RiTa/pastPart/index.html">RiTa.pastPart()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/phones/index.html">RiTa.phones()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/pos/index.html">RiTa.pos()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/posInline/index.html">RiTa.posInline()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/presentPart/index.html">RiTa.presentPart()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/pluralize/index.html">RiTa.pluralize()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/randomOrdering/index.html">RiTa.randomOrdering()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/randomSeed/index.html">RiTa.randomSeed()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/randomWord/index.html">RiTa.randomWord()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/rhymes/index.html">RiTa.rhymes()</a><br/>
      <!--a href="./RiTa/scripting/index.html">RiTa.scripting()</a><br/-->
      <a href="https://rednoise.org/rita/reference/RiTa/search/index.html">RiTa.search()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/sentences/index.html">RiTa.sentences()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/singularize/index.html">RiTa.singularize()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/soundsLike/index.html">RiTa.soundsLike()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/spellsLike/index.html">RiTa.spellsLike()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/stem/index.html">RiTa.stem()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/stresses/index.html">RiTa.stresses()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/syllables/index.html">RiTa.syllables()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/tokenize/index.html">RiTa.tokenize()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiTa/untokenize/index.html">RiTa.untokenize()</a><br/>
      <!--a href="./RiTa/VERSION/index.html">RiTa.VERSION</a><br/-->
    </td>
    <td style="vertical-align: top !important; padding-top: 15px; min-width: 125px">
      <a href="https://rednoise.org/rita/reference/RiMarkov/addText/index.html">addText()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiMarkov/completions/index.html">completions()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiMarkov/generate/index.html">generate()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiMarkov/probability/index.html">probability()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiMarkov/probabilities/index.html">probabilities()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiMarkov/size/index.html">size()</a><br/>
<!--       <a href="https://rednoise.org/rita/reference/RiMarkov/toString/index.html">toString()</a><br/-->
      <a href="https://rednoise.org/rita/reference/RiMarkov/toJSON/index.html">toJSON()</a><br/> 
      <a href="https://rednoise.org/rita/reference/RiMarkov/fromJSON/index.html">fromJSON()</a><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </td>
    <td style="vertical-align: top !important; padding-top: 15px; min-width: 125px">
      <a href="https://rednoise.org/rita/reference/RiGrammar/addRule/index.html">addRule()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiGrammar/expand/index.html">expand()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiGrammar/removeRule/index.html">removeRule()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiGrammar/addRules/index.html">setRules()</a><br/>
      <a href="https://rednoise.org/rita/reference/RiGrammar/toJSON/index.html">toJSON()</a><br/>
<!--       <a href="https://rednoise.org/rita/reference/RiGrammar/toString/index.html">toString()</a><br/-->
      <a href="https://rednoise.org/rita/reference/RiGrammar/fromJSON/index.html">fromJSON()</a><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/> 
    </td>
 </tr>
</table>

## RiScript

[RiScript](https://github.com/dhowe/riscript) (the minor language that powers RiTa) was designed specifically for writers working with code. RiScript primitives (choices, symbols, gates, transforms, etc) can be used as part of any RiTa [grammar](https://rednoise.org/rita/reference/RiTa/grammar/) or executed directly using [RiTa.evaluate](https://rednoise.org/rita/reference/RiTa/evaluate/). For more info, see this interactive [notebook](https://observablehq.com/@dhowe/riscript) on observable.

<br>&nbsp;<br>

## Developing
To install/build the library and run tests (with npm/mocha and node v14.x):
```sh

$ git clone https://github.com/dhowe/ritajs.git
$ cd ritajs 
$ npm install
$ npm run build 
$ npm test

```
If all goes well, you should see a list of successful tests and find the library built in 'dist'

<br>

Please make contributions via [fork-and-pull](https://reflectoring.io/github-fork-and-pull/) - thanks!

---------------

&nbsp;

### Visual Studio Code

Once you have things running with npm/mocha/tsup, you might also try [VSCode](https://code.visualstudio.com/).

Here you can see the tests in the VSCode _Testing_ view

<img width="800" alt="vscode-tests" src="https://github.com/dhowe/ritajs/assets/737638/103665fb-3dc8-448b-9ed3-d706be6797fc">

&nbsp;

## About

* Author:   [Daniel C. Howe](http://rednoise.org/daniel)
* Web Site:          [https://rednoise.org/rita](http://rednoise.org/rita)
* Github Repo:       [https://github.com/dhowe/rita](https://github.com/dhowe/rita)
* Issues:       [https://github.com/dhowe/rita/issues](https://github.com/dhowe/rita/issues)
* Reference:    [https://rednoise.org/rita/reference](http://rednoise.org/rita/reference)
* RiScript:    [https://github.com/dhowe/riscript](https://github.com/dhowe/riscript)

&nbsp;

## Quick Start 

#### A simple browser sketch
 
Create a new file on your desktop called 'test.html' with the following lines, save and drag it into a browser:

```html
<html>
  <script src="https://cdn.jsdelivr.net/npm/rita"></script>
  <script>
    window.onload = function() {
      let words = RiTa.tokenize("The elephant took a bite!");
      document.getElementById("content").innerHTML = words;
    };
  </script>
  <div id="content" width=200 height=200></div>
<html>
```

#### An ESM browser sketch
 
Create a new file on your desktop called 'test.html' with the following lines, save and drag it into a browser:

```html
<html>
<body>
  <div id="content" width=200 height=200></div>
  <script type="module">
    import { RiTa } from "https://esm.sh/rita";
    let words = RiTa.tokenize("The elephant took a bite!");
    document.getElementById("content").innerHTML = words;
  </script>
</body>
<html>
```

#### With [p5.js](http://p5js.org/)
 
Create a new file on your desktop called 'test.html' with the following lines, save and drag it into a browser:

```html
<html>
  <script src="https://cdn.jsdelivr.net/npm/p5"></script>
  <script src="https://cdn.jsdelivr.net/npm/rita"></script>
  <script>
  function setup() {

    createCanvas(200,200);
    background(245);
    textAlign(CENTER);
    textSize(20);

    let words = RiTa.tokenize("The elephant took a bite!")
    for (let i=0; i < words.length; i++) {
        text(words[i], 100, 50 + i*20);
    }
  }
  </script>
</html>
```
If you already have a sketch, simply add `<script src="https://cdn.jsdelivr.net/npm/rita"></script>` to your index.html to include RiTa.


#### With [node.js](http://nodejs.org/) and [npm](https://www.npmjs.com/)
 
To install: `$ npm install rita`

```javascript
let RiTa = require('rita');
let data = RiTa.analyze("The elephant took a bite!");
console.log(data);
```

&nbsp;

## Contributors

### Code Contributors

This project exists only because of the people who contribute. Thank you!
<a href="https://github.com/dhowe/RiTa/graphs/contributors"><img src="https://opencollective.com/RiTa/contributors.svg?width=890&button=false" /></a>

### Financial Contributors
<a href="https://opencollective.com/rita/donate" target="_blank">
  <img src="https://opencollective.com/rita/contribute/button@2x.png?color=blue" width=300 />
</a>
