import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">🔔 Notifications</h2>
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No new notifications</p>
        ) : (
          notifications.slice(0, 5).map((notif) => (
            <div
              key={notif.id}
              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm shadow-sm"
            >
              {notif.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
