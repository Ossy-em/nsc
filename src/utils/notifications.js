import { db } from "./firebase";  
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const addNotification = async (message, type, icon) => {
  try {
    await addDoc(collection(db, "notifications"), {
      message,
      type,
      icon,
      timestamp: serverTimestamp(),
    });
    console.log("Notification added:", message);
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};
