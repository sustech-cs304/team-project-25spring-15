"use client";

import React, { useState, useCallback } from 'react';
import MessageDialog, { MessageType } from '@/app/ui/components/MessageDialog';

interface MessageOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
}

interface MessageState {
  open: boolean;
  type: MessageType;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  showCancel: boolean;
  onConfirm?: () => void;
}

export function useMessage() {
  const [messageState, setMessageState] = useState<MessageState>({
    open: false,
    type: 'info',
    title: '',
    message: '',
    confirmText: '确定',
    cancelText: '取消',
    showCancel: false,
  });

  const showMessage = useCallback((
    type: MessageType,
    message: string,
    options: MessageOptions = {}
  ) => {
    const defaultTitles = {
      success: '成功',
      error: '错误',
      warning: '警告',
      info: '提示',
    };

    setMessageState({
      open: true,
      type,
      title: options.title || defaultTitles[type],
      message,
      confirmText: options.confirmText || '确定',
      cancelText: options.cancelText || '取消',
      showCancel: options.showCancel || false,
      onConfirm: options.onConfirm,
    });
  }, []);

  const success = useCallback((message: string, options?: MessageOptions) => {
    showMessage('success', message, options);
  }, [showMessage]);

  const error = useCallback((message: string, options?: MessageOptions) => {
    showMessage('error', message, options);
  }, [showMessage]);

  const warning = useCallback((message: string, options?: MessageOptions) => {
    showMessage('warning', message, options);
  }, [showMessage]);

  const info = useCallback((message: string, options?: MessageOptions) => {
    showMessage('info', message, options);
  }, [showMessage]);

  const confirm = useCallback((
    message: string,
    onConfirm: () => void,
    options?: Omit<MessageOptions, 'onConfirm'>
  ) => {
    showMessage('warning', message, {
      ...options,
      title: options?.title || '确认',
      showCancel: true,
      onConfirm,
    });
  }, [showMessage]);

  const closeMessage = useCallback(() => {
    setMessageState(prev => ({ ...prev, open: false }));
  }, []);

  const MessageComponent = () => (
    <MessageDialog
      open={messageState.open}
      type={messageState.type}
      title={messageState.title}
      message={messageState.message}
      onClose={closeMessage}
      onConfirm={messageState.onConfirm}
      confirmText={messageState.confirmText}
      cancelText={messageState.cancelText}
      showCancel={messageState.showCancel}
    />
  );

  return {
    success,
    error,
    warning,
    info,
    confirm,
    MessageComponent,
  };
} 