import React from "react";
import { FaPlusCircle, FaTrashAlt, FaBolt } from "react-icons/fa";

const TaskFormActions = ({ isSubmitting, title, description, onClear, onQuickCreate }) => {
  return (
    <div className="task-form-actions d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-4">
      {/* Quick Create Button - Minimal fields */}
      <button
        type="button"
        className="btn btn-primary"
        onClick={onQuickCreate}
        disabled={isSubmitting || !title.trim() || !description.trim()}
        title="Create task with basic details only"
        style={{ minHeight: '44px', fontSize: '16px' }}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span> Quick Creating...
          </>
        ) : (
          <>
            <FaBolt className="me-2" /> Quick Create
          </>
        )}
      </button>

      {/* Full Submit Button */}
      <button type="submit" className="btn btn-orange-filled" disabled={isSubmitting || !title.trim() || !description.trim()} style={{ minHeight: '44px', fontSize: '16px' }}>
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span> Adding...
          </>
        ) : (
          <>
            <FaPlusCircle className="me-2" /> Add New Task
          </>
        )}
      </button>


      {/* Clear Form Button */}
      {(title || description) && (
        <button
          type="button"
          className="btn btn-orange-outline"
          onClick={onClear}
          disabled={isSubmitting}
          style={{ minHeight: '44px', fontSize: '16px' }}
        >
          <FaTrashAlt className="me-2" /> Clear Form
        </button>
      )}
    </div>
  );
};

export default TaskFormActions;
