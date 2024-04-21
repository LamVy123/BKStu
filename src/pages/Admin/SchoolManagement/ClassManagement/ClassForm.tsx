import Model from "../../../../component/Model"
import { ExitIcon } from "../../../../assets/Icon"
import { motion } from "framer-motion"
import Input from "../../../../component/Input"
import { FormEvent, useState } from "react"
import { Class, ClassDetail } from "../../../../class&interface/Class"
import { addDoc, setDoc, doc, getDocs, query, where, collection } from "firebase/firestore"
import { classColRef, classDetailColRef, facultyColRef, majorsColRef, userColRef, userDetaiColRef } from "../../../../config/firebase"
import Select, { OptionInterface } from "../../../../component/Select"
import { useEffect } from "react"
import { Faculty, FacultyFactory, FacultyInterface } from "../../../../class&interface/Faculty"
import { Majors, MajorsFactory, MajorsInterface } from "../../../../class&interface/Majors"
import { Teacher, TeacherInterface, UserFactory } from "../../../../class&interface/User"

interface ClassFormProps {
    setOpenClassForm: React.Dispatch<React.SetStateAction<boolean>>
}

const ClassForm: React.FC<ClassFormProps> = ({ setOpenClassForm }: ClassFormProps) => {

    const [reset, setReset] = useState<boolean>(false);


    const Header: React.FC = () => {
        return (
            <div className="w-full h-20 flex flex-row justify-start items-center p-4 bg-primary rounded-t-2xl">
                <h1 className="text-4xl max-md:text-2xl font-bold text-white">Thêm lớp mới</h1>

                <button className="w-fit h-full ml-auto" onClick={() => setOpenClassForm(false)}>
                    <ExitIcon width={10} height={10} color="black" />
                </button>
            </div>
        )
    }


    const Form: React.FC = () => {
        const [isSubmit, setIsSubmit] = useState<boolean>(false)

        const submit = async (e: FormEvent) => {
            e.preventDefault();
            setIsSubmit(true);
            const data = new FormData(e.currentTarget as HTMLFormElement)
            try {
                const faculty = JSON.parse(data.get('faculty')?.toString() as string) as FacultyInterface
                const majors = JSON.parse(data.get('majors')?.toString() as string) as MajorsInterface
                const teacher = JSON.parse(data.get('teacher')?.toString() as string) as TeacherInterface
                await addDoc(classColRef, {})
                    .then((target) => {
                        const id = target.id;
                        const classDocRef = doc(classColRef, id)
                        const classes = new Class(
                            id,
                            data.get('code')?.toString() as string,
                            majors.name,
                            majors.code,
                            data.get('academic_year')?.toString() as string,
                            'on_going'
                        )
                        setDoc(classDocRef, classes.getInterface());

                        const classDetail = new ClassDetail(
                            faculty.name,
                            teacher.last_name + " " + teacher.middle_name + " " + teacher.first_name,
                            teacher.uid,
                            teacher.email,
                        )
                        const classDetailDocRef = doc(classDetailColRef, id);
                        setDoc(classDetailDocRef, classDetail.getInterface());

                        const teacherRef = doc(userDetaiColRef, teacher.uid);
                        const teacherClassCol = collection(teacherRef, 'class');
                        const teacherClassRef = doc(teacherClassCol, id)
                        setDoc(teacherClassRef, classes.getInterface())
                    })
            } catch {
                alert("Đã xảy ra lỗi xin thử lại")
                return
            }
            alert("Thêm Lớp mới thành công!")
            setReset(reset => !reset)
        }

        const Section1: React.FC = () => {
            const [facultyList, setFacultyList] = useState<Faculty[]>([])

            const [currentFacultyCode, setCurrentFacultyCode] = useState<string>('');

            const [majorsList, setMajorsList] = useState<Majors[]>([])

            const [currentMajors, setCurrentMajors] = useState<string>('');

            const [teacherList, setTeacherList] = useState<Teacher[]>([])

            useEffect(() => {
                const fetchFacultyList = async () => {
                    let facultyQuerry = query(facultyColRef);

                    let list: Faculty[] = [];
                    const facultyQuerrySnapshot = await getDocs(facultyQuerry)
                    const facultyFactory = new FacultyFactory();
                    facultyQuerrySnapshot.forEach((doc) => {
                        const faculty = facultyFactory.CreateFacultyWithDocumentData(doc.data())
                        list = [...list, faculty]
                    })
                    setFacultyList(list);
                }

                fetchFacultyList()
            }, [])

            useEffect(() => {
                const fetchMajorsList = async () => {
                    let majorsQuerry = query(majorsColRef, where('faculty_code', '==', currentFacultyCode));
                    let list: Majors[] = [];
                    const majorsQuerrySnapshot = await getDocs(majorsQuerry)
                    const majorsFactory = new MajorsFactory();
                    majorsQuerrySnapshot.forEach((doc) => {
                        const majors = majorsFactory.CreateMajorsWithDocumentData(doc.data())
                        list = [...list, majors]
                    })
                    setMajorsList(list);
                }
                if (currentFacultyCode != '') {
                    fetchMajorsList();
                }
            }, [currentFacultyCode])

            useEffect(() => {
                const fetchTeacherList = async () => {
                    let teacherQuerry = query(userColRef, where('role', '==', 'teacher'), where('specialized', '==', currentMajors))

                    let list: Teacher[] = [];
                    const teacherQuerrySnapshot = await getDocs(teacherQuerry)
                    const teacherFactory = new UserFactory();
                    teacherQuerrySnapshot.forEach((doc) => {
                        const teacher = teacherFactory.CreateUserWithDocumentData('teacher', doc.data()) as Teacher
                        list = [...list, teacher]
                    })
                    setTeacherList(list);
                }
                if (currentMajors != '') {
                    fetchTeacherList()
                }
            }, [currentMajors])


            const onChangeFaculty = (e: React.ChangeEvent<HTMLSelectElement>) => {
                e.preventDefault();
                if (e.target.value) {
                    const faculty = JSON.parse(e.target.value) as FacultyInterface
                    setCurrentFacultyCode(faculty.code);
                } else {
                    setCurrentFacultyCode('');
                }
            }

            const onChangeMajors = (e: React.ChangeEvent<HTMLSelectElement>) => {
                e.preventDefault();
                if (e.target.value) {
                    const majors = JSON.parse(e.target.value) as MajorsInterface
                    setCurrentMajors(majors.name);
                } else {
                    setCurrentMajors('')
                }
            }

            let facultyOptionList: OptionInterface[] = [{ lable: 'Vui lòng chọn', value: '' }]
            let majorsOptionList: OptionInterface[] = [{ lable: 'Vui lòng chọn', value: '' }]
            let teacherOptionList: OptionInterface[] = [{ lable: 'Vui lòng chọn', value: '' }]

            facultyList.forEach((faculty) => {
                facultyOptionList = [...facultyOptionList, { lable: faculty.name, value: JSON.stringify(faculty.getInterface()) }]
            })

            majorsList.forEach((majors) => {
                majorsOptionList = [...majorsOptionList, { lable: majors.name, value: JSON.stringify(majors.getInterface()) }]
            })

            teacherList.forEach((teacher) => {
                teacherOptionList = [...teacherOptionList, { lable: teacher.last_name + " " + teacher.middle_name + " " + teacher.first_name, value: JSON.stringify(teacher.getInterface()) }]
            })

            return (
                <div className="w-full h-fit flex flex-col gap-8">

                    <div className="w-12/12 max-md:w-full h-fit flex flex-col gap-8">

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="code" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Mã lớp<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="code" name="code" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="academic_year" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Niên khóa<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="academic_year" name="academic_year" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="faculty" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Khoa<h1 className="text-red-500">*</h1></label>
                            <Select id="faculty" name="faculty" height={10} option={facultyOptionList} onChange={onChangeFaculty} className="w-full col-span-5" required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="majors" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Ngành<h1 className="text-red-500">*</h1></label>
                            <Select id="majors" name="majors" height={10} option={majorsOptionList} onChange={onChangeMajors} className="w-full col-span-5" disable={currentFacultyCode == ''} required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="teacher" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Giáo viên chủ nhiệm<h1 className="text-red-500">*</h1></label>
                            <Select id="teacher" name="teacher" height={10} option={teacherOptionList} className="w-full col-span-5" disable={currentFacultyCode == '' || currentMajors == ''} required />
                        </div>

                    </div>

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
                                <h1 className="text-xl font-bold">Bạn có chắc muốn thêm lớp mới không ?</h1>
                                <div className="w-fit h-fit flex flex-row gap-8">
                                    <button type="button" onClick={() => setOpen(false)} className="w-28 h-12 bg-red-500 flex justify-center items-center font-bold rounded-md hover:bg-red-600 text-white p-4">Cancel</button>
                                    <button type="submit" disabled={isSubmit} className="w-28 h-12 bg-green-500 flex justify-center items-center font-bold rounded-md hover:bg-green-600 text-white p-4">Confirm</button>
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
                    <button type="button" onClick={() => setReset(reset => !reset)} className="w-28 h-12 bg-gray-200 flex justify-center items-center font-bold rounded-md hover:bg-gray-300 text-black p-4">Clear</button>
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
                <div className="w-6/12 max-md:w-full max-md:h-5/6 max-h-full h-fit bg-snow rounded-2xl flex flex-col border border-black border-solid overflow-hidden">
                    <Header />
                    <Form />
                </div>
            </motion.div>
        </Model>
    )
}

export default ClassForm