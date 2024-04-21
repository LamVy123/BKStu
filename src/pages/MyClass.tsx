import { lazy } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const StudentMyClass = lazy(() => import('./Student/StudentMyClass'));

const MyClass: React.FC = () => {
    const auth = useAuth()
    switch (auth.role) {
        case 'student':
            return <StudentMyClass />
        default:
            return <Navigate to={'/'} />
    }
}

export default MyClass