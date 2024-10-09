import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase'; // Adjust the path as necessary

// Function to fetch requests for the current month
export const getRequestsForCurrentMonth = async () => {
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // Firestore query for requests within the current month
  const requestsRef = collection(db, 'requests');
  const q = query(
    requestsRef,
    where('timestamp', '>=', startOfMonth.toISOString()),
    where('timestamp', '<=', endOfMonth.toISOString())
  );

  const querySnapshot = await getDocs(q);
  const requests = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // Loop through each item's quantity and push it to the requests array
    data.items.forEach((item) => {
      requests.push({ ...item, floor: data.staffInfo.employeeFloor, timestamp: data.timestamp });
    });
  });

  return requests;
};

// Function to fetch accepted requests
export const getAcceptedRequests = async () => {
  const requestsRef = collection(db, 'requests');
  const q = query(requestsRef, where('status', '==', 'accepted'));

  const querySnapshot = await getDocs(q);
  const requests = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    data.items.forEach((item) => {
      requests.push({ ...item, floor: data.staffInfo.employeeFloor, timestamp: data.timestamp });
    });
  });

  return requests;
};

// Function to calculate total items for the overview
export const calculateTotalItemsForOverview = (requests) => {
  let totalItems = 0;
  requests.forEach((request) => {
    totalItems += request.quantity || 0;
  });
  return totalItems;
};

// Function to group requests by floor and week
export const groupRequestsByFloorAndWeek = (requests) => {
  // Define the floors in the correct order
  const floorOrder = ['Ground Floor', 'Floor 1', 'Floor 2', 'Floor 3', 'Floor 4', 'Floor 5', 'Floor 6', 'Floor 7', 'Floor 8', 'Floor 9', 'Floor 10', 'Floor 11'];

  // Initialize the groupedData with all floors and weeks set to 0
  const groupedData = {};
  floorOrder.forEach(floor => {
    groupedData[floor] = { Week1: 0, Week2: 0, Week3: 0, Week4: 0 };
  });

  // Map Firestore floor names like "1st floor" to "Floor 1"
  const normalizeFloorName = (floor) => {
    if (floor === 'Ground Floor') return 'Ground Floor';
    const match = floor.match(/(\d+)(st|nd|rd|th)?\s*floor/i);
    return match ? `Floor ${match[1]}` : 'Unknown';
  };

  // Now we process the requests from Firestore
  requests.forEach((request) => {
    const floor = normalizeFloorName(request.floor || 'Unknown'); // Normalize the floor name
    const date = new Date(request.timestamp);
    const week = Math.ceil(date.getDate() / 7); // Get the week of the month

    // If the request's floor is valid (exists in the floorOrder), proceed
    if (groupedData[floor]) {
      if (week === 1) {
        groupedData[floor].Week1 += request.quantity || 0;
      } else if (week === 2) {
        groupedData[floor].Week2 += request.quantity || 0;
      } else if (week === 3) {
        groupedData[floor].Week3 += request.quantity || 0;
      } else if (week === 4) {
        groupedData[floor].Week4 += request.quantity || 0;
      }
    }
  });

  return groupedData;
};
