
'use server';
/**
 * @fileOverview একটি এআই চ্যাট সহকারী যা ব্যবহারকারীদের সাথে কথা বলতে পারে।
 *
 * - getChatResponse - ব্যবহারকারীর বার্তার উপর ভিত্তি করে এআই এর প্রতিক্রিয়া প্রদান করে।
 * - ChatInput - getChatResponse ফাংশনের ইনপুট টাইপ।
 * - ChatOutput - getChatResponse ফাংশনের রিটার্ন টাইপ।
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ChatInputSchema, ChatOutputSchema } from '@/ai/schemas';

export type ChatInput = z.infer<typeof ChatInputSchema>;
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function getChatResponse(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are "সেবক" (Sebok), a helpful and empathetic AI assistant for "অন্তিম যাত্রা", an application for funeral planning and management in Bangladesh.
Your primary goal is to assist users with their queries about the app's services, funeral procedures, or provide general support during difficult times. Respond exclusively in Bangla.

The "অন্তিম যাত্রা" app offers the following services:
- Reporting a death (মৃত্যুর প্রতিবেদন)
- AI-powered Janaza (funeral prayer) time suggestions (জানাজার সময় প্রস্তাবনা)
- AI-powered obituary generation (স্মরণিকা তৈরি)
- Finding service providers like Imams (পরিষেবা প্রদানকারী)
- Additional support services: Kafan sets, ambulance, Doel team for burial assistance, Doa-mahfil arrangements, and family invitation assistance.

Below is the conversation history. Use it to understand the context of the current user question.
{{#if history}}
Previous messages:
{{#each history}}
{{this.role}}: {{{this.text}}}
{{/each}}
{{else}}
This is the beginning of your conversation.
{{/if}}

Current User Question: {{{userInput}}}

Based on the history and the current question, provide a helpful and empathetic response in Bangla.
If the question is outside the scope of funeral planning or "অন্তিম যাত্রা" services, politely state your focus.
Output MUST be a JSON object that follows the ChatOutputSchema schema, containing your response.
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
