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
const { Grammar: RiGrammar } = RiScript;

class RiTa {

  static grammar(rules, context) {
    return new RiGrammar(...arguments);
  }

  static addTransform(name, definition) {
    return RiScript.addTransform(...arguments);
  }

  static removeTransform(name) {
    return RiScript.removeTransform(...arguments);
  }

  static getTransforms() {
    return RiScript.getTransforms();
  }

  static articlize(word) {
    return RiScript.articlize(...arguments);
  }

  static evaluate(script, context, opts) {
    return RiScript.evaluate(...arguments);
  }

  static markov(n, opts) {
    return new RiMarkov(...arguments);
  }

  static kwic(word, opts) {
    return RiTa.concorder.kwic(...arguments);
  }

  static concordance(string, opts) {
    return RiTa.concorder.concordance(...arguments);
  }

  static randomOrdering(arrayOrInt) {
    return RiTa.randomizer.randomOrdering(...arguments);
  }

  static randomSeed(number) {
    return RiTa.randomizer.seed(number);
  }

  static isQuestion(sentence) { // remove?
    return RiTa.QUESTIONS.includes
      (RiTa.tokenize(sentence)[0].toLowerCase());
  }

  static isVowel(char) {
    return char && char.length === 1 && RiTa.VOWELS.includes(char);
  }

  static isConsonant(char) {
    return (char && char.length === 1 && !RiTa.VOWELS.includes(char)
      && IS_LETTER.test(char));
  }

  static capitalize(string) {
    return string ? string[0].toUpperCase() + string.substring(1) : '';
  }

  static randomWord(opts) {
    return RiTa.lexicon.randomWord(...arguments);
  }

  static async rhymes(word, opts) {
    return await RiTa.lexicon.rhymes(...arguments);
  }

  static isRhyme(word1, word2) {
    return RiTa.lexicon.isRhyme(...arguments);
  }

  static async alliterations(word, opts) {
    return await RiTa.lexicon.alliterations(...arguments);
  }

  static hasWord(word) {
    return RiTa.lexicon.hasWord(...arguments);
  }

  static isAbbrev(input, { caseSensitive = false } = {}) {
    if (typeof input === 'string') {
      if (caseSensitive) return RiTa.ABRV.includes(input.trim());
      let check = input.trim().toLowerCase();
      return RiTa.ABRV.some(a => a.toLowerCase() === check);
    }
  }

  static isAlliteration(word1, word2) {
    return RiTa.lexicon.isAlliteration(...arguments);
  }

  static async spellsLike(word, opts) {
    return await RiTa.lexicon.spellsLike(...arguments);
  }

  static async soundsLike(word, opts) {
    return await RiTa.lexicon.soundsLike(...arguments);
  }

  static pos(word) {
    return RiTa.tagger.tag(...arguments);
  }
  static isNoun(word) {
    return RiTa.tagger.isNoun(word);
  }

  static isAdjective(word) {
    return RiTa.tagger.isAdjective(word);
  }

  static isAdverb(word) {
    return RiTa.tagger.isAdverb(word);
  }

  static isPunct(text) {
    return text && text.length && ONLY_PUNCT.test(text);
  }

  static isVerb(word) {
    return RiTa.tagger.isVerb(word);
  }

  static posInline(words, opts = {}) { // java only?
    opts.inline = true;
    return RiTa.tagger.tag(words, opts);
  }

  static singularize(word) {
    return RiTa.inflector.singularize(...arguments);
  }

  static pluralize(word) {
    return RiTa.inflector.pluralize(...arguments);
  }

  static async search(pattern, opts) {
    return await RiTa.lexicon.search(...arguments);
  }

  static tokens(string, opts) {
    return RiTa.tokenizer.tokens(...arguments);
  }

  static tokenize(string, opts) {
    return RiTa.tokenizer.tokenize(...arguments);
  }

  static untokenize(stringArray, delim) {
    return RiTa.tokenizer.untokenize(...arguments);
  }

  static sentences(string) {
    return RiTa.tokenizer.sentences(...arguments);
  }

  static isStopWord(w) {
    return RiTa.STOP_WORDS.includes(w.toLowerCase());
  }

  static stem(string) {
    return Stemmer.stem(...arguments);
  }

  static presentPart(verbWord) {
    return RiTa.conjugator.presentPart(...arguments);
  }

  static pastPart(verbWord) {
    return RiTa.conjugator.pastPart(...arguments);
  }

  static conjugate(verbWord, opts) {
    return RiTa.conjugator.conjugate(...arguments);
  }

  static stresses(string) {
    return RiTa.analyzer.analyze(...arguments).stresses;
  }

  static syllables(string) {
    return RiTa.analyzer.analyze(...arguments).syllables;
  }

  static phones(string) {
    return RiTa.analyzer.analyze(...arguments).phones;
  }

  static analyze(string) {
    return RiTa.analyzer.analyze(...arguments);
  }

  ////////////////////////////// lex-sync ////////////////////////////

  static spellsLikeSync(word, opts) {
    return RiTa.lexicon.spellsLikeSync(...arguments);
  }

  static sountsLikeSync(word, opts) {
    return RiTa.lexicon.sountsLikeSync(...arguments);
  }

  static rhymesSync(word, opts) {
    return RiTa.lexicon.rhymesSync(...arguments);
  }

  // TODO: all need tests

  static searchSync(word, opts) {
    return RiTa.lexicon.rhymesSync(...arguments);
  }

  static alliterationsSync(word, opts) {
    return RiTa.lexicon.alliterationsSync(...arguments);
  }

  ////////////////////////////// niapa /////////////////////////////

  static randi(opts) {
    return Math.floor(RiTa.randomizer.random(...arguments));
  }

  static random(opts) {
    return RiTa.randomizer.random(...arguments);
  }
}

// BACKREFS
RiMarkov.parent = RiTa; // remove
Stemmer.parent = RiTa; // remove

// CLASSES
RiTa.RiGrammar = RiGrammar;
RiTa.RiMarkov = RiMarkov;
RiTa.Stemmer = Stemmer;

// COMPONENTS
RiTa.tagger = new Tagger(RiTa);
RiTa.analyzer = new Analyzer(RiTa);
RiTa.concorder = new Concorder(RiTa);
RiTa.tokenizer = new Tokenizer(RiTa);
RiTa.inflector = new Inflector(RiTa);
RiTa.randomizer = new RandGen(RiTa);
RiTa.lexicon = new Lexicon(RiTa);
RiTa.conjugator = new Conjugator(RiTa);

// MESSAGES
RiTa.SILENT = false;
RiTa.SILENCE_LTS = false;

// CONSTANTS
RiTa.PHONES = ['aa', 'ae', 'ah', 'ao', 'aw', 'ay', 'b', 'ch', 'd', 'dh', 'eh', 'er', 'ey', 'f', 'g', 'hh', 'ih', 'iy', 'jh', 'k', 'l', 'm', 'n', 'ng', 'ow', 'oy', 'p', 'r', 's', 'sh', 't', 'th', 'uh', 'uw', 'v', 'w', 'y', 'z', 'zh'];
RiTa.VERSION = '[VI]{{inject}}[/VI]';
RiTa.HAS_LEXICON = typeof __NOLEX__ === 'undefined';
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
RiTa.MODAL_EXCEPTIONS = ["hardness", "shortness"];
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

export { RiTa };
