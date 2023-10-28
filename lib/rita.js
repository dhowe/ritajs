
import Stemmer from './stemmer.js';
import Tokenizer from './tokenizer.js';
import Conjugator from './conjugator.js';

class RiTa {/*

  static alliterations() {
    return RiTa.lexicon().alliterations(...arguments);
  }

  static analyze() {
    return RiTa.analyzer.analyze(...arguments);
  }

  static concordance() {
    return RiTa.concorder.concordance(...arguments);
  }

  static grammar() {
    return new RiGrammar(...arguments);
  }

  static markov() {
    return new RiMarkov(...arguments);
  }


  static hasWord() {
    return RiTa.lexicon().hasWord(...arguments);
  }

  static isAbbrev(input, { caseSensitive = false } = {}) {
    if (typeof input === 'string') {
      if (caseSensitive) return RiTa.ABRV.includes(input.trim());
      let check = input.trim().toLowerCase();
      return RiTa.ABRV.some(a => a.toLowerCase() === check);
    }
  }

  static isAdjective(word) {
    return RiTa.tagger.isAdjective(word);
  }

  static isAdverb(word) {
    return RiTa.tagger.isAdverb(word);
  }

  static isAlliteration() {
    return RiTa.lexicon().isAlliteration(...arguments);
  }

  static isNoun(word) {
    return RiTa.tagger.isNoun(word);
  }

  static isPunct(text) {
    return text && text.length && ONLY_PUNCT.test(text);
  }

  static isQuestion(sentence) { // remove?
    return RiTa.QUESTIONS.includes
      (RiTa.tokenize(sentence)[0].toLowerCase());
  }



  static isRhyme() {
    return RiTa.lexicon().isRhyme(...arguments);
  }

  static isVerb(word) {
    return RiTa.tagger.isVerb(word);
  }

  static kwic() {
    return RiTa.concorder.kwic(...arguments);
  }


  static phones() {
    return RiTa.analyzer.analyze(...arguments).phones;
  }

  static pos() { // DOC:
    return RiTa.tagger.tag(...arguments);
  }

  static posInline(words, opts = {}) { // java only?
    opts.inline = true;
    return RiTa.tagger.tag(words, opts);
  }

  static pluralize() {
    return RiTa.inflector.pluralize(...arguments);
  }

  static randomOrdering() {
    return RiTa.randomizer.randomOrdering(...arguments);
  }

  static randomSeed() {
    return RiTa.randomizer.seed(...arguments);
  }

  static randomWord() {
    return RiTa.lexicon().randomWord(...arguments);
  }

  static rhymes() { // DOC:
    return RiTa.lexicon().rhymes(...arguments);
  }


  static search() {
    return RiTa.lexicon().search(...arguments);
  }



  static spellsLike() { // DOC:
    return RiTa.lexicon().spellsLike(...arguments);
  }



  static soundsLike() { // DOC:
    return RiTa.lexicon().soundsLike(...arguments);
  }

  static stresses() {
    return RiTa.analyzer.analyze(...arguments).stresses;
  }

  static syllables() {
    return RiTa.analyzer.analyze(...arguments).syllables;
  }

  ////////////////////////////// niapa /////////////////////////////

  static randi() { 
    return Math.floor(RiTa.randomizer.random(...arguments));
  }

  static random() {
    return RiTa.randomizer.random(...arguments);
  }

  static isVowel(c) {
    return c && c.length === 1 && RiTa.VOWELS.includes(c);
  }

  static isConsonant(c) {
    return (c && c.length === 1 && !RiTa.VOWELS.includes(c)
      && IS_LETTER.test(c));
  }

  static capitalize(s) {
    return s ? s[0].toUpperCase() + s.substring(1) : '';
  }

  static lexicon() { // lazy load
    if (typeof RiTa._lexicon === 'undefined') {
      if (typeof __NOLEX__ !== 'undefined') { // used by webpack, don't shorten
        RiTa._lexicon = new Lexicon(RiTa);
      }
      else {
        RiTa._lexicon = new Lexicon(RiTa, require('./rita_dict'));
      }
    }
    return RiTa._lexicon;
  }
  static singularize() {
    return RiTa.inflector.singularize(...arguments);
  }
  static pluralize() {
    return RiTa.inflector.pluralize(...arguments);
  }
  }*/
  static lexicon() { // lazy load
    if (typeof RiTa._lexicon === 'undefined') {
      if (typeof __NOLEX__ !== 'undefined') { // used by webpack, don't shorten
        RiTa._lexicon = new Lexicon(RiTa);
      }
      else {
        RiTa._lexicon = new Lexicon(RiTa, require('./rita_dict'));
      }
    }
    return RiTa._lexicon;
  }
  static tokens() {
    return RiTa.tokenizer.tokens(...arguments);
  }

  static tokenize() {
    return RiTa.tokenizer.tokenize(...arguments);
  }

  static untokenize() {
    return RiTa.tokenizer.untokenize(...arguments);
  }
  static sentences() {
    return RiTa.tokenizer.sentences(...arguments);
  }
  static isStopWord(w) {
    return RiTa.STOP_WORDS.includes(w.toLowerCase());
  }
  static stem() {
    return Stemmer.stem(...arguments);
  }
  static presentPart() {
    return RiTa.conjugator.presentPart(...arguments);
  }
  static pastPart() {
    return RiTa.conjugator.pastPart(...arguments);
  }
  static conjugate() {
    return RiTa.conjugator.conjugate(...arguments);
  }

}

// // BACKREFS
// RiMarkov.parent = RiTa;
// RiGrammar.parent = RiTa;
// //RiScript.parent = RiTa;
Stemmer.parent = RiTa;

// CLASSES
// RiTa.RiGrammar = RiGrammar;
// RiTa.RiMarkov = RiMarkov;
//RiTa.RiScript = RiScript;
// RiTa.Operator = Operator;
RiTa.Stemmer = Stemmer;
// RiTa.Util = Util;

// COMPONENTS
// RiTa.tagger = new Tagger(RiTa);
// RiTa.analyzer = new Analyzer(RiTa);
// RiTa.concorder = new Concorder(RiTa);
RiTa.tokenizer = new Tokenizer(RiTa);
// RiTa.inflector = new Inflector(RiTa);
RiTa.conjugator = new Conjugator(RiTa);
// RiTa.randomizer = new RandGen(RiTa);

// LAZY-LOADS
RiTa._lexicon = undefined;

// MESSAGES
RiTa.SILENT = false;
RiTa.SILENCE_LTS = false;
RiTa.CDN = 'https://www.unpkg.com/rita/';

// CONSTANTS
RiTa.PHONES = ['aa', 'ae', 'ah', 'ao', 'aw', 'ay', 'b', 'ch', 'd', 'dh', 'eh', 'er', 'ey', 'f', 'g', 'hh', 'ih', 'iy', 'jh', 'k', 'l', 'm', 'n', 'ng', 'ow', 'oy', 'p', 'r', 's', 'sh', 't', 'th', 'uh', 'uw', 'v', 'w', 'y', 'z', 'zh'];
RiTa.VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'DEV';
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
RiTa.ABRV = ["Adm.", "Capt.", "Cmdr.", "Col.", "Dr.", "Gen.", "Gov.", "Lt.", "Maj.", "Messrs.", "Mr.", "Mrs.", "Ms.", "Prof.", "Rep.", "Reps.", "Rev.", "Sen.", "Sens.", "Sgt.", "Sr.", "St.", "A.k.a.", "C.f.", "I.e.", "E.g.", "Vs.", "V.", "Jan.", "Feb.", "Mar.", "Apr.", "Mar.", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
RiTa.QUESTIONS = ["was", "what", "when", "where", "which", "why", "who", "will", "would", "who", "how", "if", "is", "could", "might", "does", "are", "have"];
RiTa.STOP_WORDS = ["and", "a", "of", "in", "i", "you", "is", "to", "that", "it", "for", "on", "have", "with", "this", "be", "not", "are", "as", "was", "but", "or", "from", "my", "at", "if", "they", "your", "all", "he", "by", "one", "me", "what", "so", "can", "will", "do", "an", "about", "we", "just", "would", "there", "no", "like", "out", "his", "has", "up", "more", "who", "when", "don't", "some", "had", "them", "any", "their", "it's", "only", "which", "i'm", "been", "other", "were", "how", "then", "now", "her", "than", "she", "well", "also", "us", "very", "because", "am", "here", "could", "even", "him", "into", "our", "much", "too", "did", "should", "over", "want", "these", "may", "where", "most", "many", "those", "does", "why", "please", "off", "going", "its", "i've", "down", "that's", "can't", "you're", "didn't", "another", "around", "must", "few", "doesn't", "the", "every", "yes", "each", "maybe", "i'll", "away", "doing", "oh", "else", "isn't", "he's", "there's", "hi", "won't", "ok", "they're", "yeah", "mine", "we're", "what's", "shall", "she's", "hello", "okay", "here's", "less", "didn't", "said", "over", "this", "that", "just", "then", "under", "some"];
RiTa.MASS_NOUNS = ["abalone", "asbestos", "barracks", "bathos", "breeches", "beef", "britches", "chaos", "chinese", "cognoscenti", "clippers", "corps", "cosmos", "crossroads", "diabetes", "ethos", "gallows", "graffiti", "herpes", "innings", "lens", "means", "measles", "mews", "mumps", "news", "pasta", "pathos", "pincers", "pliers", "proceedings", "rabies", "rhinoceros", "sassafras", "scissors", "series", "shears", "species", "tuna", "acoustics", "aesthetics", "aquatics", "basics", "ceramics", "classics", "cosmetics", "dialectics", "deer", "dynamics", "ethics", "harmonics", "heroics", "mechanics", "metrics", "ooze", "optics", "physics", "polemics", "pyrotechnics", "statistics", "tactics", "tropics", "bengalese", "bengali", "bonsai", "booze", "cellulose", "mess", "moose", "burmese", "chinese", "colossus", "congolese", "discus", "electrolysis", "emphasis", "expertise", "flu", "fructose", "gauze", "glucose", "grease", "guyanese", "haze", "incense", "japanese", "lebanese", "malaise", "mayonnaise", "maltese", "music", "money", "menopause", "merchandise", "olympics", "overuse", "paradise", "poise", "potash", "portuguese", "prose", "recompense", "remorse", "repose", "senegalese", "siamese", "singhalese", "sleaze", "sioux", "sudanese", "suspense", "swiss", "taiwanese", "vietnamese", "unease", "aircraft", "anise", "antifreeze", "applause", "archdiocese", "apparatus", "asparagus", "bellows", "bison", "bluefish", "bourgeois", "bream", "brill", "butterfingers", "cargo", "carp", "catfish", "chassis", "clone", "clones", "clothes", "chub", "cod", "codfish", "coley", "contretemps", "crawfish", "crayfish", "cuttlefish", "dice", "dogfish", "doings", "dory", "downstairs", "eldest", "earnings", "economics", "electronics", "firstborn", "fish", "flatfish", "flounder", "fowl", "fry", "fries", "works", "goldfish", "golf", "grand", "grief", "haddock", "hake", "halibut", "headquarters", "herring", "hertz", "honey", "horsepower", "goods", "hovercraft", "ironworks", "kilohertz", "ling", "shrimp", "swine", "lungfish", "mackerel", "macaroni", "megahertz", "moorfowl", "moorgame", "mullet", "nepalese", "offspring", "pants", "patois", "pekinese", "perch", "pickerel", "pike", "potpourri", "precis", "quid", "rand", "rendezvous", "roach", "salmon", "samurai", "seychelles", "shad", "sheep", "shellfish", "smelt", "spaghetti", "spacecraft", "starfish", "stockfish", "sunfish", "superficies", "sweepstakes", "smallpox", "swordfish", "tennis", "tobacco", "triceps", "trout", "tunafish", "turbot", "trousers", "turf", "dibs", "undersigned", "waterfowl", "waterworks", "waxworks", "wildfowl", "woodworm", "yen", "aries", "pisces", "forceps", "jeans", "mathematics", "odds", "politics", "remains", "aids", "wildlife", "shall", "would", "may", "might", "ought", "should", "acne", "admiration", "advice", "air", "anger", "anticipation", "assistance", "awareness", "bacon", "baggage", "blood", "bravery", "chess", "clay", "clothing", "coal", "compliance", "comprehension", "confusion", "consciousness", "cream", "darkness", "diligence", "dust", "education", "empathy", "enthusiasm", "envy", "equality", "equipment", "evidence", "feedback", "fitness", "flattery", "foliage", "fun", "furniture", "garbage", "gold", "gossip", "grammar", "gratitude", "gravel", "guilt", "happiness", "hardware", "hate", "hay", "health", "heat", "help", "hesitation", "homework", "honesty", "honor", "honour", "hospitality", "hostility", "humanity", "humility", "ice", "immortality", "independence", "information", "integrity", "intimidation", "jargon", "jealousy", "jewelry", "justice", "knowledge", "literacy", "logic", "luck", "lumber", "luggage", "mail", "management", "milk", "morale", "mud", "nonsense", "oppression", "optimism", "oxygen", "participation", "pay", "peace", "perseverance", "pessimism", "pneumonia", "poetry", "police", "pride", "privacy", "propaganda", "public", "punctuation", "recovery", "rice", "rust", "satisfaction", "schnapps", "shame", "slang", "software", "stamina", "starvation", "steam", "steel", "stuff", "support", "sweat", "thunder", "timber", "toil", "traffic", "tongs", "training", "trash", "valor", "vehemence", "violence", "warmth", "waste", "weather", "wheat", "wisdom", "work", "accommodation", "advertising", "aid", "art", "bread", "business", "butter", "calm", "cash", "cheese", "childhood", "clothing ", "coffee", "content", "corruption", "courage", "currency", "damage", "danger"/*, "data"*/, "determination", "electricity", "employment", "energy", "entertainment", "failure", "fame", "fire", "flour", "food", "freedom", "friendship", "fuel", "genetics", "hair", "harm", "hospitality ", "housework", "humour", "imagination", "importance", "innocence", "intelligence", "juice", "kindness", "labour", "lack", "laughter", "leisure", "literature", "litter", "love", "magic", "metal", "motherhood", "motivation", "nature", "nutrition", "obesity", "oil", "old age", "paper", "patience", "permission", "pollution", "poverty", "power", "production", "progress", "pronunciation", "publicity", "quality", "quantity", "racism", "rain", "relaxation", "research", "respect", "room (space)", "rubbish", "safety", "salt", "sand", "seafood", "shopping", "silence", "smoke", "snow", "soup", "speed", "spelling", "stress ", "sugar", "sunshine", "tea", "time", "tolerance", "trade", "transportation", "travel", "trust", "understanding", "unemployment", "usage", "vision", "water", "wealth", "weight", "welfare", "width", "wood", "yoga", "youth", "homecare", "childcare", "fanfare", "healthcare", "medicare"];

RiTa.INFINITIVE = 1;
RiTa.GERUND = 2;

// For tokenization, Can't -> Can not, etc.
RiTa.SPLIT_CONTRACTIONS = false;

// Set to false to reduce memory use (likely slower)
RiTa.CACHING = true;

const ONLY_PUNCT = /^[\p{P}|\+|-|<|>|\^|\$|\ufffd|`]*$/u;
const IS_LETTER = /^[a-z\u00C0-\u00ff]+$/;


export default RiTa;
