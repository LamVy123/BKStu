import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AuthProvider from "./context/AuthContext"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Navigation from "./component/Navigation"
import StudenManagement from "./pages/Admin/StudentManagement"
import TeacherManagement from "./pages/Admin/TeacherManagement"
import Information from "./pages/Information"
import ClassManagement from "./pages/ClassManagement"
import Schedule from "./pages/Schedule"

function App() {

    return (
        <Router>
            <AuthProvider>
                <Navigation />
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/student_management" element={<StudenManagement />}/>
                    <Route path="/teacher_management" element={<TeacherManagement />}/>
                    <Route path="/information" element={<Information />}/>
                    <Route path="/class_management" element={<ClassManagement/>}/>
                    <Route path="/schedule" element={<Schedule />}/>
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default App
