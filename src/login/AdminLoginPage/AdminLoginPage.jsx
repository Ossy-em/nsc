// src/admin/AdminLoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const AdminLogin = () => {
  const [username, setUsername] = useState('ictadmin');
  const [password, setPassword] = useState('ICT2025');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });

    try {
      console.log('Starting Firestore query...');
      const adminsRef = collection(db, 'admins'); // Matches your DB
      console.log('Collection ref:', adminsRef);
      const q = query(adminsRef, where('username', '==', username));
      console.log('Query built:', q);
      const snapshot = await getDocs(q);
      console.log('Snapshot docs:', snapshot.docs.length);

      if (snapshot.empty) {
        console.log('No matching admin found');
        setError('Invalid username or password');
        return;
      }

      const adminData = snapshot.docs[0].data();
      console.log('Admin data:', adminData);

      if (adminData.password !== password) {
        console.log('Password mismatch:', adminData.password, 'vs', password);
        setError('Invalid username or password');
        return;
      }

      console.log('Login success, setting session...');
      sessionStorage.setItem('user', JSON.stringify({
        role: 'admin', // Hardcoded to match PrivateRoute
        username: adminData.username,
        id: snapshot.docs[0].id,
      }));
      console.log('Session set:', sessionStorage.getItem('user'));
      console.log('Navigating to /admin-dashboard');
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Login error:', err.code, err.message);
      setError(`Failed to log in: ${err.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <form onSubmit={handleLogin} className="p-6 bg-white rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">ICT Admin Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;