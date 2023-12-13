export default Stemmer;
declare class Stemmer {
    static tokenizer: any;
    static impl: SnowballStemmer;
    static stem(input: any): any;
    static stemAll(input: any): any;
    static stemEnglish(word: any): any;
}
declare class SnowballStemmer {
    bra: number;
    ket: number;
    limit: number;
    cursor: number;
    limit_backward: number;
    setCurrent(word: any): void;
    current: any;
    getCurrent(): any;
    in_grouping(s: any, min: any, max: any): boolean;
    in_grouping_b(s: any, min: any, max: any): boolean;
    out_grouping(s: any, min: any, max: any): boolean;
    out_grouping_b(s: any, min: any, max: any): boolean;
    eq_s(s_size: any, s: any): boolean;
    eq_s_b(s_size: any, s: any): boolean;
    find_among(v: any, v_size: any): any;
    find_among_b(v: any, v_size: any): any;
    replace_s(c_bra: any, c_ket: any, s: any): number;
    slice_check(): void;
    slice_from(s: any): void;
    slice_del(): void;
    insert(c_bra: any, c_ket: any, s: any): void;
    slice_to(): any;
    eq_v_b(s: any): boolean;
}
