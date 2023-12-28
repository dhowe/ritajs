export class RiTa {
    static grammar(rules?: object, context?: object): any;
    static addTransform(name: string, definition: object): void;
    static removeTransform(name: string): void;
    static getTransforms(): string[];
    static articlize(word: string): string;
    static evaluate(script: string, context?: object, options?: {
        trace?: boolean;
    }): string;
    static markov(n: number, options?: {
        text?: string | string[];
        maxLengthMatch?: number;
        maxAttempts?: number;
        tokenize?: object;
        untokenize?: object;
        disableInputChecks?: boolean;
        trace?: boolean;
    }): RiMarkov;
    static kwic(keyword: string, options?: {
        numWords?: number;
        text?: string;
        words?: string[];
    }): string[];
    static kwic(keyword: string, text: number): string[];
    static concordance(text: string, options?: {
        ignoreCase?: boolean;
        ignoreStopWords?: boolean;
        ignorePunctuation?: boolean;
        wordsToIgnore?: string[];
    }): object;
    static randomOrdering(array: object[]): object[];
    static randomOrdering(k: number): number[];
    static randomSeed(seed: number): void;
    static isQuestion(sentence: string): boolean;
    static isVowel(char: string): boolean;
    static isConsonant(char: string): boolean;
    static capitalize(string: string): string;
    static randomWord(pattern?: string | RegExp, options?: {
        minLength?: number;
        maxLength?: number;
        numSyllables?: number;
        limit?: number;
        pos?: string;
        pattern?: RegExp;
        type?: string;
    }): string;
    static rhymes(word: string, options?: {
        minLength?: number;
        maxLength?: number;
        numSyllables?: number;
        limit?: number;
        shuffle?: boolean;
        pos?: string;
    }): Promise<string[]>;
    static isRhyme(word1: string, word2: string): boolean;
    static alliterations(word: string, options?: {
        minLength?: number;
        maxLength?: number;
        numSyllables?: number;
        limit?: number;
        shuffle?: boolean;
        pos?: string;
    }): Promise<string[]>;
    static hasWord(word: string, options?: {
        noDerivations?: boolean;
    }): boolean;
    static isAbbrev(input: string, options?: {
        caseSensitive?: boolean;
    }): boolean;
    static isAlliteration(word1: string, word2: string): boolean;
    static spellsLike(word: string, options?: {
        minLength?: number;
        maxLength?: number;
        numSyllables?: number;
        limit?: number;
        shuffle?: boolean;
        pos?: string;
    }): Promise<string[]>;
    static soundsLike(word: string, options?: {
        minLength?: number;
        maxLength?: number;
        numSyllables?: number;
        limit?: number;
        shuffle?: boolean;
        matchSpelling?: boolean;
        pos?: string;
    }): Promise<string[]>;
    static pos(word: string | string[], options?: {
        simple?: boolean;
    }): string | string[];
    static isNoun(word: string): string;
    static isAdjective(word: string): string;
    static isAdverb(word: string): string;
    static isVerb(word: string): string;
    static isPunct(text: string): boolean;
    static posInline(sentence: string, options?: {
        simple?: boolean;
    }): string;
    static singularize(word: string): string;
    static pluralize(word: string): string;
    static search(pattern?: string | RegExp, options?: {
        minLength?: number;
        maxLength?: number;
        numSyllables?: number;
        limit?: number;
        shuffle?: boolean;
        pos?: string;
        type?: string;
    }): Promise<string[]>;
    static tokens(text: string, options?: {
        caseSensitive?: boolean;
        ignoreStopWords?: boolean;
        splitContractions?: boolean;
        includePunct?: boolean;
        sort?: boolean;
    }): string[];
    static tokenize(input: string, options?: {
        regex?: RegExp;
        splitHyphens?: boolean;
        splitContractions?: boolean;
    }): string[];
    static untokenize(input: string[], delim?: string): string;
    static sentences(text: string, pattern?: string | RegExp): string[];
    static isStopWord(word: string): boolean;
    static stem(word: string): string;
    static presentPart(verbWord: string): string;
    static pastPart(verbWord: string): string;
    static conjugate(verbWord: string, options?: {
        tense?: number;
        person?: number;
        number?: number;
        form?: number;
        passive?: boolean;
        progressive?: boolean;
        perfect?: boolean;
        interrogative?: boolean;
    }): string;
    static stresses(input: string, options?: object): string;
    static syllables(input: string, options?: object): string;
    static phones(input: string, options?: object): string;
    static analyze(input: string, options?: {
        simple?: boolean;
    }): object;
    static spellsLikeSync(word: string, options?: {
        minLength?: number;
        maxLength?: number;
        numSyllables?: number;
        limit?: number;
        pos?: string;
        shuffle?: boolean;
    }): string[];
    static soundsLikeSync(word: string, options?: {
        minLength?: number;
        maxLength?: number;
        numSyllables?: number;
        limit?: number;
        matchSpelling?: boolean;
        shuffle?: boolean;
        pos?: string;
    }): string[];
    static rhymesSync(word: string, options?: {
        minLength?: number;
        maxLength?: number;
        numSyllables?: number;
        limit?: number;
        shuffle?: boolean;
        pos?: string;
    }): string[];
    static searchSync(pattern?: string | RegExp, options?: {
        minLength?: number;
        maxLength?: number;
        numSyllables?: number;
        limit?: number;
        shuffle?: boolean;
        pos?: string;
        type?: string;
    }): string[];
    static alliterationsSync(word: string, options?: {
        minLength?: number;
        maxLength?: number;
        numSyllables?: number;
        limit?: number;
        shuffle?: boolean;
        pos?: string;
    }): string[];
    static randi(param1: number, param2?: number): number;
    static random(param1?: number | object[], param2?: number): number | object;

    static VERSION: string;
    static SILENT: boolean;
    static SILENCE_LTS: boolean;
    static SPLIT_CONTRACTIONS: boolean;

    static STRESS: string;
    static NOSTRESS: string;
    static PHONE_BOUNDARY: string;
    static WORD_BOUNDARY: string;
    static SYLLABLE_BOUNDARY: string;
    static SENTENCE_BOUNDARY: string;
    static VOWELS: string;
    static PHONES: string[];
    static ABRV: string[];
    static QUESTIONS: string[];
    static STOP_WORDS: string[];
    static MASS_NOUNS: string[];

    static INFINITIVE: number;
    static FIRST: number;
    static SECOND: number;
    static THIRD: number;
    static PAST: number;
    static PRESENT: number;
    static FUTURE: number;
    static SINGULAR: number;
    static PLURAL: number;
    static NORMAL: number;
    static GERUND: number;
}

export class RiMarkov {
    static fromJSON(json: string): RiMarkov;
    constructor(n?: number, options?: {
        text?: string | string[];
        trace?: boolean;
        maxLengthMatch?: number;
        maxAttempts?: number;
        tokenizer?: object;
        untokenizer?: object;
        disableInputChecks?: boolean;
    });
    n: number;
    addText(text: string | string[], multiplier?: number): RiMarkov;
    generate(count: number, options?: {
        minLength?: number;
        maxLength?: number;
        temperature?: number;
        allowDuplicates?: boolean;
        seed?: string | string[];
    }): string[];
    generate(options?: {
        minLength?: number;
        maxLength?: number;
        temperature?: number;
        allowDuplicates?: boolean;
        seed?: string | string[];
    }): string;
    toJSON(): string;
    completions(pre: string[], post?: string[]): string[];
    probabilities(path: string | string[], temperature?: number): object;
    probability(data: string | string[]): number;
    toString(root: object, sort: boolean): string;
    size(): number;
}
