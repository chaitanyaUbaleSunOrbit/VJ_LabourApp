import React, { useState } from 'react';
import { Link, matchRoutes } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import './sidebar.css';

function Sidebar({ formStatus }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getBulletColor = (isCompleted) => {
    return isCompleted ? '#20C305' : '#FFBF00';
  };

  return (
    <div className="sidebar">
      <div className="stages">
        <label>STAGES</label>
      </div>
      <div className="profile-section">
        <div className="profile-icon">
          <PersonOutlineIcon />
          <span className="bullet" style={{ color: getBulletColor(formStatus.kyc) }}>&#8226;</span>
        </div>
        <Link to="/kyc" className="sidebar-link">
          <span className="mains">KYC</span>
        </Link>
      </div>
      <div className="application-section">
        <div className="application-header" onClick={toggleCollapse}>
          <EditNoteIcon />         
          <span className="bullet" style={{ marginRight:"21px", color: getBulletColor(formStatus.personal && formStatus.bankDetails && formStatus.project) }}>&#8226;</span>
          <span className="mains" >Application</span>
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </div>
        {!isCollapsed && (
          <ul className="application-list">
            <li>
              <Link to="/personal" className="sidebar-link">
                <span className="bullet" style={{ color: getBulletColor(formStatus.personal) }}>&#8226;</span> Personal
              </Link>
            </li>
            <li>
              <Link to="/bankDetails" className="sidebar-link">
                <span className="bullet" style={{ color: getBulletColor(formStatus.bankDetails) }}>&#8226;</span> Bank Details
              </Link>
            </li>
            <li>
              <Link to="/project" className="sidebar-link">
                <span className="bullet" style={{ color: getBulletColor(formStatus.project) }}>&#8226;</span> Project
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;








