
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyAW-t-ZKFU9mT2wm1C0uA5KyrnDV8IRtS4",
  authDomain: "nsc-staff-request-portal.firebaseapp.com",
  projectId: "nsc-staff-request-portal",
  storageBucket: "nsc-staff-request-portal.appspot.com",
  messagingSenderId: "565078357654",
  appId: "1:565078357654:web:153b9dc4c5b0ed02dcb4b7",
  measurementId: "G-W7LMH4VC9L"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// export (app, auth, analytics);