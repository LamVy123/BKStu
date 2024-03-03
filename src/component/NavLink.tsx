import React from "react";
import { Link } from "react-router-dom";
import { LoginIcon,
    DashboardIcon,
    HomeIcon,
    StudentsIcon,
    TeachersIcon,
    AdminsIcon,
    InformationIcon,
    ScheduleIcon,
    ClassIcon,
} from "../assets/Icon";
import { motion } from "framer-motion";


export const HomeLink : React.FC = () => {
    return (
        <Link to="/" className="p-2 hover:bg-blue-700 ">
            <motion.div 
            initial={{scale:1}}
            whileHover={{scale:1.1}}
            className="flex items-center justify-start gap-4 w-full h-12">
                <button><HomeIcon width={10} height={10} color="white"/></button>
                <div><h1 className="text-base text-white font-bold">Home</h1></div>
            </motion.div>
        </Link> 
    )
}

export const LoginLink : React.FC = () => {
    return (
        <Link to="/login" className="p-2 hover:bg-blue-700">
            <motion.div 
            initial={{scale:1}}
            whileHover={{scale:1.1}}
            className="flex items-center justify-start gap-4 w-full h-12">
                <button><LoginIcon width={10} height={10} color="white"/></button>
                <div><h1 className="text-base text-white font-bold">Login</h1></div>
            </motion.div>
        </Link> 
    )
}

export const DashboardLink : React.FC = () => {
    return (
        <Link to={'/dashboard'} className="p-2 hover:bg-blue-700">
            <motion.div 
            initial={{scale:1}}
            whileHover={{scale:1.1}}
            className="flex items-center justify-start gap-4 w-full h-12"
            >
                <button><DashboardIcon width={10} height={10} color="white"/></button>
                <div><h1 className="text-base text-white font-bold">Dashboard</h1></div>
            </motion.div>
        </Link>
    )
}

export const StudentManagementLink : React.FC = () => {
    return (
        <Link to={'/student_management'} className="p-2 hover:bg-blue-700">
            <motion.div 
            initial={{scale:1}}
            whileHover={{scale:1.1}}
            className="flex items-center justify-start gap-4 w-full h-12">
                <button><StudentsIcon width={10} height={10} color="white"/></button>
                <div><h1 className="text-base text-white font-bold">Student Management</h1></div>
            </motion.div>
        </Link>
    )
}

export const TeacherManagementdLink : React.FC = () => {
    return (
        <Link to={'/teacher_management'} className="p-2 hover:bg-blue-700">
            <motion.div 
            initial={{scale:1}}
            whileHover={{scale:1.1}}
            className="flex items-center justify-start gap-4 w-full h-12">
                <button><TeachersIcon width={10} height={10} color="white"/></button>
                <div><h1 className="text-base text-white font-bold">Teacher Management</h1></div>
            </motion.div>
        </Link>
    )
}

export const AdminManagementdLink : React.FC = () => {
    return (
        <Link to={'/admin_management'} className="p-2 hover:bg-blue-700">
            <motion.div 
            initial={{scale:1}}
            whileHover={{scale:1.1}}
            className="flex items-center justify-start gap-4 w-full h-12">
                <button><AdminsIcon width={10} height={10} color="white"/></button>
                <div><h1 className="text-base text-white font-bold">Admin Management</h1></div>
            </motion.div>
        </Link>
    )
}

export const InformationLink : React.FC = () => {
    return (
        <Link to={'/information'} className="p-2 hover:bg-blue-700">
            <motion.div 
            initial={{scale:1}}
            whileHover={{scale:1.1}}
            className="flex items-center justify-start gap-4 w-full h-12">
                <button><InformationIcon width={10} height={10} color="white"/></button>
                <div><h1 className="text-base text-white font-bold">Informaion</h1></div>
            </motion.div>
        </Link>
    )
}

export const ClassManagementLink : React.FC = () => {
    return (
        <Link to={'/class_management'} className="p-2 hover:bg-blue-700">
            <motion.div 
            initial={{scale:1}}
            whileHover={{scale:1.1}}
            className="flex items-center justify-start gap-4 w-full h-12">
                <button><ClassIcon width={10} height={10} color="white"/></button>
                <div><h1 className="text-base text-white font-bold">Class Management</h1></div>
            </motion.div>
        </Link>
    )
}

export const ScheduleLink : React.FC = () => {
    return (
        <Link to={'/schedule'} className="p-2 hover:bg-blue-700">
            <motion.div 
            initial={{scale:1}}
            whileHover={{scale:1.1}}
            className="flex items-center justify-start gap-4 w-full h-12">
                <button><ScheduleIcon width={10} height={10} color="white"/></button>
                <div><h1 className="text-base text-white font-bold">Schedule</h1></div>
            </motion.div>
        </Link>
    )
}