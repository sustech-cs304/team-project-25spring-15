import { streamText, tool, UIMessage } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';
import { z } from 'zod';

export async function POST(req: Request) {
  const {
    id,
    messages,
    selectedChatModel,
  }: {
    id: string;
    messages: Array<UIMessage>;
    selectedChatModel: string;
  } = await req.json();

  const result = streamText({
    model: deepseek(selectedChatModel), // could be changed to 'deepseek-reasoner'
    messages,
    maxSteps: 5,
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
