import type { Message } from 'ai';
import { useCopyToClipboard } from 'usehooks-ts';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, Tooltip, Snackbar } from '@mui/material';

import { memo, useState } from 'react';

export function PureMessageActions({
  chatId,
  message,
  isLoading,
}: {
  chatId: string;
  message: Message;
  isLoading: boolean;
}) {
  const [_, copyToClipboard] = useCopyToClipboard();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  if (isLoading) return null;
  if (message.role === 'user') return null;

  return (
    <>
      <Tooltip title="复制">
        <Button
          sx={{
            minWidth: 32,
            minHeight: 32,
            width: 32,
            height: 32,
            padding: 0,
            borderRadius: '6px',
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={async () => {
            const textFromParts = message.parts
              ?.filter((part) => part.type === 'text')
              .map((part) => part.text)
              .join('\n')
              .trim();

            if (!textFromParts) {
              setSnackbarOpen(true);
              return;
            }

            await copyToClipboard(textFromParts);
            setSnackbarOpen(true);
          }}
        >
          <ContentCopyIcon sx={{ fontSize: 16 }} />
        </Button>
      </Tooltip>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="已复制到剪贴板"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    return true;
  },
);
