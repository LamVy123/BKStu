import React, { FormEvent, useEffect, useState } from "react";
import { Course, CourseFactory } from "../../../class&interface/Course";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { courseColRef, courseDetailColRef, userDetaiColRef } from "../../../config/firebase";
import { motion } from "framer-motion";
import { ArrowLeftIcon, LoadingIcon, RefreashIcon, SearchIcon, TrashIcon } from "../../../assets/Icon";
import Input from "../../../component/Input";
import Model from "../../../component/Model";
import { Semester } from "../../../class&interface/Semester";
import { useNavigate } from "react-router-dom";

interface CourseSelectProp {
    currentSemester: Semester
}


const CourseSelect: React.FC<CourseSelectProp> = ({ currentSemester }) => {

    const auth = useAuth()

    const navigate = useNavigate()

    const [reset, setReset] = useState<boolean>(false);

    const [courseList, setCourseList] = useState<Course[]>([])

    const [currentCourseID, setcurrentCourseID] = useState<string>('');

    const [searchValue, setSearchValue] = useState<string>('')

    const [isLoading, setLoading] = useState<boolean>(true);

    const [myCourseList, setMyCourseList] = useState<Course[]>([])

    function scheduleIntersect(event1: string, event2: string): boolean {
        if (event1 == '' || event2 == '') return false;

        const matches1 = event1.split('/');
        const matches2 = event2.split('/')


        const [day1, timeRange1, weeks1] = matches1;
        const [day2, timeRange2, weeks2] = matches2;


        let same_day: boolean
        if (day1 !== day2) {
            same_day = false
        } else {
            same_day = true
        }


        const [start1, end1] = timeRange1.split("-").map(time => {
            const [hour, minute] = time.split(":").map(t => parseInt(t));
            return hour * 60 + minute;
        });

        const [start2, end2] = timeRange2.split("-").map(time => {
            const [hour, minute] = time.split(":").map(t => parseInt(t));
            return hour * 60 + minute;
        });

        if (isNaN(start1) || isNaN(end1) || isNaN(start2) || isNaN(end2) || start1 >= end1 || start2 >= end2) {
            throw new Error("Invalid time range");
        }

        let same_hours: boolean
        if (
            (start1 > start2 && start1 < end2) ||
            (end1 > start2 && end1 < end2) ||
            (start2 > start1 && start2 < end1) ||
            (end2 > start1 && end2 < end1) ||
            (start1 == start2) || (end1 == end2)
        ) {
            same_hours = true
        } else {
            same_hours = false
        }

        const weeksArr1 = weeks1.split("|")
        const weeksArr2 = weeks2.split("|")

        let same_weeks: boolean = false
        for (let i = 0; i < weeksArr1.length; i++) {
            if (weeksArr1[i] !== "--" && weeksArr2[i] !== "--") {
                same_weeks = true
            }
        }

        return (same_day && same_hours && same_weeks);
    }

    const checkIntersect = (t_course: Course): boolean => {
        if (myCourseList.length == 0) return false;
        let result = false;
        myCourseList.forEach((course) => {
            let study_schedule = course.study_schedule
            let lab_schedule = course.lab_schedule

            let t_study_schedule = t_course.study_schedule
            let t_lab_schedule = t_course.lab_schedule

            if (
                scheduleIntersect(t_study_schedule, study_schedule) ||
                scheduleIntersect(t_study_schedule, lab_schedule) ||
                scheduleIntersect(t_lab_schedule, study_schedule) ||
                scheduleIntersect(t_lab_schedule, lab_schedule)
            ) {
                result = true;
            }

            if (course.subject_code == t_course.subject_code) {
                result = true
            }
        })
        return result;
    }


    const register_course = async () => {
        try {
            const courseDetailRef = doc(courseDetailColRef, currentCourseID)
            const courseStudentListCol = collection(courseDetailRef, 'student_list')
            const studentRef = doc(courseStudentListCol, auth.userInfor.uid)
            await setDoc(studentRef, auth.userInfor.getInterface())
            const courseFactory = new CourseFactory();
            const courseRef = doc(courseColRef, currentCourseID)

            const userDetailRef = doc(userDetaiColRef, auth.userInfor.uid)
            const userCourseCol = collection(userDetailRef, 'course');
            const userCourse = doc(userCourseCol, currentCourseID);

            await getDoc(courseRef).then((doc) => {
                const course = courseFactory.CreateCourseWithDocumentData(doc.data())
                setDoc(userCourse, course.getInterface())
            })
            alert("Đăng kí khóa học thành công");
            setReset(reset => !reset)
        } catch (err) {
            console.error
            alert("Bạn đã đăng kí khóa học này, không thể đăng kí lại!");
        }
    }


    const delete_course = async () => {
        try {
            const courseDetailRef = doc(courseDetailColRef, currentCourseID)
            const courseStudentListCol = collection(courseDetailRef, 'student_list')
            const studentRef = doc(courseStudentListCol, auth.userInfor.uid)
            await deleteDoc(studentRef)
            const userDetailRef = doc(userDetaiColRef, auth.userInfor.uid)
            const userCourseCol = collection(userDetailRef, 'course');
            const userCourse = doc(userCourseCol, currentCourseID);
            deleteDoc(userCourse)

            alert("Hủy đăng kí khóa học thành công");
            setReset(reset => !reset)
        } catch {
            alert("Đã xảy ra lỗi xin thử lại!");
        }
    }

    useEffect(() => {
        const fetchCourseList = async () => {
            setLoading(true);
            let courseQuerry = query(courseColRef, where('semester', '==', currentSemester?.code));

            if (searchValue != '') {
                courseQuerry = query(courseQuerry, where('subject_code', '==', searchValue));
            }

            let list: Course[] = [];
            const courseQuerrySnapshot = await getDocs(courseQuerry)
            const courseFactory = new CourseFactory();
            courseQuerrySnapshot.forEach((doc) => {
                list = [...list, courseFactory.CreateCourseWithDocumentData(doc.data())]
            })
            setCourseList(list);
            setLoading(false)
        }

        fetchCourseList();
    }, [reset, searchValue])

    useEffect(() => {
        const fetchMyCourseList = async () => {
            const userDetailRef = doc(userDetaiColRef, auth.userInfor.uid)
            const userCourseCol = collection(userDetailRef, 'course')
            const userCourseQuery = query(userCourseCol, where('semester', '==', currentSemester?.code))
            let list: Course[] = [];
            const courseQuerrySnapshot = await getDocs(userCourseQuery)
            const courseFactory = new CourseFactory();
            courseQuerrySnapshot.forEach((doc) => {
                list = [...list, courseFactory.CreateCourseWithDocumentData(doc.data())]
            })
            setMyCourseList(list);
        }
        fetchMyCourseList()
    }, [reset])

    const Header: React.FC = () => {
        const search = (e: FormEvent) => {
            e.preventDefault();

            const data = new FormData(e.currentTarget as HTMLFormElement)

            const value = data.get("search")?.toString() as string

            setSearchValue(value)

        }

        return (
            <div className="w-full h-20 flex flex-row max-md:flex-col p-2 gap-4 items-center max-md:items-end ml-auto">
                <motion.button whileTap={{ scale: 0.9 }} type="button" onClick={() => navigate('/course_registration')}>
                    <ArrowLeftIcon width={8} height={8} color="black" />
                </motion.button>
                <div className="w-full h-fit flex flex-row items-center gap-20 max-md:gap-8">

                    <div className="h-fit w-fit flex flex-col">
                        <h1 className="text-3xl w-64 font-bold">Đợt đăng kí {currentSemester?.code}</h1>
                    </div>

                    <form onSubmit={search} className="w-full h-fit flex flex-row justify-center items-center gap-2">
                        <div className="h-10 flex justify-center items-center">
                            <motion.button whileTap={{ scale: 0.9 }} type="submit">
                                <SearchIcon width={8} height={8} color="black" />
                            </motion.button>
                        </div>
                        <Input type="search" name="search" id="search" className="w-full h-10 text-sm" defaultValue={searchValue} placeholder="Tìm kiếm bằng mã môn học"></Input>
                    </form>

                </div>
            </div>
        )
    }

    const getSchedule = (schedule: string): string[] => {
        return schedule.split('/');
    }


    const [open1, setOpen1] = useState<boolean>(false);
    const [open2, setOpen2] = useState<boolean>(false);

    return (
        <>
            <div className="w-full h-full border-solid border p-4 border-black rounded-md shadow-md bg-snow shadow-gray-default flex items-center justify-center">

                <div className="w-full h-full flex items-center justify-center p-4">

                    <div className="w-full h-full flex flex-row items-center justify-center gap-2">

                        <div className="w-6/12 max-md:w-full h-full flex flex-col">

                            <Header />

                            <div className="w-full h-full flex flex-col p-0 gap-0 overflow-hidden">
                                <div className="w-full h-24 grid grid-cols-10 p-4 items-center">

                                    <div className="w-full h-full col-span-2 text-lg font-bold text-gray-default flex items-center">Mã môn học</div>

                                    <div className="w-full h-full col-span-2 text-lg font-bold text-gray-default flex items-center justify-center">Mã khóa học</div>

                                    <div className="w-full h-full col-span-3 text-lg font-bold text-gray-default flex items-center justify-center">Môn</div>

                                    <div className="w-full h-full col-span-2 text-lg font-bold text-gray-default flex items-center justify-center">Số tín chỉ</div>

                                    <div className="w-full h-full flex justify-center items-center">
                                        <motion.button whileTap={{ scale: .9 }} onClick={() => { setCourseList([]); setReset(reset => !reset) }} className="hover:bg-gray-300 p-2 rounded-md">
                                            <RefreashIcon width={6} height={6} color="gray" />
                                        </motion.button>
                                    </div>
                                </div>

                                <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>

                                <div className="w-full h-full flex flex-col p-0 overflow-scroll no-scrollbar">
                                    {(() => {
                                        if (isLoading) {
                                            return <div className="w-full h-full flex items-center justify-center"><LoadingIcon width={10} height={10} /></div>
                                        } else if (courseList.length == 0 && searchValue != '') {
                                            return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                                Không có khóa học nào với mã môn học là {searchValue}!
                                            </div>
                                        }
                                        return courseList.map((course, index) => {
                                            const class1 = "w-full h-fit flex flex-col p-4 gap-2 hover:bg-gray-50 bg-snow";
                                            const class2 = "w-full h-fit flex flex-col p-4 gap-2 hover:bg-gray-50 bg-white";

                                            const study_schedule = getSchedule(course.study_schedule)
                                            const lab_schedule = getSchedule(course.lab_schedule)
                                            const bla = !checkIntersect(course) && (currentSemester?.status == 'open')

                                            return (
                                                <React.Fragment key={course.id}>
                                                    <div className={(index % 2 != 0) ? class1 : class2}>
                                                        <div className="w-full h-fit grid grid-cols-10 gap-4">

                                                            <div className="w-full h-full col-span-2 text-xs font-bold text-black">{course.subject_code}</div>

                                                            <div className="w-full h-full col-span-2 text-xs font-bold text-black text-center">{course.code}</div>

                                                            <div className="w-full h-full col-span-3 text-xs font-bold text-black text-center">{course.subject_name}</div>

                                                            <div className="w-full h-full col-span-2 text-xs font-bold text-black text-center">{course.number_of_credit}</div>

                                                            <>
                                                                {open1 && <Model>
                                                                    <div className="w-full h-full flex justify-center items-center text-xl">
                                                                        <div className="w-fit h-fit p-8 gap-8 rounded-2xl bg-white border border-black border-solid flex flex-col justify-end items-end">
                                                                            <h1 className="text-xl font-bold">Bạn có chắc muốn đăng kí khóa học này không ?</h1>
                                                                            <div className="w-fit h-fit flex flex-row gap-8">
                                                                                <button type="button" onClick={() => setOpen1(false)} className="w-28 h-12 bg-red-500 flex justify-center items-center font-bold rounded-md hover:bg-red-600 text-white p-4">Cancel</button>
                                                                                <button type="button" onClick={() => { register_course(); setOpen1(false) }} className="w-28 h-12 bg-green-500 flex justify-center items-center font-bold rounded-md hover:bg-green-600 text-white p-4">Confirm</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Model>}
                                                                {bla && <motion.button
                                                                    onClick={(e) => {
                                                                        setcurrentCourseID(e.currentTarget.getAttribute('data-key') as string);
                                                                        setOpen1(true)
                                                                    }}
                                                                    data-key={course.id} whileTap={{ scale: .9 }} className="w-fit h-fit rounded-md flex justify-center items-center text-sm text-green-500">
                                                                    Đăng kí
                                                                </motion.button>}
                                                            </>
                                                        </div>
                                                        <hr className="solid bg-gray-200 border-gray-400 border rounded-full"></hr>
                                                        <div className="w-full h-fit text-xs font-bold text-black grid grid-cols-12">
                                                            <div className="col-span-2">Lý thuyết:</div>
                                                            <div className="col-span-2">{study_schedule[0]}</div>
                                                            <div className="col-span-2">{study_schedule[1]}</div>
                                                            <div className="col-span-6 text-end">{study_schedule[2]}</div>
                                                        </div>
                                                        <div className="w-full h-fit text-xs font-bold text-black grid grid-cols-12">
                                                            <div className="col-span-2">Thí nghiệm:</div>
                                                            <div className="col-span-2">{lab_schedule[0]}</div>
                                                            <div className="col-span-2">{lab_schedule[1]}</div>
                                                            <div className="col-span-6 text-end">{lab_schedule[2]}</div>
                                                        </div>
                                                    </div>
                                                    <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>
                                                </React.Fragment>
                                            )
                                        })
                                    })()}
                                </div>

                            </div>

                        </div>

                        <div className="w-0 h-full border border-solid border-gray-default" />

                        <div className="w-6/12 max-md:w-full h-full flex flex-col">

                            <div className="w-full h-20 flex flex-row max-md:flex-col p-2 gap-4 items-center max-md:items-end ml-auto">

                                <div className="w-full h-fit flex flex-row items-center justify-center gap-20 max-md:gap-8">
                                    <h1 className="text-3xl w-fit font-bold">Khóa học đã đăng kí </h1>
                                </div>
                            </div>

                            <div className="w-full h-full flex flex-col gap-0 overflow-hidden">
                                <div className="w-full h-24 grid grid-cols-10 p-4">

                                    <div className="w-full h-full col-span-2 text-lg font-bold text-gray-default flex items-center">Mã môn học</div>

                                    <div className="w-full h-full col-span-2 text-lg font-bold text-gray-default flex items-center justify-center">Mã khóa học</div>

                                    <div className="w-full h-full col-span-3 text-lg font-bold text-gray-default flex items-center justify-center">Môn</div>

                                    <div className="w-full h-full col-span-2 text-lg font-bold text-gray-default flex items-center justify-center">Số tín chỉ</div>

                                    <div className="w-full h-full flex justify-center items-center">
                                        <button className="p-2 rounded-md hover:cursor-default">
                                            <RefreashIcon width={6} height={6} color="white" />
                                        </button>
                                    </div>

                                </div>

                                <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>

                                <div className="w-full h-full flex flex-col p-0 overflow-scroll no-scrollbar">
                                    {(() => {
                                        if (myCourseList.length == 0) {
                                            return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                                Bạn chưa đăng kí khóa học nào!
                                            </div>
                                        }
                                        return myCourseList.map((course, index) => {
                                            const class1 = "w-full h-fit flex flex-col p-4 gap-2 hover:bg-gray-50 bg-snow";
                                            const class2 = "w-full h-fit flex flex-col p-4 gap-2 hover:bg-gray-50 bg-white";

                                            const study_schedule = getSchedule(course.study_schedule)
                                            const lab_schedule = getSchedule(course.lab_schedule)

                                            return (
                                                <React.Fragment key={course.id}>
                                                    <div className={(index % 2 != 0) ? class1 : class2}>
                                                        <div className="w-full h-fit grid grid-cols-10 gap-4">

                                                            <div className="w-full h-full col-span-2 text-xs font-bold text-black">{course.subject_code}</div>

                                                            <div className="w-full h-full col-span-2 text-xs font-bold text-black text-center">{course.code}</div>

                                                            <div className="w-full h-full col-span-3 flex justify-center text-xs font-bold text-black text-center">{course.subject_name}</div>

                                                            <div className="w-full h-full col-span-2 text-xs font-bold text-black text-center">{course.number_of_credit}</div>

                                                            <>
                                                                {open2 && <Model>
                                                                    <div className="w-full h-full flex justify-center items-center text-xl">
                                                                        <div className="w-fit h-fit p-8 gap-8 rounded-2xl bg-white border border-black border-solid flex flex-col justify-end items-end">
                                                                            <h1 className="text-xl font-bold">Bạn có chắc muốn hủy đăng kí khóa học này không ?</h1>
                                                                            <div className="w-fit h-fit flex flex-row gap-8">
                                                                                <button type="button" onClick={() => setOpen2(false)} className="w-28 h-12 bg-red-500 flex justify-center items-center font-bold rounded-md hover:bg-red-600 text-white p-4">Cancel</button>
                                                                                <button type="button" onClick={() => { delete_course(); setOpen2(false) }} className="w-28 h-12 bg-green-500 flex justify-center items-center font-bold rounded-md hover:bg-green-600 text-white p-4">Confirm</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Model>}
                                                                {(currentSemester?.status == 'open') && <motion.button
                                                                    onClick={(e) => {
                                                                        setcurrentCourseID(e.currentTarget.getAttribute('data-key') as string);
                                                                        setOpen2(true)
                                                                    }}
                                                                    data-key={course.id} whileTap={{ scale: .9 }} className="w-fit h-full rounded-md flex justify-center items-center text-sm text-red-500">
                                                                    <TrashIcon width={4} height={4} color="red" />
                                                                </motion.button>}
                                                            </>

                                                        </div>
                                                        <hr className="solid bg-gray-200 border-gray-400 border rounded-full"></hr>
                                                        <div className="w-full h-fit text-xs font-bold text-black grid grid-cols-12">
                                                            <div className="col-span-2">Lý thuyết:</div>
                                                            <div className="col-span-2">{study_schedule[0]}</div>
                                                            <div className="col-span-2">{study_schedule[1]}</div>
                                                            <div className="col-span-6 text-end">{study_schedule[2]}</div>
                                                        </div>
                                                        <div className="w-full h-fit text-xs font-bold text-black grid grid-cols-12">
                                                            <div className="col-span-2">Thí nghiệm:</div>
                                                            <div className="col-span-2">{lab_schedule[0]}</div>
                                                            <div className="col-span-2">{lab_schedule[1]}</div>
                                                            <div className="col-span-6 text-end">{lab_schedule[2]}</div>
                                                        </div>
                                                    </div>
                                                    <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>
                                                </React.Fragment>
                                            )
                                        })
                                    })()}
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </>
    )
}

export default CourseSelect