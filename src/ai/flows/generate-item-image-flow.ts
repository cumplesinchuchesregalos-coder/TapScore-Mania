
'use server';
/**
 * @fileOverview A flow to generate an image for a shop item.
 *
 * - generateItemImage - A function that handles the image generation process.
 * - GenerateItemImageInput - The input type for the generateItemImage function.
 * - GenerateItemImageOutput - The return type for the generateItemImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateItemImageInputSchema = z.object({
  description: z.string().describe('A simple description of the item to generate, e.g., "gold coin", "diamond ring".'),
});
export type GenerateItemImageInput = z.infer<typeof GenerateItemImageInputSchema>;

const GenerateItemImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI."),
});
export type GenerateItemImageOutput = z.infer<typeof GenerateItemImageOutputSchema>;

export async function generateItemImage(input: GenerateItemImageInput): Promise<GenerateItemImageOutput> {
  return generateItemImageFlow(input);
}

const generateItemImageFlow = ai.defineFlow(
  {
    name: 'generateItemImageFlow',
    inputSchema: GenerateItemImageInputSchema,
    outputSchema: GenerateItemImageOutputSchema,
  },
  async (input) => {
    const prompt = `Generate a clean, simple, cartoon-style icon of a ${input.description} on a transparent background. The image should be iconic and clear, suitable for a mobile game.`;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        aspectRatio: '1:1'
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed for item.');
    }

    return { imageDataUri: media.url };
  }
);
