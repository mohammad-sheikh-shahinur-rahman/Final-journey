
'use server';
/**
 * @fileOverview Generates invitation messages for funeral-related events using AI.
 *
 * - generateInvitation - A function that generates invitation messages.
 * - GenerateInvitationInput - The input type for the generateInvitation function.
 * - GenerateInvitationOutput - The return type for the generateInvitation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateInvitationInputSchema = z.object({
  deceasedName: z.string().describe('মৃত ব্যক্তির নাম।'),
  eventType: z.enum(['জানাজা', 'দাফন', 'দোয়া মাহফিল', 'কুলখানি', 'অন্যান্য']).describe('অনুষ্ঠানের প্রকার (যেমন: জানাজা, দোয়া মাহফিল)।'),
  eventDateTime: z.string().describe('অনুষ্ঠানের তারিখ ও সময় (যেমন: ২৫শে ডিসেম্বর, ২০২৪, দুপুর ২:০০ ঘটিকায়)।'),
  eventLocation: z.string().describe('অনুষ্ঠানের স্থান (যেমন: বায়তুল মোকাররম মসজিদ / মরহুমের নিজ বাসভবন)।'),
  hostName: z.string().optional().describe('আমন্ত্রণকারী বা আয়োজকের নাম (ঐচ্ছিক, যেমন: শোকসন্তপ্ত পরিবারবর্গ)।'),
  additionalMessage: z.string().optional().describe('কোনো অতিরিক্ত বার্তা বা বিশেষ অনুরোধ (ঐচ্ছিক)।'),
});
export type GenerateInvitationInput = z.infer<typeof GenerateInvitationInputSchema>;

export const GenerateInvitationOutputSchema = z.object({
  invitationText: z.string().describe('এআই দ্বারা তৈরি করা আমন্ত্রণ বার্তা (সাধারণত এসএমএস বা হোয়াটসঅ্যাপের জন্য উপযুক্ত)।'),
  smsLink: z.string().describe('এসএমএস পাঠানোর জন্য একটি `sms:` স্কিমের লিঙ্ক।'),
  whatsappLink: z.string().describe('হোয়াটসঅ্যাপে বার্তা পাঠানোর জন্য একটি `https://wa.me/` লিঙ্ক (ফোন নম্বর ছাড়া)।')
});
export type GenerateInvitationOutput = z.infer<typeof GenerateInvitationOutputSchema>;

export async function generateInvitation(input: GenerateInvitationInput): Promise<GenerateInvitationOutput> {
  return generateInvitationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInvitationPrompt',
  input: {schema: GenerateInvitationInputSchema},
  output: {schema: GenerateInvitationOutputSchema.pick({ invitationText: true })}, // AI only generates text
  prompt: `আপনি একজন সহানুভূতিশীল এবং দক্ষ জনসংযোগ সহকারী। আপনার কাজ হলো বাংলায় অন্ত্যেষ্টিক্রিয়া সম্পর্কিত অনুষ্ঠানের জন্য সংক্ষিপ্ত, তথ্যপূর্ণ এবং সম্মানজনক আমন্ত্রণ বার্তা তৈরি করা। বার্তাটি যেন এসএমএস বা হোয়াটসঅ্যাপের মাধ্যমে পাঠানোর জন্য উপযুক্ত হয়।

অনুগ্রহ করে নিচের তথ্যগুলো ব্যবহার করে একটি খসড়া আমন্ত্রণ তৈরি করুন:

মৃতের নাম: {{{deceasedName}}}
অনুষ্ঠানের প্রকার: {{{eventType}}}
তারিখ ও সময়: {{{eventDateTime}}}
স্থান: {{{eventLocation}}}
{{#if hostName}}আমন্ত্রণকারী: {{{hostName}}}{{/if}}
{{#if additionalMessage}}বিশেষ বার্তা: {{{additionalMessage}}}{{/if}}

কিছু নির্দেশিকা:
- বার্তাটি সংক্ষিপ্ত রাখুন।
- মৃতের নাম এবং অনুষ্ঠানের বিবরণ পরিষ্কারভাবে উল্লেখ করুন।
- প্রয়োজনে "ইন্না লিল্লাহি ওয়া ইন্না ইলাইহি রাজিউন" বাক্যটি ব্যবহার করতে পারেন।
- আমন্ত্রণকারী হিসেবে "শোকসন্তপ্ত পরিবারবর্গ" বা প্রদত্ত নামটি ব্যবহার করুন যদি থাকে, অন্যথায় এটি বাদ দিন।

Output MUST be a JSON object that follows the GenerateInvitationOutputSchema schema (only the 'invitationText' field), providing the invitation text in Bangla.
The 'smsLink' and 'whatsappLink' fields will be constructed by the application later based on this 'invitationText'.
`,
});

const generateInvitationFlow = ai.defineFlow(
  {
    name: 'generateInvitationFlow',
    inputSchema: GenerateInvitationInputSchema,
    outputSchema: GenerateInvitationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.invitationText) {
      throw new Error("AI did not return an invitation text.");
    }
    
    const encodedText = encodeURIComponent(output.invitationText);
    return {
      invitationText: output.invitationText,
      smsLink: `sms:?body=${encodedText}`,
      whatsappLink: `https://wa.me/?text=${encodedText}`
    };
  }
);
