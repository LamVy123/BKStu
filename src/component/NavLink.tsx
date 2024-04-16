import React from "react";
import { Link } from "react-router-dom";
import {
    LoginIcon,
    DashboardIcon,
    HomeIcon,
    StudentsIcon,
    BriefCaseIcon,
    InformationIcon,
    ScheduleIcon,
    BookIcon,
    PenIcon,
} from "../assets/Icon";


export const HomeLink: React.FC = () => {
    return (
        <Link to="/" className="p-2 hover:bg-blue-700 ">
            <div className="flex items-center justify-start gap-4 w-full h-12">
                <button><HomeIcon width={10} height={10} color="white" /></button>
                <div><h1 className="text-base text-white font-bold">Home</h1></div>
            </div>
        </Link>
    )
}

export const LoginLink: React.FC = () => {
    return (
        <Link to="/login" className="p-2 hover:bg-blue-700">
            <div className="flex items-center justify-start gap-4 w-full h-12">
                <button><LoginIcon width={10} height={10} color="white" /></button>
                <div><h1 className="text-base text-white font-bold">Login</h1></div>
            </div>
        </Link>
    )
}

export const DashboardLink: React.FC = () => {
    return (
        <Link to={'/dashboard'} className="p-2 hover:bg-blue-700">
            <div className="flex items-center justify-start gap-4 w-full h-12"
            >
                <button><DashboardIcon width={10} height={10} color="white" /></button>
                <div><h1 className="text-base text-white font-bold">Dashboard</h1></div>
            </div>
        </Link>
    )
}

export const StudentManagementLink: React.FC = () => {
    return (
        <Link to={'/student_management'} className="p-2 hover:bg-blue-700">
            <div className="flex items-center justify-start gap-4 w-full h-12">
                <button><StudentsIcon width={10} height={10} color="white" /></button>
                <div><h1 className="text-base text-white font-bold">Quản lý sinh viên</h1></div>
            </div>
        </Link>
    )
}

export const TeacherManagementdLink: React.FC = () => {
    return (
        <Link to={'/teacher_management'} className="p-2 hover:bg-blue-700">
            <div className="flex items-center justify-start gap-4 w-full h-12">
                <button><BriefCaseIcon width={10} height={10} color="white" /></button>
                <div><h1 className="text-base text-white font-bold">Quản lý giảng viên</h1></div>
            </div>
        </Link>
    )
}

export const InformationLink: React.FC = () => {
    return (
        <Link to={'/information'} className="p-2 hover:bg-blue-700">
            <div className="flex items-center justify-start gap-4 w-full h-12">
                <button><InformationIcon width={10} height={10} color="white" /></button>
                <div><h1 className="text-base text-white font-bold">Thông tin cá nhân</h1></div>
            </div>
        </Link>
    )
}

export const SchoolManagementLink: React.FC = () => {
    return (
        <Link to={'/school_management'} className="p-2 hover:bg-blue-700">
            <div className="flex items-center justify-start gap-4 w-full h-12">
                <button><BookIcon width={10} height={10} color="white" /></button>
                <div><h1 className="text-base text-white font-bold">Quản lý trường học</h1></div>
            </div>
        </Link>
    )
}

export const ClassManagementLink: React.FC = () => {
    return (
        <Link to={'/class_management'} className="p-2 hover:bg-blue-700">
            <div className="flex items-center justify-start gap-4 w-full h-12">
                <button><BookIcon width={10} height={10} color="white" /></button>
                <div><h1 className="text-base text-white font-bold">Quản lý lớp học</h1></div>
            </div>
        </Link>
    )
}

export const CourseManagementLink: React.FC = () => {
    return (
        <Link to={'/course_management'} className="p-2 hover:bg-blue-700">
            <div className="flex items-center justify-start gap-4 w-full h-12">
                <button><BookIcon width={10} height={10} color="white" /></button>
                <div><h1 className="text-base text-white font-bold">Quản lý khóa học</h1></div>
            </div>
        </Link>
    )
}

export const MyClass: React.FC = () => {
    return (
        <Link to={'/my_class'} className="p-2 hover:bg-blue-700">
            <div className="flex items-center justify-start gap-4 w-full h-12">
                <button><DashboardIcon width={10} height={10} color="white" /></button>
                <div><h1 className="text-base text-white font-bold">Lớp học của tôi</h1></div>
            </div>
        </Link>
    )
}

export const MyCourse: React.FC = () => {
    return (
        <Link to={'/my_course'} className="p-2 hover:bg-blue-700">
            <div className="flex items-center justify-start gap-4 w-full h-12">
                <button><BookIcon width={10} height={10} color="white" /></button>
                <div><h1 className="text-base text-white font-bold">Khóa học của tôi</h1></div>
            </div>
        </Link>
    )
}

export const CourseRegistration: React.FC = () => {
    return (
        <Link to={'/course_registration'} className="p-2 hover:bg-blue-700">
            <div className="flex items-center justify-start gap-4 w-full h-12">
                <button><PenIcon width={10} height={10} color="white" /></button>
                <div><h1 className="text-base text-white font-bold">Đăng kí khóa học</h1></div>
            </div>
        </Link>
    )
}

export const ScheduleLink: React.FC = () => {
    return (
        <Link to={'/schedule'} className="p-2 hover:bg-blue-700">
            <div className="flex items-center justify-start gap-4 w-full h-12">
                <button><ScheduleIcon width={10} height={10} color="white" /></button>
                <div><h1 className="text-base text-white font-bold">Lịch</h1></div>
            </div>
        </Link>
    )
}