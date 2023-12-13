export default Concorder;
declare class Concorder {
    constructor(parent: any);
    RiTa: any;
    concordance(text: any, options: any): {};
    words: any;
    ignoreCase: any;
    ignoreStopWords: any;
    ignorePunctuation: any;
    wordsToIgnore: any;
    kwic(word: any, opts: any): any[];
    count(word: any): any;
    _buildModel(): void;
    model: {};
    _isIgnorable(key: any): boolean;
    _compareKey(word: any): any;
    _lookup(word: any): any;
}
