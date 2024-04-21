import React, { FormEvent, useEffect, useState } from "react";
import { Course, CourseDetail, CourseDetailFactory, CourseFactory } from "../../../class&interface/Course";
import { collection, doc, getDoc, getDocs, or, query, where } from "firebase/firestore";
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

interface CourseProp {
    currentCourseID: string
}

const CourseInfor: React.FC<CourseProp> = ({ currentCourseID }) => {

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
        { pageNumber: 1, name: 'Danh sách sinh viên' },
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


    const getDateTime = () => {
        const date = new Date()
        return (date.getFullYear() + "/" + date.getMonth() + "/" + date.getDay() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds())
    }

    const CourseSection: React.FC = () => {
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

    const CourseStudentList: React.FC = () => {
        const [openStudentInfor, setOpenStudentInfor] = useState<boolean>(false)

        const [studentList, setStudentlist] = useState<Student[]>([])

        const [currentStudentID, setCurrentStudentID] = useState<string>('')

        const [reset, setReset] = useState<boolean>(false)

        const [isLoading, setLoading] = useState<boolean>(true)

        const [searchValue, setSearchValue] = useState<string>('')

        const toggleComponentVisibility = () => {
            setOpenStudentInfor((prevState) => !prevState);
            document.body.style.position = openStudentInfor ? "static" : "fixed";
        };

        useEffect(() => {
            const fetchStudentList = async () => {

                const courseRef = doc(courseDetailColRef, currentCourseID);
                const courseStudentCol = collection(courseRef, 'student_list')

                let studentQuerryRef = query(courseStudentCol, where('role', '==', 'student'))

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
                <div className="w-10/12 min-h-screen h-full flex flex-col items-center justify-start p-4">
                    <div className="w-10/12 flex flex-row justify-between items-center gap-20 max-md:gap-8">

                        <div className="h-fit min-w-fit flex flex-col">
                            <h1 className="text-4xl font-bold">Sinh viên<nav></nav></h1>
                            <h1 className="text-base max-md:text-xs text-gray-default">{ } Sinh viên</h1>
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

                    <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>

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
                            const class1 = "w-full h-fit grid grid-cols-12 grid-rows-1 p-1 bg-white hover:bg-gray-200 cursor-pointer"
                            const class2 = "w-full h-fit grid grid-cols-12 grid-rows-1 p-1 bg-gray-100 hover:bg-gray-200 cursor-pointer"

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
                                    <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>
                                </React.Fragment>
                            )
                        })
                    })()}
                </div>
            </>
        )
    }

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
                return <CourseSection />
            case 1:
                return <CourseStudentList />
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

export default CourseInfor