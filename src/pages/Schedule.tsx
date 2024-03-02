import { lazy } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const StudentSchedule = lazy(() => import("./Student/StudentSchedule"))
const TeacherSchedule = lazy(() => import("./Teacher/TeacherSchedule"))

const Schedule : React.FC = () => {
    const auth = useAuth()
    switch(auth.role) {
        case 'student':
            return <StudentSchedule />
        case 'teacher':
            return <TeacherSchedule />
        default:
            return <Navigate to={'/'} />
    }
}

export default Schedule