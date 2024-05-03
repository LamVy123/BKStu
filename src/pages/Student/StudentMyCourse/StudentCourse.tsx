import React, { useEffect, useState } from "react";
import { Course, CourseDetail, CourseDetailFactory, CourseFactory } from "../../../class&interface/Course";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { courseColRef, courseDetailColRef } from "../../../config/firebase";
import { Section, SectionFactory } from "../../../class&interface/Section";
import CSection from "../../../component/CSection";
import { ArrowLeftIcon, LoadingIcon, UserBGIcon } from "../../../assets/Icon";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Grade, GradeFactory } from "../../../class&interface/Grade";
import { useAuth } from "../../../context/AuthContext";
import Input from "../../../component/Input";

interface CourseProp {
    currentCourseID: string
}

const MyCourse: React.FC<CourseProp> = ({ currentCourseID }) => {

    const navigate = useNavigate();

    const [currentCourse, setCurrentCourse] = useState<Course>()
    const [currentCourseDetail, setCurrentCourseDetail] = useState<CourseDetail>()

    const [currentPage, setCurrentPage] = useState<number>(0);

    const [isLoading, setLoading] = useState<boolean>(true)

    interface PageInterface {
        name: string,
        pageNumber: number,
    }

    const pageList: PageInterface[] = [
        { pageNumber: 0, name: 'Khóa học' },
        { pageNumber: 1, name: 'Điểm số' },
        { pageNumber: 2, name: 'Thông tin khóa học' },
    ]

    useEffect(() => {
        const fetchCourse = async () => {
            const courseRef = doc(courseColRef, currentCourseID)
            const courseDetailRef = doc(courseDetailColRef, currentCourseID)

            const courseFactory = new CourseFactory()
            await getDoc(courseRef)
                .then((course) => {
                    if (course.data()?.id != undefined) {
                        setCurrentCourse(courseFactory.CreateCourseWithDocumentData(course.data()))
                    } else {
                        navigate('/my_class')
                    }
                })

            const courseDetailFactoty = new CourseDetailFactory()
            await getDoc(courseDetailRef)
                .then((courseDetail) => {
                    setCurrentCourseDetail(courseDetailFactoty.CreateCourseDetailWithDocumentData(courseDetail.data()))
                })
            setLoading(false)
        }
        fetchCourse()

    }, [])


    const Header: React.FC = () => {
        return (
            <div className="w-full min-h-fit flex flex-col justify-center items-center gap-4">

                <div className="w-full h-fit flex flex-row justify-between items-start gap-2 text-3xl font-extrabold">

                    <div className="w-fit h-full flex justify-start items-start">
                        <button className="w-fit h-fit" onClick={() => { navigate('/my_course') }}>
                            <ArrowLeftIcon width={10} height={10} color="black" />
                        </button>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-2">
                        <div>
                            {`${currentCourse?.subject_name} - (${currentCourse?.subject_code}) - ${currentCourseDetail?.teacher}`}
                        </div>
                        <div>
                            {`${currentCourse?.semester} - ${currentCourse?.code}`}
                        </div>
                    </div>

                    <div></div>

                </div>
                <div className="w-full min-h-fit flex justify-center items-center">
                    {pageList.map((page, index) => {
                        return (
                            <button key={page.pageNumber} onClick={() => { setCurrentPage(page.pageNumber) }}
                                className="p-4 relative w-fit h-10 font-bold cursor-pointer flex items-center justify-center text-xl max-md:text-xs text-black">
                                <div className="text-black">
                                    {page.name}
                                </div>
                                {currentPage == index &&
                                    <motion.div
                                        transition={{ duration: 0.1 }}
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
                return <CourseSection currentCourseID={currentCourseID} />
            case 1:
                return <GradeSection currentCourseID={currentCourseID} currentCourse={currentCourse} currentCourseDetail={currentCourseDetail} />
            case 2:
                return <CourseInfor currentCourse={currentCourse} currentCourseDetail={currentCourseDetail} />
            default:
                return null
        }
    }


    if (isLoading) {
        return (
            <div className="w-full h-screen border-solid  bg-white  flex flex-col items-center justify-center">
                <LoadingIcon width={10} height={10} />
            </div>
        )
    }

    return (
        <div className="w-full h-full border-solid bg-white flex flex-col items-center justify-start">
            <Header />
            <Body />
        </div>
    )
}

export default MyCourse


interface CourseSectionProps {
    currentCourseID: string
}

const CourseSection: React.FC<CourseSectionProps> = ({ currentCourseID }) => {
    const [currentSectionList, setCurrentSectionList] = useState<Section[]>([])

    useEffect(() => {
        const fetchSection = async () => {
            const courseDetailDocRef = doc(courseDetailColRef, `${currentCourseID}`);
            const courseSectionCol = collection(courseDetailDocRef, 'section');
            const courseSectionQuery = query(courseSectionCol)

            let sectionList: Section[] = []
            const sectionFacoty = new SectionFactory()
            const courseSectionSnapShot = await getDocs(courseSectionQuery)

            courseSectionSnapShot.forEach((sectionData) => {
                const sectionDocRef = doc(courseSectionCol, sectionData.data()?.id)
                sectionFacoty.CreateSectionWithDocumentData(sectionData.data(), sectionDocRef).then((n_section) => {
                    sectionList = [...sectionList, n_section]
                    sectionList.sort((a, b) => {
                        const dateA = new Date(a.time_created);
                        const dateB = new Date(b.time_created);

                        if (dateA < dateB) {
                            return -1;
                        } else if (dateA > dateB) {
                            return 1;
                        } else {
                            return 0;
                        }
                    })
                    setCurrentSectionList(sectionList)
                })
            })

        }

        fetchSection()
    }, [])

    return (
        <div className="w-full h-full flex items-start justify-center mt-16">
            <div className="w-full h-full flex flex-col justify-start items-center">
                {currentSectionList.map((section, index) => {
                    const courseDocRef = doc(courseDetailColRef, currentCourseID)
                    const courseSectionCol = collection(courseDocRef, 'section')
                    const sectionDocRef = doc(courseSectionCol, section.id)
                    return (
                        <CSection key={section.id} section={section} index={index} setCurrentSectionList={setCurrentSectionList} sectionDocRef={sectionDocRef} disableEdit />
                    )
                })}
            </div>
        </div>
    )
}

interface GradeProps {
    currentCourseID: string
    currentCourse?: Course
    currentCourseDetail?: CourseDetail
}

const GradeSection: React.FC<GradeProps> = ({ currentCourseID, currentCourse, currentCourseDetail }) => {

    const auth = useAuth();

    const [currentGrade, setCurrentGrade] = useState<Grade>();

    useEffect(() => {
        const fetchGrade = async () => {
            const courseDetailDocRef = doc(courseDetailColRef, `${currentCourseID}`);
            const courseGradeCol = collection(courseDetailDocRef, 'grade');
            const gradeDoc = doc(courseGradeCol, auth.userInfor.uid);
            const gradeFactory = new GradeFactory()
            await getDoc(gradeDoc).then((gradeData) => {
                setCurrentGrade(gradeFactory.CreateGradeWithDocumnetData(currentCourseID, gradeData?.data()))
            })
        }

        fetchGrade()
    }, [])

    let home_work_grade = 0
    let assignment_grade = 0
    let lab_grade = 0
    let midterm_grade = 0
    let finalterm_grade = 0
    if (currentGrade?.home_work && currentCourseDetail?.home_work_percent) {
        home_work_grade = currentGrade?.home_work == 15 ? 15 : (currentGrade?.home_work * currentCourseDetail?.home_work_percent / 100)
    }
    if (currentGrade?.assignment && currentCourseDetail?.assignment_percent) {
        assignment_grade = currentGrade?.assignment == 15 ? 15 : (currentGrade?.assignment * currentCourseDetail?.assignment_percent / 100)
    }
    if (currentGrade?.laboratory && currentCourseDetail?.laboratory_percent) {
        lab_grade = currentGrade?.laboratory == 15 ? 15 : (currentGrade?.laboratory * currentCourseDetail?.laboratory_percent / 100)
    }
    if (currentGrade?.midterm_exam && currentCourseDetail?.midterm_exam_percent) {
        midterm_grade = currentGrade?.midterm_exam == 15 ? 15 : (currentGrade?.midterm_exam * currentCourseDetail?.midterm_exam_percent / 100)
    }
    if (currentGrade?.final_exam && currentCourseDetail?.final_exam_percent) {
        finalterm_grade = currentGrade?.final_exam == 15 ? 15 : (currentGrade?.final_exam * currentCourseDetail?.final_exam_percent / 100)
    }

    return (
        <div className="w-full h-full flex items-start justify-center mt-16">
            <div className="w-full h-full flex flex-col justify-start items-center">
                <div className="w-8/12 h-fit flex flex-col gap-4">
                    <div className="w-full h-fit flex flex-row text-3xl font-bold items-center gap-4">
                        <div className="border border-black border-solid rounded-full p-1 bg-black">
                            <UserBGIcon width={10} height={10} color="white" />
                        </div>
                        {auth.userInfor.last_name + " " + auth.userInfor.middle_name + " " + auth.userInfor.first_name}
                    </div>

                    <div className="w-full h-fit text-xl font-semibold bg-white p-2">
                        {`${currentCourse?.subject_name} - (${currentCourse?.subject_code}) - ${currentCourseDetail?.teacher} - ${currentCourse?.semester} - ${currentCourse?.code}`}
                    </div>
                    <div className="w-full h-fit bg-snow flex flex-col gap-4 p-4 border border-gray-200 border-solid rounded-sm">

                        <div className="w-full h-fit p-4 grid grid-cols-12 text-lg font-semibold">
                            <div className="w-full h-full col-span-4 text-start">Mục điểm</div>
                            <div className="w-full h-full col-span-2 text-center">Điểm</div>
                            <div className="w-full h-full col-span-2 text-center">Phần trăm<main></main></div>
                            <div className="w-full h-full col-span-4 text-center">Đóng góp vào điểm trung bình</div>
                        </div>

                        {(currentCourseDetail?.home_work_percent != 0) &&
                            <div className="w-full h-fit bg-white p-2 border border-gray-200 border-solid rounded-sm flex flex-col">
                                <div className="w-full h-fit p-2 grid grid-cols-12 text-lg">
                                    <div className="w-full h-full col-span-4 text-start font-semibold">Bài tập</div>
                                    <div className="w-full h-full col-span-2 text-center">{currentGrade?.home_work}</div>
                                    <div className="w-full h-full col-span-2 text-center">{currentCourseDetail?.home_work_percent}%<main></main></div>
                                    <div className="w-full h-full col-span-4 text-center">{home_work_grade}</div>
                                </div>
                            </div>}
                        {(currentCourseDetail?.assignment_percent != 0) &&
                            <div className="w-full h-fit bg-white p-2 border border-gray-200 border-solid rounded-sm flex flex-col">
                                <div className="w-full h-fit p-2 grid grid-cols-12 text-lg">
                                    <div className="w-full h-full col-span-4 text-start font-semibold">Bài tập Lớn</div>
                                    <div className="w-full h-full col-span-2 text-center">{currentGrade?.assignment}</div>
                                    <div className="w-full h-full col-span-2 text-center">{currentCourseDetail?.assignment_percent}%<main></main></div>
                                    <div className="w-full h-full col-span-4 text-center">{assignment_grade}</div>
                                </div>
                            </div>}
                        {(currentCourseDetail?.laboratory_percent != 0) &&
                            <div className="w-full h-fit bg-white p-2 border border-gray-200 border-solid rounded-sm flex flex-col">
                                <div className="w-full h-fit p-2 grid grid-cols-12 text-lg">
                                    <div className="w-full h-full col-span-4 text-start font-semibold">Thí nghiệm \ Thực Hành</div>
                                    <div className="w-full h-full col-span-2 text-center">{currentGrade?.laboratory}</div>
                                    <div className="w-full h-full col-span-2 text-center">{currentCourseDetail?.laboratory_percent}%<main></main></div>
                                    <div className="w-full h-full col-span-4 text-center">{lab_grade}</div>
                                </div>
                            </div>}
                        {(currentCourseDetail?.midterm_exam_percent != 0) &&
                            <div className="w-full h-fit bg-white p-2 border border-gray-200 border-solid rounded-sm flex flex-col">
                                <div className="w-full h-fit p-2 grid grid-cols-12 text-lg">
                                    <div className="w-full h-full col-span-4 text-start font-semibold">Kiểm tra giữa kì</div>
                                    <div className="w-full h-full col-span-2 text-center">{currentGrade?.midterm_exam}</div>
                                    <div className="w-full h-full col-span-2 text-center">{currentCourseDetail?.midterm_exam_percent}%<main></main></div>
                                    <div className="w-full h-full col-span-4 text-center">{midterm_grade}</div>
                                </div>
                            </div>}
                        {(currentCourseDetail?.final_exam_percent != 0) &&
                            <div className="w-full h-fit bg-white p-2 border border-gray-200 border-solid rounded-sm flex flex-col">
                                <div className="w-full h-fit p-2 grid grid-cols-12 text-lg">
                                    <div className="w-full h-full col-span-4 text-start font-semibold">Kiểm tra cuối kì </div>
                                    <div className="w-full h-full col-span-2 text-center">{currentGrade?.final_exam}</div>
                                    <div className="w-full h-full col-span-2 text-center">{currentCourseDetail?.final_exam_percent}%<main></main></div>
                                    <div className="w-full h-full col-span-4 text-center">{finalterm_grade}</div>
                                </div>
                            </div>}

                        <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>

                        <div className="w-full h-fit bg-white p-2 border border-gray-200 border-solid rounded-sm flex flex-col">
                            <div className="w-full h-fit p-2 grid grid-cols-12 text-lg">
                                <div className="w-full h-full col-span-4 text-start font-semibold">Tổng</div>
                                <div className="w-full h-full col-span-2 text-center">{currentGrade?.total}</div>
                                <div className="w-full h-full col-span-2 text-center">100%<main></main></div>
                                <div className="w-full h-full col-span-4 text-center">{currentGrade?.total}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

interface CourseInforProps {
    currentCourse?: Course
    currentCourseDetail?: CourseDetail
}

const CourseInfor: React.FC<CourseInforProps> = ({ currentCourse, currentCourseDetail }) => {

    const study_schedule = currentCourse?.study_schedule.split('/');
    const lab_schedule = currentCourse?.lab_schedule.split('/');

    return (
        <div className="w-full h-full flex items-start justify-center mt-16">
            <div className="w-full h-full flex flex-col justify-start items-center">
                <div className="w-8/12 h-fit flex flex-col gap-4">
                    <form className="w-full h-full max-md:hidden flex flex-col gap-2 p-2 overflow-scroll">
                        {(currentCourse && currentCourseDetail) ? <div className="w-full h-full flex flex-col p-4 gap-8 text-xl overflow-scroll">
                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="subject_name" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tên môn học:</label>
                                <Input type="text" id="subject_name" name="subject_name" defaultValue={currentCourse.subject_name} placeholder="" className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="subject_code" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Mã môn học:</label>
                                <Input type="text" id="subject_code" name="subject_code" defaultValue={currentCourse.subject_code} placeholder="" className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="subject_type" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Loại môn học:</label>
                                <Input type="text" id="subject_type" name="subject_type" defaultValue={currentCourse.subject_type} placeholder="" className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="course_code" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Mã khóa học:</label>
                                <Input type="text" id="course_code" name="course_code" defaultValue={currentCourse.code} placeholder="" className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="academic_year" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Niên khóa:</label>
                                <Input type="text" id="academic_year" name="academic_year" defaultValue={currentCourse.academic_year} placeholder="" className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="semester" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Học kì:</label>
                                <Input type="text" id="semester" name="semester" defaultValue={currentCourse.semester} placeholder="" className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 text-black gap-2">
                                <label htmlFor="status" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Trạng thái khóa học:</label>
                                <Input type="text" id="status" name="status" placeholder="" className="w-full col-span-5" disable defaultValue={currentCourse.status} />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="faculty" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Khoa:</label>
                                <Input type="text" id="faculty" name="faculty" defaultValue={currentCourse.faculty} className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="majors" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Ngành:</label>
                                <Input type="text" id="majors" name="majors" defaultValue={currentCourse.majors} className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="teacher" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Giảng viên:</label>
                                <Input type="text" id="teacher" name="teacher" defaultValue={currentCourseDetail.teacher} className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="teacher_email" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Email giảng viên:</label>
                                <Input type="text" id="teacher_email" name="teacher_email" defaultValue={currentCourseDetail.teacher_email} className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit flex flex-col max-md:grid-cols-5 gap-2">
                                <label className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Lịch học lý thuyết:</label>
                                <div className="w-full h-fit p-2 grid grid-cols-12 text-lg font-normal border-2 border-solid border-gray-300 rounded-md">
                                    <div className="col-span-2">{study_schedule ? study_schedule[0] : null}</div>
                                    <div className="col-span-2">{study_schedule ? study_schedule[1] : null}</div>
                                    <div className="col-span-8 text-end">{study_schedule ? study_schedule[2] : null}</div>
                                </div>
                            </div>

                            {currentCourseDetail.laboratory_percent == 0 ? null : <div className="w-full h-fit flex flex-col max-md:grid-cols-5 gap-2">
                                <label htmlFor="lab_schedule" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Lịch học thí nghiệm:</label>
                                <div className="w-full h-fit p-2 grid grid-cols-12 text-lg font-normal border-2 border-solid border-gray-300 rounded-md">
                                    <div className="col-span-2">{lab_schedule ? lab_schedule[0] : null}</div>
                                    <div className="col-span-2">{lab_schedule ? lab_schedule[1] : null}</div>
                                    <div className="col-span-8 text-end">{lab_schedule ? lab_schedule[2] : null}</div>
                                </div>
                            </div>}

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="class_duration" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Thời lượng tiết:</label>
                                <Input type="number" id="class_duration" name="class_duration" defaultValue={currentCourseDetail.class_duration} placeholder="" className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="number_of_credit" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Số tín chỉ:</label>
                                <Input type="number" id="number_of_credit" name="number_of_credit" defaultValue={currentCourse.number_of_credit} placeholder="" className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="hours_needed" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Số giờ học:</label>
                                <Input type="number" id="hours_needed" name="hours_needed" defaultValue={currentCourseDetail.hours_needed} placeholder="" className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="home_work_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm bài tập:</label>
                                <Input type="number" id="home_work_percent" name="home_work_percent" defaultValue={currentCourseDetail.home_work_percent} placeholder="" className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="assignment_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm BTL:</label>
                                <Input type="number" id="assignment_percent" name="assignment_percent" defaultValue={currentCourseDetail.assignment_percent} placeholder="" className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="laboratory_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm thí nghiệm:</label>
                                <Input type="number" id="laboratory_percent" name="laboratory_percent" defaultValue={currentCourseDetail.laboratory_percent} placeholder="" className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="midterm_exam_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm giữa kì:</label>
                                <Input type="number" id="midterm_exam_percent" name="midterm_exam_percent" defaultValue={currentCourseDetail.midterm_exam_percent} placeholder="" className="w-full col-span-5" disable />
                            </div>

                            <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                                <label htmlFor="final_exam_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm cuối kì:</label>
                                <Input type="number" id="final_exam_percent" name="final_exam_percent" defaultValue={currentCourseDetail.final_exam_percent} placeholder="" className="w-full col-span-5" disable />
                            </div>
                        </div> : <div className="w-full h-full flex items-center justify-center"><LoadingIcon width={10} height={10} /></div>}

                    </form>
                </div>
            </div>
        </div>
    )
}