import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Viewrequest.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

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

  const openModal = (request) => {
    setSelectedRequest(request);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="view-requests">
      <h2>Submitted Requests</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
            <th>Items Requested</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
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
              <td>
                <button onClick={() => openModal(request)}>More Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRequest && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Request Details"
          className="Modal"
          overlayClassName="Overlay"
        >
          <h2>Request Details</h2>
          <p><strong>First Name:</strong> {selectedRequest.staffInfo.firstName}</p>
          <p><strong>Last Name:</strong> {selectedRequest.staffInfo.lastName}</p>
          <p><strong>Department:</strong> {selectedRequest.staffInfo.department}</p>
          <p><strong>Manager:</strong> {selectedRequest.staffInfo.manager}</p>
          <p><strong>Floor:</strong> {selectedRequest.staffInfo.employeeFloor}</p>
          <p><strong>Unit:</strong> {selectedRequest.staffInfo.unit}</p>
          <p><strong>Items Requested:</strong></p>
          <ul>
            {selectedRequest.items.map((item, index) => (
              <li key={index}>{item.item.label} (Qty: {item.quantity})</li>
            ))}
          </ul>
          <p><strong>Purpose:</strong> {selectedRequest.purpose}</p>
          <p><strong>Timestamp:</strong> {new Date(selectedRequest.timestamp).toLocaleString()}</p>
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default ViewRequests;
