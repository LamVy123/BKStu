import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuIcon, LogoutIcon} from "../assets/Icon";
import { 
    HomeLink,
    LoginLink,
    DashboardLink,
    StudentManagementLink,
    TeacherManagementdLink,
    InformationLink,
    ClassManagementLink,
    ScheduleLink,
} from "./NavLink";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navigation: React.FC = () => {
    const auth = useAuth()

    const Navbar: React.FC = () => {
        return (
        <div className="min-w-full h-14 flex items-center justify-between z-40 bg-primary p-4 fixed top-0 left-0">
            
        </div>
        )
    }

    const Sidebar: React.FC = () => {

        const LogoutButton : React.FC = () => {
            return (
                <div className="h-full flex items-end">
                    <div className="p-2 hover:bg-blue-700 w-full h-fit overflow-hidden">
                        <motion.div 
                        initial={{scale:1}}
                        whileHover={{scale:1.1}}
                        onClick={() => auth.LogOutUser()} className="flex items-center justify-start gap-4 w-full h-12 overflow-hidden hover:bg-blue-700">
                            <button><LogoutIcon width={10} height={10} color="white"/></button>
                            <div><h1 className="text-base text-white font-bold">Logout</h1></div>
                        </motion.div>
                    </div>
                </div>
            )
        }

        const StudentNavigation : React.FC = () => {
            return (
                <>
                    <DashboardLink />
                    <hr className="solid bg-black border-black"></hr>
                    <InformationLink />
                    <hr className="solid bg-black border-black"></hr>
                    <ClassManagementLink />
                    <hr className="solid bg-black border-black"></hr>
                    <ScheduleLink />
                    <hr className="solid bg-black border-black"></hr>
                    <LogoutButton />
                </>
            )
        }

        const TeacherNavigation : React.FC = () => {
            return (
                <>
                    <DashboardLink />
                    <hr className="solid bg-black border-black"></hr>
                    <InformationLink />
                    <hr className="solid bg-black border-black"></hr>
                    <ClassManagementLink />
                    <hr className="solid bg-black border-black"></hr>
                    <ScheduleLink />
                    <hr className="solid bg-black border-black"></hr>
                    <LogoutButton />
                </>
            )
        }

        const AdminNavigation : React.FC = () => {
            return (
                <>
                    <DashboardLink />
                    <hr className="solid bg-black border-black"></hr>
                    <InformationLink />
                    <hr className="solid bg-black border-black"></hr>
                    <StudentManagementLink />
                    <hr className="solid bg-black border-black"></hr>
                    <TeacherManagementdLink />
                    <hr className="solid bg-black border-black"></hr>
                    <ClassManagementLink />
                    <hr className="solid bg-black border-black"></hr>
                    <LogoutButton />
                </>
            )
        } 
 

        const GuestNavigation : React.FC = () => {
            return (
                <>
                    <HomeLink/>
                    <hr className="solid bg-black border-black"></hr>   
                    <LoginLink />
                    <hr className="solid bg-black border-black"></hr>   
                </>
            )
        }

        const UserNavigation : React.FC = () => {
            switch(auth.role) {
                case 'student':
                    return <StudentNavigation />
                case 'teacher':
                    return <TeacherNavigation />
                case 'admin':
                    return <AdminNavigation />
                default:
                    return <GuestNavigation />
            }
        }
        const location = useLocation();
        let displayPath : string
        switch(location.pathname) {
            case '/login':
                displayPath = 'Login'
                break
            case '/dashboard':
                displayPath = 'Dashboard'
                break
            case '/student_management': 
                displayPath = 'Student_Management'
                break
            case '/teacher_management':
                displayPath = 'Teacher_Management'
                break
            case '/information':
                displayPath = 'Information'
                break
            case '/class_management':
                displayPath = 'Class_Management'
                break
            case '/schedule':
                displayPath = 'Schedule'
                break
            default:
                displayPath = 'Home'
        }
        
        let closeWidth = '64px'
        let openWidth = '180px'
        return (
            <motion.div
                className="h-screen fixed z-50 bg-primary py-2 hover:w-50 left-0 top-0"
                initial={{width: closeWidth}}
                whileHover={{width: openWidth}}
            >
                <div className="h-full flex flex-col justify-start">
                    <div className="px-2 flex gap-4 items-center" style={{paddingTop : '3px',paddingBottom: '3px'}}>
                        <button><MenuIcon width={10} height={10} color="white" /></button>
                        <div className="flex gap-4">
                            <Link to="/" className="text-3xl text-white font-bold">BKStu</Link>
                            <h1 className="text-3xl text-white font-bold">/</h1>
                            <h1 className="text-3xl text-white font-bold">{displayPath}</h1>
                        </div>
                    </div>
                    <UserNavigation />
                </div>
            </motion.div>
    );
};

    return (
        <>
        <Navbar />
        <Sidebar />
        </>
    );
};

export default Navigation;
