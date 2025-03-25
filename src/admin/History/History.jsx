import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../utils/firebase';

const History = () => {
  const navigate = useNavigate();
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      console.log('Fetching history...');
      try {
        const auth = getAuth();
        const uid = auth.currentUser?.uid;
        console.log('ICT Admin UID:', uid);

        const decisionsRef = collection(db, 'admin_decisions');
        const snapshot = await getDocs(decisionsRef);
        const allDecisions = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Decision data:', doc.id, data);
          return {
            id: doc.id,
            staffName: data.staffName || 'Unknown',
            departmentName: data.departmentName || data.departmentId || 'Unknown',
            item: data.item || 'Unknown',
            qtyRequested: data.qtyRequested || 0,
            qtyApproved: data.qtyApproved || 0,
            adminComment: data.adminComment || 'No comment',
            status: data.status || 'unknown',
            date: data.date ? new Date(data.date).toLocaleString() : 'N/A',
          };
        });
        console.log('All decisions:', allDecisions);

        setDecisions(allDecisions);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err.message, err.code);
        setError(`Failed to load history: ${err.message}`);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-gray-600 text-xl font-semibold animate-pulse">Loading History...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-red-500 text-xl font-semibold bg-red-100 p-4 rounded-lg shadow-md">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
          ICT Admin - Request History
        </h2>
        {decisions.length === 0 ? (
          <div className="text-center text-gray-500 text-lg bg-white p-6 rounded-lg shadow-md">
            No history yet—start approving some requests!
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                  <tr>
                    <th className="p-4 font-semibold text-sm uppercase tracking-wider">Staff</th>
                    <th className="p-4 font-semibold text-sm uppercase tracking-wider">Department</th>
                    <th className="p-4 font-semibold text-sm uppercase tracking-wider">Item</th>
                    <th className="p-4 font-semibold text-sm uppercase tracking-wider">Req Qty</th>
                    <th className="p-4 font-semibold text-sm uppercase tracking-wider">App Qty</th>
                    <th className="p-4 font-semibold text-sm uppercase tracking-wider">Comment</th>
                    <th className="p-4 font-semibold text-sm uppercase tracking-wider">Status</th>
                    <th className="p-4 font-semibold text-sm uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {decisions.map(decision => (
                    <tr 
                      key={decision.id} 
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="p-4 text-gray-800 font-medium">{decision.staffName}</td>
                      <td className="p-4 text-gray-800">{decision.departmentName}</td>
                      <td className="p-4 text-gray-800">{decision.item}</td>
                      <td className="p-4 text-gray-600 text-center">{decision.qtyRequested}</td>
                      <td className="p-4 text-gray-600 text-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          decision.qtyApproved > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {decision.qtyApproved}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 italic">{decision.adminComment}</td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          decision.status === 'approved' 
                            ? 'bg-green-200 text-green-900' 
                            : 'bg-red-200 text-red-900'
                        }`}>
                          {decision.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">{decision.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;