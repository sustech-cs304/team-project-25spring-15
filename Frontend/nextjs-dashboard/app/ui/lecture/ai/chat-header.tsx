'use client';

import { ModelSelector } from './model-select';
import { Button } from '@mui/material';
import { memo } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

function PureChatHeader({
  chatId,
  selectedModelId,
  isReadonly,
  onDelete,
}: {
  chatId: string;
  selectedModelId: string;
  isReadonly: boolean;
  onDelete?: () => void;
}) {
  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">

      {!isReadonly && (
        <>
          <ModelSelector
          selectedModelId={selectedModelId}
          className="order-1 md:order-2"
          />
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            className="order-2 md:order-3"
            sx={{
              px: { md: 2 },
              height: { md: 34 },
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'action.hover',
                color: 'error.main',
              },
              textTransform: 'none',
              borderRadius: 2,
              minWidth: 0,
              boxShadow: 'none',
              ml: 1,
            }}
            onClick={onDelete}
          >
            删除记录
          </Button>
        </>
      )}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
