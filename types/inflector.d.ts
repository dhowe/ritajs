export default Inflector;
declare class Inflector {
    constructor(parent: any);
    RiTa: any;
    adjustNumber(word: any, type: any, dbug: any): any;
    singularize(word: any, opts: any): any;
    pluralize(word: any, opts: any): any;
    isPlural(word: any, opts: any): boolean;
}
