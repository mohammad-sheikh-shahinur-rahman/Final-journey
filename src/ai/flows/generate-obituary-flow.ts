
'use server';
/**
 * @fileOverview Generates an obituary using AI.
 *
 * - generateObituary - A function that generates an obituary.
 * - GenerateObituaryInput - The input type for the generateObituary function.
 * - GenerateObituaryOutput - The return type for the generateObituary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { GenerateObituaryInputSchema, GenerateObituaryOutputSchema } from '@/ai/schemas';

export type GenerateObituaryInput = z.infer<typeof GenerateObituaryInputSchema>;
export type GenerateObituaryOutput = z.infer<typeof GenerateObituaryOutputSchema>;

export async function generateObituary(input: GenerateObituaryInput): Promise<GenerateObituaryOutput> {
  return generateObituaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateObituaryPrompt',
  input: {schema: GenerateObituaryInputSchema},
  output: {schema: GenerateObituaryOutputSchema},
  prompt: `আপনি একজন সহানুভূতিশীল এবং দক্ষ স্মরণিকা লেখক। আপনার কাজ হলো বাংলায় একটি মর্মস্পর্শী ও সম্মানজনক স্মরণিকা তৈরি করা। অনুগ্রহ করে নিচের তথ্যগুলো ব্যবহার করে একটি খসড়া তৈরি করুন:

মৃতের নাম: {{{deceasedName}}}
{{#if dateOfBirth}}জন্ম তারিখ: {{{dateOfBirth}}}{{/if}}
মৃত্যুর তারিখ: {{{dateOfDeath}}}
জীবনের উল্লেখযোগ্য ঘটনা ও অর্জনসমূহ: {{{significantEvents}}}
ব্যক্তিত্বের প্রধান বৈশিষ্ট্যসমূহ: {{{personality}}}
পরিবারে যারা আছেন: {{{survivedBy}}}

স্মরণিকাটি মৃতের জীবন, তার অবদান এবং প্রিয়জনদের উপর তার প্রভাব সুন্দরভাবে ফুটিয়ে তুলবে। এটি যেন আন্তরিক ও শ্রদ্ধাশীল ভাষায় লেখা হয়।

Output MUST be a JSON object that follows the GenerateObituaryOutputSchema schema, providing the obituary text in Bangla.
`,
});

const generateObituaryFlow = ai.defineFlow(
  {
    name: 'generateObituaryFlow',
    inputSchema: GenerateObituaryInputSchema,
    outputSchema: GenerateObituaryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

