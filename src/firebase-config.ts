import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoSMeb__6NGz2Yg_sfsPPyw2hqnhjNhdk",
  authDomain: "bkstu-test.firebaseapp.com",
  projectId: "bkstu-test",
  storageBucket: "bkstu-test.appspot.com",
  messagingSenderId: "647107826600",
  appId: "1:647107826600:web:d8611f03cd14b7faa7439d",
  measurementId: "G-VE2G6B3KLQ"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
