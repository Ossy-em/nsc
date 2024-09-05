import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import { getAuth, signOut } from "firebase/auth";
import './Header.css';

const Header = () => {
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div className="header-container">
      <FontAwesomeIcon icon={faBell} className="icon" />

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Header;
