import React from "react";
import { Link } from "react-router-dom";
import { MenuIcon, HomeIcon, LoginIcon, LogoutIcon} from "../assets/Icon";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navigation: React.FC = () => {
    const auth = useAuth()

    const Navbar: React.FC = () => {
        return (
        <div className="min-w-full h-14 flex items-center justify-between z-40 bg-primary p-4 fixed top-0 left-0">
            <ul className="h-full flex items-center list-none gap-2">
            <li>
                <MenuIcon width={10} height={10} color="white" />
            </li>
            <li className="text-white font-bold">
                <Link to="/" className="text-3xl">
                BKStu
                </Link>
            </li>
            </ul>
            <ul></ul>
        </div>
        );
    };

    const Sidebar: React.FC = () => {
        let closeWidth = '64px';
        let openWidth = '180px';

        function logout() {
            auth.LogOutUser();
            window.location.reload();
        }

        const StudentNavigation : React.FC = () => {
            return (
                <div></div>
            )
        }

        const TeacherNavigation : React.FC = () => {
            return (
                <div></div>
            )
        }

        const AdminNavigation : React.FC = () => {
            return (
                <div></div>
            )
        } 
 

        const GuestNavigation : React.FC = () => {
            return (
                <div></div>
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
      
        return (
            <motion.div
                className="h-screen fixed z-50 bg-primary p-2 hover:w-50 left-0 top-0"
                initial={{width: closeWidth}}
                whileHover={{width: openWidth}}
            >
                <div className="h-full flex flex-col justify-start list-none gap-4">
                    <div className="flex items-center justify-start w-10 h-10 gap-4">
                        <button><MenuIcon width={10} height={10} color="white" /></button>
                        <div className="flex items-center justify-start w-full h-full">
                            <Link to="/" className="text-3xl text-white font-bold mr-4">BKStu</Link>
                            <h1 className="text-3xl text-white font-bold mr-4">/</h1>
                            <h1 className="text-3xl text-white font-bold">Home</h1>
                        </div>
                    </div>

                    <Link to="/" className="flex items-center justify-start gap-4 w-full h-10 overflow-hidden">
                        <button><HomeIcon width={10} height={10} color="white"/></button>
                        <div><h1 className="text-lg text-white font-bold">Home</h1></div>
                    </Link> 

                    {auth.isLogin ? 
                        <div onClick={() => logout()} className="flex items-center justify-start gap-4 w-full h-10 overflow-hidden absolute bottom-4">
                            <button><LogoutIcon width={10} height={10} color="white"/></button>
                            <div><h1 className="text-lg text-white font-bold">Logout</h1></div>
                        </div>
                        :
                        <Link to="/login" className="flex items-center justify-start gap-4 w-full h-10 overflow-hidden">
                            <button><LoginIcon width={10} height={10} color="white"/></button>
                            <div><h1 className="text-lg text-white font-bold">Login</h1></div>
                        </Link> 
                    }
                    <div className="flex items-center justify-start gap-4 w-full h-10 overflow-hidden">
                        <h1 className="text-lg text-white font-bold">{auth.role}</h1>
                    </div>

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
