import { appendResponseMessages, createDataStreamResponse, streamText, UIMessage } from 'ai';

import { AiMessage, myProvider } from '@/app/lib/definitions';
import { generateUUID, getTrailingMessageId } from '@/app/lib/utils';
import { systemPrompt } from '@/app/lib/prompts';
import { auth } from '@/auth';
import { AiMessageAPI } from '@/app/lib/server-api';

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.userId;

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const {
    id,
    messages,
    selectedChatModel,
  }: {
    id: string;
    messages: Array<UIMessage>;
    selectedChatModel: string;
  } = await req.json();

  // console.log("messages: ", messages);
  const lastMessage = messages[messages.length - 1];
  const idNum = Number(id);

  const message: AiMessage = {
    chatId: generateUUID(),
    lectureId: idNum,
    userId: userId,
    role: 'user',
    parts: JSON.stringify(lastMessage.parts), // 复制parts部分，包括reasoning
    createdAt: new Date(),
  };
  const res = await AiMessageAPI.saveMessage(message);

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
        onFinish: async ({ response }) => {
          try {
            const assistantId = getTrailingMessageId({
              messages: response.messages.filter(
                (message) => message.role === 'assistant',
              ),
            });
            console.log("assistant id: ", assistantId);

            if (!assistantId) {
              throw new Error('No assistant message found!');
            }
            const [, assistantMessage] = appendResponseMessages({
              messages: [lastMessage],
              responseMessages: response.messages,
            });
            console.log("assistant message: ", assistantMessage);
            console.log(assistantId);

            await AiMessageAPI.saveMessage({
              chatId: assistantId,
              userId: userId,
              lectureId: idNum,
              role: assistantMessage.role,
              parts: JSON.stringify(assistantMessage.parts),
              createdAt: new Date(),
            });
          } catch (e) {
            console.error('Failed to save chat');
          }
        }
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
