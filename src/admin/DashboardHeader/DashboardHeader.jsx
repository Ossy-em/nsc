// import React, { useEffect, useState } from 'react';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../../utils/firebase'
// import Header from '../../staff/Header/Header';
// const ViewRequests = () => {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       const querySnapshot = await getDocs(collection(db, "requests"));
//       const requestsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setRequests(requestsList);
//     };
//     fetchRequests();
//   }, []);

//   return (
//     <div>
//     <Header/>
//     <table>
        
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th>Department</th>
//           <th>Unit</th>
//           <th>Item Requested</th>
//           <th>Quantity</th>
//           <th>Purpose</th>
//           <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {requests.map(request => (
//           <tr key={request.id}>
//             <td>{request.name}</td>
//             <td>{request.department}</td>
//             <td>{request.unit}</td>
//             <td>{request.itemRequested}</td>
//             <td>{request.quantity}</td>
//             <td>{request.purpose}</td>
//             <td>
//               {/* Add Approve/Decline buttons or other actions */}
//               <button>Approve</button>
//               <button>Decline</button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//     </div>
//   );
// };

// export default ViewRequests;
import React from 'react';
import ViewRequests from '../View Request/Viewrequest';
import './Dashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <nav>
          <ul>
            <li><a href="#">View Requests</a></li>
            <li><a href="#">Add User</a></li>
            <li><a href="#">Status</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <ViewRequests />
      </main>
    </div>
  );
};

export default AdminDashboard;
