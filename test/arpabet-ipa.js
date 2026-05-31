/**
 * Re-exports IPA conversion utilities from src/analyzer.js for use in tests.
 */
import Analyzer from '../src/analyzer.js';
export const arpabetToIpa = Analyzer.arpabetToIpa;
export const phonesToIpa = Analyzer.phonesToIpa;
export const syllablesToIpa = Analyzer.syllablesToIpa;
