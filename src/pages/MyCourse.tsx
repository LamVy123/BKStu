import { lazy } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const StudentMyCourse = lazy(() => import('./Student/StudentMyCourse/StudentMyCourse'));

const MyCourse: React.FC = () => {
    const auth = useAuth()
    switch (auth.role) {
        case 'student':
            return <StudentMyCourse />
        default:
            return <Navigate to={'/'} />
    }
}

export default MyCourse