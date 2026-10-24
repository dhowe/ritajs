<!--![ritajs](pen.jpg)


<a href="https://github.com/dhowe/rjs3/actions"><img src="https://github.com/dhowe/rjs3/actions/workflows/node.js.yml/badge.svg" alt="ci tests"></a> <a href="https://www.npmjs.com/package/rita"><img src="https://img.shields.io/npm/v/rita.svg" alt="npm version"></a> <a href="https://www.gnu.org/licenses/gpl-3.0.en.html"><img src="https://img.shields.io/badge/license-GPL-orange.svg" alt="license"></a> <img src="https://img.shields.io/badge/%E2%99%A8_ai--free-100%25-green" alt="100% ai-free">-->

#### This repo has been archived, see the main repo at https://github.com/dhowe/rita

<br> 
## RiTa: tools for computational writing

RiTa is implemented in JavaScript, Java and Python, with a common [API](https://rednoise.org/rita) for both, and is free/libre/open-source.

<!--
### Features

* A complete rewrite of the Markov generator, efficiently employing unbounded (infinite) N-grams
* Smart lexicon search for words matching part-of-speech, syllable, stress and rhyme patterns
* Fast, heuristic algorithms for inflection, conjugation, stemming, tokenization, and more
* Letter-to-sound engine for feature analysis of arbitrary words (with/without lexicon)
* Integration of the [RiScript](https://observablehq.com/@dhowe/riscript) scripting language, built with the blazing fast [Chevrotain](https://chevrotain.io/) parser
* New options for generation via grammars and Markov chains
* Published in ESM, CommonJS and as an IIFE

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

## RiScript

[RiScript](https://github.com/dhowe/riscript) (the minor language that powers RiTa) was designed specifically for writers working with code. RiScript primitives (choices, symbols, gates, transforms, etc) can be used as part of any RiTa [grammar](https://rednoise.org/rita/reference/RiTa/grammar/) or executed directly using [RiTa.evaluate](https://rednoise.org/rita/reference/RiTa/evaluate/). For more info, see this interactive [notebook](https://observablehq.com/@dhowe/riscript) on observable.

<br>

## Developing
To install/build the library and run tests (with npm/mocha and node v14.x):
```sh

$ git clone https://github.com/dhowe/rita4.git
$ cd js 
$ npm install
$ npm run build 
$ npm test

```
If all goes well, you should see a list of successful tests and find the library built in 'dist'

<br>

Please make contributions via [fork-and-pull](https://reflectoring.io/github-fork-and-pull/) - thanks!

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
let { RiTa } = require('rita');
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
-->
