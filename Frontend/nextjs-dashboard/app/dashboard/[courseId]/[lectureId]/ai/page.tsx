import { Chat } from '@/app/ui/lecture/ai/chat';
import { Box } from '@mui/material';

export default function Page() {
  return (
    <div className="flex flex-col h-full w-full">
      <Chat
          id={'0'}
          initialMessages={[]}
          selectedChatModel={'deepseek-chat'}
          isReadonly={false}
      />
    </div>
  );
}
