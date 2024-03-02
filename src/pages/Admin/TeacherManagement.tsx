import React from "react";
import Container from "../../component/Container";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const TeacherManagement : React.FC = () => {
    const auth = useAuth();
    if (auth.role != 'admin') return <Navigate to={'/'} />

    return (
        <Container>
            <div className="w-full h-full flex items-center justify-center p-4 bg-zinc-200">
                <div className="w-full h-full border-solid border border-black rounded-md shadow-sm bg-white shadow-gray-700 flex items-center justify-center">
                    <h1>Teacher Management</h1>
                </div>
            </div>
        </Container>
    )
}

export default TeacherManagement