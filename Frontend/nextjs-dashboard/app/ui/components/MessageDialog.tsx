"use client";

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

interface MessageDialogProps {
  open: boolean;
  type: MessageType;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const messageConfig = {
  success: {
    icon: SuccessIcon,
    color: '#4caf50',
    backgroundColor: '#e8f5e8',
  },
  error: {
    icon: ErrorIcon,
    color: '#f44336',
    backgroundColor: '#ffebee',
  },
  warning: {
    icon: WarningIcon,
    color: '#ff9800',
    backgroundColor: '#fff3e0',
  },
  info: {
    icon: InfoIcon,
    color: '#2196f3',
    backgroundColor: '#e3f2fd',
  },
};

export default function MessageDialog({
  open,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = '确定',
  cancelText = '取消',
  showCancel = false,
}: MessageDialogProps) {
  const config = messageConfig[type];
  const IconComponent = config.icon;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'visible',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          backgroundColor: config.backgroundColor,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            pr: 6,
            color: config.color,
            fontWeight: 'bold',
          }}
        >
          <IconComponent sx={{ fontSize: 32 }} />
          {title}
        </DialogTitle>
        
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        {showCancel && (
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            {cancelText}
          </Button>
        )}
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            backgroundColor: config.color,
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: config.color,
              opacity: 0.9,
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 