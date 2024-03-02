import React from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import StudentClassManagement from "./Student/StudentClassManagement"
import TeacherClassManagement from "./Teacher/TeacherClassManagemnt"
import AdminClassManagement from "./Admin/AdminClassManagement"

const ClassManagement : React.FC = () => {
    const auth = useAuth()
    switch(auth.role) {
        case 'student':
            return <StudentClassManagement />
        case 'teacher':
            return <TeacherClassManagement  />
        case 'admin':
            return <AdminClassManagement />
        default:
            return <Navigate to={'/'} />
    }
}

export default ClassManagement