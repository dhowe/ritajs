/**
 * @class RiTa
 * @memberof module:rita
 */
export class RiTa {
    /**
     * Create a RiTa grammar instance
     * @param {object} rules - the rules of the grammar
     * @param {object} context - the context of the grammar
     * @returns {RiGrammar} - a new RiGrammar instance
     */
    static grammar(rules: object, context: object): any;
    /**
     * Add a transform function to the RiScript parser
     * @param {string} name - the name of the transform
     * @param {function} definition - the transform function
     */
    static addTransform(name: string, definition: Function): void;
    /**
     * Remove a transform function from the RiScript parser
     * @param {string} name - the name of the transform to remove
     */
    static removeTransform(name: string): void;
    /**
     * Returns the names of all current transform functions
     * @returns {string[]} the names of all transforms
     */
    static getTransforms(): string[];
    /**
     * Adds the appropriate article ('a' or 'an') to the word, according to its phonemes (useful as a transform function)
     * @param {string} word - the word to transform
     * @returns {string} - the word with an article, e.g., 'honor' -> 'an honor'
     */
    static articlize(word: string): string;
    /**
     * Evaluates the input script via the RiScript parser
     * @param {string} script - the script to evaluate
     * @param {object} context - the context to evaluate the script in
     * @param {object} [options] - options for the evaluation
     * @param {boolean} options.trace - whether to trace the evaluation
     * @returns {string} the result of the evaluation
     */
    static evaluate(script: string, context: object, options?: {
        trace: boolean;
    }): string;
    /**
     * Creates a new RiMarkov object
     * @param {number} n - an int representing the n-factor of the markov chain
     * @param {object} [options] - options for the markov chain
     * @returns {RiMarkov}
     */
    static markov(n: number, options?: object): RiMarkov;
    /**
     * Return a list of occurrences of the key word in the Key-Word-In-Context (KWIC) model.
     * @overload
     * @param {string} keyword
     * @param {object} [options]
     * @param {number} options.numWords - the number of words to include in the context
     * @param {string} options.text - the text as input for the KWIC model
     * @param {string[]} options.words - the array of words to be used as input for the KWIC model
     * @returns {string[]} all the occurrences of the keyword in the model, each with no more
     * than 'numWords' words of context on either side
     * @overload
     * @param {string} keyword
     * @param {number} text - the number of words to include in the context
     * @returns {string[]} all the occurrences of the keyword in the model, each with no more
     * than 'numWords' words of context on either side
     */
    static kwic(keyword: string, options?: {
        numWords: number;
        text: string;
        words: string[];
    }): string[];
    /**
     * Return a list of occurrences of the key word in the Key-Word-In-Context (KWIC) model.
     * @overload
     * @param {string} keyword
     * @param {object} [options]
     * @param {number} options.numWords - the number of words to include in the context
     * @param {string} options.text - the text as input for the KWIC model
     * @param {string[]} options.words - the array of words to be used as input for the KWIC model
     * @returns {string[]} all the occurrences of the keyword in the model, each with no more
     * than 'numWords' words of context on either side
     * @overload
     * @param {string} keyword
     * @param {number} text - the number of words to include in the context
     * @returns {string[]} all the occurrences of the keyword in the model, each with no more
     * than 'numWords' words of context on either side
     */
    static kwic(keyword: string, text: number): string[];
    /**
     * Creates a concordance, a list of words with their frequency of occurence, from the given text and options.
     * @param {string} text - the text from which to create the concordance
     * @param {object} [options] - options for the concordance
     * @param {boolean} options.ignoreCase=false - whether to ignore case when creating the concordance
     * @param {boolean} options.ignoreStopWords=false - whether to ignore stop words like
     *  'the', 'and', 'a', 'of', etc, as specified in RiTa.STOP_WORDS
     * @param {boolean} options.ignorePunctuation=false - whether to ignore punctuation when creating the concordance
     * @param {string[]} options.wordsToIgnore=null - words to ignore when creating the concordance (alternate stop-words)
     * @returns {object} the concordance, an object with words as keys and frequencies as values
     */
    static concordance(text: string, options?: {
        ignoreCase: boolean;
        ignoreStopWords: boolean;
        ignorePunctuation: boolean;
        wordsToIgnore: string[];
    }): object;
    /**
     * Returns a random ordering of the input array or a random ordering of integers from 1 to k
     * @overload
     * @param {object[]} array - the array to shuffle
     * @returns {object[]} the input array in a random order
     * @overload
     * @param {number} k - the number of integers to return
     * @returns {number[]} an array of arrays of integers from 1 to k in random order
     */
    static randomOrdering(array: object[]): object[];
    /**
     * Returns a random ordering of the input array or a random ordering of integers from 1 to k
     * @overload
     * @param {object[]} array - the array to shuffle
     * @returns {object[]} the input array in a random order
     * @overload
     * @param {number} k - the number of integers to return
     * @returns {number[]} an array of arrays of integers from 1 to k in random order
     */
    static randomOrdering(k: number): number[];
    /**
     * Sets the seed for the RiTa random number generator
     * @param {number} seed - the seed to set
     */
    static randomSeed(seed: number): void;
    /**
     * Returns true if the sentence is a question, else false
     * @param {string} sentence
     * @returns {boolean} - true if the sentence is a question, else false
     */
    static isQuestion(sentence: string): boolean;
    /**
     * Returns true if the character is a vowel, else false
     * @param {string} char
     * @returns {boolean} - true if the character is a vowel, else false
     */
    static isVowel(char: string): boolean;
    /**
     * Returns true if the character is a consonant, else false
     * @param {string} char
     * @returns {boolean} - true if the character is a consonant, else false
     */
    static isConsonant(char: string): boolean;
    /**
     * Capitalizes the first letter of the input string, leaving others unchanged
     * @param {string} string - the string to capitalize
     * @returns {string} the capitalized string
     */
    static capitalize(string: string): string;
    /**
     * Return a random word from the lexicon matching the specified criteria
     * (length, syllable-count, phonemic pattern, stress pattern, part-of-speech, etc.).
     * @param {(string|RegExp)} [pattern] - the pattern to match
     * @param {object} [options]
     * @param {number} options.minLength=4 - the minimum length of the word
     * @param {number} options.maxLength=-1 - the maximum length of the word
     * @param {number} options.numSyllables=null - the number of syllables in the word
     * @param {number} options.limit=10 - the maximum number of results to retur
     * @param {string} options.pos=null - the part-of-speech of the word to return,
     *  either from the Penn tag set or the simplified tag set [a, r, v, n]
     * @param {RegExp} options.pattern=null - the spelling or phonemic pattern to match
     * @param {string} options.type=null - the type of regex or string pattern to match,
     * options are 'stresses' or 'phones' or 'letters' (the default)
     * @returns {string} a random word matching the criteria in the options object
     */
    static randomWord(pattern?: (string | RegExp), options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        pos: string;
        pattern: RegExp;
        type: string;
    }): string;
    /**
     * Returns words that rhyme with the given word. Two words are considered as rhyming if
     * their final stressed vowel and all following phonemes are identical.
     * @param {string} word
     * @param {object} [options]
     * @param {number} options.minLength=4 - the minimum length of the words
     * @param {number} options.maxLength - the maximum length of the words
     * @param {number} options.numSyllables - the number of syllables in the words
     * @param {number} options.limit=10 - the maximum number of results to return (pass -1 to return all matches)
     * @param {boolean} options.shuffle=false - whether to shuffle the results before returning them
     * @param {string} options.pos - the part-of-speech of the words to return, either from the Penn tag set
     *  or the simplified tag set [a, r, v, n]
     * @returns {Promise<string[]>} an array of rhymes that match criteria in the options object
     */
    static rhymes(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        pos: string;
    }): Promise<string[]>;
    /**
     * Returns words that rhyme with the given word. Two words are considered as rhyming if
     * their final stressed vowel and all following phonemes are identical.
     * @param {string} word1 - the first word to compare
     * @param {string} word2 - the second word to compare
     * @returns {boolean}  true if the two words rhyme, else false
     */
    static isRhyme(word1: string, word2: string): boolean;
    /**
     * Finds alliterations by comparing the phonemes of the input string to those
     *  of each word in the lexicon via a minimum-edit-distance metric.
     * @param {string} word
     * @param {object} [options]
     * @param {number} options.minLength=4 - the minimum length of the words
     * @param {number} options.maxLength - the maximum length of the words
     * @param {number} options.numSyllables - the number of syllables in the words
     * @param {number} options.limit=10 - the maximum number of results to return (pass -1 to return all matches)
     * @param {boolean} options.shuffle=false - whether to shuffle the results before returning them
     * @param {string} options.pos - the part-of-speech of the words to return, either from the Penn tag set
     *  or the simplified tag set [a, r, v, n]
     * @returns {Promise<string[]>} an array of alliterations matching criteria in the options object
     */
    static alliterations(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        pos: string;
    }): Promise<string[]>;
    /**
     * Returns true if the word is in the lexicon, else false
     * @param {string} word - the word to check
     * @param {object} [options] - options for the search
     * @param {boolean} options.noDerivations=false - whether to ignore derivations and only search for raw words
     * @returns {boolean} true if the word is in the lexicon, else false
     */
    static hasWord(word: string, options?: {
        noDerivations: boolean;
    }): boolean;
    /**
     * Returns true if the word is an abbreviation, else false
     * @param {string} input - the word to check
     * @param {object} [options] - options for the search
     * @param {boolean} options.caseSensitive=false - whether to ignore case when checking for abbreviations
     * @returns {boolean} true if the word is an abbreviation, else false
     */
    static isAbbrev(input: string, options?: {
        caseSensitive: boolean;
    }): boolean;
    /**
     * Returns true if the two words are an alliteration (if their first stressed consonants match).
     * Note: returns true if wordA.equals(wordB) and false if either (or both) are null.
     * @param {string} word1 - the first word to compare
     * @param {string} word2 - the second word to compare
     * @returns {boolean}  true if the two words are an alliteration, else false
     */
    static isAlliteration(word1: string, word2: string): boolean;
    /**
     * Compares the letters of the input word (using a version of the Levenstein min-edit distance algorithm)
     * to each word in the lexicon, returning the set of closest matches that also match the criteria in the options object.
     * @param {string} word - the word to match
     * @param {object} [options] - options for the search
     * @param {number} options.minLength=4 - the minimum length of the words
     * @param {number} options.maxLength - the maximum length of the words
     * @param {number} options.numSyllables - the number of syllables in the words
     * @param {number} options.limit=10 - the maximum number of results to return  (pass -1 to return all matches)
     * @param {boolean} options.shuffle=false - whether to shuffle the results before returning them
     * @param {string} options.pos - the part-of-speech of the words to return, either from the Penn tag set or the simplified tag set [a, r, v, n]
     * @returns {Promise<string[]>} an array of words matching the spelling pattern and criteria in the options object
     */
    static spellsLike(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        pos: string;
    }): Promise<string[]>;
    /**
     * Compares the phonemes of the input pattern (using a version of the Levenstein min-edit distance algorithm)
     *  to each word in the lexicon, returning the set of closest matches that also match the criteria in the options object.
     * @param {string} word - the word to match
     * @param {object} [options] - options for the search
     * @param {number} options.minLength=4 - the minimum length of the words
     * @param {number} options.maxLength - the maximum length of the words
     * @param {number} options.numSyllables - the number of syllables in the words
     * @param {number} options.limit=10 - the maximum number of results to return (pass -1 to return all matches)
     * @param {boolean} options.shuffle=false - whether to shuffle the results before returning them
     * @param {boolean} options.matchSpelling=false, if true will also attempt to match spelling by returning an intersection with RiTa.spellsLike()
     * @param {string} options.pos - the part-of-speech of the words to return, either from the Penn tag set
     *  or the simplified tag set [a, r, v, n]
     * @returns {Promise<string[]>} an array of words matching the phonemic pattern and criteria in the options object
     */
    static soundsLike(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        matchSpelling: boolean;
        pos: string;
    }): Promise<string[]>;
    /**
     * Generates part-of-speech tags for each word in the input with tags
     * from the Penn tag set or the simplified tag set [a, r, v, n].
     * @param {(string|string[])} word - the word or words to tag
     * @param {object} [options] - options for the tagging
     * @param {boolean} options.inline - tags are returned inline with words
     * @param {boolean} options.simple - use simple tags (noun=n,verb=v,adverb=a,adjective=r)
     * @returns {string|string[]} - an array of part-of-speech tags for each word in the input
     */
    static pos(word: (string | string[]), options?: {
        inline: boolean;
        simple: boolean;
    }): string | string[];
    /**
     * Returns true if the word has a noun form. That is, if any of its possible
     *  parts of speech are any variant of a noun in the Penn tag set(e.g. nn, nns, nnp, nnps).
     * @param {string} word - the word to check
     * @returns {string} - true if the word is a noun, else false
     */
    static isNoun(word: string): string;
    /**
     * Returns true if word has an adjective form. That is, if any of its possible parts of speech
     *  are any variant of an adjective in the Penn tag set (e.g. jj, jjr, jjs).
     * @param {string} word - the word to check
     * @returns {string} - true if the word is an adjective, else false
     */
    static isAdjective(word: string): string;
    /**
     * Returns true if the word has an adverb form. That is, if any of its possible parts of speech
     * are any variant of an adverb in the Penn tag set (e.g. rb, rbr, rbs).
     * @param {string} word - the word to check
     * @returns {string} - true if the word is an adverb, else false
     */
    static isAdverb(word: string): string;
    /**
     * Returns true for if word has a verb form. That is, if any of its possible
     * parts of speech are any variant of a verb in the Penn tag set (e.g. vb, vbg, vbd, vbp, vbz).
     * @param {string} word - the word to check
     * @returns {string} - true if the word is a verb, else false
     */
    static isVerb(word: string): string;
    /**
     * Returns true if every character of 'text' is a punctuation character.
     * @param {string} text
     * @returns {boolean} true if every character of 'text' is punctuation, else false
     */
    static isPunct(text: string): boolean;
    /**
     * Tags the input string with part-of-speech tags, either from the Penn tag set or the simplified tag set [a, r, v, n].
     * @param {string} sentence - the sentence to tag
     * @param {object} [options] - options for the tagging
     * @param {boolean} options.simple=false - use the simplified tag set [a, r, v, n]
     * @returns {string} the tagged sentence
     */
    static posInline(sentence: string, options?: {
        simple: boolean;
    }): string;
    /**
     * Return the singular form of the input word
     * @param {string} word - the word to singularize
     * @returns {string} the singular form of the input word
     */
    static singularize(word: string): string;
    /**
     * Return the plural form of the input word
     * @param {string} word - the word to pluralize
     * @returns {string} the plural form of the input word
     */
    static pluralize(word: string): string;
    /**
     * Searches for words in the lexicon matching the given criteria, either by length, syllable-count,
     * spelling, phonemes, stresses, part-of-speech, etc. If no regex or options are supplied, the full set of words is returned.
     * @param {(string|RegExp)} [pattern] - the pattern to match
     * @param {object} [options] - options for the search
     * @param {number} options.minLength=4 - the minimum length of the words
     * @param {number} options.maxLength - the maximum length of the words
     * @param {number} options.numSyllables - the number of syllables in the words
     * @param {number} options.limit=10 - the maximum number of results to return (pass -1 to return all matches)
     * @param {boolean} options.shuffle=false - whether to shuffle the results before returning them
     * @param {string} options.pos - the part-of-speech of the words to return, either from the Penn tag set
     *  or the simplified tag set [a, r, v, n]
     * @param {string} options.type - the type of regex or string pattern to match, options are 'stresses'
     *  or 'phones' or 'letters' (the default)
     * @returns {Promise<string[]>} an array of words matching the criteria in both the pattern and the options object
     */
    static search(pattern?: (string | RegExp), options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        pos: string;
        type: string;
    }): Promise<string[]>;
    /**
      * Returns an array containing all unique alphabetical words (tokens) in the text.
      * Punctuation and case are ignored unless specified otherwise.
      * @param {string} text - The text from which to extract the tokens
      * @param {object} [options] - The options
      * @param {boolean} options.caseSensitive=false - Whether to pay attention to case
      * @param {boolean} options.ignoreStopWords=false - Whether to ignore words such as 'the', 'and', 'a', 'of', etc,
      *  as specified in RiTa.STOP_WORDS
      * @param {boolean} options.splitContractions=false - Whether to convert contractions
      *  (e.g., "I'd" or "she'll") into multiple individual tokens
      * @param {boolean} options.includePunct=false - Whether to include punctuation in the results
      * @param {boolean} options.sort=false - Whether to sort the tokens before returning them
      * @returns {string[]} Array of tokens
      */
    static tokens(text: string, options?: {
        caseSensitive: boolean;
        ignoreStopWords: boolean;
        splitContractions: boolean;
        includePunct: boolean;
        sort: boolean;
    }): string[];
    /**
     * Tokenizes an input string into words, according to the Penn Treebank conventions
     * @param {string} input - The text to tokenize
     * @param {object} [options] - The options
     * @param {RegExp} options.regex=null - An optional custom regex to split on
     * @param {boolean} options.splitHyphens=false - Whether to split hyphenated words
     * (e.g., "mother-in-law") into multiple individual tokens
     * @param {boolean} options.splitContractions=false - Whether to split contractions
     * (e.g., "I'd" or "she'll") into multiple individual tokens
     * @returns {string[]} Array of tokens
     */
    static tokenize(input: string, options?: {
        regex: RegExp;
        splitHyphens: boolean;
        splitContractions: boolean;
    }): string[];
    /**
     * Joins an array (of words and punctuation) into a sentence, according to
     * the Penn Treebank conventions. The inverse of RiTa.tokenize().
     * @param {string[]} input - The array of words to join
     * @param {string} delim=' ' - The delimiter to use between words, or a space by default
     * @returns {string} The joined sentence
     */
    static untokenize(input: string[], delim?: string): string;
    /**
     * Split the input text into sentences following using Penn Treebank conventions and the specified options.
     * @param {string} text - The text to split
     * @param {(string|RegExp)} [pattern] - An optional custom regex to split on
     * @returns {string[]} An array of sentences
     */
    static sentences(text: string, pattern?: (string | RegExp)): string[];
    /**
     * Returns true if the word is a 'stop word', a commonly used word that is often ignored in text processing.
     * To use your own list, set RiTa.STOP_WORDS to a new array of (lowercase) words.
     * @param {string} word - the word to check
     * @returns {boolean} true if the word is a stop word, else false
     */
    static isStopWord(word: string): boolean;
    /**
     * Extracts base roots from a word according to the Pling stemming algorithm.
     * @param {string} word - the word to stem
     * @returns {string} the base root of the word
     */
    static stem(word: string): string;
    /**
     * Returns the present participle of the input word (e.g., "walking" for "walk").
     * @param {string} verbWord - the word to get the present participle of
     * @returns {string} the present participle of the input word
     */
    static presentPart(verbWord: string): string;
    /**
     * Returns the past participle of the input word (e.g., "walked" for "walk").
     * @param {string} verbWord
     * @returns {string} the past participle of the input word
     */
    static pastPart(verbWord: string): string;
    /**
     * Conjugates the 'verb' according to the specified options (tense, person, number, etc.)
     * @param {string} verbWord
     * @param {object} [options]
     * @param {number} options.tense - the tense of the verb, either RiTa.PAST, RiTa.PRESENT, or RiTa.FUTURE
     * @param {number} options.person - the person of the verb, either RiTa.FIRST, RiTa.SECOND, or RiTa.THIRD
     * @param {number} options.number - the number of the verb, either RiTa.SINGULAR or RiTa.PLURAL
     * @param {number} options.form - the form of the verb, either RiTa.INFINITIVE or RiTa.GERUND
     * @param {boolean} options.passive - whether the verb should be passive
     * @param {boolean} options.progressive - whether the verb should be progressive
     * @param {boolean} options.perfect - whether the verb should be perfect
     * @param {boolean} options.interrogative - whether the verb should be in interrogative form
     * @returns {string} the conjugated verb
     */
    static conjugate(verbWord: string, options?: {
        tense: number;
        person: number;
        number: number;
        form: number;
        passive: boolean;
        progressive: boolean;
        perfect: boolean;
        interrogative: boolean;
    }): string;
    /**
     * Analyzes the input and returns a new string containing the stresses for each syllable of the input text .
     * @param {string} input - the text to analyze
     * @returns {string} a string containing the stresses for each syllable of the input text
     */
    static stresses(input: string): string;
    /**
     * Analyzes the input and returns a new string containing the syllables of the input text.
     * @param {string} input - the text to analyze
     * @returns {string} a string containing the syllables of the input text
     */
    static syllables(input: string): string;
    /**
     * Analyzes the input and returns a new string containing the phonemes of the input text.
     * @param {string} input - the text to analyze
     * @returns {string} a string containing the phones of the input text
     */
    static phones(input: string): string;
    /**
     * Analyzes the input to compute a set of features for the input,
     * including phonemes, syllables, stresses, and part-of-speech tags.
     * @param {string} input - the text to analyze
     * @param {object} [options] - options for the analysis
     * @param {boolean} options.simple=false - whether to use the simplified tag set [a, r, v, n]
     * @returns {object} an object containing the features of the input text (phones, syllables, stresses, pos), or the features inline
     */
    static analyze(input: string, options?: {
        simple: boolean;
    }): object;
    /**
     * A synchronous version of RiTa.spellsLike(). It compares the letters of the input word
     * (using a version of the Levenstein min-edit distance algorithm) to each word in the lexicon,
     *  returning the set of closest matches that also match the criteria in the options object.
     * @param {string} word - the word to match
     * @param {object} [options] - options for the search
     * @param {number} options.minLength=4 - the minimum length of the words
     * @param {number} options.maxLength - the maximum length of the words
     * @param {number} options.numSyllables - the number of syllables in the words
     * @param {number} options.limit=10 - the maximum number of results to return (pass -1 to return all matches)
     * @param {string} options.pos - the part-of-speech of the words to return, either from the Penn tag set
     * or the simplified tag set [a, r, v, n]
     * @param {boolean} options.shuffle=false - whether to shuffle the results before returning them
     * @return {string[]} an array of words matching the spelling pattern and criteria in the options object
     */
    static spellsLikeSync(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        pos: string;
        shuffle: boolean;
    }): string[];
    /**
     * A synchronous version of RiTa.lexicon.soundsLike(). It compares the phonemes of the input pattern (using a version of the Levenstein min-edit distance algorithm)
     *  to each word in the lexicon, returning the set of closest matches that also match the criteria in the options object.
     * @param {string} word - the word to match
     * @param {object} [options] - options for the search
     * @param {number} options.minLength=4 - the minimum length of the words
     * @param {number} options.maxLength - the maximum length of the words
     * @param {number} options.numSyllables - the number of syllables in the words
     * @param {number} options.limit=10 - the maximum number of results to return (pass -1 to return all matches)
     * @param {boolean} options.matchSpelling=false, if true will also attempt to match spelling by returning an intersection with RiTa.spellsLike()
     * @param {boolean} options.shuffle=false - whether to shuffle the results before returning them
     * @param {string} options.pos - the part-of-speech of the words to return, either from the Penn tag set
     *  or the simplified tag set [a, r, v, n]
     * @return {string[]} an array of words matching the phonemic pattern and criteria in the options object
     */
    static soundsLikeSync(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        matchSpelling: boolean;
        shuffle: boolean;
        pos: string;
    }): string[];
    /**
     * Synchronous version of RiTa.rhymes(). Returns words that rhyme with the given word.
     * Two words are considered as rhyming if their final stressed vowel and all following phonemes are identical.
     * @param {string} word - the word to match
     * @param {object} [options] - options for the search
     * @param {number} options.minLength=4 - the minimum length of the words
     * @param {number} options.maxLength - the maximum length of the words
     * @param {number} options.numSyllables - the number of syllables in the words
     * @param {number} options.limit=10 - the maximum number of results to return (pass -1 to return all matches)
     * @param {boolean} options.shuffle=false - whether to shuffle the results before returning them
     * @param {string} options.pos - the part-of-speech of the words to return, either from the Penn tag set
     * or the simplified tag set [a, r, v, n]
     * @return {string[]} an array of rhymes that match criteria in the options object
     */
    static rhymesSync(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        pos: string;
    }): string[];
    /**
     * A synchronous version of RiTa.search(). Searches for words in the lexicon matching
     *  the given criteria, either by length, syllable-count, spelling, phonemes, stresses,
     * part-of-speech, etc.
     * @param {(string|RegExp)} [pattern] - the pattern to match
     * @param {object} [options] - options for the search
     * @param {number} options.minLength=4 - the minimum length of the words
     * @param {number} options.maxLength - the maximum length of the words
     * @param {number} options.numSyllables - the number of syllables in the words
     * @param {number} options.limit=10 - the maximum number of results to return (pass -1 to return all matches)
     * @param {boolean} options.shuffle=false - whether to shuffle the results before returning them
     * @param {string} options.pos - the part-of-speech of the words to return, either from the Penn tag set
     * or the simplified tag set [a, r, v, n]
     * @param {string} options.type - the type of regex or string pattern to match, options are 'stresses' or 'phones' or 'letters' (the default)
     * @return {string[]} an array of words matching the criteria in both the pattern and the options object
     */
    static searchSync(pattern?: (string | RegExp), options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        pos: string;
        type: string;
    }): string[];
    /**
     * A synchronous version of RiTa.alliterations(). Finds alliterations by comparing the phonemes
     * of the input string to those of each word in the lexicon via a minimum-edit-distance metric.
     * @param {string} word - the word to match
     * @param {object} [options] - options for the search
     * @param {number} options.minLength=4 - the minimum length of the words
     * @param {number} options.maxLength - the maximum length of the words
     * @param {number} options.numSyllables - the number of syllables in the words
     * @param {number} options.limit=10 - the maximum number of results to return (pass -1 to return all matches)
     * @param {boolean} options.shuffle=false - whether to shuffle the results before returning them
     * @param {string} options.pos - the part-of-speech of the words to return, either from the Penn tag set
     *  or the simplified tag set [a, r, v, n]
     * @return {string[]} an array of alliterations matching criteria in the options object
     */
    static alliterationsSync(word: string, options?: {
        minLength: number;
        maxLength: number;
        numSyllables: number;
        limit: number;
        shuffle: boolean;
        pos: string;
    }): string[];
    /**
     * Returns a random integer from a range
     * The version of random() with one parameter returns a random integer from 0 up to but not including the number.
     * The version of random() with two parameters returns a random integer from the first number up to but not including the second.
     * @param {number} param1 - the first parameter
     * @param {number} [param2] - the second optional parameter
     * @returns {number} a random integer from the range
     */
    static randi(param1: number, param2?: number, ...args: any[]): number;
    /**
     * Returns a random number or a random element from an array.
     * The version of random() with no parameters returns a random number from 0 up to but not including 1.
     * The version of random() with one parameter works one of two ways. If the argument passed is a number, random() returns a random number from 0 up to but not including the number.
     * If the argument passed is an array, random() returns a random element from that array.
     * The version of random() with two parameters returns a random number from the first number up to but not including the second.
     * @param {number|object[]} [param1] - the minimum value of the random number, or an array of values to choose from
     * @param {number} [param2] - the maximum value of the random number
     * @returns {number|object} a random number or a random element from the array
     */
    static random(param1?: number | object[], param2?: number, ...args: any[]): number | object;
}
export namespace RiTa {
    export { RiGrammar };
    export { RiMarkov };
    export { Stemmer };
    export let randomizer: RandGen;
    export let tagger: Tagger;
    export let analyzer: Analyzer;
    export let concorder: Concorder;
    export let tokenizer: Tokenizer;
    export let inflector: Inflector;
    export let lexicon: Lexicon;
    export let conjugator: Conjugator;
    export let SILENT: boolean;
    export let SILENCE_LTS: boolean;
    export let VERSION: string;
    export let FIRST: number;
    export let SECOND: number;
    export let THIRD: number;
    export let PAST: number;
    export let PRESENT: number;
    export let FUTURE: number;
    export let SINGULAR: number;
    export let PLURAL: number;
    export let NORMAL: number;
    export let STRESS: string;
    export let NOSTRESS: string;
    export let PHONE_BOUNDARY: string;
    export let WORD_BOUNDARY: string;
    export let SYLLABLE_BOUNDARY: string;
    export let SENTENCE_BOUNDARY: string;
    export let VOWELS: string;
    export let PHONES: string[];
    export let ABRV: string[];
    export let QUESTIONS: string[];
    export let STOP_WORDS: string[];
    export let MASS_NOUNS: string[];
    export let INFINITIVE: number;
    export let GERUND: number;
    export let SPLIT_CONTRACTIONS: boolean;
    export { RiScript };
    export let riscript: any;
}
import RiMarkov from './markov.js';
declare const RiGrammar: any;
import Stemmer from './stemmer.js';
import RandGen from './randgen.js';
import Tagger from './tagger.js';
import Analyzer from './analyzer.js';
import Concorder from './concorder.js';
import Tokenizer from './tokenizer.js';
import Inflector from './inflector.js';
import Lexicon from './lexicon.js';
import Conjugator from './conjugator.js';
export {};
