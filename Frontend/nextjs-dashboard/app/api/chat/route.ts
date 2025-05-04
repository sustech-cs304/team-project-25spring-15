import { createDataStreamResponse, streamText, UIMessage } from 'ai';

import { myProvider } from '@/app/lib/definitions';
import { generateUUID } from '@/app/lib/utils';
import { systemPrompt } from '@/app/lib/prompts';

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

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: myProvider.languageModel(selectedChatModel),
        system: systemPrompt({ selectedChatModel }),
        messages,
        maxSteps: 5,
        // experimental_activeTools:
        //   selectedChatModel === 'chat-model-reasoning'
        //     ? []
        //     : [
        //         'createDocument',
        //         'updateDocument',
        //         'requestSuggestions',
        //       ],
        experimental_generateMessageId: generateUUID,
        // tools: {
        //   createDocument: createDocument({ session, dataStream }),
        //   updateDocument: updateDocument({ session, dataStream }),
        //   requestSuggestions: requestSuggestions({
        //     session,
        //     dataStream,
        //   }),
        // },
      });

      result.consumeStream();

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: () => {
      return 'Oops, an error occurred!';
    },
  });
}
