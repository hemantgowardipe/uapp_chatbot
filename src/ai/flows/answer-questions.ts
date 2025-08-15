'use server';

/**
 * @fileOverview Implements the question answering flow for DocuChat Secure.
 *
 * - answerQuestions - A function that answers questions based on the provided documents.
 * - AnswerQuestionsInput - The input type for the answerQuestions function.
 * - AnswerQuestionsOutput - The return type for the answerQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsInputSchema = z.object({
  documents: z
    .array(
      z.object({
        name: z.string().describe('The name of the document.'),
        content: z.string().describe('The content of the document.'),
      })
    )
    .describe('The documents to answer questions from.'),
  question: z.string().describe('The question to answer.'),
});
export type AnswerQuestionsInput = z.infer<typeof AnswerQuestionsInputSchema>;

const AnswerQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
  sources: z
    .array(
      z.object({
        documentName: z.string().describe('The name of the document.'),
        snippet: z.string().describe('The relevant snippet from the document.'),
      })
    )
    .describe('The sources used to answer the question.'),
});
export type AnswerQuestionsOutput = z.infer<typeof AnswerQuestionsOutputSchema>;

export async function answerQuestions(input: AnswerQuestionsInput): Promise<AnswerQuestionsOutput> {
  return answerQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsPrompt',
  input: {schema: AnswerQuestionsInputSchema},
  output: {schema: AnswerQuestionsOutputSchema},
  prompt: `You are a helpful AI assistant for working with documents. Your tasks include answering questions, summarizing, analyzing, and providing suggestions based on the provided documents. When answering, you should primarily use the information within the documents. However, you can also use your general knowledge to provide helpful analysis, critiques, and suggestions for improvement. When you pull information directly from a document, you MUST cite your sources.

Documents:
{{#each documents}}
  Document Name: {{this.name}}
  Content: {{this.content}}
{{/each}}

Question: {{question}}`,
});

const answerQuestionsFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFlow',
    inputSchema: AnswerQuestionsInputSchema,
    outputSchema: AnswerQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
