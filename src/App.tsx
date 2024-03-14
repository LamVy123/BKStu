import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import Navigation from "./component/Navigation";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudenManagement = lazy(() => import("./pages/Admin/StudentManagement/StudentManagement"));
const TeacherManagement = lazy(() => import("./pages/Admin/TeacherManagement"));
const AdminManagement = lazy(() => import("./pages/Admin/AdminManagement"))
const Information = lazy(() => import("./pages/Information"));
const ClassManagement = lazy(() => import("./pages/ClassManagement"));
const Schedule = lazy(() => import("./pages/Schedule"));
const LoadingScreen = lazy(() => import("./component/LoadingScreen"))

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/student_management" element={<StudenManagement />} />
            <Route path="/teacher_management" element={<TeacherManagement />} />
            <Route path="/admin_management" element={<AdminManagement />} />
            <Route path="/information" element={<Information />} />
            <Route path="/class_management" element={<ClassManagement />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/test" element={<LoadingScreen />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
