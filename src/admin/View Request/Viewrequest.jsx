import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../utils/firebase';

const ViewRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [departments, setDepartments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      console.log('Starting fetch...');
      try {
        const auth = getAuth();
        const uid = auth.currentUser?.uid;
        console.log('ICT Admin UID:', uid);

        // Fetch departments
        const deptsRef = collection(db, 'departments');
        const deptSnapshot = await getDocs(deptsRef);
        const deptMap = deptSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data().departmentName || doc.id;
          return acc;
        }, {});
        setDepartments(deptMap);
        console.log('Departments:', deptMap);

        // Fetch requests
        const requestsRef = collection(db, 'requests');
        const reqSnapshot = await getDocs(requestsRef);
        const allRequests = reqSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Request data:', doc.id, data);
          const itemData = Array.isArray(data.items) && data.items[0] ? data.items[0] : {};
          return {
            id: doc.id,
            submittedBy: data.submittedBy || 'Unknown',
            departmentId: data.departmentId || 'Unknown',
            item: itemData.itemName || itemData.name || 'Unknown',
            qty: (itemData.quantity || itemData.qty || 0).toString(),
            originalQty: itemData.quantity || itemData.qty || 0,
            status: data.status || 'unknown',
          };
        });
        console.log('All requests:', allRequests);

        const approvedRequests = allRequests.filter(req => req.status === 'approved');
        setRequests(approvedRequests);
        console.log('Approved requests:', approvedRequests);

        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err.message, err.code);
        setError(`Failed to load data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQtyChange = (id, newQty) => {
    setRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, qty: newQty } : req))
    );
  };

  const handleCommentChange = (id, comment) => {
    setComments(prev => ({ ...prev, [id]: comment }));
  };

  const handleApprove = async (id) => {
    try {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;
      console.log('Approving with UID:', uid);

      const request = requests.find(req => req.id === id);
      if (!request) throw new Error('Request not found');
      console.log('Approving:', request);

      // Update requests
      const requestRef = doc(db, 'requests', id);
      await updateDoc(requestRef, { status: 'admin_approved' });
      console.log('Updated request:', id);

      // Save to admin_decisions
      const qtyApproved = isNaN(parseInt(request.qty, 10)) ? 0 : parseInt(request.qty, 10);
      const decisionDoc = await addDoc(collection(db, 'admin_decisions'), {
        staffName: request.submittedBy,
        departmentId: request.departmentId,
        departmentName: departments[request.departmentId] || request.departmentId,
        item: request.item,
        qtyRequested: request.originalQty,
        qtyApproved,
        adminComment: comments[id] || 'No comment',
        status: 'approved',
        date: new Date().toISOString(),
      });
      console.log('Saved to admin_decisions:', decisionDoc.id);

      // Update UI
      setRequests(prev => prev.filter(req => req.id !== id));
      setComments(prev => {
        const newComments = { ...prev };
        delete newComments[id];
        return newComments;
      });
      setSuccess('Request approved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Approve error:', err.message, err.code);
      setError(`Failed to approve: ${err.message} (Code: ${err.code})`);
    }
  };

  const handleDecline = async (id) => {
    try {
      const request = requests.find(req => req.id === id);
      if (!request) throw new Error('Request not found');
      console.log('Declining:', request);

      // Update requests
      const requestRef = doc(db, 'requests', id);
      await updateDoc(requestRef, { status: 'declined' });
      console.log('Updated request:', id);

      // Save to admin_decisions
      const decisionDoc = await addDoc(collection(db, 'admin_decisions'), {
        staffName: request.submittedBy,
        departmentId: request.departmentId,
        departmentName: departments[request.departmentId] || request.departmentId,
        item: request.item,
        qtyRequested: request.originalQty,
        qtyApproved: 0,
        adminComment: comments[id] || 'No comment',
        status: 'declined',
        date: new Date().toISOString(),
      });
      console.log('Saved to admin_decisions:', decisionDoc.id);

      // Update UI
      setRequests(prev => prev.filter(req => req.id !== id));
      setComments(prev => {
        const newComments = { ...prev };
        delete newComments[id];
        return newComments;
      });
      setSuccess('Request declined!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Decline error:', err.message, err.code);
      setError(`Failed to decline: ${err.message} (Code: ${err.code})`);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">ICT Admin - View Requests</h2>
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">{success}</div>}
      {requests.length === 0 ? (
        <p className="text-gray-600 text-center">No approved requests to review.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3 text-left">Staff</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Comment</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-700">{req.submittedBy}</td>
                  <td className="p-3 text-gray-700">{departments[req.departmentId] || req.departmentId}</td>
                  <td className="p-3 text-gray-700">{req.item}</td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={req.qty}
                      onChange={(e) => handleQtyChange(req.id, e.target.value)}
                      className="w-16 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={comments[req.id] || ''}
                      onChange={(e) => handleCommentChange(req.id, e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add comment"
                    />
                  </td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecline(req.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewRequests;