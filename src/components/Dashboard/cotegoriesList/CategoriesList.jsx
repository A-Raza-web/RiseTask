// CategoriesList.jsx

import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import axios from 'axios';
import "./CategoriesList.css";

// The component now receives 'categories' as a prop
const CategoriesList = ({ categories }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryTasks, setCategoryTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const getIconComponent = (iconName) => {
        const IconComponent = FaIcons[iconName];
        return IconComponent ? <IconComponent /> : <FaIcons.FaQuestionCircle />;
    };

    // Fetch tasks for selected category
    const handleCategoryClick = async (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
        setLoading(true);

        try {
            const response = await axios.get(`https://rise-task-server.vercel.app/api/tasks?category=${category.name}`);
            setCategoryTasks(response.data.tasks || []);
        } catch (error) {
            console.error('Failed to fetch category tasks:', error);
            setCategoryTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
        setCategoryTasks([]);
    };

    const getStatusBadge = (status) => {
        const badges = {
            completed: { class: 'badge-success', text: 'Completed' },
            pending: { class: 'badge-warning', text: 'Pending' },
            'in-progress': { class: 'badge-info', text: 'In Progress' },
            overdue: { class: 'badge-danger', text: 'Overdue' }
        };
        return badges[status] || { class: 'badge-secondary', text: status };
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            high: { class: 'priority-high', text: 'High' },
            medium: { class: 'priority-medium', text: 'Medium' },
            low: { class: 'priority-low', text: 'Low' }
        };
        return badges[priority] || { class: 'priority-medium', text: priority };
    };

    return (
        <>
            <div className="card mb-4 shadow-sm border-0 dashboard-card">
                <div className="card-header">
                    <h5><FaIcons.FaTasks className="me-2 text-orange" /> Categories</h5>
                </div>
                <div className="card-body">
                    {categories && categories.length > 0 ? (
                        <div className="categories-grid">
                            {categories.map((cat) => (
                                <div 
                                    key={cat.name} 
                                    className="category-box"
                                    onClick={() => handleCategoryClick(cat)}
                                >
                                    <div className="category-header">
                                        <span className="category-icon" style={{ color: cat.color }}>
                                            {getIconComponent(cat.icon)}
                                        </span>
                                        <h6 className="category-name">{cat.name}</h6>
                                    </div>
                                    <div className="category-footer">
                                        <span className="category-count" style={{ color: cat.color }}>
                                            {cat.taskCount}
                                        </span>
                                        <span className="count-label">Tasks</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No categories found</p>
                    )}
                </div>
            </div>

            {/* Category Tasks Modal */}
            {isModalOpen && (
                <div className="category-modal-overlay" onClick={closeModal}>
                    <div className="category-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="category-modal-header">
                            <div className="modal-title-section">
                                <span className="modal-category-icon" style={{ color: selectedCategory?.color }}>
                                    {getIconComponent(selectedCategory?.icon)}
                                </span>
                                <h3>{selectedCategory?.name} Tasks</h3>
                            </div>
                            <button className="modal-close-btn" onClick={closeModal}>
                                <FaIcons.FaTimes />
                            </button>
                        </div>

                        <div className="category-modal-body">
                            {loading ? (
                                <div className="modal-loading">
                                    <div className="spinner"></div>
                                    <p>Loading tasks...</p>
                                </div>
                            ) : categoryTasks.length > 0 ? (
                                <div className="tasks-list">
                                    {categoryTasks.map((task, index) => (
                                        <div key={task._id || index} className="task-item">
                                            <div className="task-header">
                                                <h4 className="task-title">{task.title}</h4>
                                                <div className="task-badges">
                                                    <span className={`status-badge ${getStatusBadge(task.status).class}`}>
                                                        {getStatusBadge(task.status).text}
                                                    </span>
                                                    {task.priority && (
                                                        <span className={`priority-badge ${getPriorityBadge(task.priority).class}`}>
                                                            {getPriorityBadge(task.priority).text}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {task.description && (
                                                <p className="task-description">{task.description}</p>
                                            )}
                                            <div className="task-footer">
                                                {task.dueDate && (
                                                    <span className="task-date">
                                                        <FaIcons.FaCalendar className="me-1" />
                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {task.tags && task.tags.length > 0 && (
                                                    <div className="task-tags">
                                                        {task.tags.map((tag, idx) => (
                                                            <span key={idx} className="task-tag">
                                                                <FaIcons.FaTag className="me-1" />
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="modal-empty">
                                    <FaIcons.FaInbox className="empty-icon" />
                                    <p>No tasks found in this category</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CategoriesList;