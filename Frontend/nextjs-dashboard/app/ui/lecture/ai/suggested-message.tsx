'use client';

import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import { memo } from 'react';
import { UseChatHelpers } from '@ai-sdk/react';
import { CourseWareAPI } from '@/app/lib/client-api';

interface SuggestedMessagesProps {
  chatId: string;
  lectureId: string;
  append: UseChatHelpers['append'];
}

function PureSuggestedActions({ chatId, lectureId, append }: SuggestedMessagesProps) {
  const basePrompt = 'Contents for the lecture in markdown format are below: ';
  const suggestedActions = [
    {
      title: 'Generate a mindmap',
      label: 'for contents in this lecture',
      action: 'Given the above contents, please draw a brief mindmap for it.',
    },
    {
      title: 'Generate a quiz',
      label: 'according to contents in this lecture',
      action: 'Given the above contents, please generate a tiny quiz for it.',
    },
    {
      title: 'Generate a brief summary',
      label: 'for contents in this lecture',
      action: 'Given the above contents, please give brief summary for the contents in the file',
    },
    {
      title: 'Write code to',
      label: `demonstrate djikstra's algorithm`,
      action: `Write code to demonstrate djikstra's algorithm`,
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="text"
            sx={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              textAlign: 'left',
              color: 'text.primary',
              backgroundColor: 'transparent',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '15px',
              padding: '10px 20px',
              '&:hover': {
                backgroundColor: 'action.hover',
                color: 'primary.main',
              },
            }}
            onClick={async () => {
              // window.history.replaceState({}, '', `/chat/${chatId}`);
              const res = await CourseWareAPI.getMarkdown(lectureId);
              const blob = res.data as Blob;
              const text = await blob.text();
              const prompt = basePrompt + text + suggestedAction.action;
              append({
                role: 'user',
                content: prompt,
              });
            }}
            className="text-sm flex-1 gap-1 sm:flex-col w-full h-auto"
          >
            <span style={{ textTransform: 'none' }} className='font-medium'>{suggestedAction.title}</span>
            <span style={{ textTransform: 'none' }} className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
