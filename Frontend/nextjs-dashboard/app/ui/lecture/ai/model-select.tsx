'use client';

import { startTransition, useMemo, useOptimistic, useState } from 'react';
import { saveChatModelAsCookie } from '@/app/lib/data';
import { chatModels } from '@/app/lib/definitions';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Button,
  Menu,
  MenuItem,
  Box,
  Typography
} from '@mui/material';

export function ModelSelector({
  selectedModelId,
}: {
  selectedModelId: string;
} & React.ComponentProps<typeof Button>) {
  // 状态管理
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(selectedModelId);

  const selectedChatModel = useMemo(
    () => chatModels.find((chatModel) => chatModel.id === optimisticModelId),
    [optimisticModelId],
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        data-testid="model-selector"
        variant="text"
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
        sx={{
          px: { md: 2 },
          height: { md: 34 },
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          '&:hover': {
            backgroundColor: 'action.hover',
            color: 'primary.main',
          },
          textTransform: 'none',
          borderRadius: 2,
          minWidth: 0,
          boxShadow: 'none',
        }}
      >
        {selectedChatModel?.name}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          minWidth: '300px',
          mt: 1,
          borderRadius: 1,
          boxShadow: 2,
          p: 1.5,
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        {chatModels.map((chatModel) => {
          const { id } = chatModel;
          const isSelected = id === optimisticModelId;

          return (
            <MenuItem
              key={id}
              data-testid={`model-selector-item-${id}`}
              onClick={() => {
                handleClose();
                startTransition(() => {
                  setOptimisticModelId(id);
                  saveChatModelAsCookie(id);
                });
              }}
              sx={{
                borderRadius: 2, // 添加圆角
                width: '95%',
                mx: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 0.5,
                padding: 1,
              }}>
                <Typography variant="body1" sx={{ fontSize: '0.95rem' }} fontWeight={'medium'}>
                  {chatModel.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.85rem' }} fontWeight={'regular'}>
                  {chatModel.description}
                </Typography>
              </Box>

              {isSelected && (
                <CheckCircleIcon color="primary" sx={{ opacity: 1 }} />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
