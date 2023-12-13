export default Util;
declare class Util {
    static syllablesToPhones(syllables: any): string;
    static syllablesFromPhones(input: any): string;
    static isNum(n: any): boolean;
    static numOpt(opts: any, name: any, def?: number): any;
}
declare namespace Util {
    namespace Numbers {
        namespace fromWords {
            let zero: number;
            let one: number;
            let two: number;
            let three: number;
            let four: number;
            let five: number;
            let six: number;
            let seven: number;
            let eight: number;
            let nine: number;
            let ten: number;
            let eleven: number;
            let twelve: number;
            let thirteen: number;
            let fourteen: number;
            let fifteen: number;
            let sixteen: number;
            let seventeen: number;
            let eighteen: number;
            let nineteen: number;
            let twenty: number;
            let thirty: number;
            let forty: number;
            let fifty: number;
            let sixty: number;
            let seventy: number;
            let eighty: number;
            let ninety: number;
        }
        let toWords: {
            '0': string;
            '1': string;
            '2': string;
            '3': string;
            '4': string;
            '5': string;
            '6': string;
            '7': string;
            '8': string;
            '9': string;
            '10': string;
            '11': string;
            '12': string;
            '13': string;
            '14': string;
            '15': string;
            '16': string;
            '17': string;
            '18': string;
            '19': string;
            '20': string;
            '30': string;
            '40': string;
            '50': string;
            '60': string;
            '70': string;
            '80': string;
            '90': string;
        };
    }
    namespace Phones {
        let consonants: string[];
        let vowels: string[];
        let onsets: string[];
    }
    function RE(a: any, b: any, c: any): RE;
}
declare class RE {
    constructor(regex: any, offset: any, suffix: any);
    raw: any;
    regex: RegExp;
    offset: any;
    suffix: any;
    applies(word: any): boolean;
    fire(word: any): any;
    truncate(word: any): any;
    toString(): string;
}
