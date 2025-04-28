'use client';

import { ModelSelector } from './model-select';
import { Button } from '@mui/material';
import { memo } from 'react';

function PureChatHeader({
  chatId,
  selectedModelId,
  isReadonly,
}: {
  chatId: string;
  selectedModelId: string;
  isReadonly: boolean;
}) {
  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">

      {!isReadonly && (
        <ModelSelector
          selectedModelId={selectedModelId}
          className="order-1 md:order-2"
        />
      )}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
