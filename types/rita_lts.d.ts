export default LetterToSound;
declare class LetterToSound {
    constructor(parent: any);
    RiTa: any;
    cache: {};
    letterIndex: {};
    fval_buff: any[];
    numStates: number;
    stateMachine: any[];
    warnedForNoLTS: boolean;
    tokenizer: LtsTokenizer;
    createState(type: any): DecisionState | FinalState;
    parseAndAdd(line: any): void;
    stateMachineSize: number;
    buildPhones(word: any, opts: any): any[];
    getState(i: any): any;
}
declare namespace LetterToSound {
    let RULES: string[];
}
declare class LtsTokenizer {
    tokenize(str: any, delim: any): void;
    idx: number;
    tokens: any;
    nextToken(): any;
}
declare class DecisionState {
    constructor(index: any, c: any, qtrue: any, qfalse: any);
    c: any;
    index: any;
    qtrue: any;
    qfalse: any;
    getNextState(chars: any): any;
}
declare namespace DecisionState {
    let TYPE: number;
}
declare class FinalState {
    constructor(phones: any);
    phoneList: any[];
    append(array: any): void;
}
declare namespace FinalState {
    let TYPE_1: number;
    export { TYPE_1 as TYPE };
}
