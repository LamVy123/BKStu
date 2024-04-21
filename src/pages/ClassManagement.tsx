import { lazy } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const TeacherClassManagement = lazy(() => import('./Teacher/TeacherClassManagement/TeacherClassManagement'));

const ClassManagement: React.FC = () => {
    const auth = useAuth()
    switch (auth.role) {
        case 'teacher':
            return <TeacherClassManagement />
        default:
            return <Navigate to={'/'} />
    }
}

export default ClassManagement