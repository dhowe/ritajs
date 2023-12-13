export default Tagger;
declare class Tagger {
    constructor(parent: any);
    RiTa: any;
    isVerb(word: any, opts: any): any;
    isNoun(word: any): any;
    isAdverb(word: any): any;
    isAdjective(word: any): any;
    hasTag(choices: any, tag: any): boolean;
    inlineTags(words: any, tags: any, delimiter: any): string;
    allTags(word: any, opts?: {}): any;
    tag(input: (string | string[]), opts?: {
        inline?: boolean;
        simple?: boolean;
    }): any;
    _isNoLexIrregularVerb(stem: any): boolean;
    _checkPluralNounOrVerb(stem: any, result: any): void;
    _safeConcat(a: any, b: any): any;
    _derivePosData(word: any, noGuessing: any): any[];
    isLikelyPlural(word: any): boolean;
    _handleSingleLetter(c: any): any;
    _log(i: any, frm: any, to: any): void;
    _applyContext(words: string[], result: string[], choices: string[], dbug: boolean): string[];
    _tagCompoundWord(word: any, tag: any, result: any, context: any, i: any, dbug: any): any;
    _lexHas(pos: any, word: any): boolean;
}
