import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import Navigation from "./component/Navigation";
import { ErrorBoundary } from "react-error-boundary";
import ErrorScreen from "./component/ErrorSceen";

const Test = lazy(() => import("./test/test"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Schedule = lazy(() => import("./pages/Schedule"));

const StudenManagement = lazy(() => import("./pages/Admin/StudentManagement/StudentManagement"));
const TeacherManagement = lazy(() => import("./pages/Admin/TeacherManagement/TeacherManagement"));
const SchoolManagement = lazy(() => import("./pages/Admin/SchoolManagement/SchoolManagement"))

const Information = lazy(() => import("./pages/Information"));

const ClassManagement = lazy(() => import("./pages/ClassManagement"));
const CourseManagement = lazy(() => import("./pages/CourseManagement"))

const MyClass = lazy(() => import('./pages/MyClass'))
const MyCourse = lazy(() => import('./pages/MyCourse'))
const CourseRegistration = lazy(() => import("./pages/Student/StudentCourseRegistration/StudentCourseRegistration"))


function App() {
    return (
        <ErrorBoundary fallback={<ErrorScreen />}>
            <Router>
                <AuthProvider>
                    <Navigation />
                    <Suspense fallback={<div />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/information" element={<Information />} />

                            <Route path="/student_management" element={<StudenManagement />} />
                            <Route path="/teacher_management" element={<TeacherManagement />} />
                            <Route path="/school_management" element={<SchoolManagement />} />

                            <Route path="/class_management" element={<ClassManagement />} />
                            <Route path="/class_management/:classID" element={<ClassManagement />} />

                            <Route path="/course_management" element={<CourseManagement />} />
                            <Route path="/course_management/:classID" element={<CourseManagement />} />

                            <Route path="/my_class" element={<MyClass />} />

                            <Route path="/my_course" element={<MyCourse />} />
                            <Route path="/my_course/:courseID" element={<MyCourse />} />

                            <Route path="/course_registration" element={<CourseRegistration />} />
                            <Route path="/course_registration/:semesterID" element={<CourseRegistration />} />

                            <Route path="/schedule" element={<Schedule />} />
                            <Route path="/test" element={<Test />} />
                        </Routes>
                    </Suspense>
                </AuthProvider>
            </Router >
        </ErrorBoundary >
    );
}

export default App;
