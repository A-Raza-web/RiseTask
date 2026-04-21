import React from "react";
import { FaTasks, FaCheckCircle, FaHourglassHalf, FaCalendarAlt } from "react-icons/fa";
import "./taskstats.css";

const TaskStats = ({ tasks }) => {
  console.log("🔴 TASKSTATS COMPONENT MOUNTED with tasks:", tasks.length);
  
  // Calculate stats with memoized values
  const stats = React.useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const due = tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate <= today;
    }).length;
    
    // Calculate completion percentage
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Determine progress bar color based on completion
    let progressColor = 'progress-success'; // green
    if (completionPercentage < 30) {
      progressColor = 'progress-danger'; // red
    } else if (completionPercentage < 70) {
      progressColor = 'progress-warning'; // yellow
    }
    
    return { total, completed, pending, due, completionPercentage, progressColor };
  }, [tasks]);

  // Stat card data configuration
  const statCards = [
    { 
      title: "Total Tasks", 
      value: stats.total, 
      icon: FaTasks, 
      color: "primary-gradient",
      iconSize: "large",
      showProgress: false
    },
    { 
      title: "Completed", 
      value: stats.completed, 
      icon: FaCheckCircle, 
      color: "success",
      iconSize: "medium",
      showProgress: true,
      progressValue: stats.completionPercentage,
      progressColor: stats.progressColor
    },
    { 
      title: "Pending", 
      value: stats.pending, 
      icon: FaHourglassHalf, 
      color: "warning",
      iconSize: "medium",
      showProgress: false
    },
    { 
      title: "Due Today", 
      value: stats.due, 
      icon: FaCalendarAlt, 
      color: "danger",
      iconSize: "small",
      showProgress: false
    }
  ];



  console.log("Rendering TaskStats with:", { 
    showProgress: statCards[1]?.showProgress, 
    progressValue: statCards[1]?.progressValue, 
    progressColor: statCards[1]?.progressColor 
  });

  return (
    <div className="task-stats-container">
      <div className="task-stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card-wrapper">
            <div className={`stat-card stat-card-${card.iconSize} shadow-sm border-0`}>
              <div className="stat-card-body">
                <div className="stat-content">
                  <div className="stat-info">
                    <h6 className="stat-title">{card.title}</h6>
                    <h3 className="stat-value">{card.value}</h3>
                    {card.showProgress && (
                      <div className="progress-container">
                        <div className="progress-bar-wrapper">
                          <div 
                            className={`progress-bar-fill ${card.progressColor}`}
                            style={{ width: `${card.progressValue}%` }}
                          ></div>
                        </div>
                        <span className="progress-percentage">
                          {card.progressValue}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`stat-icon-tile ${card.color}`} aria-hidden>
                    <card.icon className="icon-svg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskStats;
