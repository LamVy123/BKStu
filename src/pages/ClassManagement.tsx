import { lazy } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const StudentClassManagement = lazy(() => import('./Student/StudentClassManagement'));
const TeacherClassManagement = lazy(() => import('./Teacher/TeacherClassManagemnt'));
const AdminClassManagement = lazy(() => import('./Admin/SchoolManagement/ClassManagement/ClassManagement'));

const ClassManagement: React.FC = () => {
    const auth = useAuth()
    switch (auth.role) {
        case 'student':
            return <StudentClassManagement />
        case 'teacher':
            return <TeacherClassManagement />
        case 'admin':
            return <AdminClassManagement />
        default:
            return <Navigate to={'/'} />
    }
}

export default ClassManagement