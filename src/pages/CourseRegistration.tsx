import { lazy } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const StudentCourseRegistration = lazy(() => import('./Student/StudentCourseRegistration'));

const ClassManagement: React.FC = () => {
    const auth = useAuth()
    switch (auth.role) {
        case 'student':
            return <StudentCourseRegistration />
        default:
            return <Navigate to={'/'} />
    }
}

export default ClassManagement