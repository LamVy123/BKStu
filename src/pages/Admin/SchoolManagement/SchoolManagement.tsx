import { useState } from "react"
import Container from "../../../component/Container"
import { motion } from "framer-motion";

import FacultyManagement from "./FacultyManagement/FacultyManagment";
import MajorsManagement from "./MajorsManagement/MajorsManagemnet";
import ClassManagement from "./ClassManagement/ClassManagement";
import SubjectManagement from "./SubjectManagement/SubjectManagement";
import CourseManagement from "./CourseManagement/CourseManagement";
import SemesterManagement from "./SemesterManagement/SemesterManagemnet";
import AdminManagement from "./AdminManagement/AdminManagement";

type SchoolManagementProps = {

}

function SchoolManagement({ }: SchoolManagementProps) {
    const [currentPage, setCurrentPage] = useState<number>(0);

    const Header: React.FC = () => {
        interface PageInterface {
            name: string,
            pageNumber: number,
        }

        const pageList: PageInterface[] = [
            { pageNumber: 0, name: 'Khoa' },
            { pageNumber: 1, name: 'Ngành' },
            { pageNumber: 2, name: 'Lớp' },
            { pageNumber: 3, name: 'Môn học' },
            { pageNumber: 4, name: 'Học kì' },
            { pageNumber: 5, name: 'Khóa học' },
            { pageNumber: 6, name: 'Quản trị viên' },
        ]


        return (
            <div className="w-full min-h-10 overflow-scroll no-scrollbar" >
                <div className="w-full min-h-10 flex flex-row relative z-10 gap-2">
                    {pageList.map((page, index) => {
                        return (
                            <button key={page.pageNumber} onClick={() => { setCurrentPage(page.pageNumber) }}
                                className="p-4 relative w-fit h-10 font-bold cursor-pointer flex items-center justify-center text-xl max-md:text-xs text-black">
                                <div className="text-black">
                                    {page.name}
                                </div>
                                {currentPage == index &&
                                    <motion.div
                                        transition={{ duration: 0.2 }}
                                        className="absolute inset-0 rounded-md bg-primary border border-solid border-black z-0" layoutId="pill">
                                        <span className="w-full h-full flex items-center justify-center absolute z-10 text-white">{page.name}</span>
                                    </motion.div>
                                }
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

    const Body: React.FC = () => {
        switch (currentPage) {
            case 0:
                return <FacultyManagement />
            case 1:
                return <MajorsManagement />
            case 2:
                return <ClassManagement />
            case 3:
                return <SubjectManagement />
            case 4:
                return <SemesterManagement />
            case 5:
                return <CourseManagement />
            case 6:
                return <AdminManagement />
            default:
                return null
        }
    }

    return (
        <Container>
            <div className="w-full h-full p-4 flex flex-col bg-white">
                <div className="w-full h-full flex flex-col gap-2">
                    <Header />

                    <div className="w-full h-full border border-solid border-black rounded-md bg-white overflow-hidden shadow-md shadow-gray-default">
                        <Body />
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default SchoolManagement