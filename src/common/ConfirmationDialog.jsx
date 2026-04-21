import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Fade,
} from '@mui/material';

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning', // 'error', 'warning', 'info'
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return '#d32f2f';
      case 'warning':
        return '#ed6c02';
      default:
        return '#1976d2';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 200 }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle
        id="confirmation-dialog-title"
        sx={{
          fontWeight: 600,
          borderBottom: `2px solid ${getSeverityColor()}20`,
          pb: 1.5,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ pt: 2.5 }}>
        <DialogContentText id="confirmation-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: getSeverityColor(),
            textTransform: 'none',
            borderRadius: '8px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: getSeverityColor(),
              filter: 'brightness(0.9)',
              transform: 'translateY(-1px)',
              boxShadow: `0 4px 12px ${getSeverityColor()}40`,
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

