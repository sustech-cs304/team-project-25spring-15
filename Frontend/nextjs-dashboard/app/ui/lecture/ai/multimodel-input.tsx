'use client';

import type { UIMessage } from 'ai';
import cx from 'classnames';
import type React from 'react';
import {
  useRef,
  useEffect,
  useCallback,
  memo,
} from 'react';
import { toast } from 'sonner';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';

import StopIcon from '@mui/icons-material/Stop';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import { PreviewAttachment } from './preview-attachment';
import { Button } from '@mui/material';
import { Textarea } from '@/app/ui/text-area';
import { SuggestedActions } from './suggested-message';
import type { UseChatHelpers } from '@ai-sdk/react';
import { useParams } from 'next/navigation';

function PureMultimodalInput({
  chatId,  // 当前聊天会话的唯一标识符
  input,   // 当前输入框中的文本内容
  setInput,
  status,  // 聊天状态
  stop,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: {
  chatId: string;
  input: UseChatHelpers['input'];
  setInput: UseChatHelpers['setInput'];
  status: UseChatHelpers['status'];
  stop: () => void;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers['setMessages'];
  append: UseChatHelpers['append'];
  handleSubmit: UseChatHelpers['handleSubmit'];
  className?: string;
}) {
  const {courseId, lectureId} = useParams();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '98px';
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    'input',
    '',
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || '';
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const submitForm = useCallback(() => {
    // window.history.replaceState({}, '', `/chat/${chatId}`);

    handleSubmit(undefined, {
    });

    setLocalStorageInput('');
    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [
    handleSubmit,
    setLocalStorageInput,
    width,
    chatId,
  ]);

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 && (
          <SuggestedActions append={append} chatId={chatId} lectureId={lectureId as string}/>
        )}

      <Textarea
        data-testid="multimodal-input"
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className={cx(
          'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700',
          className,
        )}
        rows={2}
        autoFocus
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault();

            if (status !== 'ready') {
              toast.error('Please wait for the model to finish its response!');
            } else {
              submitForm();
            }
          }
        }}
      />

      <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
        {status === 'submitted' ? (
          <StopButton stop={stop} setMessages={setMessages} />
        ) : (
          <SendButton
            input={input}
            submitForm={submitForm}
          />
        )}
      </div>
    </div>
  );
}

// 目前只支持文字上传，无法传递附件
export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false;
    if (prevProps.status !== nextProps.status) return false;

    return true;
  },
);

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: UseChatHelpers['setMessages'];
}) {
  return (
    <Button
      data-testid="stop-button"
      sx={{
        minWidth: 36,
        minHeight: 36,
        width: 36,
        height: 36,
        padding: 0,
        borderRadius: '50%',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: '#f0f0f0',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: '#e0e0e0',
          boxShadow: 'none',
        },
      }}
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => messages);
      }}
    >
      <StopIcon />
    </Button>
  );
}

const StopButton = memo(PureStopButton);

function PureSendButton({
  submitForm,
  input,
}: {
  submitForm: () => void;
  input: string;
}) {
  return (
    <Button
      data-testid="send-button"
      sx={{
        minWidth: 36,
        minHeight: 36,
        width: 36,
        height: 36,
        padding: 0,
        borderRadius: '50%',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: '#f0f0f0',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: '#e0e0e0',
          boxShadow: 'none',
        },
      }}
      onClick={(event) => {
        event.preventDefault();
        submitForm();
      }}
      disabled={input.length === 0}
    >
      <ArrowUpwardIcon/>
    </Button>
  );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  return true;
});
