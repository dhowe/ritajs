export default Lexicon;
declare class Lexicon {
    constructor(parent: any, custom: any);
    RiTa: any;
    data: any;
    analyzer: any;
    lexWarned: boolean;
    hasWord(word: any, opts?: {}): any;
    alliterations(word: any, options?: {}): Promise<any>;
    alliterationsSync(theWord: any, opts?: {}): string[];
    rhymes(word: any, options?: {}): Promise<any>;
    rhymesSync(theWord: any, opts?: {}): string[];
    spellsLike(word: any, options?: {}): Promise<any>;
    spellsLikeSync(word: any, options?: {}): any[];
    soundsLike(word: any, options?: {}): Promise<any>;
    soundsLikeSync(word: string, opts?: object): string[];
    randomWord(pattern: any, opts: any): any;
    search(pattern: any, options: any): Promise<any>;
    searchSync(pattern: any, options: any): string[];
    isAlliteration(word1: any, word2: any): boolean;
    isRhyme(word1: any, word2: any): boolean;
    size(): number;
    _byTypeSync(theWord: any, opts: any): any[];
    _matchPos(word: any, rdata: any, opts: any, strict: any): any;
    _checkCriteria(word: any, rdata: any, opts: any): boolean;
    _parseArgs(opts: any): void;
    _reconjugate(word: any, pos: any): any;
    _bySoundAndLetterSync(word: any, opts: any): any;
    _bySoundAndLetter(word: any, opts: any): Promise<any>;
    rawPhones(word: any, opts: any): any;
    minEditDist(source: any, target: any): number;
    isMassNoun(w: any): any;
    _promise(fun: any, args: any): Promise<any>;
    _parseRegex(regex: any, opts: any): {
        regex: any;
        opts: any;
    };
    _regexMatch(word: any, data: any, regex: any, type: any): boolean;
    _toPhoneArray(raw: any): any;
    _firstPhone(rawPhones: any): any;
    _intersect(a1: any, a2: any): any;
    _lastStressedPhoneToEnd(word: any): any;
    _lastStressedVowelPhonemeToEnd(word: any): any;
    _firstStressedSyl(word: any): any;
    _posData(word: any, fatal: any): any;
    _posArr(word: any, fatal: any): any;
    _lookupRaw(word: any, fatal: any): any;
}
