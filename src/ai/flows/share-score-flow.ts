
'use server';
/**
 * @fileOverview A flow to generate an image for sharing a game score.
 *
 * - shareScore - A function that handles the image generation process.
 * - ShareScoreInput - The input type for the shareScore function.
 * - ShareScoreOutput - The return type for the shareScore function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ShareScoreInputSchema = z.object({
  score: z.number().describe('The player\'s score.'),
  memeText: z.string().describe('A meme-like text to include in the image.'),
  language: z.string().describe('The language for the prompt (e.g., "Spanish", "English").'),
});
export type ShareScoreInput = z.infer<typeof ShareScoreInputSchema>;

const ShareScoreOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI."),
});
export type ShareScoreOutput = z.infer<typeof ShareScoreOutputSchema>;

export async function shareScore(input: ShareScoreInput): Promise<ShareScoreOutput> {
  return shareScoreFlow(input);
}

const shareScoreFlow = ai.defineFlow(
  {
    name: 'shareScoreFlow',
    inputSchema: ShareScoreInputSchema,
    outputSchema: ShareScoreOutputSchema,
  },
  async (input) => {
    const prompt = `Generate a fun, vibrant, and exciting image to celebrate a new high score of ${input.score} in a mobile tapping game called 'TapScore Mania'. The image should be visually striking, colorful, and suitable for sharing on social media. It must include the text "${input.memeText}" and the score "${input.score}" in a prominent, cool, and celebratory font. The style should be energetic and cartoonish, with elements like confetti, stars, or lightning bolts. Generate the image in ${input.language}.`;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        // Using a square aspect ratio for better compatibility with social media posts.
        aspectRatio: '1:1'
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }

    return { imageDataUri: media.url };
  }
);
