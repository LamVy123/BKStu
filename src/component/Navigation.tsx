import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuIcon, LogoutIcon } from "../assets/Icon";
import {
    HomeLink,
    LoginLink,
    DashboardLink,
    StudentManagementLink,
    TeacherManagementdLink,
    InformationLink,
    SchoolManagementLink,
    ScheduleLink,
    CourseManagementLink,
} from "./NavLink";
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

        const LogoutButton: React.FC = () => {
            return (
                <div className="p-2 hover:bg-blue-700 w-full h-fit overflow-hidden">
                    <div
                        onClick={() => auth.LogOutUser()} className="flex items-center justify-start gap-4 w-full h-12 overflow-hidden hover:bg-blue-700">
                        <button><LogoutIcon width={10} height={10} color="white" /></button>
                        <div><h1 className="text-base text-white font-bold">Thoát</h1></div>
                    </div>
                </div>
            )
        }

        const StudentNavigation: React.FC = () => {
            return (
                <>
                    <DashboardLink />
                    <InformationLink />
                    <CourseManagementLink />
                    <ScheduleLink />
                    <div className="h-full flex flex-col justify-end">
                        <LogoutButton />
                    </div>
                </>
            )
        }

        const TeacherNavigation: React.FC = () => {
            return (
                <>
                    <DashboardLink />
                    <InformationLink />
                    <CourseManagementLink />
                    <ScheduleLink />
                    <div className="h-full flex flex-col justify-end">
                        <LogoutButton />
                    </div>
                </>
            )
        }

        const AdminNavigation: React.FC = () => {
            return (
                <>
                    <DashboardLink />
                    <InformationLink />
                    <StudentManagementLink />
                    <TeacherManagementdLink />
                    <SchoolManagementLink />
                    <div className="h-full flex flex-col justify-end">
                        <LogoutButton />
                    </div>
                </>
            )
        }

        const GuestNavigation: React.FC = () => {
            return (
                <>
                    <HomeLink />
                    <LoginLink />
                </>
            )
        }

        const UserNavigation: React.FC = () => {
            switch (auth.role) {
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
        let displayPath: string
        switch (location.pathname) {
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
            case '/school_management':
                displayPath = 'School_Management'
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

        const [openWidth, setOpenWidth] = useState<string>('0px')

        const toggleSideBar = () => {
            if (openWidth == '0px') {
                setOpenWidth('200px')
            } else {
                setOpenWidth('0px')
            }
        }

        return (
            <>
                <div
                    className="h-screen fixed z-50 bg-primary py-1 top-0 hover:cursor-pointer"
                    style={{ width: openWidth }}
                >
                    <div className="h-screen flex flex-col">

                        <div className="px-1 py-px flex gap-4 items-center">
                            <button onClick={() => toggleSideBar()} className=""><MenuIcon width={12} height={12} color="white" /></button>
                            <div className="flex gap-4 max-md:gap-2 max-sm:gap-1 text-3xl max-md:text-xl max-sm:text-lg ">
                                <Link to="/" className="text-white font-bold">BKStu</Link>
                                <h1 className="text-white font-bold">/</h1>
                                <h1 className="text-white font-bold">{displayPath}</h1>
                            </div>
                        </div>

                        <div className="h-full flex flex-col overflow-hidden">
                            <UserNavigation />
                        </div>

                    </div>

                </div>
                {openWidth != '0px' ? <div onClick={() => toggleSideBar()} className="w-full h-screen bg-opacity-15 bg-black absolute top-0 left-0 z-30"></div> : null}
            </>
        );
    };

    return (
        <div className="relative z-40">
            <Navbar />
            <Sidebar />
        </div>
    );
};

export default Navigation;
