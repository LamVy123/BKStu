import React, { FormEvent, useEffect, useReducer, useState } from "react";
import { Course, CourseDetail, CourseDetailFactory, CourseFactory } from "../../../class&interface/Course";
import { collection, doc, getCountFromServer, getDoc, getDocs, or, query, setDoc, where } from "firebase/firestore";
import { courseColRef, courseDetailColRef, userColRef, userDetaiColRef } from "../../../config/firebase";
import { v4 } from "uuid";
import { Section, SectionFactory } from "../../../class&interface/Section";
import CSection from "../../../component/CSection";
import { Student, StudentDetail, UserDetailFactory, UserFactory } from "../../../class&interface/User";
import { ArrowLeftIcon, ExitIcon, InformationIcon, LoadingIcon, RefreashIcon, SearchIcon, UserIcon } from "../../../assets/Icon";
import Input from "../../../component/Input";
import Model from "../../../component/Model";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Grade, GradeFactory } from "../../../class&interface/Grade";

interface CourseProp {
    currentCourseID: string
}

const CourseManagemnt: React.FC<CourseProp> = ({ currentCourseID }) => {

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
        { pageNumber: 1, name: 'Danh sách' },
        { pageNumber: 2, name: 'Điểm số' },
        { pageNumber: 3, name: 'Thông tin khóa học' },
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
                        navigate('/course_management')
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
                <div className="w-full min-h-10 flex justify-between items-start text-3xl font-bold">
                    <div className="w-fit h-full flex justify-start items-start">
                        <button className="w-fit h-fit" onClick={() => { navigate('/course_management') }}>
                            <ArrowLeftIcon width={10} height={10} color="black" />
                        </button>
                    </div>
                    <div className="w-full h-fit flex flex-col justify-center items-center gap-2">
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
                return <CourseStudentList currentCourseID={currentCourseID} />
            case 2:
                return <CourseGrading currentCourseID={currentCourseID} curentCourseDetail={currentCourseDetail} />
            case 3:
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
        <div className="w-full h-full border-solid  bg-white  flex flex-col items-center justify-start">
            <Header />
            <Body />
        </div>
    )
}

export default CourseManagemnt


interface CourseSectionProp {
    currentCourseID: string
}
const CourseSection: React.FC<CourseSectionProp> = ({ currentCourseID }) => {

    const getDateTime = () => {
        const date = new Date()
        return date.toString()
    }

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


    const addSection = () => {
        const n_section: Section = new Section('', v4(), getDateTime(), [], true)
        setCurrentSectionList([...currentSectionList, n_section])
    }

    return (
        <div className="w-full h-full flex items-start justify-center mt-16">
            <div className="w-full h-full flex flex-col justify-start items-center">
                {currentSectionList.map((section, index) => {
                    const courseDocRef = doc(courseDetailColRef, currentCourseID)
                    const courseSectionCol = collection(courseDocRef, 'section')
                    const sectionDocRef = doc(courseSectionCol, section.id)
                    return (
                        <CSection key={section.id} section={section} index={index} setCurrentSectionList={setCurrentSectionList} sectionDocRef={sectionDocRef} />
                    )
                })}
                <button onClick={addSection} className="p-2 bg-primary mt-4 text-white rounded-md font-bold"> Add section</button>
            </div>
        </div>
    )
}


interface CourseStudentListProp {
    currentCourseID: string
}
const CourseStudentList: React.FC<CourseStudentListProp> = ({ currentCourseID }) => {
    const [openStudentInfor, setOpenStudentInfor] = useState<boolean>(false)

    const [studentList, setStudentlist] = useState<Student[]>([])

    const [currentStudentID, setCurrentStudentID] = useState<string>('')

    const [reset, setReset] = useState<boolean>(false)

    const [isLoading, setLoading] = useState<boolean>(true)

    const [searchValue, setSearchValue] = useState<string>('')

    const [count, setCount] = useState<number>(0)

    const toggleComponentVisibility = () => {
        setOpenStudentInfor((prevState) => !prevState);
        document.body.style.position = openStudentInfor ? "static" : "fixed";
    };

    useEffect(() => {
        const fetchStudentList = async () => {

            const courseRef = doc(courseDetailColRef, currentCourseID);
            const courseStudentCol = collection(courseRef, 'student_list')

            let studentQuerryRef = query(courseStudentCol)

            setCount((await getCountFromServer(studentQuerryRef)).data().count)

            if (searchValue.toUpperCase() == '@ALL') {
                //studentQuerryRef = query(studentQuerryRef)
            } else if (searchValue != '') {
                studentQuerryRef = query(studentQuerryRef, or(
                    where('last_name', '==', searchValue),
                    where('first_name', '==', searchValue),
                    where('display_id', '==', searchValue),
                    where('email', '==', searchValue),
                    where('majors', '==', searchValue)
                ))
            }

            const studentQuerry = await getDocs(studentQuerryRef)
            const userFactory = new UserFactory()
            let list: Student[] = []
            studentQuerry.forEach((doc) => {
                list = [...list, userFactory.CreateUserWithDocumentData('student', doc.data()) as Student]
            })
            setStudentlist(list);
            setLoading(false);
        }

        fetchStudentList()
    }, [reset, searchValue])

    const search = (e: FormEvent) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget as HTMLFormElement)

        const value = data.get("search")?.toString() as string

        setSearchValue(value)
    }

    const StudentInfor: React.FC = () => {

        const Header: React.FC = () => {
            return (
                <div className="w-full h-20 flex flex-row justify-start items-center p-4 bg-primary rounded-t-2xl">
                    <h1 className="text-4xl max-md:text-2xl font-bold text-white">Thông tin sinh viên</h1>

                    <button className="w-fit h-full ml-auto" onClick={() => toggleComponentVisibility()}>
                        <ExitIcon width={10} height={10} color="black" />
                    </button>
                </div>
            )
        }

        const Form: React.FC = () => {
            const [loading, setLoading] = useState<boolean>(true);
            const [student, setStudent] = useState<Student>()
            const [studentDetail, setStudentDetail] = useState<StudentDetail>()

            useEffect(() => {
                const fetchStudent = async () => {
                    const studentRef = doc(userColRef, currentStudentID)

                    const studentDetailRef = doc(userDetaiColRef, currentStudentID)

                    const studentDoc = await getDoc(studentRef)
                    const userFactory = new UserFactory()
                    setStudent(userFactory.CreateUserWithDocumentData('student', studentDoc.data()) as Student)

                    const studentDetailDoc = await getDoc(studentDetailRef)
                    const userDetailFactory = new UserDetailFactory()
                    setStudentDetail(userDetailFactory.CreateUserDetailWithDocumentData('student', studentDetailDoc.data()) as StudentDetail)

                    setLoading(false);
                }

                fetchStudent()
            }, [])


            const Avatar: React.FC = () => {
                return (
                    <div className="w-full h-full col-span-3 max-md:col-span-6 flex justify-center items-center">
                        <div className="w-full h-full min-h-60 col-span-3 border border-black border-solid rounded-lg bg-user bg-no-repeat bg-contain bg-center">
                        </div>
                    </div>
                )
            }

            const Section1: React.FC = () => {

                return (

                    <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="last_name" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Họ <h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="last_name" name="last_name" defaultValue={student?.last_name} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="middle_name" className="py-2 font-bold flex flex-row gap-2 w-fit col-span-2 max-md:col-span-full">Tên lót <h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="middle_name" name="middle_name" defaultValue={student?.middle_name} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="first_name" className="py-2 font-bold flex flex-row gap-2 w-fit col-span-2 max-md:col-span-full">Tên <h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="first_name" name="first_name" defaultValue={student?.first_name} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="gender" className="py-2 font-bold flex flex-row gap-2 w-fit col-span-2 max-md:col-span-full">Giới tính<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="gender" name="gender" defaultValue={studentDetail?.gender} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />                                </div>

                    </div>
                )
            }

            const Section2: React.FC = () => {
                return (
                    <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="date_of_birth" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Ngày sinh<h1 className="text-red-500">*</h1></label>
                            <Input type="date" id="date_of_birth" name="date_of_birth" defaultValue={studentDetail?.date_of_birth} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                        </div>
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="identification_number" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Số CCCD <h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="identification_number" name="identification_number" defaultValue={studentDetail?.identification_number} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                        </div>
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="ethnic_group" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Dân tộc <h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="ethnic_group" name="ethnic_group" defaultValue={studentDetail?.ethnic_group} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="religion" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tôn giáo</label>
                            <Input type="text" id="religion" name="religion" defaultValue={studentDetail?.religion} placeholder="Bỏ trống nếu không có" className="w-full col-span-5" required disable />
                        </div>

                    </div>
                )
            }

            const Section3: React.FC = () => {
                return (
                    <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="academic_year" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Niên khóa<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="academic_year" name="academic_year" defaultValue={studentDetail?.academic_year} placeholder="VD: 2024" className="w-full col-span-5" required disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="faculty" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Khoa<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="faculty" name="faculty" defaultValue={studentDetail?.faculty} className="w-full col-span-5" disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="specialized" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Ngành<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="specialized" name="specialized" defaultValue={student?.majors} className="w-full col-span-5" disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="class_name" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Lớp<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="class_name" name="class_name" defaultValue={studentDetail?.classes_name} className="w-full col-span-5" disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="display_id" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">MSSV<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="display_id" name="display_id" defaultValue={student?.display_id} placeholder={''} className="w-full col-span-5" disable />
                        </div>
                    </div>
                )
            }

            const Section4: React.FC = () => {

                return (
                    <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="nationality" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Quốc tịch</label>
                            <Input type="text" id="nationality" name="nationality" defaultValue={studentDetail?.nationality} placeholder="Vui lòng điền" className="w-full col-span-5" disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="province" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tỉnh</label>
                            <Input type="text" id="province" name="province" defaultValue={studentDetail?.province} placeholder="Vui lòng điền" className="w-full col-span-5" disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="city" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Thành phố</label>
                            <Input type="text" id="city" name="city" defaultValue={studentDetail?.city} placeholder="Vui lòng điền" className="w-full col-span-5" disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="address" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Địa chỉ cụ thể</label>
                            <Input type="text" id="address" name="address" defaultValue={studentDetail?.address} placeholder="Vui lòng điền" className="w-full col-span-5" disable />
                        </div>

                    </div>
                )
            }

            const Section5: React.FC = () => {
                return (
                    <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="email" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Email trường<h1 className="text-red-500">*</h1></label>
                            <Input type="email" id="email" name="email" defaultValue={student?.email} placeholder="abc@bkstu.edu.vn" className="w-full col-span-5" required disable />
                        </div>
                    </div>
                )
            }



            if (loading) return (
                <div className="w-full h-full flex items-center justify-center">
                    <LoadingIcon width={15} height={15} color="gray" />
                </div>
            )

            return (
                <form className="w-full h-full flex flex-row p-2 overflow-scroll">
                    <div className="w-full h-full flex flex-col p-8 max-md:p-2 gap-12 text-base max-md:text-sx">

                        <div className="w-full h-fit grid grid-cols-16 max-md:grid-cols-6 gap-x-8 gap-y-4">
                            <h1 className="text-3xl max-md:text-xl font-bold col-span-full">Thông tin cơ bản</h1>

                            <Avatar />

                            <Section1 />

                            <div></div>

                            <Section2 />

                        </div>

                        <div className="w-full h-fit col-span-full flex flex-row max-md:flex-col gap-20">

                            <div className="w-1/2 max-md:w-full h-fit flex flex-col gap-4">

                                <h1 className="text-3xl max-md:text-xl font-bold">Thông tin Sinh viên</h1>

                                <Section3 />

                            </div>

                            <div className="w-1/2 max-md:w-full h-fit flex flex-col gap-4">
                                <h1 className="text-3xl max-md:text-xl font-bold col-span-full">Thông tin cư trú</h1>

                                <Section4 />

                            </div>
                        </div>

                        <div className="w-full h-fit col-span-full flex flex-row max-md:flex-col gap-20">

                            <div className="w-1/2 max-md:w-full h-fit flex flex-col gap-4">

                                <h1 className="text-3xl max-md:text-xl font-bold">Thông tin tài khoản</h1>

                                <Section5 />

                            </div>
                            <div className="w-1/2 max-md:w-full h-fit flex flex-col gap-4"></div>
                        </div>

                    </div>
                </form>
            )
        }

        return (
            <Model>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0.1 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full flex items-center justify-center p-6">
                    <div className="w-11/12 max-md:w-full max-md:h-5/6 max-h-full h-full bg-snow rounded-2xl flex flex-col border border-black border-solid overflow-hidden">

                        <Header />

                        <Form />

                    </div>
                </motion.div>
            </Model>
        )
    }
    return (
        <>
            {openStudentInfor && <StudentInfor />}
            <div className="w-full min-h-screen h-full flex items-start justify-center">
                <div className="w-10/12 min-h-8/12 h-3/5 flex flex-col items-center justify-start p-4">
                    <div className="w-10/12 flex flex-row justify-between items-center gap-20 max-md:gap-8">

                        <div className="h-fit min-w-fit flex flex-col">
                            <h1 className="text-4xl font-bold">Sinh viên<nav></nav></h1>
                            <h1 className="text-base max-md:text-xs text-gray-default">{count} Sinh viên</h1>
                        </div>

                        <form onSubmit={search} className="w-6/12 h-fit flex flex-row justify-center items-center gap-2">
                            <div className="h-10 flex justify-center items-center">
                                <motion.button whileTap={{ scale: 0.9 }} type="submit">
                                    <SearchIcon width={8} height={8} color="black" />
                                </motion.button>
                            </div>
                            <Input type="search" name="search" id="search" className="w-full h-10 text-sm" defaultValue={searchValue} placeholder="Tìm kiếm bằng họ, tên, email hoặc MSSV"></Input>
                        </form>

                    </div>
                    <div className="w-full h-fit grid grid-cols-12 max-md:grid-cols-6 p-4">
                        <div className="flex items-center justify-center"></div>

                        <div className="col-span-3 max-md:col-span-4 flex items-center justify-start text-xl max-md:text-sm text-gray-default font-bold">Họ và tên</div>

                        <div className="col-span-2 max-md:hidden flex items-center text-xl max-md:text-sm text-gray-default font-bold">MSSV</div>

                        <div className="col-span-3 max-md:hidden flex items-center text-xl text-gray-default font-bold">Email</div>

                        <div className="col-span-2 max-md:hidden flex items-center text-xl text-gray-default font-bold">Ngành</div>

                        <div className="w-full h-full flex items-center text-xl max-md:text-sm text-gray-default font-bold">
                            <motion.div onClick={() => {
                                setLoading(true);
                                setReset(reset => !reset)
                            }}
                                whileTap={{ scale: 0.9 }} className="p-2 w-fit h-fit hover:bg-gray-200 rounded-md">
                                <RefreashIcon width={7} height={7} color="gray" />
                            </motion.div>
                        </div>

                    </div>

                    <hr className="w-full solid bg-gray-200 border-gray-200 border rounded-full"></hr>

                    {(() => {
                        if (isLoading) {
                            return <div className="w-full h-full flex items-center justify-center"><LoadingIcon width={10} height={10} /></div>
                        } else if (studentList.length == 0 && searchValue != '') {
                            return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                Không có sinh viên nào ứng với tìm kiếm của bạn!
                            </div>
                        } else if (studentList.length == 0) {
                            return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                Hiện tại chưa có sinh viên nào!
                            </div>
                        }
                        return studentList.map((student, index) => {
                            const class1 = "w-full h-fit grid grid-cols-12 grid-rows-1 p-1 bg-white hover:bg-gray-50 cursor-pointer"
                            const class2 = "w-full h-fit grid grid-cols-12 grid-rows-1 p-1 bg-snow hover:bg-gray-50 cursor-pointer"

                            return (
                                <React.Fragment key={student.uid}>
                                    <div className={(index % 2 != 0) ? class1 : class2}>
                                        <div className="w-full h-full flex items-center justify-center"><UserIcon width={12} height={12} color="gray" /></div>

                                        <div className="col-span-3 flex items-center text-base font-bold ">{student.last_name + " " + student.middle_name + " " + student.first_name}</div>

                                        <div className="col-span-2 flex items-center text-base font-bold">{student.display_id}</div>

                                        <div className="col-span-3 flex items-center text-base font-bold">{student.email}</div>

                                        <div className="col-span-2 flex items-center text-base font-bold">{student.majors}</div>

                                        <div className="col-span-1 flex items-center">
                                            <motion.button
                                                onClick={() => {
                                                    setCurrentStudentID(student.uid);
                                                    toggleComponentVisibility()
                                                }}
                                                whileTap={{ scale: 0.9 }} className="">
                                                <InformationIcon width={8} height={8} color="#1071e5" />
                                            </motion.button>
                                        </div>
                                    </div>
                                    <hr className="w-full solid bg-gray-200 border-gray-200 border rounded-full"></hr>
                                </React.Fragment>
                            )
                        })
                    })()}
                </div>
            </div>
        </>
    )
}

interface CourseGradingProps {
    currentCourseID: string,
    curentCourseDetail?: CourseDetail,
}
const CourseGrading: React.FC<CourseGradingProps> = ({ currentCourseID, curentCourseDetail }) => {

    const [studentList, setStudentlist] = useState<Student[]>([])

    const [studentGradeList, setStudentGradeList] = useState<Grade[]>([])

    const [edit, setEdit] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(true)

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        const fetchStudentList = async () => {
            const courseRef = doc(courseDetailColRef, currentCourseID);
            const courseStudentCol = collection(courseRef, 'student_list')
            const studentGradeCol = collection(courseRef, 'grade')

            let studentQuerryRef = query(courseStudentCol)

            const gradeFactory = new GradeFactory()
            const studentQuerry = await getDocs(studentQuerryRef)
            const userFactory = new UserFactory()
            let studentList: Student[] = []
            let gradeList: Grade[] = []
            studentQuerry.forEach((studentData) => {
                const n_student = userFactory.CreateUserWithDocumentData('student', studentData.data()) as Student
                studentList = [...studentList, n_student]
            })

            for (let i = 0; i < studentList.length; i++) {
                const studentGradeRef = doc(studentGradeCol, studentList[i].uid)
                await getDoc(studentGradeRef).then((gradeData) => {
                    gradeList = [...gradeList, gradeFactory.CreateGradeWithDocumnetData(studentList[i].uid, gradeData.data())]
                })
            }

            setStudentGradeList(gradeList);
            setStudentlist(studentList);
        }

        if (loading) {
            fetchStudentList()
            setLoading(false)
        }
    }, [])

    const handleEdit = () => {
        setEdit(true)
        forceUpdate()
    }

    const handleCancel = () => {
        setEdit(false)
    }

    const handleSave = (e: FormEvent) => {
        e.preventDefault()

        const data = new FormData(e.currentTarget as HTMLFormElement)

        let n_gradeList: Grade[] = []

        studentList.forEach((student) => {
            const home_work_grade = data.get(`${student.uid}-home_work`)?.toString()
            const assignment_grade = data.get(`${student.uid}-assignment`)?.toString()
            const laboratory_grade = data.get(`${student.uid}-laboratory`)?.toString()
            const midterm_exam_grade = data.get(`${student.uid}-midterm_exam`)?.toString()
            const final_examgrade = data.get(`${student.uid}-final_exam`)?.toString()

            let n_grade = new Grade(
                student.uid,
                home_work_grade ? parseInt(home_work_grade) : 15,
                assignment_grade ? parseInt(assignment_grade) : 15,
                laboratory_grade ? parseInt(laboratory_grade) : 15,
                midterm_exam_grade ? parseInt(midterm_exam_grade) : 15,
                final_examgrade ? parseInt(final_examgrade) : 15,
                15,
            )

            n_grade.calculateTotal(curentCourseDetail)

            const courseRef = doc(courseDetailColRef, currentCourseID);
            const studentGradeCol = collection(courseRef, 'grade')
            const studentGradeDocRef = doc(studentGradeCol, student.uid)

            setDoc(studentGradeDocRef, n_grade.getInterface())

            n_gradeList = [...n_gradeList, n_grade]
        })
        setEdit(false)
        setStudentGradeList(n_gradeList)
    }

    const SaveButton: React.FC = () => {
        const [open, setOpen] = useState<boolean>(false);
        return (
            <>
                {open && <Model>
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-fit h-fit p-8 gap-8 rounded-2xl bg-white border border-black border-solid flex flex-col justify-end items-end">
                            <h1 className="text-xl font-bold">Bạn có chắc muốn lưu thay đổi không ?</h1>
                            <div className="w-fit h-fit flex flex-row gap-8 text-xl">
                                <button type="button" onClick={() => setOpen(false)} className="w-28 h-12 bg-red-500 hover:bg-red-600 flex justify-center items-center font-bold rounded-md text-white p-4">Cancel</button>
                                <button type="submit" className="w-28 h-12 bg-green-500 hover:bg-green-600 flex justify-center items-center font-bold rounded-md text-white p-4">Confirm</button>
                            </div>
                        </div>
                    </div>
                </Model>}
                <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setOpen(true)}
                    className="w-fit h-fit px-2 py-1 bg-primary hover:bg-blue-600 text-white rounded-md">
                    Lưu thay đổi
                </motion.button>
            </>
        )
    }

    return (
        <form onSubmit={(e) => handleSave(e)} className="w-11/12 h-fit flex flex-col items-center justify-start p-2 bg-snow mt-10">
            <div className="w-full h-fit flex flex-row items-center justify-end p-2">
                {
                    !edit ?
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { handleEdit() }}
                            className="w-fit h-fit px-2 py-1 bg-primary hover:bg-blue-600 text-white rounded-md">
                            Chỉnh sửa
                        </motion.button> :
                        <div className="flex flex-row gap-4">
                            <motion.button
                                type="button"
                                whileTap={{ scale: 0.9 }}
                                onClick={() => { handleCancel() }}
                                className="w-fit h-fit px-2 py-1 bg-gray-300 hover:bg-gray-400 text-black rounded-md">
                                Hủy
                            </motion.button>
                            <SaveButton />
                        </div>
                }
            </div>
            <div className="w-full min-h-3/5 bg-gray-300 flex flex-col gap-0">
                <div style={{ backgroundColor: edit ? 'black' : 'lightgray' }} className="w-full text-black text-lg pt-0.5 px-0.5 grid grid-cols-16 gap-0.5 font-bold">
                    <div className="col-span-3 bg-snow p-1">Họ và tên</div>
                    <div className="col-span-2 text-center bg-snow p-1">MSSV</div>
                    <div className="col-span-2 text-center bg-snow p-1">Bài tập {`(${curentCourseDetail?.home_work_percent}%)`}</div>
                    <div className="col-span-2 text-center bg-snow p-1">Bài tập lớn {`(${curentCourseDetail?.assignment_percent}%)`}</div>
                    <div className="col-span-2 text-center bg-snow p-1">TN / TH {`(${curentCourseDetail?.laboratory_percent}%)`}</div>
                    <div className="col-span-2 text-center bg-snow p-1">Giữa kì {`(${curentCourseDetail?.midterm_exam_percent}%)`}</div>
                    <div className="col-span-2 text-center bg-snow p-1">Cuối kì {`(${curentCourseDetail?.final_exam_percent}%)`}</div>
                    <div className="col-span-1 text-center bg-snow p-1">Tổng</div>
                </div>

                {(studentList.length == studentGradeList.length) && studentList.map((student, index) => {
                    return (
                        <div key={student.uid} style={{ backgroundColor: edit ? 'black' : 'lightgray' }} className="w-full text-black text-lg pt-0.5 px-0.5 grid grid-cols-16 gap-0.5">

                            <div className="col-span-3 bg-snow p-1">{`${student.last_name} ${student.middle_name} ${student.first_name}`}</div>

                            <div className="col-span-2 text-center bg-snow p-1">{student.display_id}</div>

                            <div className="col-span-2 text-center bg-snow p-1">
                                {
                                    curentCourseDetail?.home_work_percent != 0 ?
                                        <Input type="number" id={`${student.uid}-home_work`} name={`${student.uid}-home_work`}
                                            defaultValue={studentGradeList[index].home_work}
                                            className="border-transparent disabled:border-transparent w-full text-center h-fit py-0"
                                            disable={!edit} /> :
                                        null
                                }

                            </div>

                            <div className="col-span-2 text-center bg-snow p-1">
                                {
                                    curentCourseDetail?.assignment_percent != 0 ?
                                        <Input type="number" id={`${student.uid}-assignment`} name={`${student.uid}-assignment`}
                                            defaultValue={studentGradeList[index].assignment}
                                            className="border-transparent disabled:border-transparent w-full text-center h-fit py-0"
                                            disable={!edit} required /> :
                                        null
                                }
                            </div>

                            <div className="col-span-2 text-center bg-snow p-1">
                                {
                                    curentCourseDetail?.laboratory_percent != 0 ?
                                        <Input type="number" id={`${student.uid}-laboratory`} name={`${student.uid}-laboratory`}
                                            defaultValue={studentGradeList[index].laboratory}
                                            className="border-transparent disabled:border-transparent w-full text-center h-fit py-0"
                                            disable={!edit} required /> :
                                        null
                                }
                            </div>

                            <div className="col-span-2 text-center bg-snow p-1">
                                {
                                    curentCourseDetail?.midterm_exam_percent != 0 ?
                                        <Input type="number" id={`${student.uid}-midterm_exam`} name={`${student.uid}-midterm_exam`}
                                            defaultValue={studentGradeList[index].midterm_exam}
                                            className="border-transparent disabled:border-transparent w-full text-center h-fit py-0"
                                            disable={!edit} required /> :
                                        null
                                }
                            </div>

                            <div className="col-span-2 text-center bg-snow p-1">
                                {
                                    curentCourseDetail?.final_exam_percent != 0 ?
                                        <Input type="number" id={`${student.uid}-final_exam`} name={`${student.uid}-final_exam`}
                                            defaultValue={studentGradeList[index].final_exam}
                                            className="border-transparent disabled:border-transparent w-full text-center h-fit py-0"
                                            disable={!edit} required /> :
                                        null
                                }
                            </div>

                            <div className="col-span-1 text-center bg-snow p-1">
                                <Input type="number" id={`${student.uid}-total`} name={`${student.uid}-total`}
                                    defaultValue={studentGradeList[index].total}
                                    className="border-transparent disabled:border-transparent w-full text-center h-fit py-0" disable required />
                            </div>


                        </div>
                    )
                })}
                <div style={{ backgroundColor: edit ? 'black' : 'lightgray' }} className="w-full pt-0.5"></div>
            </div>
        </form>
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