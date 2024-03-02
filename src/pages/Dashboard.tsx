import React from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import StudentDashboard from "./Student/StudentDashboard"
import TeacherDashBoard from "./Teacher/TeacherDashboard"
import AdminDashboard from "./Admin/AdminDashboard"

const Dashboard : React.FC = () => {
    const auth = useAuth()
    switch(auth.role) {
        case 'student':
            return <StudentDashboard />
        case 'teacher':
            return <TeacherDashBoard />
        case 'admin':
            return <AdminDashboard />
        default:
            return <Navigate to={'/'} />
    }
}

export default Dashboard