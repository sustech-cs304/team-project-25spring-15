import { AiMessage, DEFAULT_CHAT_MODEL } from '@/app/lib/definitions';
import { Chat } from '@/app/ui/lecture/ai-view';
import { cookies } from 'next/headers';
import type { UIMessage } from 'ai';
import { auth } from '@/auth';
import { AiMessageAPI } from '@/app/lib/server-api';

export default async function Page({ params }: { params: Promise<{ courseId: string; lectureId: string }> }) {
  const { courseId, lectureId } = await params;

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get('chat-model');

  const session = await auth();
  const userId = session?.user?.userId;
  if (!userId) {
    throw new Error("Unauthorized: userId is missing");
  }
  const prevMessages = await AiMessageAPI.getMessages(userId?.toString(), lectureId);
  console.log("Prev messages: ", prevMessages);

  function convertToUIMessages(messages: Array<AiMessage>): Array<UIMessage> {
    if(messages === null) return [];
    return messages.map((message) => ({ // TODO: NOTHING TO STRINGFY parts
      id: message.chatId,
      parts: JSON.parse(message.parts) as UIMessage['parts'],
      role: message.role as UIMessage['role'],
      // Note: content will soon be deprecated in @ai-sdk/react
      content: '',
      createdAt: new Date(message.createdAt),
      experimental_attachments: [],
    }));
  }

  if (!chatModelFromCookie) {
    return (
      <div className="flex flex-col h-full w-full">
      <Chat
          id={lectureId} // TODO: change this lectureId, to make different lecture have different ai chatting
          initialMessages={convertToUIMessages(prevMessages)}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          isReadonly={false}
          userId={userId}
      />
    </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <Chat
          id={lectureId} // TODO: change this lectureId, to make different lecture have different ai chatting
          initialMessages={convertToUIMessages(prevMessages)}
          selectedChatModel={chatModelFromCookie.value}
          isReadonly={false}
          userId={userId}
      />
    </div>
  );
}
