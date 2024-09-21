import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase'; // Firebase setup
import './History.css'

const History = () => {
  const [historyRequests, setHistoryRequests] = useState([]);

  // Fetch historical requests from Firestore when component mounts
  useEffect(() => {
    const fetchHistoryRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'history'));
        const historyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistoryRequests(historyData);
      } catch (error) {
        console.error('Error fetching history requests:', error);
      }
    };

    fetchHistoryRequests();
  }, []);

  return (
    <div className="history-requests">
      <h2>Request History</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
            <th>Items Requested</th>
            <th>Status</th>
            <th>Processed At</th>
          </tr>
        </thead>
        <tbody>
          {historyRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.staffInfo.firstName}</td>
              <td>{request.staffInfo.lastName}</td>
              <td>{request.staffInfo.department}</td>
              <td>
                <ul>
                  {request.items.map((item, index) => (
                    <li key={index}>{item.item.label} (Qty: {item.quantity})</li>
                  ))}
                </ul>
              </td>
              <td>{request.status}</td>
              <td>{new Date(request.processedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
