// src/admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import DashboardOverview from './DashboardOverview';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [departments, setDepartments] = useState({});

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = sessionStorage.getItem('user');
      console.log('Dashboard auth check, storedUser:', storedUser);
      if (!storedUser) {
        console.log('No session found, redirecting to /admin-login');
        navigate('/admin-login');
        return null;
      }
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed user:', parsedUser);
        return parsedUser;
      } catch (err) {
        console.error('Auth parse error:', err);
        setError('Authentication failed');
        navigate('/admin-login');
        return null;
      }
    };

    console.log('Dashboard useEffect running');
    const user = checkAuth();
    if (user) {
      console.log('User authenticated, fetching data');
      setUserData(user);
      fetchData();
    } else {
      console.log('No valid user, setting loading false');
      setLoading(false);
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const requestsRef = collection(db, 'requests');
      const reqSnapshot = await getDocs(requestsRef);
      const allRequests = reqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(allRequests);

      const deptsRef = collection(db, 'departments');
      const deptSnapshot = await getDocs(deptsRef);
      const deptMap = deptSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().name;
        return acc;
      }, {});
      setDepartments(deptMap);

      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Loading...</div>;
  if (error) return (
    <div className="p-6 text-center text-red-500">
      <p>{error}</p>
      <button onClick={() => navigate('/admin-login')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Login
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ICT Admin Dashboard</h1>
      <DashboardOverview requests={requests} departments={departments} />
      {/* Add charts and history later */}
    </div>
  );
};

export default Dashboard;