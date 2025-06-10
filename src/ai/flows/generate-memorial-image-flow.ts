'use server';
/**
 * @fileOverview Generates memorial images using AI based on a given theme.
 *
 * - generateMemorialImage - A function that generates a memorial image.
 * - MemorialImageInput - The input type for the generateMemorialImage function.
 * - MemorialImageOutput - The return type for the generateMemorialImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const MemorialImageInputSchema = z.object({
  theme: z.string().describe('The theme for the memorial image, e.g., "Peaceful natural scenery", "Light of memory (like a candle or lantern)".'),
  // Optional: Add deceasedName if you want to subtly incorporate it or guide the AI, but keep image respectful.
  // deceasedName: z.string().optional().describe('The name of the deceased, to subtly guide the image if appropriate.'),
});
export type MemorialImageInput = z.infer<typeof MemorialImageInputSchema>;

export const MemorialImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."),
  revisedPrompt: z.string().optional().describe("The revised prompt used by the model, if available.")
});
export type MemorialImageOutput = z.infer<typeof MemorialImageOutputSchema>;

export async function generateMemorialImage(input: MemorialImageInput): Promise<MemorialImageOutput> {
  return generateMemorialImageFlow(input);
}

// Note: Image generation models might not strictly follow complex output schemas like text models.
// The primary output is the image itself.
const generateMemorialImageFlow = ai.defineFlow(
  {
    name: 'generateMemorialImageFlow',
    inputSchema: MemorialImageInputSchema,
    outputSchema: MemorialImageOutputSchema,
  },
  async (input) => {
    const imagePrompt = `Generate a high-quality, serene, and respectful image based on the theme: '${input.theme}'. This image is intended for a memorial or obituary. It should evoke feelings of peace, remembrance, and dignity. Avoid direct depictions of human faces. The style should be artistic and somber.`;

    const {media, prompt} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', // Ensure this model is capable of image generation
      prompt: imagePrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // Must request IMAGE modality
        // safetySettings: [ // Optional: adjust safety settings if needed
        //   { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        //   { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        //   { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        //   { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        // ],
      },
    });

    if (!media || !media.url) {
      throw new Error('AI did not return an image. The response might have been blocked due to safety settings or other issues.');
    }

    return {
      imageDataUri: media.url, // This will be the data URI
      revisedPrompt: prompt?.toString(),
    };
  }
);