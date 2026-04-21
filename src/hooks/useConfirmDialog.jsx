import { useState, useCallback } from 'react';
import ConfirmationDialog from '../common/ConfirmationDialog';

export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState({
    open: false,
    title: 'Confirm Action',
    message: 'Are you sure you want to perform this action?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    severity: 'warning',
    onConfirm: null,
  });

  const showConfirmDialog = useCallback((
    onConfirm,
    {
      title = 'Confirm Action',
      message = 'Are you sure you want to perform this action?',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      severity = 'warning',
    } = {}
  ) => {
    setDialogState({
      open: true,
      title,
      message,
      confirmText,
      cancelText,
      severity,
      onConfirm: () => {
        if (onConfirm) {
          onConfirm();
        }
        setDialogState((prev) => ({ ...prev, open: false }));
      },
    });
  }, []);

  const hideConfirmDialog = useCallback(() => {
    setDialogState((prev) => ({ ...prev, open: false }));
  }, []);

  const ConfirmDialogComponent = () => (
    <ConfirmationDialog
      open={dialogState.open}
      onClose={hideConfirmDialog}
      onConfirm={dialogState.onConfirm || hideConfirmDialog}
      title={dialogState.title}
      message={dialogState.message}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
      severity={dialogState.severity}
    />
  );

  return {
    showConfirmDialog,
    hideConfirmDialog,
    ConfirmDialog: ConfirmDialogComponent,
  };
};

