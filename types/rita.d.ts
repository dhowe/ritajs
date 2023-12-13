export class RiTa {
    static grammar(rules: object, context: object): object;
    static addTransform(name: string, definition: Function): void;
    static removeTransform(name: string): void;
    static getTransforms(): string[];
    static articlize(word: string): string;
    static evaluate(script: string, context: object, options?: {
        trace: boolean;
    }): string;
    static markov(n: number, options?: object): RiMarkov;
    static kwic(keyword: string, options?: {
        numWords: number;
        text: string;
        words: string[];
    }): string[];
    static kwic(keyword: string, text: number): string[];
    static concordance(text: string, options?: {
        ignoreCase: boolean;
        ignoreStopWords: boolean;
        ignorePunctuation: boolean;
        wordsToIgnore: string[];
    }): object;
    static randomOrdering(array: object[]): object[];
    static randomOrdering(k: number): number[];
    static randomSeed(seed: number): void;
    static isQuestion(sentence: string): boolean;
    static isVowel(char: string): boolean;
    static isConsonant(char: string): boolean;
    static capitalize(string: string): string;
    static randomWord(pattern?: (string | RegExp), options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        pos: string;
        pattern: RegExp;
        type: string;
    }): string;
    static rhymes(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        pos: string;
    }): Promise<string[]>;
    static isRhyme(word1: string, word2: string): boolean;
    static alliterations(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        pos: string;
    }): Promise<string[]>;
    static hasWord(word: string, options?: {
        noDerivations: boolean;
    }): boolean;
    static isAbbrev(input: string, options?: {
        caseSensitive: boolean;
    }): boolean;
    static isAlliteration(word1: string, word2: string): boolean;
    static spellsLike(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        pos: string;
    }): Promise<string[]>;
    static soundsLike(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        matchSpelling: boolean;
        pos: string;
    }): Promise<string[]>;
    static pos(word: (string | string[]), options?: {
        simple: boolean;
    }): string | string[];
    static isNoun(word: string): string;
    static isAdjective(word: string): string;
    static isAdverb(word: string): string;
    static isVerb(word: string): string;
    static isPunct(text: string): boolean;
    static posInline(sentence: string, options?: {
        simple: boolean;
    }): string;
    static singularize(word: string): string;
    static pluralize(word: string): string;
    static search(pattern?: (string | RegExp), options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        pos: string;
        type: string;
    }): Promise<string[]>;
    static tokens(text: string, options?: {
        caseSensitive: boolean;
        ignoreStopWords: boolean;
        splitContractions: boolean;
        includePunct: boolean;
        sort: boolean;
    }): string[];
    static tokenize(input: string, options?: {
        regex: RegExp;
        splitHyphens: boolean;
        splitContractions: boolean;
    }): string[];
    static untokenize(input: string[], delim?: string): string;
    static sentences(text: string, pattern?: (string | RegExp)): string[];
    static isStopWord(word: string): boolean;
    static stem(word: string): string;
    static presentPart(verbWord: string): string;
    static pastPart(verbWord: string): string;
    static conjugate(verbWord: string, options?: {
        tense: number;
        person: number;
        number: number;
        form: number;
        passive: boolean;
        progressive: boolean;
        perfect: boolean;
        interrogative: boolean;
    }): string;
    static stresses(input: string, options: any): string;
    static syllables(input: string, options: any): string;
    static phones(input: string, options: any): string;
    static analyze(input: string, options?: {
        simple: boolean;
    }): object;
    static spellsLikeSync(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        pos: string;
        shuffle: boolean;
    }): string[];
    static soundsLikeSync(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        matchSpelling: boolean;
        shuffle: boolean;
        pos: string;
    }): string[];
    static rhymesSync(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        pos: string;
    }): string[];
    static searchSync(pattern?: (string | RegExp), options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        pos: string;
        type: string;
    }): string[];
    static alliterationsSync(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        pos: string;
    }): string[];
    static randi(param1: number, param2?: number, ...args: any[]): number;
    static random(param1?: number | object[], param2?: number, ...args: any[]): number | object;
}
export namespace RiTa {
    export { RiGrammar };
    export { RiMarkov };
    export { Stemmer };
    export let randomizer: RandGen;
    export let tagger: Tagger;
    export let analyzer: Analyzer;
    export let concorder: Concorder;
    export let tokenizer: Tokenizer;
    export let inflector: Inflector;
    export let lexicon: Lexicon;
    export let conjugator: Conjugator;
    export let SILENT: boolean;
    export let SILENCE_LTS: boolean;
    export let VERSION: string;
    export let FIRST: number;
    export let SECOND: number;
    export let THIRD: number;
    export let PAST: number;
    export let PRESENT: number;
    export let FUTURE: number;
    export let SINGULAR: number;
    export let PLURAL: number;
    export let NORMAL: number;
    export let STRESS: string;
    export let NOSTRESS: string;
    export let PHONE_BOUNDARY: string;
    export let WORD_BOUNDARY: string;
    export let SYLLABLE_BOUNDARY: string;
    export let SENTENCE_BOUNDARY: string;
    export let VOWELS: string;
    export let PHONES: string[];
    export let ABRV: string[];
    export let QUESTIONS: string[];
    export let STOP_WORDS: string[];
    export let MASS_NOUNS: string[];
    export let INFINITIVE: number;
    export let GERUND: number;
    export let SPLIT_CONTRACTIONS: boolean;
    export { RiScript };
    export let riscript: any;
}
import RiMarkov from './markov.js';
declare const RiGrammar: any;
import Stemmer from './stemmer.js';
import RandGen from './randgen.js';
import Tagger from './tagger.js';
import Analyzer from './analyzer.js';
import Concorder from './concorder.js';
import Tokenizer from './tokenizer.js';
import Inflector from './inflector.js';
import Lexicon from './lexicon.js';
import Conjugator from './conjugator.js';
export {};
