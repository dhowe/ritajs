export default Tokenizer;
declare class Tokenizer {
    constructor(parent: any);
    RiTa: any;
    splitter: RegExp;
    tokens(text: string, opts?: {
        caseSensitive: boolean;
        ignoreStopWords: boolean;
        splitContractions: boolean;
        includePunct: boolean;
        sort: boolean;
    }): string[];
    tokenize(input: any, opts?: {}): any;
    untokenize(arr: any, delim?: string): any;
    sentences(text: string, regex?: (string | RegExp)): string[];
    pushTags(text: any): {
        tags: any[];
        text: any;
    };
    popTags(result: any, tags: any): any;
    preProcessTags(array: any): any[];
    tagSubarrayToString(array: any): any;
}
