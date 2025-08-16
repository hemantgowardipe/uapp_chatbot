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
        content: z.string().describe('The text content of the document.'),
        images: z.array(z.string()).optional().describe('An array of page images as data URIs.')
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
  suggestedQuestions: z
    .array(z.string())
    .describe('A list of 3-4 relevant follow-up questions that the user might want to ask.'),
});
export type AnswerQuestionsOutput = z.infer<typeof AnswerQuestionsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'answerQuestionsPrompt',
  input: {schema: AnswerQuestionsInputSchema},
  output: {schema: AnswerQuestionsOutputSchema},
  prompt: `You are a helpful AI assistant for working with documents. Your tasks are to answer questions, summarize, analyze, and describe images based on the provided documents.

When you answer, you MUST adhere to the following rules:
1.  Base your answers primarily on the information within the provided documents.
2.  If you use information directly from a document, you MUST cite your source.
3.  For the 'snippet' field in a citation, provide a direct quote or a concise description of the information you used from the source.

After providing a thorough answer, you must suggest 3-4 relevant follow-up questions that the user might be interested in, based on the context of their question and the document content.

Documents:
{{#each documents}}
  Document Name: {{this.name}}
  Content: {{this.content}}
  {{#if this.images}}
    Images from the document are provided below. You can see them and should describe them if asked.
    {{#each this.images}}
      {{media url=this}}
    {{/each}}
  {{/if}}
{{/each}}

Question: {{question}}`,
});

const answerQuestionsFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFlow',
    inputSchema: AnswerQuestionsInputSchema,
    outputSchema: AnswerQuestionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function answerQuestions(
  input: AnswerQuestionsInput
): Promise<AnswerQuestionsOutput> {
  return answerQuestionsFlow(input);
}
