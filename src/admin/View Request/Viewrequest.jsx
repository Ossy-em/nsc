import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import Table from '../../component/Table';

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);

  // Fetch requests from Firestore when the component mounts
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'requests'));
        const requestsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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
            <Table data={requests} />
    </div>
  );
};

export default ViewRequests;
