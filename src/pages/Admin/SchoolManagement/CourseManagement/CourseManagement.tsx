import Input from "../../../../component/Input"
import { SearchIcon, PlusIcon, RefreashIcon, InformationIcon, TrashIcon, LoadingIcon } from "../../../../assets/Icon"
import { motion } from "framer-motion"
import CourseForm from "./CourseForm"
import React, { useEffect, useState, FormEvent } from "react"
import { Course, CourseDetail, CourseDetailFactory, CourseFactory } from "../../../../class&interface/Course"
import { getDocs, query, getDoc, doc, setDoc, deleteDoc, where, getCountFromServer, collection } from "firebase/firestore"
import { courseColRef, courseDetailColRef, userDetaiColRef } from "../../../../config/firebase"
import Model from "../../../../component/Model"
import Select, { OptionInterface } from "../../../../component/Select"
import { Student, UserFactory } from "../../../../class&interface/User"

const CourseManagement: React.FC = () => {
    const [openCourseForm, setOpenCourseForm] = useState<boolean>(false);

    const [openCourseInfor, setOpenCourseInfor] = useState<boolean>(false);

    const [reset, setReset] = useState<boolean>(false);

    const [courseList, setCourseList] = useState<Course[]>([])

    const [currentCourseID, setcurrentCourseID] = useState<string>('');

    const [searchValue, setSearchValue] = useState<string>('')

    const [isLoading, setLoading] = useState<boolean>(true);

    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const fetchCourseList = async () => {
            setCount((await getCountFromServer(courseColRef)).data().count);
            let courseQuerry = query(courseColRef);

            if (searchValue.toUpperCase() == '@ALL') {

            } else if (searchValue != '') {
                courseQuerry = query(courseQuerry, where('subject_code', '==', searchValue));
            } else {
                courseQuerry = query(courseQuerry, where('status', '==', 'on_going'))
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

    const Header: React.FC = () => {
        const search = (e: FormEvent) => {
            e.preventDefault();

            const data = new FormData(e.currentTarget as HTMLFormElement)

            const value = data.get("search")?.toString() as string

            setSearchValue(value)

            setOpenCourseInfor(false);
        }

        return (
            <div className="w-full h-fit flex flex-row max-md:flex-col p-2 gap-4 items-center max-md:items-end ml-auto">

                <div className="w-full h-fit flex flex-row items-center gap-8 max-md:gap-8">

                    <div className="h-fit w-fit flex flex-col">
                        <h1 className="text-4xl max-md:text-3xl w-44 font-bold">Khóa học</h1>
                        <h1 className="text-base max-md:text-xs text-gray-default">{count} Khóa học</h1>
                    </div>

                    <form onSubmit={search} className="w-full h-fit flex flex-row justify-center items-center gap-2">
                        <div className="h-10 flex justify-center items-center">
                            <motion.button whileTap={{ scale: 0.9 }} type="submit">
                                <SearchIcon width={8} height={8} color="black" />
                            </motion.button>
                        </div>
                        <Input type="search" name="search" id="search" className="w-full h-10 text-sm" defaultValue={searchValue} placeholder="Tìm kiếm bằng mã môn học hoặc @all"></Input>
                    </form>

                </div>

                <motion.button
                    className="min-w-fit h-10 bg-primary rounded flex justify-center items-center font-bold text-base"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpenCourseForm(true)}
                >
                    <div className="w-full h-full bg-blue-500 rounded-l hover:bg-primary flex items-center justify-center p-2 text-white">
                        Thêm khóa học mới
                    </div>
                    <div className=" flex justify-center items-center p-2">
                        <PlusIcon width={7} height={7} color="white" />
                    </div>
                </motion.button>
            </div>
        )
    }

    const CourseInfor: React.FC = () => {
        const [currentCourse, setcurrentCourse] = useState<Course>();
        const [currentCourseDetail, setcurrentCourseDetail] = useState<CourseDetail>();
        const [currentStudentList, setCurrentStudentList] = useState<Student[]>()
        const [edit, setEdit] = useState<boolean>(false);

        useEffect(() => {
            const fetchCourse = async () => {
                const courseDoc = doc(courseColRef, currentCourseID)
                const courseFactory = new CourseFactory()
                await getDoc(courseDoc).then((doc) => {
                    setcurrentCourse(courseFactory.CreateCourseWithDocumentData(doc.data()))
                })

                const courseDetailDoc = doc(courseDetailColRef, currentCourseID)
                const courseDetailFactory = new CourseDetailFactory()
                await getDoc(courseDetailDoc).then((doc) => {
                    setcurrentCourseDetail(courseDetailFactory.CreateCourseDetailWithDocumentData(doc.data()))
                })

                const studentListCol = collection(courseDetailDoc, 'student_list');
                const student_query = await getDocs(query(studentListCol));
                let list: Student[] = []
                const studentFactory = new UserFactory();
                student_query.forEach((student) => {
                    list = [...list, studentFactory.CreateUserWithDocumentData('student', student.data()) as Student]
                })
                setCurrentStudentList(list);
            }
            fetchCourse();

        }, [currentCourseID])

        const submit = async (e: FormEvent) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget as HTMLFormElement)

            try {
                const id = currentCourse?.id.toString() as string;
                const courseDocRef = doc(courseColRef, id);
                const course = new Course(
                    currentCourse?.code.toString() as string,
                    currentCourse?.id.toString() as string,
                    currentCourse?.academic_year.toString() as string,
                    currentCourse?.semester.toString() as string,
                    currentCourse?.faculty.toString() as string,
                    currentCourse?.majors.toString() as string,
                    currentCourse?.subject_name.toString() as string,
                    currentCourse?.subject_type.toString() as string,
                    currentCourse?.subject_code.toString() as string,
                    currentCourse?.day_semester_start.toString() as string,
                    isNaN(parseInt(currentCourse?.subject_code.toString() as string)) ? 0 : parseInt(currentCourse?.subject_code.toString() as string),
                    currentCourse?.study_schedule.toString() as string,
                    currentCourse?.lab_schedule.toString() as string,
                    isNaN(parseInt(currentCourse?.number_of_credit.toString() as string)) ? 0 : parseInt(currentCourse?.number_of_credit.toString() as string),
                    data.get('status')?.toString() as string,
                )

                const courseDetailRef = doc(courseDetailColRef, currentCourseID)
                const courseStudentCol = collection(courseDetailRef, 'student_list')
                const courseStudentQuery = query(courseStudentCol)
                const courseStudentSnapshot = await getDocs(courseStudentQuery)
                courseStudentSnapshot.forEach((data) => {
                    const student_uid = data.id
                    console.log(student_uid)
                    const studentRef = doc(userDetaiColRef, student_uid)
                    const studentCourseCol = collection(studentRef, 'course')
                    const studentCourse = doc(studentCourseCol, currentCourseID)
                    setDoc(studentCourse, course.getInterface())
                })


                const teacherRef = doc(userDetaiColRef, currentCourseDetail?.teacher_id.toString() as string);
                const teacherCourseCol = collection(teacherRef, 'course');
                const teacherCourseRef = doc(teacherCourseCol, currentCourseID)
                setDoc(teacherCourseRef, course.getInterface())


                setDoc(courseDocRef, course.getInterface());
                setcurrentCourse(course);
                alert('Thay đổi thông tin khóa học thành công!')

            } catch {
                alert("Đã có lỗi xảy ra! Vui lòng thử lại")
            }
            setEdit(false);
        }

        const ConfirmButton: React.FC = () => {
            const [open, setOpen] = useState<boolean>(false);
            return (
                <>
                    {open && <Model>
                        <div className="w-full h-full flex justify-center items-center">
                            <div className="w-fit h-fit p-8 gap-8 rounded-2xl bg-white border border-black border-solid flex flex-col justify-end items-end">
                                <h1 className="text-xl font-bold">Bạn có chắc muốn lưu thay đổi không ?</h1>
                                <div className="w-fit h-fit flex flex-row gap-8">
                                    <button type="button" onClick={() => setOpen(false)} className="w-28 h-12 bg-red-500 flex justify-center items-center font-bold rounded-md hover:bg-red-600 text-white p-4">Cancel</button>
                                    <button type="submit" className="w-28 h-12 bg-green-500 flex justify-center items-center font-bold rounded-md hover:bg-green-600 text-white p-4">Confirm</button>
                                </div>
                            </div>
                        </div>
                    </Model>}
                    <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => setOpen(true)} className="ml-auto w-fit h-fit bg-primary hover:bg-blue-700 rounded-md text-white text-xl font-bold flex items-center justify-center px-4 py-2">Change</motion.button>
                </>
            )
        }

        const DeleteButton: React.FC = () => {
            const delDoc = async () => {
                const delCourse = doc(courseColRef, currentCourseID);
                const delCourseDetail = doc(courseDetailColRef, currentCourseID);
                const courseStudentCol = collection(delCourseDetail, 'student_list')

                const courseStudentQuery = query(courseStudentCol)
                const courseStudentSnapshot = await getDocs(courseStudentQuery)
                courseStudentSnapshot.forEach((data) => {
                    const student_uid = data.id
                    const studentRef = doc(userDetaiColRef, student_uid)
                    const studentCourseCol = collection(studentRef, 'course')
                    const studentDelCourse = doc(studentCourseCol, currentCourseID)
                    deleteDoc(studentDelCourse)
                })

                const teacherRef = doc(userDetaiColRef, currentCourseDetail?.teacher_id.toString() as string);
                const teacherCourseCol = collection(teacherRef, 'course');
                const teacherCourseRef = doc(teacherCourseCol, currentCourseID)
                deleteDoc(teacherCourseRef)

                setcurrentCourse(undefined)
                setcurrentCourseDetail(undefined)
                setOpenCourseInfor(false)

                await deleteDoc(delCourseDetail)
                await deleteDoc(delCourse).then(() => {
                    setCourseList(courseList.filter(item => item.id != currentCourseID));
                })

            }
            const [open, setOpen] = useState<boolean>(false);
            return (
                <>
                    {open && <Model>
                        <div className="w-full h-full flex justify-center items-center">
                            <div className="w-fit h-fit p-8 gap-8 rounded-2xl bg-white border border-black border-solid flex flex-col justify-end items-end">
                                <h1 className="text-xl text-black font-bold">Bạn có chắc muốn xóa khóa học này không ?</h1>
                                <div className="w-fit h-fit flex flex-row gap-8 text-xl">
                                    <button type="button" onClick={() => delDoc()} className="w-28 h-12 bg-red-500 flex justify-center items-center font-bold rounded-md hover:bg-red-600 text-white p-4">Confirm</button>
                                    <button type="button" onClick={() => setOpen(false)} className="w-28 h-12 bg-green-500 flex justify-center items-center font-bold rounded-md hover:bg-green-600 text-white p-4">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </Model>}
                    <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => setOpen(true)} className="w-fit h-fit ml-auto"><TrashIcon width={8} height={8} color="red" /></motion.button>
                </>
            )
        }

        const study_schedule = currentCourse?.study_schedule.split('/');
        const lab_schedule = currentCourse?.lab_schedule.split('/');


        const option1: OptionInterface[] = [{ lable: 'Đang diễn ra', value: 'on_going' }, { lable: 'Đã kết thúc', value: 'end' }]
        const option2: OptionInterface[] = [{ lable: 'Đã kết thúc', value: 'end' }, { lable: 'Đang diễn ra', value: 'on_going' }]

        let statusOption: OptionInterface[];
        switch (currentCourse?.status) {
            case 'on_going':
                statusOption = option1
                break
            default:
                statusOption = option2
                break
        }

        return (
            <form className="w-full h-full max-md:hidden flex flex-col gap-2 p-2 overflow-scroll" onSubmit={submit}>

                <div className="w-full h-fit bg-primary rounded-t-2xl flex items-center justify-start text-white font-bold p-4 text-4xl">
                    Thông tin khóa học
                    {edit && <DeleteButton />}
                </div>
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
                        <Select id="status" name="status" className="w-full col-span-5" disable={!edit} height={12} option={statusOption} />
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

                    <div className="w-full h-fit flex flex-col items-start justify-start text-black font-bold gap-4">
                        <label htmlFor="teacher_name" className="min-w-52">Sinh viên:</label>
                        {currentStudentList?.map((student) => {
                            return (
                                <div key={student.uid} className="w-full h-fit p-2 grid grid-cols-12 text-lg font-normal border-2 border-solid border-gray-300 rounded-md">
                                    <div className="col-span-4">{student.last_name + " " + student.middle_name + " " + student.first_name}</div>
                                    <div className="col-span-3">{student.display_id}</div>
                                    <div className="col-span-5 text-end">{student.email}</div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="w-full h-fit mt-auto flex items-center justify-start">
                        {edit ?
                            <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => setEdit(false)} className="w-fit h-fit bg-gray-200 hover:bg-gray-300 rounded-md text-black text-xl font-bold flex items-center justify-center px-4 py-2">Cancel</motion.button> :
                            <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => setEdit(true)} className="w-fit h-fit bg-primary hover:bg-blue-700 rounded-md text-white text-xl font-bold flex items-center justify-center px-4 py-2">Edit</motion.button>}

                        {edit && <ConfirmButton />}
                    </div>
                </div> : <div className="w-full h-full flex items-center justify-center"><LoadingIcon width={10} height={10} /></div>}

            </form>
        )
    }

    const PlaceHolder: React.FC = () => {
        return (
            <div className="w-full h-full max-md:hidden flex flex-col gap-2 p-2 overflow-hidden">
                <div className="w-full h-fit bg-primary rounded-t-2xl flex items-center justify-start text-white font-bold p-4 text-4xl">
                    Thông tin khóa học
                </div>
                <div className="w-12/12 max-md:w-full h-fit flex text-xl flex-col gap-8 p-4 overflow-scroll">
                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="subject_name" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tên môn học:</label>
                        <Input type="text" id="subject_name" name="subject_name" placeholder="" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="subject_code" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Mã môn học:</label>
                        <Input type="text" id="subject_code" name="subject_code" placeholder="" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="subject_type" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Loại môn học:</label>
                        <Input type="text" id="subject_type" name="subject_type" placeholder="" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="course_code" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Mã khóa học:</label>
                        <Input type="text" id="course_code" name="course_code" placeholder="" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="academic_year" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Trạng thái khóa học:</label>
                        <Input type="text" id="academic_year" name="academic_year" placeholder="" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="status" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Niên khóa:</label>
                        <Input type="text" id="status" name="status" placeholder="" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="semester" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Học kì:</label>
                        <Input type="text" id="semester" name="semester" placeholder="" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="faculty" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Khoa:</label>
                        <Input type="text" id="faculty" name="faculty" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="majors" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Ngành:</label>
                        <Input type="text" id="majors" name="majors" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="teacher_name" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Giảng viên:</label>
                        <Input type="text" id="teacher_name" name="teacher_name" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="teacher_email" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Email giảng viên:</label>
                        <Input type="text" id="teacher_email" name="teacher_email" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="study_schedule" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Lịch học lý thuyết:</label>
                        <Input type="text" id="study_schedule" name="study_schedule" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="lab_schedule" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Lịch học thí nghiệm:</label>
                        <Input type="text" id="lab_schedule" name="lab_schedule" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="number_of_credit" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Số tín chỉ:</label>
                        <Input type="number" id="number_of_credit" name="number_of_credit" placeholder="" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="hours_needed" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Số giờ học:</label>
                        <Input type="number" id="hours_needed" name="hours_needed" placeholder="" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="home_work_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm bài tập:</label>
                        <Input type="number" id="home_work_percent" name="home_work_percent" placeholder="" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="assignment_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm BTL:</label>
                        <Input type="number" id="assignment_percent" name="assignment_percent" placeholder="" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="laboratory_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm thí nghiệm:</label>
                        <Input type="number" id="laboratory_percent" name="laboratory_percent" placeholder="" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="midterm_exam_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm giữa kì:</label>
                        <Input type="number" id="midterm_exam_percent" name="midterm_exam_percent" placeholder="" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="final_exam_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm cuối kì:</label>
                        <Input type="number" id="final_exam_percent" name="final_exam_percent" placeholder="" className="w-full col-span-5" disable />
                    </div>

                </div>
            </div>
        )
    }

    return (
        <>
            {openCourseForm && <CourseForm setOpenCourseForm={setOpenCourseForm} />}
            <div className="w-full h-full flex items-center justify-center p-4 bg-snow">

                <div className="w-full h-full flex flex-row items-center justify-center gap-2">

                    <div className="w-6/12 max-md:w-full h-full flex flex-col">

                        <Header />

                        <div className="w-full h-full flex flex-col p-4 gap-0 overflow-hidden">
                            <div className="w-full h-16 grid grid-cols-10 p-4">

                                <div className="w-full h-full col-span-3 text-xl font-bold text-gray-default flex items-center">Khóa học</div>

                                <div className="w-full h-full col-span-3 text-xl font-bold text-gray-default flex items-center">Mã khóa học</div>

                                <div className="w-full h-full col-span-3 text-xl font-bold text-gray-default flex items-center">Mã môn học</div>

                                <div className="w-full h-full flex justify-center items-center">
                                    <motion.button whileTap={{ scale: .9 }} onClick={() => { setLoading(true); setReset(reset => !reset) }} className="hover:bg-gray-200 p-2 rounded-md">
                                        <RefreashIcon width={7} height={7} color="gray" />
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
                                            Không có khóa học nào với code là {searchValue}!
                                        </div>
                                    } else if (courseList.length == 0) {
                                        return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                            Hãy thêm gì đó!
                                        </div>
                                    }
                                    return courseList.map((course, index) => {
                                        const class1 = "w-full h-14 max-md:h-20 grid grid-cols-10 p-4 gap-4 hover:bg-gray-50 bg-snow";
                                        const class2 = "w-full h-14 max-md:h-20 grid grid-cols-10 p-4 gap-4 hover:bg-gray-50 bg-white";
                                        let color: string
                                        let label: string = ''
                                        switch (course.status) {
                                            case 'on_going':
                                                label = 'Đang diễn ra'
                                                color = 'green'
                                                break
                                            default:
                                                label = 'Đã kết thúc'
                                                color = 'red'
                                        }
                                        return (
                                            <React.Fragment key={course.id}>
                                                <div className={(index % 2 != 0) ? class1 : class2}>

                                                    <div className="w-full h-full col-span-3 text-base font-bold text-black">{course.subject_name}</div>

                                                    <div className="w-full h-full col-span-3 text-base font-bold text-black">{course.code}</div>

                                                    <div style={{ color: color }} className="w-full h-full col-span-3 text-base font-bold text-black">{label}</div>

                                                    <motion.button
                                                        onClick={(e) => {
                                                            setcurrentCourseID(e.currentTarget.getAttribute('data-key') as string);
                                                            setOpenCourseInfor(true)
                                                        }}
                                                        data-key={course.id} whileTap={{ scale: .9 }} className="w-fit h-fit rounded-md flex justify-center items-center">
                                                        <InformationIcon width={6} height={6} color="#1071e5" />
                                                    </motion.button>
                                                </div>
                                                <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>
                                            </React.Fragment>
                                        )
                                    })
                                })()}
                            </div>

                        </div>

                    </div>

                    <div className="w-0 h-full border border-solid border-gray-default max-md:hidden" />

                    <div className="w-6/12 h-full flex flex-col max-md:w-full max-md:absolute overflow-hidden">
                        {openCourseInfor ? <CourseInfor /> : <PlaceHolder />}
                    </div>

                </div>

            </div>
        </>
    )
}
export default CourseManagement