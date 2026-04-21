// StatsCard.js

const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="col-md-3 mb-3">
      <div className={`stat-card shadow-sm border-0`}>
        <div className="stat-card-body">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h6 className="stat-title">{title}</h6>
              <h3 className="stat-value">{value}</h3>
            </div>
            <div className={`stat-icon-tile ${color}`} aria-hidden>
              <Icon className="icon-svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;