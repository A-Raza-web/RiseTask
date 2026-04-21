import React, { useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaCheckCircle, FaCalendarAlt, FaStar, FaExclamationTriangle, FaFire, FaFlag, FaClock, FaCheck, FaTimes } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import TaskEditForm from "./TaskEditForm";

// Helper functions outside component for performance
const getPriorityData = (priority) => {
    switch (priority) {
        case "low":
            return {
                color: "#28a745",
                gradient: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                icon: <FaFlag style={{ color: "white" }} />,
                textColor: "#155724",
                bgColor: "rgba(40, 167, 69, 0.1)"
            };
        case "medium":
            return {
                color: "#ffc107",
                gradient: "linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)",
                icon: <FaStar style={{ color: "white" }} />,
                textColor: "#856404",
                bgColor: "rgba(255, 193, 7, 0.1)"
            };
        case "high":
            return {
                color: "#fd7e14",
                gradient: "linear-gradient(135deg, #fd7e14 0%, #e8590c 100%)",
                icon: <FaExclamationTriangle style={{ color: "white" }} />,
                textColor: "#8f2d0f",
                bgColor: "rgba(253, 126, 20, 0.1)"
            };
        case "urgent":
            return {
                color: "#dc3545",
                gradient: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                icon: <FaFire style={{ color: "white" }} />,
                textColor: "#721c24",
                bgColor: "rgba(220, 53, 69, 0.1)"
            };
        default:
            return {
                color: "#6c757d",
                gradient: "linear-gradient(135deg, #6c757d 0%, #5a6268 100%)",
                icon: null,
                textColor: "#383d41",
                bgColor: "rgba(108, 117, 125, 0.1)"
            };
    }
};

const TaskItem = ({ task, editId, setEditId, editTitle, setEditTitle, editDescription, setEditDescription, updateTaskInState, API_URL, handleDelete }) => {
    const { _id, title, description, completed, priority, createdAt, updatedAt } = task;
    const priorityData = getPriorityData(priority);

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // ✅ Toggle Complete Task
    const handleToggleComplete = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            const res = await axios.patch(`${API_URL}/${_id}/toggle`, null, {
                params: { userId },
            });
            const updatedTask = res.data;

            updateTaskInState(updatedTask);
        } catch (err) {
            console.error("Failed to toggle task:", err);
        }
    };

    // ✅ Delete Task
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        handleDelete(_id);
        setShowDeleteModal(false);
    };

    // ✅ Start Edit
    const startEdit = () => {
        setShowEditModal(true);
        setEditId(_id);
        setEditTitle(title);
        setEditDescription(description);
    };

    const handleEditClose = () => {
        setShowEditModal(false);
        setEditId(null);
    };

    return (
        <>
            <div className="task-item-wrapper">
                <div className={`task-card-modern ${completed ? 'task-completed' : ''} priority-${priority}`}>
                    {/* Priority Banner */}
                    <div className="task-priority-banner" style={{ background: priorityData.gradient }}>
                        <div className="priority-icon">
                            {priorityData.icon}
                        </div>
                        <span className="priority-label">{priority.toUpperCase()}</span>
                    </div>

                    {/* Task Content */}
                    <div className="task-content">
                        {/* Completion Status Indicator */}
                        {completed && (
                            <div className="completion-indicator">
                                <FaCheck className="completion-icon" />
                                <span className="completion-text">COMPLETED</span>
                            </div>
                        )}

                        {/* Title */}
                        <h5 className={`task-title ${completed ? 'completed-text' : ''}`}>
                            {title}
                        </h5>

                        {/* Description */}
                        <p className={`task-description ${completed ? 'completed-text' : ''}`}>
                            {description}
                        </p>

                        {/* Meta Information */}
                        <div className="task-meta">
                            <div className="meta-item">
                                <FaCalendarAlt className="meta-icon" />
                                <span className="meta-text">
                                    {new Date(createdAt || updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="meta-item">
                                <FaClock className="meta-icon" />
                                <span className="meta-text">
                                    {new Date(createdAt || updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="task-actions">
                        <button
                            className={`action-btn complete-btn ${completed ? 'undo-btn' : 'complete-btn-primary'}`}
                            onClick={handleToggleComplete}
                            title={completed ? "Mark as pending" : "Mark as complete"}
                        >
                            {completed ? <FaClock className="btn-icon" /> : <FaCheckCircle className="btn-icon" />}
                            <span className="btn-text">{completed ? "Undo" : "Complete"}</span>
                        </button>

                        <button
                            className="action-btn edit-btn"
                            onClick={startEdit}
                            title="Edit task"
                        >
                            <FaEdit className="btn-icon" />
                            <span className="btn-text">Edit</span>
                        </button>

                        <button
                            className="action-btn delete-btn"
                            onClick={handleDeleteClick}
                            title="Delete task"
                        >
                            <FaTrash className="btn-icon" />
                            <span className="btn-text">Delete</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Task Modal */}
            <Modal
                show={showEditModal}
                onHide={handleEditClose}
                size="lg"
                centered
                className="task-modal edit-modal-enhanced"
            >
                <Modal.Header style={{
                    background: priorityData.gradient,
                    color: 'white',
                    borderBottom: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                }} className="edit-modal-header">
                    <Modal.Title className="d-flex align-items-center">
                        <div className="modal-icon-wrapper me-3">
                            <FaEdit />
                        </div>
                        <div>
                            <h5 className="mb-0">Edit Task</h5>
                            <small className="modal-subtitle">Update task details</small>
                        </div>
                    </Modal.Title>
                    <div className="modal-priority-indicator">
                        <span className="priority-badge" style={{ background: priorityData.gradient }}>
                            {priorityData.icon}
                            <span className="ms-1">{priority.toUpperCase()}</span>
                        </span>
                    </div>
                </Modal.Header>
                <Modal.Body className="edit-modal-body">
                    <TaskEditForm
                        {...{ task, API_URL, setEditId: handleEditClose, editTitle, setEditTitle, editDescription, setEditDescription, updateTaskInState }}
                    />
                </Modal.Body>
                <Modal.Footer style={{
                    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                    background: '#f8f9fa'
                }}>
                    <small className="text-muted">
                        Task ID: <code>{task._id?.slice(-8)}</code>
                    </small>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
                className="task-modal delete-modal"
            >
                <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', color: 'white' }}>
                    <Modal.Title>
                        <FaTrash className="me-2" />
                        Delete Task
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center p-4">
                    <div className="delete-icon mb-3">
                        <FaTrash size={48} className="text-danger" />
                    </div>
                    <h5 className="mb-3">Are you sure you want to delete this task?</h5>
                    <p className="text-muted mb-4">
                        This action cannot be undone. The task "{title}" will be permanently removed.
                    </p>
                    <div className="task-preview mb-4 p-3 bg-light rounded">
                        <h6 className="text-start mb-2">{title}</h6>
                        <p className="text-start text-muted small mb-0">{description}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={confirmDelete}
                        className="px-4"
                    >
                        <FaTrash className="me-2" />
                        Delete Task
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TaskItem;
