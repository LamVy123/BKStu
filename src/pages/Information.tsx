import React from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import StudentInformation from "./Student/StudentInformaiton"
import TeacherInformation from "./Teacher/TeacherInformation"
import AdminInformation from "./Admin/AdminInfomation"

const Information : React.FC = () => {
    const auth = useAuth()
    switch(auth.role) {
        case 'student':
            return <StudentInformation />
        case 'teacher':
            return <TeacherInformation />
        case 'admin':
            return <AdminInformation />
        default:
            return <Navigate to={'/'} />
    }
}

export default Information