# UI Components Usage Guide

## Snackbar/Toast Notifications

### Setup
The SnackbarProvider is already set up in App.jsx. Just import and use the hook in any component:

```jsx
import { useSnackbar } from '../../contexts/SnackbarContext';

function MyComponent() {
  const { showSnackbar } = useSnackbar();

  const handleSuccess = () => {
    showSnackbar('Task saved successfully!', 'success');
  };

  const handleError = () => {
    showSnackbar('Something went wrong!', 'error', 5000);
  };

  const handleWarning = () => {
    showSnackbar('Please check your input', 'warning');
  };

  const handleInfo = () => {
    showSnackbar('Task updated', 'info');
  };

  return (
    <button onClick={handleSuccess}>Show Success</button>
  );
}
```

### Snackbar Severity Types
- `'success'` - Green notification for successful actions
- `'error'` - Red notification for errors
- `'warning'` - Orange notification for warnings
- `'info'` - Blue notification for informational messages

## Confirmation Dialog

### Usage Example

```jsx
import { useConfirmDialog } from '../../hooks/useConfirmDialog';

function MyComponent() {
  const { showConfirmDialog, ConfirmDialog } = useConfirmDialog();

  const handleDelete = () => {
    showConfirmDialog(
      () => {
        // Action to perform on confirmation
        console.log('Deleted!');
      },
      {
        title: 'Delete Task',
        message: 'Are you sure you want to delete this task? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        severity: 'error', // 'error', 'warning', 'info'
      }
    );
  };

  return (
    <>
      <button onClick={handleDelete} className="btn-hover-lift">
        Delete Task
      </button>
      <ConfirmDialog />
    </>
  );
}
```

## CSS Classes for Animations

### Button Hover Effects
```jsx
<button className="btn-hover-lift">Hover Me</button>
```

### Card Hover Effects
```jsx
<div className="card-hover">
  Card content
</div>
```

### Scale on Hover
```jsx
<div className="hover-scale">
  Scales on hover
</div>
```

### Fade In Animation
```jsx
<div className="fade-in">
  Fades in on mount
</div>
```

### List Item Transitions
```jsx
<div className="list-item-transition">
  Smooth hover effect
</div>
```

## Dark/Light Mode

The app now has enhanced dark/light mode with smooth transitions. The mode is controlled through the Settings component and persisted in localStorage.

The theme automatically applies to all components with smooth transitions between modes.

