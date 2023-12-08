import Stemmer from './stemmer.js';
import Tokenizer from './tokenizer.js';
import Conjugator from './conjugator.js';
import Lexicon from './lexicon.js';
import Tagger from './tagger.js';
import Inflector from './inflector.js';
import Analyzer from './analyzer.js';
import Concorder from './concorder.js';
import RandGen from './randgen.js';
import RiMarkov from './markov.js';
import { RiScript } from 'riscript';

/** @module rita */

const { Grammar: RiGrammar } = RiScript;


/**
 * @class RiTa
 * @memberof module:rita  
 */
class RiTa {

  /**
   * Create a RiTa grammar instance
   * @param {object} rules 
   * @param {object} context 
   * @returns {RiGrammar}
   */
  static grammar(rules, context) {
    return new RiGrammar(...arguments);
  }

  /**
   * Add a transform function to the RiScript parser
   * @param {string} name - the name of the transform
   * @param {function} definition - the transform function
   */
  static addTransform(name, definition) {
    RiTa.riscript.addTransform(...arguments);
  }

  /**
   * Remove a transform function from the RiScript parser
   * @param {string} name - the name of the transform to remove
   */
  static removeTransform(name) {
    RiTa.riscript.removeTransform(...arguments);
  }

  /**
   * Returns the names of all current transform functions
   * @returns {string[]} the names of all transforms
   */
  static getTransforms() {
    return RiTa.riscript.getTransforms();
  }

  /**
   * Adds the appropriate article ('a' or 'an') to the word, according to its phonemes (useful as a transform function)
   * @param {string} word - the word to transform
   * @returns the word with an article, e.g., 'honor' -> 'an honor'
   */
  static articlize(word) {
    return RiScript.articlize(...arguments);
  }

  /**
   * Evaluates the input script via the RiScript parser
   * @param {string} script - the script to evaluate
   * @param {object} context - the context to evaluate the script in
   * @param {object} [options] - options for the evaluation
   * @param {boolean} options.trace - whether to trace the evaluation
   * @returns {string} the result of the evaluation
   */
  static evaluate(script, context, options) {
    return RiTa.riscript.evaluate(...arguments);
  }

  /**
   * Creates a new RiMarkov object
   * @param {number} n - an int representing the n-factor of the markov chain 
   * @param {object} [options] - options for the markov chain
   * @returns {RiMarkov}
   */
  static markov(n, options) {
    return new RiMarkov(...arguments);
  }

  /**
   * Return a list of occurrences of the key word in the Key-Word-In-Context (KWIC) model.
   * @overload
   * @param {string} keyword 
   * @param {object} [options]  
   * @param {number} options.numWords - the number of words to include in the context
   * @param {string} options.text - the text as input for the KWIC model
   * @param {string[]} options.words - the array of words to be used as input for the KWIC model
   * @overload
   * @param {string} keyword
   * @param {number} text - the number of words to include in the context
   * @returns {string[]} all the occurrences of the keyword in the model, each with no more 
   * than 'numWords' words of context on either side
   */
  static kwic(keyword, options) {
    return RiTa.concorder.kwic(keyword, options);
  }

  /**
   * Creates a concordance, a list of words with their frequency of occurence, from the given text and options.
   * @param {string} text - the text from which to create the concordance
   * @param {object} [options] - options for the concordance
   * @param {boolean} options.ignoreCase=false - whether to ignore case when creating the concordance
   * @param {boolean} options.ignoreStopWords=false - whether to ignore stop words like
   *  'the', 'and', 'a', 'of', etc, as specified in RiTa.STOP_WORDS
   * @param {boolean} options.ignorePunctuation=false - whether to ignore punctuation when creating the concordance
   * @param {string[]} options.wordsToIgnore=null - words to ignore when creating the concordance (alternate stop-words)
   * @returns {object} the concordance, an object with words as keys and frequencies as values
   */
  static concordance(text, options) {
    return RiTa.concorder.concordance(text, options);
  }

  /**
   * Returns a random ordering of the input array or a random ordering of integers from 1 to k
   * @overload
   * @param {object[]} array - the array to shuffle
   * @returns {object[]} the input array in a random order
   * @overload
   * @param {number} k - the number of integers to return
   * @returns {number[]} an array of arrays of integers from 1 to k in random order 
   */
  static randomOrdering(arrayOrInt) {
    return RiTa.randomizer.randomOrdering(arrayOrInt);
  }

  /**
   * Sets the seed for the RiTa random number generator
   * @param {number} seed - the seed to set 
   */
  static randomSeed(seed) {
    RiTa.randomizer.seed(seed);
  }

  /**
   * Returns true if the sentence is a question, else false
   * @param {string} sentence 
   * @returns {boolean} - true if the sentence is a question, else false
   */
  static isQuestion(sentence) {
    return RiTa.QUESTIONS.includes
      (RiTa.tokenize(sentence)[0].toLowerCase());
  }

  /**
   * Returns true if the character is a vowel, else false
   * @param {string} char 
   * @returns {boolean} - true if the character is a vowel, else false
   */
  static isVowel(char) { // remove?
    return char && char.length === 1 && RiTa.VOWELS.includes(char);
  }

  /**
   * Returns true if the character is a consonant, else false
   * @param {string} char 
   * @returns {boolean} - true if the character is a consonant, else false
   */
  static isConsonant(char) {
    return (char && char.length === 1 && !RiTa.VOWELS.includes(char)
      && IS_LETTER.test(char));
  }

  /**
   * Capitalizes the first letter of the input string, leaving others unchanged
   * @param {string} string - the string to capitalize
   * @returns {string} the capitalized string
   */
  static capitalize(string) {
    return string ? string[0].toUpperCase() + string.substring(1) : '';
  }

  /**
   * Return a random word from the lexicon matching the specified criteria 
   * (length, syllable-count, phonemic pattern, stress pattern, part-of-speech, etc.).
   * @param {(string|RegExp)} [pattern] - the pattern to match
   * @param {object} [options] 
   * @param {number} options.minLength=4 - the minimum length of the word
   * @param {number} options.maxLength=-1 - the maximum length of the word
   * @param {number} options.numSyllables=null - the number of syllables in the word 
   * @param {number} options.limit=10 - the maximum number of results to retur   
   * @param {string} options.pos=null - the part-of-speech of the word to return,
   *  either from the Penn tag set or the simplified tag set [a, r, v, n]
   * @param {RegExp} options.pattern=null - the spelling or phonemic pattern to match
   * @param {string} options.type=null - the type of regex or string pattern to match, 
   * options are 'stresses' or 'phones' or 'letters' (the default)
   * @returns {string} a random word matching the criteria in the options object 
   */
  static randomWord(pattern, options) {
    return RiTa.lexicon.randomWord(pattern, options);
  }

  /**
   * 
   * @param {*} word 
   * @param {object} [options]
   * @returns 
   */
  static async rhymes(word, options) {
    return await RiTa.lexicon.rhymes(...arguments);
  }

  /**
   * 
   * @param {*} word1 
   * @param {*} word2 
   * @returns 
   */
  static isRhyme(word1, word2) {
    return RiTa.lexicon.isRhyme(...arguments);
  }


  /**
   * 
   * @param {*} word 
   * @param {object} [options]
   * @returns 
   */
  static async alliterations(word, options) {
    return await RiTa.lexicon.alliterations(...arguments);
  }

  /**
   * 
   * @param {*} word 
   * @returns 
   */
  static hasWord(word) {
    return RiTa.lexicon.hasWord(...arguments);
  }

  /**
   * 
   * @param {*} input 
   * @param {*} param1 
   * @returns 
   */
  static isAbbrev(input, { caseSensitive = false } = {}) {
    if (typeof input === 'string') {
      if (caseSensitive) return RiTa.ABRV.includes(input.trim());
      let check = input.trim().toLowerCase();
      return RiTa.ABRV.some(a => a.toLowerCase() === check);
    }
  }

  /**
   * 
   * @param {*} word1 
   * @param {*} word2 
   * @returns 
   */
  static isAlliteration(word1, word2) {
    return RiTa.lexicon.isAlliteration(...arguments);
  }

  /**
   * Compares the letters of the input word (using a version of the Levenstein min-edit distance algorithm) 
   * to each word in the lexicon, returning the set of closest matches that also match the criteria in the options object.
   * @param {(string|RegExp)} pattern - the spelling pattern to match
   * @param {object} [options] - options for the search
   * @param {number} options.minLength=4 - the minimum length of the words
   * @param {number} options.maxLength - the maximum length of the words
   * @param {number} options.numSyllables - the number of syllables in the words 
   * @param {number} options.limit=10 - the maximum number of results to return  (pass -1 to return all matches) 
   * @param {boolean} options.shuffle=false - whether to shuffle the results before returning them
   * @param {string} options.pos - the part-of-speech of the words to return, either from the Penn tag set or the simplified tag set [a, r, v, n]
   * @returns {Promise<string[]>} an array of words matching the spelling pattern and criteria in the options object 
   */
  static async spellsLike(word, options) {
    return await RiTa.lexicon.spellsLike(...arguments);
  }

  /**
   * Compares the phonemes of the input pattern (using a version of the Levenstein min-edit distance algorithm)
   *  to each word in the lexicon, returning the set of closest matches that also match the criteria in the options object.
   * @param {(string|RegExp)} pattern - the phonemic pattern to match
   * @param {object} [options] - options for the search
   * @param {number} options.minLength=4 - the minimum length of the words
   * @param {number} options.maxLength - the maximum length of the words
   * @param {number} options.numSyllables - the number of syllables in the words 
   * @param {number} options.limit=10 - the maximum number of results to return (pass -1 to return all matches)
   * @param {boolean} options.shuffle=false - whether to shuffle the results before returning them
   * @param {string} options.pos - the part-of-speech of the words to return, either from the Penn tag set
   *  or the simplified tag set [a, r, v, n]
   * @returns {Promise<string[]>} an array of words matching the phonemic pattern and criteria in the options object 
   */
  static async soundsLike(word, options) {
    return await RiTa.lexicon.soundsLike(...arguments);
  }

  /**
   * 
   * @param {*} word 
   * @param {object} [options]
   * @returns 
   */
  static pos(word, options) {
    return RiTa.tagger.tag(word, options);
  }

  /**
   * 
   * @param {*} word 
   * @returns 
   */
  static isNoun(word) {
    return RiTa.tagger.isNoun(word);
  }

  /**
   * 
   * @param {*} word 
   * @returns 
   */
  static isAdjective(word) {
    return RiTa.tagger.isAdjective(word);
  }

  /**
   * 
   * @param {*} word 
   * @returns 
   */
  static isAdverb(word) {
    return RiTa.tagger.isAdverb(word);
  }

  /**
   * 
   * @param {*} text 
   * @returns 
   */
  static isPunct(text) {
    return text && text.length && ONLY_PUNCT.test(text);
  }

  /**
   * 
   * @param {*} word 
   * @returns 
   */
  static isVerb(word) {
    return RiTa.tagger.isVerb(word);
  }

  /**
   * Tags the input string with part-of-speech tags
   * @param {string} sentence - the sentence to tag
   * @param {object} [options] - options for the tagging
   * @param {boolean} options.simple=false - use the simplified tag set [a, r, v, n]
   * @param {boolean} options.inline=true - return the tags inline with the words
   * @returns {string} the tagged sentence
   */
  static posInline(sentence, options = {
    inline: true,
    simple: false
  }) {
    return RiTa.tagger.tag(sentence, options);
  }


  /**
   * Return the singular form of the input word
   * @param {string} word - the word to singularize
   * @returns {string} the singular form of the input word
   */
  static singularize(word) {
    return RiTa.inflector.singularize(...arguments);
  }

  /**
   * Return the plural form of the input word
   * @param {string} word - the word to pluralize
   * @returns {string} the plural form of the input word
   */
  static pluralize(word) {
    return RiTa.inflector.pluralize(...arguments);
  }

  /**
   * Searches for words in the lexicon matching the given criteria, either by length, syllable-count, 
   * spelling, phonemes, stresses, part-of-speech, etc. If no regex or options are supplied, the full set of words is returned.
   * @param {(string|RegExp)} [pattern] - the pattern to match
   * @param {object} [options] - options for the search
   * @param {number} options.minLength=4 - the minimum length of the words
   * @param {number} options.maxLength - the maximum length of the words
   * @param {number} options.numSyllables - the number of syllables in the words 
   * @param {number} options.limit=10 - the maximum number of results to return (pass -1 to return all matches)
   * @param {boolean} options.shuffle=false - whether to shuffle the results before returning them
   * @param {string} options.pos - the part-of-speech of the words to return, either from the Penn tag set
   *  or the simplified tag set [a, r, v, n]
   * @param {string} options.type - the type of regex or string pattern to match, options are 'stresses'
   *  or 'phones' or 'letters' (the default)
   * @returns {Promise<string[]>} an array of words matching the criteria in both the pattern and the options object 
   */
  static async search(pattern, options) {
    return await RiTa.lexicon.search(...arguments);
  }

  /**
    * Returns an array containing all unique alphabetical words (tokens) in the text.
    * Punctuation and case are ignored unless specified otherwise.
    * @param {string} text - The text from which to extract the tokens
    * @param {object} [options] - The options
    * @param {boolean} options.caseSensitive=false - Whether to pay attention to case
    * @param {boolean} options.ignoreStopWords=false - Whether to ignore words such as 'the', 'and', 'a', 'of', etc,
    *  as specified in RiTa.STOP_WORDS
    * @param {boolean} options.splitContractions=false - Whether to convert contractions
    *  (e.g., "I'd" or "she'll") into multiple individual tokens
    * @param {boolean} options.includePunct=false - Whether to include punctuation in the results
    * @param {boolean} options.sort=false - Whether to sort the tokens before returning them
    * @returns {string[]} Array of tokens
    */
  static tokens(text, options = {
    caseSensitive: false,
    ignoreStopWords: false,
    splitContractions: false,
    includePunct: false,
    sort: false
  }) {
    return RiTa.tokenizer.tokens(text, options);
  }


  /**
   * Tokenizes an input string into words, according to the Penn Treebank conventions
   * @param {string} input - The text to tokenize
   * @param {object} [options] - The options
   * @param {RegExp} options.regex=null - An optional custom regex to split on
   * @param {boolean} options.splitHyphens=false - Whether to split hyphenated words 
   * (e.g., "mother-in-law") into multiple individual tokens
   * @param {boolean} options.splitContractions=false - Whether to split contractions 
   * (e.g., "I'd" or "she'll") into multiple individual tokens
   * @returns {string[]} Array of tokens
   */
  static tokenize(string, options) {
    return RiTa.tokenizer.tokenize(...arguments);
  }

  /**
   * 
   * @param {*} stringArray 
   * @param {*} delim 
   * @returns 
   */
  static untokenize(stringArray, delim) {
    return RiTa.tokenizer.untokenize(...arguments);
  }

  /**
   * Split the input text into sentences according to the options
   * @param {string} text - The text to split
   * @param {RegExp} [regex] - An optional custom regex to split on
   * @returns {string[]} An array of sentences
   */
  static sentences(text, regex) {
    return RiTa.tokenizer.sentences(text, regex);
  }

  /**
   * 
   * @param {*} word 
   * @returns 
   */
  static isStopWord(word) {
    return RiTa.STOP_WORDS.includes(word.toLowerCase());
  }

  /**
   * 
   * @param {*} string 
   * @returns 
   */
  static stem(string) {
    return Stemmer.stem(...arguments);
  }

  /**
   * 
   * @param {*} verbWord 
   * @returns 
   */
  static presentPart(verbWord) {
    return RiTa.conjugator.presentPart(...arguments);
  }

  /**
   * 
   * @param {*} verbWord 
   * @returns 
   */
  static pastPart(verbWord) {
    return RiTa.conjugator.pastPart(...arguments);
  }

  /**
   * 
   * @param {*} verbWord 
   * @param {object} [options]
   * @returns 
   */
  static conjugate(verbWord, options) {
    return RiTa.conjugator.conjugate(...arguments);
  }

  /**
   * 
   * @param {*} string 
   * @returns 
   */
  static stresses(string) {
    return RiTa.analyzer.analyze(...arguments).stresses;
  }

  /**
   * 
   * @param {*} string 
   * @returns 
   */
  static syllables(string) {
    return RiTa.analyzer.analyze(...arguments).syllables;
  }

  /**
   * 
   * @param {*} string 
   * @returns 
   */
  static phones(string) {
    return RiTa.analyzer.analyze(...arguments).phones;
  }

  /**
   * 
   * @param {*} string 
   * @returns 
   */
  static analyze(string) {
    return RiTa.analyzer.analyze(...arguments);
  }

  ////////////////////////////// lex-sync ////////////////////////////

  /**
   * 
   * @param {*} word 
   * @param {object} [options]
   * @returns 
   */
  static spellsLikeSync(word, options) {
    return RiTa.lexicon.spellsLikeSync(...arguments);
  }

  /**
   * 
   * @param {*} word 
   * @param {object} [options]
   * @returns 
   */
  static soundsLikeSync(word, options) {
    return RiTa.lexicon.soundsLikeSync(...arguments);
  }

  /**
   * 
   * @param {*} word 
   * @param {object} [options]
   * @returns 
   */
  static rhymesSync(word, options) {
    return RiTa.lexicon.rhymesSync(...arguments);
  }

  // TODO: all need tests

  /**
   * 
   * @param {*} word 
   * @param {object} [options]
   * @returns 
   */
  static searchSync(word, options) {
    return RiTa.lexicon.rhymesSync(...arguments);
  }

  /**
   * 
   * @param {*} word 
   * @param {object} [options]
   * @returns 
   */
  static alliterationsSync(word, options) {
    return RiTa.lexicon.alliterationsSync(...arguments);
  }

  ////////////////////////////// niapa /////////////////////////////

  /**
   * 
   * @param {object} [options]
   * @returns 
   */
  static randi(options) {
    return Math.floor(RiTa.randomizer.random(...arguments));
  }

  /**
   * 
   * @param {object} [options]
   * @returns 
   */
  static random(options) {
    return RiTa.randomizer.random(...arguments);
  }
}



// CLASSES
RiTa.RiGrammar = RiGrammar;
RiTa.RiMarkov = RiMarkov;
RiTa.Stemmer = Stemmer;

// COMPONENTS
RiTa.randomizer = new RandGen();
RiTa.tagger = new Tagger(RiTa);
RiTa.analyzer = new Analyzer(RiTa);
RiTa.concorder = new Concorder(RiTa);
RiTa.tokenizer = new Tokenizer(RiTa);
RiTa.inflector = new Inflector(RiTa);
RiTa.lexicon = new Lexicon(RiTa);
RiTa.conjugator = new Conjugator(RiTa);

// BACKREFS
RiMarkov.parent = RiTa;
Stemmer.tokenizer = RiTa.tokenizer;

// MESSAGES
RiTa.SILENT = false;
RiTa.SILENCE_LTS = false;

// CONSTANTS
RiTa.VERSION = '[VI]{{inject}}[/VI]';
//RiTa.HAS_LEXICON = typeof __NOLEX__ === 'undefined';
RiTa.FIRST = 1;
RiTa.SECOND = 2;
RiTa.THIRD = 3;
RiTa.PAST = 4;
RiTa.PRESENT = 5;
RiTa.FUTURE = 6;
RiTa.SINGULAR = 7;
RiTa.PLURAL = 8;
RiTa.NORMAL = 9;
RiTa.STRESS = '1';
RiTa.NOSTRESS = '0';
RiTa.PHONE_BOUNDARY = '-';
RiTa.WORD_BOUNDARY = " ";
RiTa.SYLLABLE_BOUNDARY = "/";
RiTa.SENTENCE_BOUNDARY = "|";
RiTa.VOWELS = "aeiou";
// RiTa.MODAL_EXCEPTIONS = ["hardness", "shortness"];
RiTa.PHONES = ['aa', 'ae', 'ah', 'ao', 'aw', 'ay', 'b', 'ch', 'd', 'dh', 'eh', 'er', 'ey', 'f', 'g', 'hh', 'ih', 'iy', 'jh', 'k', 'l', 'm', 'n', 'ng', 'ow', 'oy', 'p', 'r', 's', 'sh', 't', 'th', 'uh', 'uw', 'v', 'w', 'y', 'z', 'zh'];
RiTa.ABRV = ["Adm.", "Capt.", "Cmdr.", "Col.", "Dr.", "Gen.", "Gov.", "Lt.", "Maj.", "Messrs.", "Mr.", "Mrs.", "Ms.", "Prof.", "Rep.", "Reps.", "Rev.", "Sen.", "Sens.", "Sgt.", "Sr.", "St.", "A.k.a.", "C.f.", "I.e.", "E.g.", "Vs.", "V.", "Jan.", "Feb.", "Mar.", "Apr.", "Mar.", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
RiTa.QUESTIONS = ["was", "what", "when", "where", "which", "why", "who", "will", "would", "who", "how", "if", "is", "could", "might", "does", "are", "have"];
RiTa.STOP_WORDS = ["and", "a", "of", "in", "i", "you", "is", "to", "that", "it", "for", "on", "have", "with", "this", "be", "not", "are", "as", "was", "but", "or", "from", "my", "at", "if", "they", "your", "all", "he", "by", "one", "me", "what", "so", "can", "will", "do", "an", "about", "we", "just", "would", "there", "no", "like", "out", "his", "has", "up", "more", "who", "when", "don't", "some", "had", "them", "any", "their", "it's", "only", "which", "i'm", "been", "other", "were", "how", "then", "now", "her", "than", "she", "well", "also", "us", "very", "because", "am", "here", "could", "even", "him", "into", "our", "much", "too", "did", "should", "over", "want", "these", "may", "where", "most", "many", "those", "does", "why", "please", "off", "going", "its", "i've", "down", "that's", "can't", "you're", "didn't", "another", "around", "must", "few", "doesn't", "the", "every", "yes", "each", "maybe", "i'll", "away", "doing", "oh", "else", "isn't", "he's", "there's", "hi", "won't", "ok", "they're", "yeah", "mine", "we're", "what's", "shall", "she's", "hello", "okay", "here's", "less", "didn't", "said", "over", "this", "that", "just", "then", "under", "some"];
RiTa.MASS_NOUNS = ["abalone", "asbestos", "barracks", "bathos", "breeches", "beef", "britches", "chaos", "chinese", "cognoscenti", "clippers", "corps", "cosmos", "crossroads", "diabetes", "ethos", "gallows", "graffiti", "herpes", "innings", "lens", "means", "measles", "mews", "mumps", "news", "pasta", "pathos", "pincers", "pliers", "proceedings", "rabies", "rhinoceros", "sassafras", "scissors", "series", "shears", "species", "tuna", "acoustics", "aesthetics", "aquatics", "basics", "ceramics", "classics", "cosmetics", "dialectics", "deer", "dynamics", "ethics", "harmonics", "heroics", "mechanics", "metrics", "ooze", "optics", "physics", "polemics", "pyrotechnics", "statistics", "tactics", "tropics", "bengalese", "bengali", "bonsai", "booze", "cellulose", "mess", "moose", "burmese", "chinese", "colossus", "congolese", "discus", "electrolysis", "emphasis", "expertise", "flu", "fructose", "gauze", "glucose", "grease", "guyanese", "haze", "incense", "japanese", "lebanese", "malaise", "mayonnaise", "maltese", "music", "money", "menopause", "merchandise", "olympics", "overuse", "paradise", "poise", "potash", "portuguese", "prose", "recompense", "remorse", "repose", "senegalese", "siamese", "singhalese", "sleaze", "sioux", "sudanese", "suspense", "swiss", "taiwanese", "vietnamese", "unease", "aircraft", "anise", "antifreeze", "applause", "archdiocese", "apparatus", "asparagus", "bellows", "bison", "bluefish", "bourgeois", "bream", "brill", "butterfingers", "cargo", "carp", "catfish", "chassis", "clone", "clones", "clothes", "chub", "cod", "codfish", "coley", "contretemps", "crawfish", "crayfish", "cuttlefish", "dice", "dogfish", "doings", "dory", "downstairs", "eldest", "earnings", "economics", "electronics", "firstborn", "fish", "flatfish", "flounder", "fowl", "fry", "fries", "works", "goldfish", "golf", "grand", "grief", "haddock", "hake", "halibut", "headquarters", "herring", "hertz", "honey", "horsepower", "goods", "hovercraft", "ironworks", "kilohertz", "ling", "shrimp", "swine", "lungfish", "mackerel", "macaroni", "megahertz", "moorfowl", "moorgame", "mullet", "nepalese", "offspring", "pants", "patois", "pekinese", "perch", "pickerel", "pike", "potpourri", "precis", "quid", "rand", "rendezvous", "roach", "salmon", "samurai", "seychelles", "shad", "sheep", "shellfish", "smelt", "spaghetti", "spacecraft", "starfish", "stockfish", "sunfish", "superficies", "sweepstakes", "smallpox", "swordfish", "tennis", "tobacco", "triceps", "trout", "tunafish", "turbot", "trousers", "turf", "dibs", "undersigned", "waterfowl", "waterworks", "waxworks", "wildfowl", "woodworm", "yen", "aries", "pisces", "forceps", "jeans", "mathematics", "odds", "politics", "remains", "aids", "wildlife", "shall", "would", "may", "might", "ought", "should", "acne", "admiration", "advice", "air", "anger", "anticipation", "assistance", "awareness", "bacon", "baggage", "blood", "bravery", "chess", "clay", "clothing", "coal", "compliance", "comprehension", "confusion", "consciousness", "cream", "darkness", "diligence", "dust", "education", "empathy", "enthusiasm", "envy", "equality", "equipment", "evidence", "feedback", "fitness", "flattery", "foliage", "fun", "furniture", "garbage", "gold", "gossip", "grammar", "gratitude", "gravel", "guilt", "happiness", "hardware", "hate", "hay", "health", "heat", "help", "hesitation", "homework", "honesty", "honor", "honour", "hospitality", "hostility", "humanity", "humility", "ice", "immortality", "independence", "information", "integrity", "intimidation", "jargon", "jealousy", "jewelry", "justice", "knowledge", "literacy", "logic", "luck", "lumber", "luggage", "mail", "management", "milk", "morale", "mud", "nonsense", "oppression", "optimism", "oxygen", "participation", "pay", "peace", "perseverance", "pessimism", "pneumonia", "poetry", "police", "pride", "privacy", "propaganda", "public", "punctuation", "recovery", "rice", "rust", "satisfaction", "schnapps", "shame", "slang", "software", "stamina", "starvation", "steam", "steel", "stuff", "support", "sweat", "thunder", "timber", "toil", "traffic", "tongs", "training", "trash", "valor", "vehemence", "violence", "warmth", "waste", "weather", "wheat", "wisdom", "work", "accommodation", "advertising", "aid", "art", "bread", "business", "butter", "calm", "cash", "cheese", "childhood", "clothing ", "coffee", "content", "corruption", "courage", "currency", "damage", "danger"/*, "data"*/, "determination", "electricity", "employment", "energy", "entertainment", "failure", "fame", "fire", "flour", "food", "freedom", "friendship", "fuel", "genetics", "hair", "harm", "hospitality ", "housework", "humour", "imagination", "importance", "innocence", "intelligence", "juice", "kindness", "labour", "lack", "laughter", "leisure", "literature", "litter", "love", "magic", "metal", "motherhood", "motivation", "nature", "nutrition", "obesity", "oil", "old age", "paper", "patience", "permission", "pollution", "poverty", "power", "production", "progress", "pronunciation", "publicity", "quality", "quantity", "racism", "rain", "relaxation", "research", "respect", "room (space)", "rubbish", "safety", "salt", "sand", "seafood", "shopping", "silence", "smoke", "snow", "soup", "speed", "spelling", "stress ", "sugar", "sunshine", "tea", "time", "tolerance", "trade", "transportation", "travel", "trust", "understanding", "unemployment", "usage", "vision", "water", "wealth", "weight", "welfare", "width", "wood", "yoga", "youth", "homecare", "childcare", "fanfare", "healthcare", "medicare"];

RiTa.INFINITIVE = 1;
RiTa.GERUND = 2;

// For tokenization, Can't -> Can not, etc.
RiTa.SPLIT_CONTRACTIONS = false;

const ONLY_PUNCT = /^[\p{P}|\+|-|<|>|\^|\$|\ufffd|`]*$/u;
const IS_LETTER = /^[a-z\u00C0-\u00ff]+$/;

RiTa.RiScript = RiScript;
RiScript.RiTa = RiTa;

RiTa.riscript = new RiScript({ RiTa });

export { RiTa };
