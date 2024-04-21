import { useState } from "react"
import Container from "../../../component/Container"
import { Semester } from "../../../class&interface/Semester"
import SemesterSelect from "./StudentSemesterSelect"
import CourseSelect from "./StudentCourseSelect"
import { useLocation } from "react-router-dom"


const StudentCourseRegistration: React.FC = () => {
    const location = useLocation()

    let ID: string = ''

    const pathList = location.pathname.split('/')
    if (pathList.length < 3) {
        ID = ''
    } else {
        ID = pathList[2]
    }

    const [currentSemester, setcurrentSemester] = useState<Semester>()

    if (currentSemester && ID != '') {
        return (
            <Container>
                <div className="w-full h-full flex items-center justify-center p-4 bg-white">
                    <CourseSelect currentSemester={currentSemester} />
                </div>
            </Container>
        )
    }


    return (
        <Container>
            <div className="w-full h-full flex items-center justify-center p-4 bg-white">
                <SemesterSelect setcurrentSemester={setcurrentSemester} />
            </div>
        </Container>
    )
}

export default StudentCourseRegistration