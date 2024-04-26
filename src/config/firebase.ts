import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

//Firebase config for testing
const testFirebaseConfig = {
  apiKey: "AIzaSyAoSMeb__6NGz2Yg_sfsPPyw2hqnhjNhdk",
  authDomain: "bkstu-test.firebaseapp.com",
  projectId: "bkstu-test",
  storageBucket: "bkstu-test.appspot.com",
  messagingSenderId: "647107826600",
  appId: "1:647107826600:web:d8611f03cd14b7faa7439d",
  measurementId: "G-VE2G6B3KLQ"
};

//Firebase config for deploying


const firebaseConfig = testFirebaseConfig;

//Get Applicaiton
export const app = initializeApp(firebaseConfig);
export const secondary_app = initializeApp(firebaseConfig,'second_app')

//Get Database
export const db = getFirestore(app);

export const userColRef = collection(db,'user');
export const userDetaiColRef = collection(db,'user_detail')

export const facultyColRef = collection(db, 'faculty');
export const facultyDetailColRef = collection(db, 'faculty_detail');

export const semesterColRef = collection(db, 'semester')
export const semesterDetailColRef = collection(db, 'semester_detail')

export const majorsColRef = collection(db, 'majors');
export const majorsDetailColRef = collection(db, 'majors_detail');

export const classColRef = collection(db, 'class');
export const classDetailColRef = collection(db, 'class_detail');

export const subjectColRef = collection(db, 'subject');
export const subjectDetailColRef = collection(db, 'subject_detail');

export const courseColRef = collection(db, 'course');
export const courseDetailColRef = collection(db, 'course_detail');


export const testRef = collection(db, 'test');

//Get Authentication
export const auth = getAuth(app);
export const secondary_auth = getAuth(secondary_app);

