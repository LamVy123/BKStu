import { lazy } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const TeacherCourseManagement = lazy(() => import('./Teacher/TeacherCourseManagement/TeacherCourseManagement'));

const CourseManagement: React.FC = () => {
    const auth = useAuth()
    switch (auth.role) {
        case 'teacher':
            return <TeacherCourseManagement />
        default:
            return <Navigate to={'/'} />
    }
}

export default CourseManagement