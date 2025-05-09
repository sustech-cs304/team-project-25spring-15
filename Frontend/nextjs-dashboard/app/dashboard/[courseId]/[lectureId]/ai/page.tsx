import { DEFAULT_CHAT_MODEL } from '@/app/lib/definitions';
import { Chat } from '@/app/ui/lecture/ai-view';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get('chat-model');

  if (!chatModelFromCookie) {
    return (
      <div className="flex flex-col h-full w-full">
      <Chat
          id={'0'} // TODO: change this lectureId, to make different lecture have different ai chatting
          initialMessages={[]}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          isReadonly={false}
      />
    </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <Chat
          id={'0'} // TODO: change this lectureId, to make different lecture have different ai chatting
          initialMessages={[]}
          selectedChatModel={chatModelFromCookie.value}
          isReadonly={false}
      />
    </div>
  );
}
