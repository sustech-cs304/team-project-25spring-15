'use client';

import type { Attachment, UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

import { ChatHeader } from './ai/chat-header';
import { Messages } from './ai/messages';
import { MultimodalInput } from './ai/multimodel-input';
import { fetcher, generateUUID } from '@/app/lib/utils';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { AiAPI } from '@/app/lib/client-api';
// import { getChatHistoryPaginationKey } from './sidebar-history';

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  isReadonly,
  userId,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  selectedChatModel: string;
  isReadonly: boolean;
  userId: number;
}) {
  // const { mutate } = useSWRConfig();
  const params = useParams();
  const {courseId, lectureId} = params;

  const onDelete = async () => {
    try {
      await AiAPI.removeMessages(userId.toString(), id); // 删除后端所有消息
      setMessages([]); // 清空前端消息
      alert('聊天记录已删除');
    } catch(e) {
      console.log('error', e)
      alert('删除失败，请重试')
    }
  }

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat({
    id: lectureId?.toString(),
    body: { id: lectureId, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      // mutate(unstable_serialize(getChatHistoryPaginationKey));
      console.log("on finish");
    },
    onError: () => {
      toast.error('An error occurred, please try again!');
    },
  });

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <ChatHeader
          chatId={id}
          selectedModelId={selectedChatModel}
          isReadonly={false}
          onDelete={onDelete}
        />

        <Messages
          chatId={id}
          status={status}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isArtifactVisible={false} //{isArtifactVisible}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              status={status}
              stop={stop}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          )}
        </form>
      </div>
    </>
  );
}
