export default SeededRandom;
declare class SeededRandom {
    N: number;
    M: number;
    MATRIX_A: number;
    UPPER_MASK: number;
    LOWER_MASK: number;
    mt: any[];
    mti: number;
    shuffle(arr: any): any;
    randomOrdering(arg: any): any[];
    seed(num: any): void;
    pselect(probs: any): number;
    pselect2(weights: any): any;
    ndist(weights: any, temp: any): number[];
    random(...args: any[]): any;
    randomBias(min: any, max: any, bias: any, influence?: number): number;
    _rndi(): number;
    _rndf(): number;
}
