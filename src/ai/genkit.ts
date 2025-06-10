import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import genkitNext from '@genkit-ai/next'; // Changed from named import {genkitNext}

export const ai = genkit({
  plugins: [
    googleAI(),
    genkitNext(),
  ],
  model: 'googleai/gemini-2.0-flash',
});
