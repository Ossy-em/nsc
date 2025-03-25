import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Added for auth check
import { db } from '../utils/firebase';
import ItemLookup from '../staff/ItemLookup/ItemLookup';
import Sidebar from '../staff/sidebar';

const StaffRequestPage = () => {
  const { departmentName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [departmentData, setDepartmentData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [departmentRequests, setDepartmentRequests] = useState([]);

  useEffect(() => {
    const checkAuth = () => {
      console.log('Checking auth in StaffRequestPage');
      const storedUser = sessionStorage.getItem('user');
      if (!storedUser) {
        console.log('No user in sessionStorage, redirecting to /');
        navigate('/');
        return null;
      }
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed user:', parsedUser);
        const urlDeptName = departmentName.toLowerCase();
        const userDeptName = parsedUser.departmentName.toLowerCase().replace(/\s+/g, '-');
        if (urlDeptName !== userDeptName) {
          console.log('Department mismatch, redirecting:', urlDeptName, userDeptName);
          navigate(`/department/${userDeptName}/${parsedUser.role === 'director' ? 'director' : 'staff-request'}`);
          return null;
        }
        return parsedUser;
      } catch (error) {
        console.error('Auth check error:', error.message, error.stack);
        setError('Authentication error. Please log in again.');
        return null;
      }
    };

    const fetchDepartmentData = async (userData) => {
      console.log('Fetching department data for:', userData);
      try {
        const departmentsRef = collection(db, 'departments');
        const deptQuery = query(departmentsRef, where('departmentName', '==', userData.departmentName));
        const deptSnapshot = await getDocs(deptQuery);
        console.log('Dept snapshot docs:', deptSnapshot.docs.length);

        if (deptSnapshot.empty) {
          console.log('No department found');
          setError('Department not found');
          setLoading(false);
          return;
        }

        const deptDoc = deptSnapshot.docs[0];
        const deptData = { id: deptDoc.id, ...deptDoc.data() };
        console.log('Department data:', deptData);
        setDepartmentData(deptData);

        const requestsRef = collection(db, 'requests');
        const reqQuery = query(requestsRef, where('departmentId', '==', userData.departmentId));
        const reqSnapshot = await getDocs(reqQuery);
        const requests = reqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Department requests:', requests);
        setDepartmentRequests(requests);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching department data:', error.message, error.code, error.stack);
        setError('Failed to load department data.');
        setLoading(false);
      }
    };

    console.log('useEffect running, departmentName:', departmentName);
    const user = checkAuth();
    if (user) {
      setUserData(user);
      fetchDepartmentData(user);
    } else {
      setLoading(false);
    }
  }, [departmentName, navigate]);

  const handleSubmitRequest = async (formData) => {
    if (!userData || (userData.role !== 'staff' && userData.role !== 'director')) return;
    console.log('Submitting request:', formData);
    console.log('Firebase Auth UID before submit:', getAuth().currentUser?.uid); // Auth check
    try {
      setLoading(true);
      const requestData = {
        ...formData,
        departmentId: userData.departmentId,
        departmentName: userData.departmentName,
        submittedBy: userData.name,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'requests'), requestData);
      console.log('Request submitted, ID:', docRef.id);
      setSuccessMessage('Request submitted successfully! Awaiting director approval.');

      const reqSnapshot = await getDocs(
        query(collection(db, 'requests'), where('departmentId', '==', userData.departmentId))
      );
      const requests = reqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDepartmentRequests(requests);
      setLoading(false);
    } catch (error) {
      console.error('Error submitting request:', error.message, error.code);
      setError(`Failed to submit request: ${error.message} (Code: ${error.code})`);
      setLoading(false);
    }
  };

  const handleApproval = async (requestId, status) => {
    if (userData?.role !== 'director') return;
    console.log('Approving request:', requestId, status);
    try {
      setLoading(true);
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, { status, updatedAt: serverTimestamp() });
      console.log('Request updated:', requestId);

      const reqSnapshot = await getDocs(
        query(collection(db, 'requests'), where('departmentId', '==', userData.departmentId))
      );
      const requests = reqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDepartmentRequests(requests);
      setSuccessMessage(`Request ${status} successfully!`);
      setLoading(false);
    } catch (error) {
      console.error('Error updating request:', error.message, error.code);
      setError('Failed to update request.');
      setLoading(false);
    }
  };

  const pendingRequests = departmentRequests.filter(req => req.status === 'pending');
  const recentRequests = userData?.role === 'staff' ? departmentRequests.slice(0, 6) : pendingRequests;

  console.log('Rendering - loading:', loading, 'error:', error, 'userData:', userData, 'departmentData:', departmentData);

  if (loading && !departmentData) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error && !departmentData) return (
    <div className="flex items-center justify-center min-h-screen text-red-500">
      <div>
        <h2 className="text-xl font-bold">Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Login
        </button>
      </div>
    </div>
  );

  try {
    console.log('Rendering main UI, recentRequests:', recentRequests);
    return (
      <div className="flex min-h-screen">
        {console.log('Rendering Sidebar')}
        <Sidebar departmentName={departmentName} userData={userData} pendingRequests={pendingRequests.length} />
        <div className="ml-64 flex-1 p-6 bg-gray-50">
          {console.log('Rendering header')}
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {userData?.role === 'director' ? 'Director Portal' : 'Staff Portal'}
            </h1>
            <p className="text-gray-600">Welcome, {userData?.role === 'director' ? 'Director' : userData?.name}</p>
          </header>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMessage}</div>
          )}
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

          {console.log('Rendering ItemLookup')}
          <section className="mb-8">
            <ItemLookup onSubmit={handleSubmitRequest} departmentName={userData?.departmentName} />
          </section>

          {console.log('Rendering requests section')}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {userData?.role === 'director' ? 'Requests Awaiting Approval' : 'Recent Department Requests'}
            </h2>
            {recentRequests.length === 0 ? (
              <p className="text-gray-600">
                {userData?.role === 'director' ? 'No pending requests.' : 'No recent requests.'}
              </p>
            ) : (
              <div className="space-y-4">
                {recentRequests.map((request) => {
                  console.log('Rendering request:', request.id, request);
                  return (
                    <div key={request.id} className="p-4 bg-white rounded-lg shadow-md">
                      <h3 className="text-lg font-medium text-gray-800">
                        Request by {request.submittedBy || 'Unknown'}
                      </h3>
                      <p className="text-gray-600">
                        <strong>Status:</strong> {request.status || 'N/A'}
                      </p>
                      {userData?.role === 'director' && request.purpose && (
                        <p className="text-gray-600"><strong>Purpose:</strong> {request.purpose}</p>
                      )}
                      {request.items && Array.isArray(request.items) && (
                        <div className="mt-2">
                          <strong className="text-gray-700">Items:</strong>
                          <ul className="list-disc pl-5 text-gray-600">
                            {request.items.map((item, idx) => (
                              <li key={idx}>
                                {item.itemName || item.item || 'Unknown'} - Qty: {item.quantity || 'N/A'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p className="text-gray-500 text-sm mt-2">
                        <strong>Date:</strong>{' '}
                        {request.createdAt?.seconds
                          ? new Date(request.createdAt.seconds * 1000).toLocaleString()
                          : 'N/A'}
                      </p>
                      {userData?.role === 'director' && request.status === 'pending' && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleApproval(request.id, 'approved')}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproval(request.id, 'declined')}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {userData?.role === 'staff' && departmentRequests.length > 6 && (
              <NavLink
                to={`/department/${departmentName}/requests`}
                className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View All Requests
              </NavLink>
            )}
          </section>
        </div>
      </div>
    );
  } catch (renderError) {
    console.error('Render error:', renderError.message, renderError.stack);
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Render failed: {renderError.message}
      </div>
    );
  }
};

export default StaffRequestPage;