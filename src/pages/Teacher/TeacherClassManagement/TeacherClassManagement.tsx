import React from "react";
import Footer from "../../../component/Footer";
import ClassSelect from "./TeacherClassSelect";
import ClassInfor from "./TeacherClass";
import { useLocation } from "react-router-dom";


const TeacherClassManagement: React.FC = () => {
    const location = useLocation()

    let ID: string = ''

    const pathList = location.pathname.split('/')
    if (pathList.length < 3) {
        ID = ''
    } else {
        ID = pathList[2]
    }

    if (ID != '') {
        return (
            <>
                <div className="min-w-full min-h-screen h-full pt-14 flex flex-col justify-start items-center">
                    <div className="w-full h-full flex items-start justify-start p-4 ">
                        <ClassInfor currentClassID={ID} /> :
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <div className="min-w-full min-h-screen h-full pt-14 flex flex-col justify-start items-center">
                <div className="w-full h-full flex items-start justify-start p-4 ">
                    <ClassSelect />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default TeacherClassManagement