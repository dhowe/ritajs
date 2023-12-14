export default Analyzer;
declare class Analyzer {
    constructor(parent: any);
    cache: {};
    RiTa: any;
    lts: any;
    analyze(text: any, opts: any): {
        phones: string;
        stresses: string;
        syllables: string;
        pos: any;
        tokens: any;
    };
    computePhones(word: any, opts: any): any;
    phonesToStress(phones: any): string;
    analyzeWord(word: any, opts?: {}): any;
    _computeRawPhones(word: any, lex: any, opts: any): any;
    _computePhonesHyph(word: any, lex: any, opts: any): any[];
    _computePhonesWord(word: any, lex: any, opts: any, isPart: any): any;
}
