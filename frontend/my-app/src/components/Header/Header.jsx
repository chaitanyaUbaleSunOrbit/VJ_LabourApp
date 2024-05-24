import React from 'react';
import './Header.css'; 
import VJLogo from "../../images/VJlogo-1-removebg.png"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
function Header() {
  return (
    <div className="header">
      <div className="logo-container">
        <img src={VJLogo} alt="Logo" className="logo" />
      </div>
      <div className="options">
        <NotificationsActiveIcon className='icon'/>
        <LogoutIcon className='icon'/>
        <AccountCircleIcon className='icon'/>

       
      </div>
    </div>
  );
}

export default Header;
