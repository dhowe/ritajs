export default RiMarkov;
declare class RiMarkov {
    static parent: any;
    static fromJSON(json: string): RiMarkov;
    constructor(n?: number, options?: {
        text?: string | string[];
        trace?: boolean;
        maxLengthMatch?: number;
        maxAttempts?: number;
        tokenize?: object;
        untokenize?: Function;
        disableInputChecks?: boolean;
    });
    n: number;
    root: Node;
    trace: boolean;
    mlm: number;
    maxAttempts: number;
    tokenize: any;
    untokenize: any;
    disableInputChecks: boolean;
    sentenceStarts: any[];
    sentenceEnds: Set<string>;
    input: any[];
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
    _selectNext(parent: any, temp: any, tokens: any, filter: any): any;
    _isEnd(node: any): boolean;
    _pathTo(path: any, root: any): any;
    treeify(tokens: any): void;
    _splitEnds(str: any): any[];
    _flatten(nodes: any): any;
}
declare class Node {
    constructor(parent: any, word: any, count: any);
    children: {};
    parent: any;
    token: any;
    count: any;
    numChildren: number;
    marked: boolean;
    hidden: boolean;
    child(word: any): any;
    pselect(filter: any): any;
    isLeaf(ignoreHidden: any): boolean;
    isRoot(): boolean;
    childNodes(opts: any): any[];
    childCount(ignoreHidden: any): number;
    nodeProb(excludeMetaTags: any): number;
    addChild(word: any, count: any): any;
    toString(): string;
    asTree(sort: any, showHiddenNodes: any): any;
}
