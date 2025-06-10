
import { z } from 'zod';

// For chat-flow.ts
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']).describe("কথোপকথনে বার্তা প্রেরকের ভূমিকা (ব্যবহারকারী বা মডেল)।"),
  text: z.string().describe("বার্তার বিষয়বস্তু।")
});

export const ChatInputSchema = z.object({
  userInput: z.string().describe('ব্যবহারকারীর বর্তমান বার্তা।'),
  history: z.array(ChatMessageSchema).optional().describe('পূর্ববর্তী কথোপকথনের ইতিহাস, যদি থাকে।'),
});

export const ChatOutputSchema = z.object({
  aiResponse: z.string().describe('এআই সহকারীর প্রতিক্রিয়া।'),
});

// For generate-invitation-flow.ts
export const GenerateInvitationInputSchema = z.object({
  deceasedName: z.string().describe('মৃত ব্যক্তির নাম।'),
  eventType: z.enum(['জানাজা', 'দাফন', 'দোয়া মাহফিল', 'কুলখানি', 'অন্যান্য']).describe('অনুষ্ঠানের প্রকার (যেমন: জানাজা, দোয়া মাহফিল)।'),
  eventDateTime: z.string().describe('অনুষ্ঠানের তারিখ ও সময় (যেমন: ২৫শে ডিসেম্বর, ২০২৪, দুপুর ২:০০ ঘটিকায়)।'),
  eventLocation: z.string().describe('অনুষ্ঠানের স্থান (যেমন: বায়তুল মোকাররম মসজিদ / মরহুমের নিজ বাসভবন)।'),
  hostName: z.string().optional().describe('আমন্ত্রণকারী বা আয়োজকের নাম (ঐচ্ছিক, যেমন: শোকসন্তপ্ত পরিবারবর্গ)।'),
  additionalMessage: z.string().optional().describe('কোনো অতিরিক্ত বার্তা বা বিশেষ অনুরোধ (ঐচ্ছিক)।'),
});

export const GenerateInvitationOutputSchema = z.object({
  invitationText: z.string().describe('এআই দ্বারা তৈরি করা আমন্ত্রণ বার্তা (সাধারণত এসএমএস বা হোয়াটসঅ্যাপের জন্য উপযুক্ত)।'),
  smsLink: z.string().describe('এসএমএস পাঠানোর জন্য একটি `sms:` স্কিমের লিঙ্ক।'),
  whatsappLink: z.string().describe('হোয়াটসঅ্যাপে বার্তা পাঠানোর জন্য একটি `https://wa.me/` লিঙ্ক (ফোন নম্বর ছাড়া)।')
});


// For generate-memorial-image-flow.ts
export const MemorialImageInputSchema = z.object({
  theme: z.string().describe('The theme for the memorial image, e.g., "Peaceful natural scenery", "Light of memory (like a candle or lantern)".'),
});

export const MemorialImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."),
  revisedPrompt: z.string().optional().describe("The revised prompt used by the model, if available.")
});

// For generate-obituary-flow.ts
export const GenerateObituaryInputSchema = z.object({
  deceasedName: z.string().describe('মৃত ব্যক্তির নাম।'),
  dateOfBirth: z.string().optional().describe('জন্ম তারিখ (YYYY-MM-DD), ঐচ্ছিক।'),
  dateOfDeath: z.string().describe('মৃত্যুর তারিখ (YYYY-MM-DD)।'),
  significantEvents: z.string().describe('জীবনের উল্লেখযোগ্য ঘটনা ও অর্জনসমূহ।'),
  personality: z.string().describe('ব্যক্তিত্বের প্রধান বৈশিষ্ট্যসমূহ।'),
  survivedBy: z.string().describe('পরিবারে কে কে আছেন (যেমন: স্ত্রী, পুত্র, কন্যা)।'),
});

export const GenerateObituaryOutputSchema = z.object({
  obituaryText: z.string().describe('এআই দ্বারা তৈরি করা স্মরণিকার পাঠ্য।'),
});

// For suggest-janaza-time.ts
export const SuggestJanazaTimeInputSchema = z.object({
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

export const SuggestJanazaTimeOutputSchema = z.object({
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

