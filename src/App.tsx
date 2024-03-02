import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import Navigation from "./component/Navigation";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudenManagement = lazy(() => import("./pages/Admin/StudentManagement"));
const TeacherManagement = lazy(() => import("./pages/Admin/TeacherManagement"));
const Information = lazy(() => import("./pages/Information"));
const ClassManagement = lazy(() => import("./pages/ClassManagement"));
const Schedule = lazy(() => import("./pages/Schedule"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/student_management" element={<StudenManagement />} />
            <Route path="/teacher_management" element={<TeacherManagement />} />
            <Route path="/information" element={<Information />} />
            <Route path="/class_management" element={<ClassManagement />} />
            <Route path="/schedule" element={<Schedule />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
