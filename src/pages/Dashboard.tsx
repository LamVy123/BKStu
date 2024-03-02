import { lazy } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const StudentDashboard = lazy(() => import('./Student/StudentDashboard'));
const TeacherDashboard = lazy(() => import('./Teacher/TeacherDashboard'));
const AdminDashboard = lazy(() => import('./Admin/AdminDashboard'));

const Dashboard : React.FC = () => {
    const auth = useAuth()
    switch(auth.role) {
        case 'student':
            return <StudentDashboard />
        case 'teacher':
            return <TeacherDashboard />
        case 'admin':
            return <AdminDashboard />
        default:
            return <Navigate to={'/'} />
    }
}

export default Dashboard