import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const DepartmentAuth = () => {
  const [username, setUsername] = useState('ict_dept');
  const [password, setPassword] = useState('ict_password');
  const [name, setName] = useState('Osinachukwu Emeruwa');
  const [isDirector, setIsDirector] = useState(false);
  const [directorPin, setDirectorPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const departmentsRef = collection(db, 'departments');
      const q = query(
        departmentsRef,
        where('loginCredentials.username', '==', username),
        where('loginCredentials.password', '==', password)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError('Invalid department credentials');
        setLoading(false);
        return;
      }

      const departmentDoc = querySnapshot.docs[0];
      const departmentData = departmentDoc.data();

      if (isDirector) {
        setShowPinInput(true);
        setLoading(false);
      } else {
        if (!departmentData.staffMembers.includes(name)) {
          setError('Your name is not registered in this department.');
          setLoading(false);
          return;
        }
        completeAuthentication(departmentDoc.id, departmentData, 'staff', name);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const handleDirectorVerify = async () => {
    setError('');
    setLoading(true);

    try {
      const departmentsRef = collection(db, 'departments');
      const q = query(
        departmentsRef,
        where('loginCredentials.username', '==', username),
        where('loginCredentials.password', '==', password),
        where('directorPin', '==', directorPin)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError('Invalid director PIN');
        setLoading(false);
        return;
      }

      const departmentDoc = querySnapshot.docs[0];
      const departmentData = departmentDoc.data();
      completeAuthentication(departmentDoc.id, departmentData, 'director', null);
    } catch (error) {
      console.error('Director verification error:', error);
      setError('Director verification failed. Please try again.');
      setLoading(false);
    }
  };

  const completeAuthentication = (departmentId, departmentData, role, staffName) => {
    const authData = {
      departmentId,
      departmentName: departmentData.departmentName,
      role,
      name: staffName || 'Director',
      timestamp: new Date().toISOString(),
    };
    console.log('Setting sessionStorage with:', authData);
    sessionStorage.setItem('user', JSON.stringify(authData));

    const deptUrlName = departmentData.departmentName.toLowerCase().replace(/\s+/g, '-');
    const target = role === 'director' ? 'director' : 'staff-request';
    console.log('Navigating to:', `/department/${deptUrlName}/${target}`);
    navigate(`/department/${deptUrlName}/${target}`);
    setLoading(false);
  };

  const handleRoleToggle = () => {
    setIsDirector(!isDirector);
    setShowPinInput(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Department Login</h2>

        {showPinInput ? (
          <>
            <p className="text-center text-gray-600">
              Enter the director PIN for <strong>{username}</strong>
            </p>
            <motion.input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Director PIN"
              value={directorPin}
              onChange={(e) => setDirectorPin(e.target.value)}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
            {error && (
              <motion.p
                className="text-red-500 bg-red-50 p-3 rounded-md text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}
            <div className="flex space-x-4">
              <motion.button
                className="w-1/2 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleDirectorVerify}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </motion.button>
              <motion.button
                className="w-1/2 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={() => setShowPinInput(false)}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
            </div>
          </>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <motion.input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Department Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            />
            <motion.input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Department Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
            {!isDirector && (
              <motion.input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
            )}
            <motion.div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="directorRole"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={isDirector}
                onChange={handleRoleToggle}
              />
              <label htmlFor="directorRole" className="text-gray-700">
                I am the department director
              </label>
            </motion.div>
            {error && (
              <motion.p className="text-red-500 bg-red-50 p-3 rounded-md text-center">
                {error}
              </motion.p>
            )}
            <motion.button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DepartmentAuth;