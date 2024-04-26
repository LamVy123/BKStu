import Model from "../../../../component/Model"
import { ExitIcon } from "../../../../assets/Icon"
import { motion } from "framer-motion"
import Input from "../../../../component/Input"
import TextArea from "../../../../component/TextArea"
import { FormEvent, useState, useEffect } from "react"
import { Subject, SubjectDetail } from "../../../../class&interface/Subject"
import { addDoc, setDoc, doc, getDocs, query, where } from "firebase/firestore"
import { subjectColRef, subjectDetailColRef } from "../../../../config/firebase"
import Select, { OptionInterface } from "../../../../component/Select"
import { Faculty, FacultyFactory, FacultyInterface } from "../../../../class&interface/Faculty"
import { Majors, MajorsFactory, MajorsInterface } from "../../../../class&interface/Majors"
import { facultyColRef, majorsColRef } from "../../../../config/firebase"

interface SubjectFormProps {
    setOpenSubjectForm: React.Dispatch<React.SetStateAction<boolean>>
}

const SubjectForm: React.FC<SubjectFormProps> = ({ setOpenSubjectForm }: SubjectFormProps) => {

    const [reset, setReset] = useState<boolean>(false);
    reset

    const Header: React.FC = () => {
        return (
            <div className="w-full h-20 flex flex-row justify-start items-center p-4 bg-primary rounded-t-2xl">
                <h1 className="text-4xl max-md:text-2xl font-bold text-white">Thêm môn học mới</h1>

                <button className="w-fit h-full ml-auto" onClick={() => setOpenSubjectForm(false)}>
                    <ExitIcon width={10} height={10} color="black" />
                </button>
            </div>
        )
    }


    const Form: React.FC = () => {
        const [isSubmit, setIsSubmit] = useState<boolean>(false)

        const submit = async (e: FormEvent) => {
            e.preventDefault();
            setIsSubmit(true)
            const data = new FormData(e.currentTarget as HTMLFormElement)


            const class_duration = isNaN(parseInt(data.get('class_duration')?.toString() as string)) ? 0 : parseInt(data.get('class_duration')?.toString() as string)
            const number_of_credit = isNaN(parseInt(data.get('number_of_credit')?.toString() as string)) ? 0 : parseInt(data.get('number_of_credit')?.toString() as string)
            const hours_needed = isNaN(parseInt(data.get('hours_needed')?.toString() as string)) ? 0 : parseInt(data.get('hours_needed')?.toString() as string)
            const home_work_percent = isNaN(parseInt(data.get('home_work_percent')?.toString() as string)) ? 0 : parseInt(data.get('home_work_percent')?.toString() as string)
            const assignment_percent = isNaN(parseInt(data.get('assignment_percent')?.toString() as string)) ? 0 : parseInt(data.get('assignment_percent')?.toString() as string)
            const laboratory_percent = isNaN(parseInt(data.get('laboratory_percent')?.toString() as string)) ? 0 : parseInt(data.get('laboratory_percent')?.toString() as string)
            const midterm_exam_percent = isNaN(parseInt(data.get('midterm_exam_percent')?.toString() as string)) ? 0 : parseInt(data.get('midterm_exam_percent')?.toString() as string)
            const final_exam_percent = isNaN(parseInt(data.get('final_exam_percent')?.toString() as string)) ? 0 : parseInt(data.get('final_exam_percent')?.toString() as string)

            const faculty = JSON.parse(data.get('faculty')?.toString() as string) as FacultyInterface
            let majors: MajorsInterface = { name: 'Không', code: '', id: '', faculty_code: '' }
            if (data.get('majors')?.toString() as string != 'Không') {
                majors = JSON.parse(data.get('majors')?.toString() as string) as MajorsInterface
            }

            if (home_work_percent < 0 || assignment_percent < 0 || laboratory_percent < 0 || midterm_exam_percent < 0 || final_exam_percent < 0) {
                alert("Phần trăm thành phần các điểm phải lớn hơn hoặc bằng không! Xin hãy nhập lại");
                setIsSubmit(false)
                return
            }
            if (home_work_percent + assignment_percent + laboratory_percent + midterm_exam_percent + final_exam_percent != 100) {
                alert("Tổng thành phần các điểm phải bằng 100%! ")
                setIsSubmit(false)
                return
            }
            try {
                await addDoc(subjectColRef, {})
                    .then((target) => {
                        const id = target.id;
                        const subjectDocRef = doc(subjectColRef, id);
                        const subject = new Subject(
                            data.get('name')?.toString() as string,
                            data.get('code')?.toString() as string,
                            id,
                            majors.name,
                            faculty.name,
                            data.get('subject_type')?.toString() as string,
                        )

                        const subjectDetail = new SubjectDetail(
                            class_duration,
                            number_of_credit,
                            hours_needed,
                            home_work_percent,
                            assignment_percent,
                            laboratory_percent,
                            midterm_exam_percent,
                            final_exam_percent,
                            data.get('description')?.toString() as string,
                        )
                        const subjectDetailDocRef = doc(subjectDetailColRef, id);

                        setDoc(subjectDocRef, subject.getInterface());
                        setDoc(subjectDetailDocRef, subjectDetail.getInterface());
                    })
            } catch {
                alert("Đã xảy ra lỗi xin thử lại")
                return;
            }
            alert("Thêm Môn học mới thành công!")
            setReset(reset => !reset)
        }

        const Section1: React.FC = () => {
            const [facultyList, setFacultyList] = useState<Faculty[]>([])

            const [currnetFacultyCode, setCurrentFacultyCode] = useState<string>('');

            const [majorsList, setMajorsList] = useState<Majors[]>([])


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
                    let majorsQuerry = query(majorsColRef, where('faculty_code', '==', currnetFacultyCode));

                    let list: Majors[] = [];
                    const majorsQuerrySnapshot = await getDocs(majorsQuerry)
                    const majorsFactory = new MajorsFactory();
                    majorsQuerrySnapshot.forEach((doc) => {
                        const majors = majorsFactory.CreateMajorsWithDocumentData(doc.data())
                        list = [...list, majors]
                    })
                    setMajorsList(list);
                }
                if (currnetFacultyCode != '') {
                    fetchMajorsList();
                }
            }, [currnetFacultyCode])


            const SubjectTypeOptionList: OptionInterface[] = [
                { lable: 'Vui lòng chọn', value: '' },
                { lable: 'Đại cương', value: 'Đại cương' },
                { lable: 'Cơ sở ngành', value: 'Cơ sở ngành' },
                { lable: 'Chuyên ngành', value: 'Chuyên ngành' }
            ]

            const onChangeFaculty = (e: React.ChangeEvent<HTMLSelectElement>) => {
                e.preventDefault();
                if (e.target.value) {
                    const faculty = JSON.parse(e.target.value) as FacultyInterface
                    setCurrentFacultyCode(faculty.code);
                } else {
                    setCurrentFacultyCode('');
                }
            }

            let facultyOptionList: OptionInterface[] = [{ lable: 'Vui lòng chọn', value: '' }]
            let majorsOptionList: OptionInterface[] = [{ lable: 'Vui lòng chọn', value: '' }, { lable: 'Không', value: 'Không' }]

            facultyList.forEach((faculty) => {
                facultyOptionList = [...facultyOptionList, { lable: faculty.name, value: JSON.stringify(faculty.getInterface()) }]
            })

            majorsList.forEach((majors) => {
                majorsOptionList = [...majorsOptionList, { lable: majors.name, value: JSON.stringify(majors.getInterface()) }]
            })

            return (
                <div className="w-full h-fit flex flex-col gap-8">

                    <div className="w-12/12 max-md:w-full h-fit flex flex-col gap-8">
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="name" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tên môn học<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="name" name="name" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="code" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Mã môn học<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="code" name="code" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="faculty" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Khoa<h1 className="text-red-500">*</h1></label>
                            <Select id="faculty" name="faculty" height={10} option={facultyOptionList} onChange={onChangeFaculty} className="w-full col-span-5" required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="majors" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Ngành<h1 className="text-red-500">*</h1></label>
                            <Select id="majors" name="majors" height={10} option={majorsOptionList} className="w-full col-span-5" disable={currnetFacultyCode == ''} required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="subject_type" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Loại môn<h1 className="text-red-500">*</h1></label>
                            <Select id="subject_type" name="subject_type" height={10} option={SubjectTypeOptionList} className="w-full col-span-5" required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="number_of_credit" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Số tín chỉ<h1 className="text-red-500">*</h1></label>
                            <Input type="number" id="number_of_credit" name="number_of_credit" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                        </div>
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="class_duration" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Thời lượng tiết học<h1 className="text-red-500">*</h1></label>
                            <Input type="number" id="class_duration" name="class_duration" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                        </div>
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="hours_needed" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Số giờ học<h1 className="text-red-500">*</h1></label>
                            <Input type="number" id="hours_needed" name="hours_needed" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                        </div>
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="home_work_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm bài tập<h1 className="text-red-500">*</h1></label>
                            <Input type="number" id="home_work_percent" name="home_work_percent" placeholder="Vui lòng điền" className="w-full col-span-5" />
                        </div>
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="assignment_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm BTL<h1 className="text-red-500">*</h1></label>
                            <Input type="number" id="assignment_percent" name="assignment_percent" placeholder="Vui lòng điền" className="w-full col-span-5" />
                        </div>
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="laboratory_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm thí nghiệm<h1 className="text-red-500">*</h1></label>
                            <Input type="number" id="laboratory_percent" name="laboratory_percent" placeholder="Vui lòng điền" className="w-full col-span-5" />
                        </div>
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="midterm_exam_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm giữa kì<h1 className="text-red-500">*</h1></label>
                            <Input type="number" id="midterm_exam_percent" name="midterm_exam_percent" placeholder="Vui lòng điền" className="w-full col-span-5" />
                        </div>
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="final_exam_percent" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">% Điểm cuối kì<h1 className="text-red-500">*</h1></label>
                            <Input type="number" id="final_exam_percent" name="final_exam_percent" placeholder="Vui lòng điền" className="w-full col-span-5" />
                        </div>

                    </div>

                    <div className="ư-full h-fit flex flex-col items-start justify-center">
                        <label htmlFor="description" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Mô tả<h1 className="text-red-500">*</h1></label>
                        <TextArea id="description" name="description" className="w-full min-h-32" required />
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
                                <h1 className="text-xl font-bold">Bạn có chắc muốn thêm môn học mới không ?</h1>
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

export default SubjectForm