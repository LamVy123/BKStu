import Model from "../../../../component/Model"
import { ExitIcon } from "../../../../assets/Icon"
import { motion } from "framer-motion"
import Input from "../../../../component/Input"
import { FormEvent, useState, useEffect } from "react"
import { Course, CourseDetail } from "../../../../class&interface/Course"
import { addDoc, setDoc, doc, getDocs, query, where, getDoc, collection } from "firebase/firestore"
import { courseColRef, courseDetailColRef, semesterColRef, semesterDetailColRef, subjectColRef, subjectDetailColRef, userDetaiColRef } from "../../../../config/firebase"
import Select, { OptionInterface } from "../../../../component/Select"
import { FacultyFactory } from "../../../../class&interface/Faculty"
import { MajorsFactory } from "../../../../class&interface/Majors"
import { UserFactory, Teacher } from "../../../../class&interface/User"
import { facultyColRef, majorsColRef } from "../../../../config/firebase"
import { userColRef } from "../../../../config/firebase"
import { Subject, SubjectDetail, SubjectDetailFactory, SubjectFactory } from "../../../../class&interface/Subject"
import { Semester, SemesterDetail, SemesterDetailFactory, SemesterFactory } from "../../../../class&interface/Semester"

interface CourseFormProps {
    setOpenCourseForm: React.Dispatch<React.SetStateAction<boolean>>
}

const CourseForm: React.FC<CourseFormProps> = ({ setOpenCourseForm }: CourseFormProps) => {

    const [reset, setReset] = useState<boolean>(false);

    const Header: React.FC = () => {
        return (
            <div className="w-full h-20 flex flex-row justify-start items-center p-4 bg-primary rounded-t-2xl">
                <h1 className="text-4xl max-md:text-2xl font-bold">Thêm Khóa học mới</h1>

                <button className="w-fit h-full ml-auto" onClick={() => setOpenCourseForm(false)}>
                    <ExitIcon width={10} height={10} color="black" />
                </button>
            </div>
        )
    }


    const Form: React.FC = () => {
        const [isSubmit, setIsSubmit] = useState<boolean>(false)

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

        const submit = async (e: FormEvent) => {
            e.preventDefault();
            setIsSubmit(true)
            const data = new FormData(e.currentTarget as HTMLFormElement)

            const teacherRef = doc(userColRef, data.get('teacher_uid')?.toString() as string)
            let teacher: Teacher
            const userFactory = new UserFactory()
            await getDoc(teacherRef).then((doc) => {
                teacher = userFactory.CreateUserWithDocumentData('teacher', doc.data()) as Teacher
            })

            const subjectRef = doc(subjectColRef, data.get('subject_id')?.toString() as string)
            let subject: Subject = new Subject('', '', '', '', '', '')
            const subjectFactory = new SubjectFactory()
            await getDoc(subjectRef).then((doc) => {
                subject = subjectFactory.CreateSubjectWithDocumentData(doc.data())
            })

            const subjectDetailRef = doc(subjectDetailColRef, data.get('subject_id')?.toString() as string)
            let subjectDetail: SubjectDetail = new SubjectDetail(0, 0, 0, 0, 0, 0, 0, 0, '')
            const subjectDetailFactory = new SubjectDetailFactory()
            await getDoc(subjectDetailRef).then((doc) => {
                subjectDetail = subjectDetailFactory.CreateSubjectDetailWithDocumentData(doc.data())
            })

            const semesterDetailRef = doc(semesterDetailColRef, data.get('semester')?.toString() as string)
            let semesterDetail: SemesterDetail = new SemesterDetail('', 0)
            const semesterDetailFactory = new SemesterDetailFactory()
            await getDoc(semesterDetailRef).then((doc) => {
                semesterDetail = semesterDetailFactory.CreateSemesterDetailWithDocumentData(doc.data())
            })

            const semesterRef = doc(semesterColRef, data.get('semester')?.toString() as string)
            let semester: Semester = new Semester('', '', '', '')
            const semesterFactory = new SemesterFactory()
            await getDoc(semesterRef).then((doc) => {
                semester = semesterFactory.CreateSemesterWithDocumentData(doc.data())
            })

            const study_schedule_day = data.get('study_schedule_day')?.toString() as string
            const study_scheule_time_start = parseInt((data.get('study_scheule_time_start')?.toString() as string))
            const study_week = data.get('study_value')?.toString() as string
            const study_schedule = `${study_schedule_day}/${study_scheule_time_start}:00-${study_scheule_time_start + subjectDetail.class_duration - 1}:50/` + study_week

            let lab_schedule = ''
            if (data.get('lab_schedule_day')) {
                const lab_schedule_day = data.get('lab_schedule_day')?.toString() as string
                const lab_scheule_time_start = parseInt((data.get('lab_scheule_time_start')?.toString() as string))
                const lab_week = data.get('lab_value')?.toString() as string
                lab_schedule = `${lab_schedule_day}/${lab_scheule_time_start}:00-${lab_scheule_time_start + 4}:50/` + lab_week
            } else {
                lab_schedule = ''
            }


            if (scheduleIntersect(study_schedule, lab_schedule)) {
                alert('Giờ học lý thuyết trùng với giờ thí nghiệm, Xin hãy điều chỉnh lại!');
            } else {
                try {
                    await addDoc(courseColRef, {})
                        .then((target) => {
                            const id = target.id;
                            const courseDocRef = doc(courseColRef, id);
                            const course = new Course(
                                data.get('code')?.toString() as string,
                                id,
                                semester.academic_year,
                                semester.code,
                                subject.faculty,
                                subject.majors,
                                subject.name,
                                subject.subject_type,
                                subject.code,
                                semesterDetail.day_start,
                                semesterDetail.number_of_weeks,
                                study_schedule,
                                subjectDetail.laboratory_percent == 0 ? '' : lab_schedule,
                                subjectDetail.number_of_credit,
                                'on_going',
                            )

                            const courseDetail = new CourseDetail(
                                teacher.last_name + " " + teacher.middle_name + " " + teacher.first_name,
                                teacher.email,
                                teacher.uid,
                                subjectDetail.class_duration,
                                subjectDetail.hours_needed,
                                subjectDetail.home_work_percent,
                                subjectDetail.assignment_percent,
                                subjectDetail.laboratory_percent,
                                subjectDetail.midterm_exam_percent,
                                subjectDetail.final_exam_percent,
                            )
                            const courseDetailDocRef = doc(courseDetailColRef, id);
                            setDoc(courseDocRef, course.getInterface());
                            setDoc(courseDetailDocRef, courseDetail.getInterface());


                            const teacherRef = doc(userDetaiColRef, teacher.uid);
                            const teacherCourseCol = collection(teacherRef, 'course');
                            const teacherCourseRef = doc(teacherCourseCol, id)
                            setDoc(teacherCourseRef, course.getInterface())
                        })
                } catch {
                    alert("Đã xảy ra lỗi xin thử lại")
                    return;
                }
                alert("Thêm Khóa học mới thành công!")
                setReset(reset => !reset)
            }
        }

        const Section1: React.FC = () => {

            const [facultyOptionList, setFacultyOptionList] = useState<OptionInterface[]>([])

            const [currnetFaculty, setCurrentFaculty] = useState<string>('');

            const [majorsOptionList, setMajorsOptionList] = useState<OptionInterface[]>([])

            const [currentMajors, setCurrentMajors] = useState<string>('');

            const [teacherOptionList, setTeacherOptionList] = useState<OptionInterface[]>([])

            const [semesterOptionList, setSemesterOptionList] = useState<OptionInterface[]>([])

            const [currentSemsterID, setCurrentSemesterID] = useState<string>('')

            const [currentSemsterDetail, setCurrentSemesterDetail] = useState<SemesterDetail>()

            const [currentSubjectType, setCurrentSubjectType] = useState<string>('')

            const [currentSubjectID, setCurrentSubjectID] = useState<string>();

            const [currentSubjectDetail, setCurrentSubjectDetail] = useState<SubjectDetail>();

            const SubjectTypeOptionList: OptionInterface[] = [
                { lable: 'Vui lòng chọn', value: '' },
                { lable: 'Đại cương', value: 'Đại cương' },
                { lable: 'Cơ sở ngành', value: 'Cơ sở ngành' },
                { lable: 'Chuyên ngành', value: 'Chuyên ngành' }]

            useEffect(() => {
                const fetchFacultyList = async () => {
                    let facultyQuerry = query(facultyColRef);

                    let list: OptionInterface[] = [{ lable: 'Vui lòng chọn', value: '' }];
                    const facultyQuerrySnapshot = await getDocs(facultyQuerry)
                    const facultyFactory = new FacultyFactory();
                    facultyQuerrySnapshot.forEach((doc) => {
                        const faculty = facultyFactory.CreateFacultyWithDocumentData(doc.data())
                        list = [...list, { lable: faculty.name, value: faculty.name + '-' + faculty.code }]
                    })
                    setFacultyOptionList(list);
                }


                const fetchSemesterList = async () => {
                    let semsterQuerry = query(semesterColRef);

                    let list: OptionInterface[] = [{ lable: 'Vui lòng chọn', value: '' }];
                    const semesterQuerrySnapshot = await getDocs(semsterQuerry)
                    const semesterFactory = new SemesterFactory();
                    semesterQuerrySnapshot.forEach((doc) => {
                        const semester = semesterFactory.CreateSemesterWithDocumentData(doc.data())
                        list = [...list, { lable: semester.code, value: semester.id }]
                    })
                    setSemesterOptionList(list);
                }

                fetchFacultyList()
                fetchSemesterList()
            }, [])

            useEffect(() => {
                const fetchMajorsList = async () => {
                    let majorsQuerry = query(majorsColRef, where('faculty_code', '==', currnetFaculty.split('-')[1]));
                    let list: OptionInterface[] = [{ lable: 'Vui lòng chọn', value: '' }];
                    const majorsQuerrySnapshot = await getDocs(majorsQuerry)
                    const majorsFactory = new MajorsFactory();
                    majorsQuerrySnapshot.forEach((doc) => {
                        const majors = majorsFactory.CreateMajorsWithDocumentData(doc.data())
                        list = [...list, { lable: majors.name, value: majors.name }]
                    })
                    setMajorsOptionList(list);
                }
                if (currnetFaculty != '') {
                    fetchMajorsList();
                }
            }, [currnetFaculty])


            useEffect(() => {
                const fetchTeacherList = async () => {
                    let teacherQuerry = query(userColRef, where('role', '==', 'teacher'), where('specialized', '==', currentMajors))

                    let list: OptionInterface[] = [{ lable: 'Vui lòng chọn', value: '' }];
                    const teacherQuerrySnapshot = await getDocs(teacherQuerry)
                    const teacherFactory = new UserFactory();
                    teacherQuerrySnapshot.forEach((doc) => {
                        const teacher = teacherFactory.CreateUserWithDocumentData('teacher', doc.data()) as Teacher
                        list = [...list, {
                            lable: teacher.last_name + " " + teacher.middle_name + " " + teacher.first_name,
                            value: teacher.uid
                        }]
                    })
                    setTeacherOptionList(list);
                }
                if (currnetFaculty != '') {
                    fetchTeacherList()
                }
            }, [currentMajors])



            useEffect(() => {
                const fetchSemesterDetail = async () => {
                    const semesterDetailRef = doc(semesterDetailColRef, currentSemsterID)
                    let semesterDetail: SemesterDetail = new SemesterDetail('', 0)
                    const semesterDetailFactory = new SemesterDetailFactory()
                    await getDoc(semesterDetailRef).then((doc) => {
                        semesterDetail = semesterDetailFactory.CreateSemesterDetailWithDocumentData(doc.data())
                    })

                    setCurrentSemesterDetail(semesterDetail)
                }

                if (currentSemsterID != '') {
                    fetchSemesterDetail()
                }
            }, [currentSemsterID])

            useEffect(() => {
                const fetchSubject = async () => {
                    let subjectRef = query(subjectColRef)

                    if (currentSubjectType == 'Đại cương') {
                        subjectRef = query(subjectRef, where('subject_type', '==', 'Đại cương'))
                    } else if (currentSubjectType == 'Cơ sở ngành') {
                        subjectRef = query(subjectRef, where('subject_type', '==', 'Cơ sở ngành'), where('faculty', '==', currnetFaculty.split('-')[0]))
                    } else if (currentSubjectType == 'Chuyên ngành') {
                        subjectRef = query(subjectRef, where('subject_type', '==', 'Chuyên ngành'), where('majors', '==', currentMajors))
                    }

                    let list: OptionInterface[] = [{ lable: 'Vui lòng chọn', value: '' }];
                    const subjectQuerySnapshot = await getDocs(subjectRef)
                    const subjectFactory = new SubjectFactory()
                    subjectQuerySnapshot.forEach((doc) => {
                        const subject = subjectFactory.CreateSubjectWithDocumentData(doc.data())
                        list = [...list, { lable: subject.name, value: subject.id }]
                    })
                    setSubjectOptionList(list)
                }

                if (currentMajors != '' && currnetFaculty != '' && currentSubjectType != '') {
                    fetchSubject()
                }
            }, [currentMajors, currnetFaculty, currentSubjectType])


            useEffect(() => {
                const fetchSubjectDetail = async () => {
                    if (currentSubjectID != undefined) {
                        const subjectDetailRef = doc(subjectDetailColRef, currentSubjectID)
                        let subjectDetail: SubjectDetail = new SubjectDetail(0, 0, 0, 0, 0, 0, 0, 0, '')
                        const subjectDetailFactory = new SubjectDetailFactory()
                        await getDoc(subjectDetailRef).then((doc) => {
                            subjectDetail = subjectDetailFactory.CreateSubjectDetailWithDocumentData(doc.data())
                        })

                        setCurrentSubjectDetail(subjectDetail)
                    }
                }

                if (currentSubjectID != '') {
                    fetchSubjectDetail()
                }
            }, [currentSubjectID])

            const [SubjectOptionList, setSubjectOptionList] = useState<OptionInterface[]>([])


            const onChangeSemester = (e: React.ChangeEvent<HTMLSelectElement>) => {
                e.preventDefault();
                setCurrentSemesterID(e.target.value);
            }

            const onChangeFaculty = (e: React.ChangeEvent<HTMLSelectElement>) => {
                e.preventDefault();
                setCurrentFaculty(e.target.value);
            }

            const onChangeMajors = (e: React.ChangeEvent<HTMLSelectElement>) => {
                e.preventDefault();
                setCurrentMajors(e.target.value);
            }

            const onChangeSubjectType = (e: React.ChangeEvent<HTMLSelectElement>) => {
                e.preventDefault();
                setCurrentSubjectType(e.target.value);
            }

            const onChangeSubject = (e: React.ChangeEvent<HTMLSelectElement>) => {
                e.preventDefault();
                setCurrentSubjectID(e.target.value);
            }


            const ScheculeForm: React.FC = () => {
                const number_of_weeks = (currentSemsterDetail?.number_of_weeks ? currentSemsterDetail?.number_of_weeks : 0)

                const [study_schedule_value, setStudySchechuleValue] = useState<number[]>(Array(number_of_weeks).fill(0));

                const handleStudySchechuleChange = (index: number) => {
                    const newStudySchechuleValue = [...study_schedule_value];
                    newStudySchechuleValue[index] = newStudySchechuleValue[index] === 1 ? 0 : 1;
                    setStudySchechuleValue(newStudySchechuleValue);
                };

                const [lab_schedule_value, setLabSchechuleValue] = useState<number[]>(Array(number_of_weeks).fill(0));

                const handleLabSchechuleChange = (index: number) => {
                    const newLabSchechuleValue = [...lab_schedule_value];
                    newLabSchechuleValue[index] = newLabSchechuleValue[index] === 1 ? 0 : 1;
                    setLabSchechuleValue(newLabSchechuleValue);
                };

                const DayOptionList: OptionInterface[] = [
                    { lable: 'Vui lòng chọn', value: '' },
                    { lable: 'Thứ 2', value: 'Thứ 2' },
                    { lable: 'Thứ 3', value: 'Thứ 3' },
                    { lable: 'Thứ 4', value: 'Thứ 4' },
                    { lable: 'Thứ 5', value: 'Thứ 5' },
                    { lable: 'Thứ 6', value: 'Thứ 6' },
                    { lable: 'Thứ 7', value: 'Thứ 7' },
                ]

                const TimeOptionList: OptionInterface[] = [
                    { lable: 'Vui lòng chọn', value: '' },
                    { lable: 'Tiết 2 - 7h', value: '7' },
                    { lable: 'Tiết 3 - 8h', value: '8' },
                    { lable: 'Tiết 4 - 9h', value: '9' },
                    { lable: 'Tiết 5 - 10h', value: '10' },
                    { lable: 'Tiết 6 - 11h', value: '11' },
                    { lable: 'Tiết 7 - 12h', value: '12' },
                    { lable: 'Tiết 8 - 13h', value: '13' },
                    { lable: 'Tiết 9 - 14h', value: '14' },
                    { lable: 'Tiết 10 - 15h', value: '15' },
                    { lable: 'Tiết 11 - 16h', value: '16' },
                ]

                function transform(array: number[]): string {
                    let result = '|';
                    array.forEach((value, index) => {
                        if (value === 1) {
                            result += `${index + 1}|`;
                        } else {
                            result += `--|`;
                        }
                    });
                    return result;
                }

                return (
                    <div className="w-full h-fit flex flex-col justify-center items-center gap-8">

                        <div className="w-full h-fit grid grid-cols-7 gap-2">
                            <label htmlFor="study_schedule_day" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Buổi lý thuyết<h1 className="text-red-500">*</h1></label>
                            <Select id="study_schedule_day" name="study_schedule_day" height={10} option={DayOptionList} className="w-full col-span-5" required disable={currentSemsterID == ''} />
                        </div>
                        <div className="w-full h-fit grid grid-cols-7 gap-2">
                            <label htmlFor="study_scheule_time_start" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tiết bắt đầu<h1 className="text-red-500">*</h1></label>
                            <Select id="study_scheule_time_start" name="study_scheule_time_start" height={10} option={TimeOptionList} className="w-full col-span-5" required disable={currentSemsterID == ''} />
                        </div>
                        <Input type="text" id="study_value" name="study_value" defaultValue={transform(study_schedule_value)} className="w-full hidden" />

                        <div className="w-full h-fit grid grid-cols-12 gap-2 p-4">
                            <label className="py-2 font-bold flex flex-row justify-center gap-2 col-span-12  ">Tuần học</label>
                            {study_schedule_value.map((value, index) => (
                                <div key={index} className="w-fit flex justify-center items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={value === 1}
                                        onChange={() => handleStudySchechuleChange(index)}
                                        className="w-5 h-5"
                                        disabled={currentSemsterID == ''}
                                    />
                                    <label>{`${index + 1}`}</label>
                                </div>
                            ))}
                        </div>

                        {currentSubjectDetail?.laboratory_percent == 0 ? null : <><div className="w-full h-fit grid grid-cols-7 gap-2">
                            <label htmlFor="lab_schedule_day" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Buổi thí nghiệm<h1 className="text-red-500">*</h1></label>
                            <Select id="lab_schedule_day" name="lab_schedule_day" height={10} option={DayOptionList} className="w-full col-span-5" required disable={currentSemsterID == ''} />
                        </div>
                            <div className="w-full h-fit grid grid-cols-7 gap-2">
                                <label htmlFor="lab_scheule_time_start" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tiết bắt đầu<h1 className="text-red-500">*</h1></label>
                                <Select id="lab_scheule_time_start" name="lab_scheule_time_start" height={10} option={TimeOptionList} className="w-full col-span-5" required disable={currentSemsterID == ''} />
                            </div>
                            <Input type="text" id="lab_value" name="lab_value" defaultValue={transform(lab_schedule_value)} className="w-full hidden" />

                            <div className="w-full h-fit grid grid-cols-12 gap-2 p-4">
                                <label className="py-2 font-bold flex flex-row justify-center gap-2 col-span-12">Tuần học</label>
                                {lab_schedule_value.map((value, index) => (
                                    <div key={index} className="w-fit flex justify-center items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={value === 1}
                                            onChange={() => handleLabSchechuleChange(index)}
                                            className="w-5 h-5"
                                            disabled={currentSemsterID == ''}
                                        />
                                        <label>{`${index + 1}`}</label>
                                    </div>
                                ))}
                            </div></>}
                    </div>
                )
            }
            return (
                <div className="w-full h-fit flex flex-col gap-8">

                    <div className="w-12/12 max-md:w-full h-fit flex flex-col gap-8">
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="code" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Mã Khóa học<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="code" name="code" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="semester" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Học kì<h1 className="text-red-500">*</h1></label>
                            <Select id="semester" name="semester" height={10} option={semesterOptionList} onChange={onChangeSemester} className="w-full col-span-5" required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="faculty" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Khoa<h1 className="text-red-500">*</h1></label>
                            <Select id="faculty" name="faculty" height={10} option={facultyOptionList} onChange={onChangeFaculty} className="w-full col-span-5" required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="majors" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Ngành<h1 className="text-red-500">*</h1></label>
                            <Select id="majors" name="majors" height={10} option={majorsOptionList} onChange={onChangeMajors} className="w-full col-span-5" disable={currnetFaculty == ''} required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="teacher_uid" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Giảng viên<h1 className="text-red-500">*</h1></label>
                            <Select id="teacher_uid" name="teacher_uid" height={10} option={teacherOptionList} className="w-full col-span-5" disable={currentMajors == ''} required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="subject_type" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Loại môn<h1 className="text-red-500">*</h1></label>
                            <Select id="subject_type" name="subject_type" height={10} option={SubjectTypeOptionList} onChange={onChangeSubjectType} className="w-full col-span-5" required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="subject_id" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Môn<h1 className="text-red-500">*</h1></label>
                            <Select id="subject_id" name="subject_id" height={10} option={SubjectOptionList} onChange={onChangeSubject} className="w-full col-span-5" required
                                disable={currentSubjectType == '' || currnetFaculty == '' || currentMajors == ''} />
                        </div>

                    </div>
                    <ScheculeForm />

                </div>
            )
        }

        const ConfirmButton: React.FC = () => {
            const [open, setOpen] = useState<boolean>(false);
            return (
                <>
                    {open && <Model>
                        <div className="w-full h-full flex justify-center items-center">
                            <div className="w-fit h-fit p-8 gap-8 rounded-2xl bg-white border border-black border-solid flex flex-col justify-end items-end">
                                <h1 className="text-xl font-bold">Bạn có chắc muốn thêm Khóa học mới không ?</h1>
                                <div className="w-fit h-fit flex flex-row gap-8">
                                    <button type="button" onClick={() => setOpen(false)} className="w-28 h-12 bg-red-500 flex justify-center items-center font-bold rounded-md hover:bg-red-700 text-white p-4">Cancel</button>
                                    <button type="submit" disabled={isSubmit} className="w-28 h-12 bg-green-400 flex justify-center items-center font-bold rounded-md hover:bg-green-600 text-white p-4">Confirm</button>
                                </div>
                            </div>
                        </div>
                    </Model>}
                    <button type="button" onClick={() => setOpen(true)} className="w-28 h-12 bg-primary flex justify-center items-center font-bold rounded-md hover:bg-blue-700 text-white p-4">Submit</button>
                </>
            )
        }

        const ButtonSection: React.FC = () => {
            return (
                <div className="w-full h-fit col-span-full flex flex-row justify-between text-lg">
                    <button type="button" onClick={() => setReset(reset => !reset)} className="w-28 h-12 bg-gray-default flex justify-center items-center font-bold rounded-md hover:bg-gray-500 text-white p-4">Clear</button>
                    <ConfirmButton />
                </div>
            )
        }

        return (
            <form
                onSubmit={(e) => submit(e)}
                className="w-full h-full flex flex-row p-2 overflow-scroll"
            >
                <div className="w-full h-full flex flex-col p-8 max-md:p-2 gap-12 text-base max-md:text-sx">
                    <Section1 />

                    <ButtonSection />
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
                <div className="w-6/12 max-md:w-full max-md:h-5/6 max-h-full h-fit bg-white rounded-2xl flex flex-col border border-black border-solid overflow-hidden">
                    <Header />
                    <Form />
                </div>
            </motion.div>
        </Model>
    )
}

export default CourseForm