import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import Sidebar from '../sidebar'; // Adjust path

const RequestHistoryPage = () => {
  const { departmentName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    console.log('=== RequestHistoryPage useEffect START ===');
    console.log('URL departmentName:', departmentName);

    const checkAuth = () => {
      console.log('checkAuth running...');
      const storedUser = sessionStorage.getItem('user');
      console.log('sessionStorage user:', storedUser);

      if (!storedUser) {
        console.log('No user found, redirecting to /');
        navigate('/');
        return null;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed user:', parsedUser);
        console.log('checkAuth passed, returning user');
        return parsedUser;
      } catch (err) {
        console.error('Parse error:', err);
        setError('Can’t parse user data—log in again.');
        return null;
      }
    };

    const fetchRequests = async (user) => {
      console.log('fetchRequests starting for:', user.departmentId);
      try {
        const requestsRef = collection(db, 'requests');
        const q = query(requestsRef, where('departmentId', '==', user.departmentId));
        const snapshot = await getDocs(q);
        const requestData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Requests fetched:', requestData);
        setRequests(requestData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load requests.');
      } finally {
        setLoading(false);
      }
    };

    const user = checkAuth();
    if (user) {
      console.log('User valid, setting userData and fetching requests');
      setUserData(user);
      fetchRequests(user);
    } else {
      console.log('No user, stopping and setting loading false');
      setLoading(false);
    }
  }, [departmentName, navigate]);

  return (
    <div className="flex min-h-screen">
      <Sidebar departmentName={departmentName} userData={userData} />
      <div className="ml-64 flex-1 p-6 bg-gray-50">
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">
            <h2 className="text-xl font-bold">Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Login
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {userData?.departmentName} Request History
            </h1>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">All Requests</h2>
              {requests.length === 0 ? (
                <p className="text-gray-600">No requests yet.</p>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div key={req.id} className="p-4 bg-white rounded-lg shadow-md">
                      <h3 className="text-lg font-medium text-gray-800">
                        {req.submittedBy || 'Unknown'}
                      </h3>
                      <p className="text-gray-600">
                        <strong>Status:</strong> {req.status}
                      </p>
                      {userData?.role === 'director' && req.purpose && (
                        <p className="text-gray-600"><strong>Purpose:</strong> {req.purpose}</p>
                      )}
                      {req.items && (
                        <div className="mt-2">
                          <strong className="text-gray-700">Items:</strong>
                          <ul className="list-disc pl-5 text-gray-600">
                            {req.items.map((item, idx) => (
                              <li key={idx}>{item.itemName || item.item} - Qty: {item.quantity}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p className="text-gray-500 text-sm mt-2">
                        <strong>Date:</strong>{' '}
                        {req.createdAt?.seconds
                          ? new Date(req.createdAt.seconds * 1000).toLocaleString()
                          : 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestHistoryPage;