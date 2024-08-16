import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = () => {
  return (
    <div className="header-container">
      <FontAwesomeIcon icon={faBell} className="icon" />
      <FontAwesomeIcon icon={faUser} className="icon" />
    </div>
  );
}

export default Header;
