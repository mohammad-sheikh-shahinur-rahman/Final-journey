'use server';

/**
 * @fileOverview Suggests appropriate Janaza (funeral prayer) times based on the time of death.
 *
 * - suggestJanazaTime - A function that suggests Janaza times.
 * - SuggestJanazaTimeInput - The input type for the suggestJanazaTime function.
 * - SuggestJanazaTimeOutput - The return type for the suggestJanazaTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestJanazaTimeInputSchema = z.object({
  timeOfDeath: z
    .string()
    .describe(
      'The time of death, in ISO 8601 format (e.g., 2024-01-01T12:00:00+06:00). Must include the correct timezone.'
    ),
  localMasjidSchedule: z
    .string()
    .describe(
      'The schedule of prayers at the local masjid, including Fajr, Dhuhr, Asr, Maghrib, and Isha. Provide as a string.'
    ),
  location: z.string().describe('The general location of the deceased.'),
});
export type SuggestJanazaTimeInput = z.infer<typeof SuggestJanazaTimeInputSchema>;

const SuggestJanazaTimeOutputSchema = z.object({
  suggestedTimes: z
    .array(z.string())
    .describe(
      'An array of suggested Janaza times, in ISO 8601 format with timezone. Provide at least three options, with reasoning.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested times, considering Islamic traditions, local masjid schedules, and daylight hours.'
    ),
});
export type SuggestJanazaTimeOutput = z.infer<typeof SuggestJanazaTimeOutputSchema>;

export async function suggestJanazaTime(input: SuggestJanazaTimeInput): Promise<SuggestJanazaTimeOutput> {
  return suggestJanazaTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestJanazaTimePrompt',
  input: {schema: SuggestJanazaTimeInputSchema},
  output: {schema: SuggestJanazaTimeOutputSchema},
  prompt: `You are an expert in Islamic funeral traditions, familiar with the customs and practices surrounding Janaza (funeral prayer). Given the time of death and local masjid schedule, you will suggest appropriate Janaza times, taking into account Islamic guidelines, daylight hours, and convenience for the community.

Time of Death: {{{timeOfDeath}}}
Local Masjid Schedule: {{{localMasjidSchedule}}}
Location: {{{location}}}

Consider the following when suggesting times:

*   Islamic tradition prefers to perform the Janaza as soon as possible after death, but with respect for necessary preparations and community participation.
*   Avoid scheduling the Janaza during times when it would be difficult for people to attend, such as late at night or during peak work hours.
*   Take into account the time required for bathing (Ghusl), shrouding (Kafan), and transporting the body to the Masjid or cemetery.
*   Consider daylight hours, especially in regions with extreme weather conditions.

Provide at least three suggested Janaza times, with clear reasoning for each suggestion.

Output MUST be a JSON object that follows the SuggestJanazaTimeOutputSchema schema. Ensure the suggestedTimes array contains ISO 8601 format datetimes with timezone.
`,
});

const suggestJanazaTimeFlow = ai.defineFlow(
  {
    name: 'suggestJanazaTimeFlow',
    inputSchema: SuggestJanazaTimeInputSchema,
    outputSchema: SuggestJanazaTimeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
