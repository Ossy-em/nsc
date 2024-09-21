import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import './Viewrequest.css';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS

Modal.setAppElement('#root');

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editableItems, setEditableItems] = useState([]);
  const [comment, setComment] = useState('');

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

  // Open the modal and set up the editable items (quantities)
  const openModal = (request) => {
    setSelectedRequest(request);
    setEditableItems(request.items); // Clone the original items to allow editing
    setModalIsOpen(true);
  };

  // Close the modal and reset selected request
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRequest(null);
    setComment(''); // Clear comment on modal close
  };

  // Handle quantity changes in the editable items array
  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = [...editableItems];
    updatedItems[index].quantity = newQuantity; // Update quantity
    setEditableItems(updatedItems);
  };

  // Handle accept or decline action (updating Firestore and moving to history)
  const handleAction = async (status) => {
    if (selectedRequest) {
      try {
        const requestRef = doc(db, 'requests', selectedRequest.id);
        const historyRef = doc(db, 'history', selectedRequest.id); // Reference to move request to 'history'

        // Update request with status
        await updateDoc(requestRef, {
          items: editableItems,
          status, // 'accepted' or 'declined'
          adminComment: comment,
          processedAt: new Date(),
        });

        // Move to 'history' collection
        await setDoc(historyRef, {
          ...selectedRequest, // Keep original data
          items: editableItems, // Updated quantities
          status, 
          adminComment: comment,
          processedAt: new Date(),
        });

        // Delete from 'requests' collection after moving to history
        await deleteDoc(requestRef);

        // Trigger success or error notifications
        if (status === 'accepted') {
          toast.success('Request accepted and moved to history!', { position: "top-right", autoClose: 3000 });
        } else {
          toast.error('Request declined and moved to history!', { position: "top-right", autoClose: 3000 });
        }

        closeModal();

        // Update the requests UI by refetching
        const querySnapshot = await getDocs(collection(db, 'requests'));
        const requestsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(requestsData);

      } catch (error) {
        console.error(`Error updating request: ${error}`);
      }
    }
  };

  return (
    <div>

      <div aria-hidden={modalIsOpen ? "true" : "false"} className="view-requests">
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
            {requests.map((request) => (
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
      </div>

      {/* Modal for detailed request view, including editable quantity and comments */}
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
            {editableItems.map((item, index) => (
              <li key={index}>
                {item.item.label} 
                Qty: 
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
              </li>
            ))}
          </ul>
          <p><strong>Purpose:</strong> {selectedRequest.purpose}</p>
          <p><strong>Timestamp:</strong> {new Date(selectedRequest.timestamp).toLocaleString()}</p>

          {/* Admin comment */}
          <div>
            <label htmlFor="adminComment"></label>
            <textarea
              id="adminComment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comment here..."
            />
          </div>

          {/* Action buttons */}
          <div className="modal-actions">
            <button onClick={() => handleAction('accepted')} className="accept-button">
              Accept
            </button>
            <button onClick={() => handleAction('declined')} className="decline-button">
              Decline
            </button>
            <button onClick={closeModal}>Close</button>
          </div>
        </Modal>
      )}

      {/* ToastContainer to display notifications */}
      <ToastContainer />
    </div>
  );
};

export default ViewRequests;
