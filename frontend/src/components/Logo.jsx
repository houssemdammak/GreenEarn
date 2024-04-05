import React from 'react'
import AuthContext from '../contexts/authSlice';

import { useContext } from 'react';
import {FireFilled} from '@ant-design/icons'
import icon from '../images/EarnGreen Icons/icon_black.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Assuming Font Awesome icons
import {faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
const Logo = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className='logo' >
      <div className="logo-icon" style={{display:"flex",flexDirection:"column",gap:"12px"}}>
      <FontAwesomeIcon onClick={handleLogout} icon={faRightFromBracket} style={{color:"rgb(89 89 89)" ,fontSize:"16px" ,alignSelf: "flex-end"}} />

      <img style={{width: '150px', height:'25px'}} src={icon} alt=" Logo" />
         
      </div>
      
    </div>
  )
}

export default Logo
