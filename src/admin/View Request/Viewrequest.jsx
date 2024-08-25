import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import './Viewrequest.css';

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'requests'));
        const requestsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(requestsData);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="view-requests">
      <h2>Submitted Requests</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
            <th>Manager</th>
            <th>Floor</th>
            <th>Unit</th>
            <th>Items</th>
            <th>Purpose</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id}>
              <td>{request.staffInfo.firstName}</td>
              <td>{request.staffInfo.lastName}</td>
              <td>{request.staffInfo.department}</td>
              <td>{request.staffInfo.manager}</td>
              <td>{request.staffInfo.employeeFloor}</td>
              <td>{request.staffInfo.unit}</td>
              <td>
                <ul>
                  {request.items.map((item, index) => (
                    <li key={index}>{item.item.label} (Qty: {item.quantity})</li>
                  ))}
                </ul>
              </td>
              <td>{request.purpose}</td>
              <td>{new Date(request.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRequests;
