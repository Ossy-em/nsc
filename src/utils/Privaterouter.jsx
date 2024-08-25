import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const PrivateRoute = ({ children, requiredRole }) => {
  const [user, loading, authError] = useAuthState(auth);
  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [roleError, setRoleError] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "Users", user.uid)); // Ensure collection name matches exactly
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserRole(data.role);
          } else {
            console.error("No role found for user.");
            setUserRole(null);
          }
        } catch (err) {
          console.error('Error fetching user role:', err);
          setRoleError(err);
        }
        setRoleLoading(false); // Ensure this is called inside the block
      } else {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  if (loading || roleLoading) {
    return <div>Loading...</div>;
  }

  if (authError || roleError) {
    console.error('Authentication or role error:', authError || roleError);
    return <div>Error: {authError?.message || roleError?.message}</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
