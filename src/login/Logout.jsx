import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { getAuth, signOut } from "firebase/auth";

const Logout = () => {
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
    <div
      className="flex items-center py-2 px-4 w-full text-green-700 hover:bg-green-100 rounded-lg transition duration-300 cursor-pointer"
      onClick={handleLogout}
    >

      <FontAwesomeIcon
        icon={faUser}
        className="text-lg text-green-700"
      />

  
      <span className="text-md font-medium">Log Out</span>
    </div>
  );
};

export default Logout;
