import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSave, FaTimes, FaCheckCircle, FaExclamationTriangle, FaEdit, FaTag, FaAlignLeft, FaFlag, FaStar, FaExclamationTriangle as FaExclamation, FaFire, FaCalendarAlt, FaClock } from "react-icons/fa";

const TaskEditForm = ({
  task,
  API_URL,
  setEditId,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  updateTaskInState,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [editPriority, setEditPriority] = useState(task.priority || "medium");
  const [editDueDate, setEditDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");

  // ✅ Initialize form values
  useEffect(() => {
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");
    setEditPriority(task.priority || "medium");
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
    setErrors({});
    setSuccessMessage("");
    setHasChanges(false);
  }, [task, setEditTitle, setEditDescription]);

  // ✅ Check for changes
  useEffect(() => {
    const titleChanged = editTitle.trim() !== (task.title || "");
    const descChanged = editDescription.trim() !== (task.description || "");
    const priorityChanged = editPriority !== (task.priority || "medium");
    const dueDateChanged = editDueDate !== (task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
    setHasChanges(titleChanged || descChanged || priorityChanged || dueDateChanged);
  }, [editTitle, editDescription, editPriority, editDueDate, task.title, task.description, task.priority, task.dueDate]);

  const validateForm = () => {
    const newErrors = {};

    if (!editTitle.trim()) {
      newErrors.title = "Task title is required";
    } else if (editTitle.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!editDescription.trim()) {
      newErrors.description = "Task description is required";
    } else if (editDescription.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveEdit = async () => {
    if (!validateForm()) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setErrors({ submit: "Please sign in again to update tasks." });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const updatedTask = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        dueDate: editDueDate || undefined,
      };

      const res = await axios.put(`${API_URL}/${task._id}`, updatedTask, {
        params: { userId },
      });

      updateTaskInState(res.data);

      setSuccessMessage("Task updated successfully!");
      setTimeout(() => {
        setEditId(null);
      }, 1500);

    } catch (err) {
      console.error("❌ Update Error:", err.message);
      setErrors({ submit: "Failed to update task. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        setEditId(null);
      }
    } else {
      setEditId(null);
    }
  };

  return (
    <div className="edit-form-container">
      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success d-flex align-items-center mb-4">
          <FaCheckCircle className="me-2" />
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="alert alert-danger d-flex align-items-center mb-4">
          <FaExclamationTriangle className="me-2" />
          {errors.submit}
        </div>
      )}

      {/* Task ID Display */}
      <div className="task-id-display mb-4">
        <FaTag className="me-2 text-muted" />
        <small className="text-muted">Editing Task ID: <code>{task._id?.slice(-8)}</code></small>
      </div>

      {/* Title Input */}
      <div className="form-group mb-4">
        <label className="form-label d-flex align-items-center">
          <FaEdit className="me-2 form-icon" style={{ color: '#007bff' }} />
          Task Title
          <span className="text-danger ms-1">*</span>
        </label>
        <input
          type="text"
          className={`form-control edit-input ${errors.title ? 'is-invalid' : ''}`}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Enter task title..."
          disabled={isLoading}
          maxLength={100}
        />
        {errors.title && (
          <div className="invalid-feedback d-flex align-items-center">
            <FaExclamationTriangle className="me-1" />
            {errors.title}
          </div>
        )}
        <small className="text-muted mt-1">
          {editTitle.length}/100 characters
        </small>
      </div>

      {/* Description Input */}
      <div className="form-group mb-4">
        <label className="form-label d-flex align-items-center">
          <FaAlignLeft className="me-2 form-icon" style={{ color: '#28a745' }} />
          Task Description
          <span className="text-danger ms-1">*</span>
        </label>
        <textarea
          className={`form-control edit-textarea ${errors.description ? 'is-invalid' : ''}`}
          rows="4"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Enter task description..."
          disabled={isLoading}
          maxLength={500}
        />
        {errors.description && (
          <div className="invalid-feedback d-flex align-items-center">
            <FaExclamationTriangle className="me-1" />
            {errors.description}
          </div>
        )}
        <small className="text-muted mt-1">
          {editDescription.length}/500 characters
        </small>
      </div>

      {/* Priority Selection */}
      <div className="form-group mb-4">
        <label className="form-label d-flex align-items-center">
          <FaFlag className="me-2 form-icon" style={{ color: '#ffc107' }} />
          Task Priority
        </label>
        <div className="priority-buttons d-flex gap-2">
          <button 
            type="button"
            className={`priority-btn ${editPriority === 'low' ? 'active' : ''}`}
            onClick={() => setEditPriority('low')}
            disabled={isLoading}
          >
            <FaFlag className="me-1" /> Low
          </button>
          <button 
            type="button"
            className={`priority-btn ${editPriority === 'medium' ? 'active' : ''}`}
            onClick={() => setEditPriority('medium')}
            disabled={isLoading}
          >
            <FaStar className="me-1" /> Medium
          </button>
          <button 
            type="button"
            className={`priority-btn ${editPriority === 'high' ? 'active' : ''}`}
            onClick={() => setEditPriority('high')}
            disabled={isLoading}
          >
            <FaExclamation className="me-1" /> High
          </button>
          <button 
            type="button"
            className={`priority-btn ${editPriority === 'urgent' ? 'active' : ''}`}
            onClick={() => setEditPriority('urgent')}
            disabled={isLoading}
          >
            <FaFire className="me-1" /> Urgent
          </button>
        </div>
      </div>

      {/* Due Date Selection */}
      <div className="form-group mb-4">
        <label className="form-label d-flex align-items-center">
          <FaCalendarAlt className="me-2 form-icon" style={{ color: '#6f42c1' }} />
          Due Date
        </label>
        <input
          type="date"
          className="form-control edit-input"
          value={editDueDate}
          onChange={(e) => setEditDueDate(e.target.value)}
          disabled={isLoading}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Action Buttons */}
      <div className="edit-actions">
        <button
          className="btn btn-save"
          onClick={saveEdit}
          disabled={isLoading || !hasChanges}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Updating...
            </>
          ) : (
            <>
              <FaSave className="me-2" />
              Save Changes
            </>
          )}
        </button>

        <button
          className="btn btn-cancel"
          onClick={handleCancel}
          disabled={isLoading}
        >
          <FaTimes className="me-2" />
          Cancel
        </button>
      </div>

      {/* Change Indicator */}
      {hasChanges && (
        <div className="change-indicator mt-3">
          <small className="text-warning">
            <FaExclamationTriangle className="me-1" />
            You have unsaved changes
          </small>
        </div>
      )}
    </div>
  );
};

export default TaskEditForm;
