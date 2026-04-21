import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FaChevronDown } from 'react-icons/fa';
import './showMenu.css';

const ShowCountMenu = ({ showOptions = [5, 10, 20, 'All'], showCount, setShowCount }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (opt) => {
    setShowCount(opt);
    handleClose();
  };

  // Custom styling for MUI components
  const buttonStyle = {
    backgroundColor: '#ffffff',
    color: '#1f2937',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    textTransform: 'none',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    minWidth: '120px',
    justifyContent: 'space-between',
  };

  const menuStyle = {
    marginTop: '0.5rem',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f1f3f5',
  };

  const menuItemStyle = {
    fontSize: '0.875rem',
    padding: '0.75rem 1rem',
    transition: 'all 0.15s ease',
  };

  return (
    <div className="show-menu-wrapper">
      <Button
        id="show-button"
        aria-controls={open ? 'show-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={buttonStyle}
        className="show-menu-button"
      >
        <span>Show: {showCount}</span>
        <FaChevronDown 
          className={`menu-arrow ${open ? 'rotated' : ''}`}
          style={{ fontSize: '0.75rem' }}
        />
      </Button>
      <Menu
        id="show-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'show-button',
          className: 'show-menu-list',
        }}
        PaperProps={{
          className: 'show-menu-paper',
          sx: menuStyle,
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {showOptions.map((opt) => (
          <MenuItem 
            key={opt} 
            onClick={() => handleSelect(opt)}
            sx={menuItemStyle}
            className={`show-menu-item ${showCount === opt ? 'active' : ''}`}
          >
            {opt}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ShowCountMenu;
