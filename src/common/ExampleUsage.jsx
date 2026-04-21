/**
 * Example component demonstrating how to use Snackbar and Confirmation Dialog
 * This is just a reference - you can delete this file if not needed
 */

import React from 'react';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useConfirmDialog } from '../hooks/useConfirmDialog';

const ExampleUsage = () => {
  const { showSnackbar } = useSnackbar();
  const { showConfirmDialog, ConfirmDialog } = useConfirmDialog();

  const handleSuccess = () => {
    showSnackbar('Operation completed successfully!', 'success');
  };

  const handleError = () => {
    showSnackbar('An error occurred!', 'error');
  };

  const handleWarning = () => {
    showSnackbar('Please check your input', 'warning');
  };

  const handleInfo = () => {
    showSnackbar('Information message', 'info');
  };

  const handleDelete = () => {
    showConfirmDialog(
      () => {
        showSnackbar('Item deleted successfully!', 'success');
      },
      {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this item? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        severity: 'error',
      }
    );
  };

  const handleUpdate = () => {
    showConfirmDialog(
      () => {
        showSnackbar('Item updated successfully!', 'success');
      },
      {
        title: 'Confirm Update',
        message: 'Do you want to save these changes?',
        confirmText: 'Save',
        cancelText: 'Cancel',
        severity: 'info',
      }
    );
  };

  return (
    <div className="container mt-4">
      <h2>UI Components Examples</h2>
      
      <div className="row gap-3 mt-3">
        <div className="col-12">
          <h4>Snackbar Examples</h4>
          <div className="d-flex gap-2 flex-wrap">
            <button 
              className="btn btn-success btn-hover-lift" 
              onClick={handleSuccess}
            >
              Success Snackbar
            </button>
            <button 
              className="btn btn-danger btn-hover-lift" 
              onClick={handleError}
            >
              Error Snackbar
            </button>
            <button 
              className="btn btn-warning btn-hover-lift" 
              onClick={handleWarning}
            >
              Warning Snackbar
            </button>
            <button 
              className="btn btn-info btn-hover-lift" 
              onClick={handleInfo}
            >
              Info Snackbar
            </button>
          </div>
        </div>

        <div className="col-12 mt-4">
          <h4>Confirmation Dialog Examples</h4>
          <div className="d-flex gap-2 flex-wrap">
            <button 
              className="btn btn-danger btn-hover-lift" 
              onClick={handleDelete}
            >
              Delete Item
            </button>
            <button 
              className="btn btn-primary btn-hover-lift" 
              onClick={handleUpdate}
            >
              Update Item
            </button>
          </div>
        </div>

        <div className="col-12 mt-4">
          <h4>Hover Animation Examples</h4>
          <div className="d-flex gap-3">
            <div className="card card-hover" style={{ width: '18rem', padding: '1rem' }}>
              <h5>Hover Card</h5>
              <p>Hover over this card to see the animation</p>
            </div>
            <div className="hover-scale" style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
              <h5>Scale on Hover</h5>
              <p>This scales up on hover</p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog />
    </div>
  );
};

export default ExampleUsage;

