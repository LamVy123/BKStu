import { lazy } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const StudentInformation = lazy(() => import("./Student/StudentInformaiton"));
const TeacherInformation = lazy(() => import("./Teacher/TeacherInformation"));
const AdminInformation = lazy(() => import("./Admin/AdminInformation"));

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