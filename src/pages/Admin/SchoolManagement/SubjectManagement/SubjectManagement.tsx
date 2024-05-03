import Input from "../../../../component/Input"
import { SearchIcon, PlusIcon, RefreashIcon, InformationIcon, TrashIcon, LoadingIcon } from "../../../../assets/Icon"
import { motion } from "framer-motion"
import SubjectForm from "./SubjectForm"
import React, { useEffect, useState, FormEvent } from "react"
import { Subject, SubjectDetail, SubjectDetailFactory, SubjectFactory } from "../../../../class&interface/Subject"
import { getDocs, query, getDoc, doc, setDoc, deleteDoc, where, getCountFromServer } from "firebase/firestore"
import { subjectColRef, subjectDetailColRef } from "../../../../config/firebase"
import TextArea from "../../../../component/TextArea"
import Model from "../../../../component/Model"
import Select, { OptionInterface } from "../../../../component/Select"

const SubjectManagement: React.FC = () => {
    const [openSubjectForm, setOpenSubjectForm] = useState<boolean>(false);

    const [openSubjectInfor, setOpenSubjectInfor] = useState<boolean>(false);

    const [reset, setReset] = useState<boolean>(false);

    const [subjectList, setSubjectList] = useState<Subject[]>([])

    const [currentSubjectID, setcurrentSubjectID] = useState<string>('');

    const [searchValue, setSearchValue] = useState<string>('')

    const [isLoading, setLoading] = useState<boolean>(true);

    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const fetchSubjectList = async () => {
            setCount((await getCountFromServer(subjectColRef)).data().count);
            let subjectQuerry = query(subjectColRef);

            if (searchValue.toUpperCase() == '@ALL') {

            } else if (searchValue != '') {
                subjectQuerry = query(subjectQuerry, where('code', '==', searchValue));
            }

            let list: Subject[] = [];
            const subjectQuerrySnapshot = await getDocs(subjectQuerry)
            const subjectFactory = new SubjectFactory();
            subjectQuerrySnapshot.forEach((doc) => {
                list = [...list, subjectFactory.CreateSubjectWithDocumentData(doc.data())]
            })
            setSubjectList(list);
            setLoading(false)
        }

        fetchSubjectList();
    }, [reset, searchValue])

    const Header: React.FC = () => {
        const search = (e: FormEvent) => {
            e.preventDefault();

            const data = new FormData(e.currentTarget as HTMLFormElement)

            const value = data.get("search")?.toString() as string

            setSearchValue(value)

            setOpenSubjectInfor(false);
        }

        return (
            <div className="w-full h-fit flex flex-row max-md:flex-col p-2 gap-4 items-center max-md:items-end ml-auto">

                <div className="w-full h-fit flex flex-row items-center gap-16 max-md:gap-8">

                    <div className="h-fit w-fit flex flex-col">
                        <h1 className="text-4xl max-md:text-3xl w-40 font-bold">Môn học</h1>
                        <h1 className="text-base max-md:text-xs text-gray-default">{count} Môn học</h1>
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

                <motion.button
                    className="min-w-fit h-10 bg-primary rounded flex justify-center items-center font-bold text-base"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpenSubjectForm(true)}
                >
                    <div className="w-full h-full bg-blue-500 rounded-l hover:bg-primary flex items-center justify-center p-2 text-white">
                        Thêm môn học mới
                    </div>
                    <div className=" flex justify-center items-center p-2">
                        <PlusIcon width={7} height={7} color="white" />
                    </div>
                </motion.button>
            </div>
        )
    }

    const SubjectInfor: React.FC = () => {
        const [currentSubject, setcurrentSubject] = useState<Subject>();
        const [currentSubjectDetail, setcurrentSubjectDetail] = useState<SubjectDetail>();
        const [edit, setEdit] = useState<boolean>(false);

        useEffect(() => {
            const fetchSubject = async () => {
                const subjectDoc = doc(subjectColRef, currentSubjectID)
                const subjectFactory = new SubjectFactory()
                await getDoc(subjectDoc).then((doc) => {
                    setcurrentSubject(subjectFactory.CreateSubjectWithDocumentData(doc.data()))
                })

                const subjectDetailDoc = doc(subjectDetailColRef, currentSubjectID)
                const subjectDetailFactory = new SubjectDetailFactory()
                await getDoc(subjectDetailDoc).then((doc) => {
                    setcurrentSubjectDetail(subjectDetailFactory.CreateSubjectDetailWithDocumentData(doc.data()))
                })

            }
            fetchSubject();

        }, [currentSubjectID])

        const submit = async (e: FormEvent) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget as HTMLFormElement)

            const class_duration = isNaN(parseInt(data.get('class_duration')?.toString() as string)) ? 0 : parseInt(data.get('class_duration')?.toString() as string)
            const number_of_credit = isNaN(parseInt(data.get('number_of_credit')?.toString() as string)) ? 0 : parseInt(data.get('number_of_credit')?.toString() as string)
            const hours_needed = isNaN(parseInt(data.get('hours_needed')?.toString() as string)) ? 0 : parseInt(data.get('hours_needed')?.toString() as string)
            const home_work_percent = isNaN(parseInt(data.get('home_work_percent')?.toString() as string)) ? 0 : parseInt(data.get('home_work_percent')?.toString() as string)
            const assignment_percent = isNaN(parseInt(data.get('assignment_percent')?.toString() as string)) ? 0 : parseInt(data.get('assignment_percent')?.toString() as string)
            const laboratory_percent = isNaN(parseInt(data.get('laboratory_percent')?.toString() as string)) ? 0 : parseInt(data.get('laboratory_percent')?.toString() as string)
            const midterm_exam_percent = isNaN(parseInt(data.get('midterm_exam_percent')?.toString() as string)) ? 0 : parseInt(data.get('midterm_exam_percent')?.toString() as string)
            const final_exam_percent = isNaN(parseInt(data.get('final_exam_percent')?.toString() as string)) ? 0 : parseInt(data.get('final_exam_percent')?.toString() as string)

            const id = currentSubject?.id.toString() as string;
            const subjectDocRef = doc(subjectColRef, id);
            const subject = new Subject(
                data.get('name')?.toString() as string,
                data.get('code')?.toString() as string,
                id,
                currentSubject?.majors.toString() as string,
                currentSubject?.faculty.toString() as string,
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

            setDoc(subjectDocRef, subject.getInterface());
            setcurrentSubject(subject);

            const subjectDetailDocRef = doc(subjectDetailColRef, id);
            setDoc(subjectDetailDocRef, subjectDetail.getInterface());
            setcurrentSubjectDetail(subjectDetail);

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
                                    <button type="button" onClick={() => setOpen(false)} className="w-28 h-12 bg-red-500 flex justify-center items-center font-bold rounded-md hover:bg-red-700 text-white p-4">Cancel</button>
                                    <button type="submit" className="w-28 h-12 bg-green-400 flex justify-center items-center font-bold rounded-md hover:bg-green-600 text-white p-4">Confirm</button>
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
                const delSubject = doc(subjectColRef, currentSubjectID);
                const delSubjectDetail = doc(subjectDetailColRef, currentSubjectID);

                await deleteDoc(delSubjectDetail)
                await deleteDoc(delSubject).then(() => {
                    setSubjectList(subjectList.filter(item => item.id != currentSubjectID));
                })
            }
            const [open, setOpen] = useState<boolean>(false);
            return (
                <>
                    {open && <Model>
                        <div className="w-full h-full flex justify-center items-center">
                            <div className="w-fit h-fit p-8 gap-8 rounded-2xl bg-white border border-black border-solid flex flex-col justify-end items-end">
                                <h1 className="text-xl text-black font-bold">Bạn có chắc muốn xóa môn học này không ?</h1>
                                <div className="w-fit h-fit flex flex-row gap-8 text-xl">
                                    <button type="button" onClick={() => delDoc()} className="w-28 h-12 bg-red-500 flex justify-center items-center font-bold rounded-md hover:bg-red-700 text-white p-4">Confirm</button>
                                    <button type="button" onClick={() => setOpen(false)} className="w-28 h-12 bg-green-400 flex justify-center items-center font-bold rounded-md hover:bg-green-600 text-white p-4">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </Model>}
                    <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => setOpen(true)} className="w-fit h-fit ml-auto"><TrashIcon width={8} height={8} color="red" /></motion.button>
                </>
            )
        }

        const SubjectTypeOptionList1: OptionInterface[] = [
            { lable: 'Cơ sở ngành', value: 'Cơ sở ngành' },
            { lable: 'Đại cương', value: 'Đại cương' },
            { lable: 'Chuyên ngành', value: 'Chuyên ngành' },
        ]

        const SubjectTypeOptionList2: OptionInterface[] = [
            { lable: 'Đại cương', value: 'Đại cương' },
            { lable: 'Cơ sở ngành', value: 'Cơ sở ngành' },
            { lable: 'Chuyên ngành', value: 'Chuyên ngành' },
        ]

        const SubjectTypeOptionList3: OptionInterface[] = [
            { lable: 'Chuyên ngành', value: 'Chuyên ngành' },
            { lable: 'Đại cương', value: 'Đại cương' },
            { lable: 'Cơ sở ngành', value: 'Cơ sở ngành' },
        ]

        let SubjectTypeOptionList: OptionInterface[]

        switch (currentSubject?.subject_type) {
            case 'Cơ sở ngành':
                SubjectTypeOptionList = SubjectTypeOptionList1
                break;
            case 'Chuyên ngành':
                SubjectTypeOptionList = SubjectTypeOptionList3
                break
            default:
                SubjectTypeOptionList = SubjectTypeOptionList2
        }

        return (
            <form className="w-full h-full max-md:hidden flex flex-col gap-2 p-2 overflow-scroll" onSubmit={submit}>

                <div className="w-full h-fit bg-primary rounded-t-2xl flex items-center justify-start text-white font-bold p-4 text-4xl">
                    Thông tin môn học
                    {edit && <DeleteButton />}
                </div>
                {(currentSubject && currentSubjectDetail) ? <div className="w-full h-full flex flex-col p-4 gap-8 text-xl overflow-scroll">
                    <div className="w-full h-fit flex flex-row items-center justify-between text-black font-bold gap-4">
                        <label htmlFor="name" className="min-w-52">Tên môn học:</label>
                        <Input id="name" name="name" defaultValue={currentSubject?.name} type="text" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="code" className="min-w-52">Mã môn học:</label>
                        <Input id="code" name="code" defaultValue={currentSubject?.code} type="text" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="faculty" className="min-w-52">Khoa:</label>
                        <Input id="faculty" name="faculty" defaultValue={currentSubject.faculty} type="text" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="majors" className="min-w-52">Ngành:</label>
                        <Input id="majors" name="majors" defaultValue={currentSubject.majors == 'none' ? 'Không' : currentSubject.majors} type="text" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="subject_type" className="min-w-52">Loại môn:</label>
                        <Select id="subject_type" name="subject_type" height={12} option={SubjectTypeOptionList} className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="class_duration" className="min-w-52">Thời lượng tiết học:</label>
                        <Input id="class_duration" name="class_duration" defaultValue={currentSubjectDetail.class_duration} type="number" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="number_of_credit" className="min-w-52">Số tín chỉ:</label>
                        <Input id="number_of_credit" name="number_of_credit" defaultValue={currentSubjectDetail.number_of_credit} type="number" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="hours_needed" className="min-w-52">Số giờ học:</label>
                        <Input id="hours_needed" name="hours_needed" defaultValue={currentSubjectDetail.hours_needed} type="number" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="home_work_percent" className="min-w-52">% Điểm bài tập:</label>
                        <Input id="home_work_percent" name="home_work_percent" defaultValue={currentSubjectDetail.home_work_percent} type="number" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="assignment_percent" className="min-w-52">% Điểm BTL:</label>
                        <Input id="assignment_percent" name="assignment_percent" defaultValue={currentSubjectDetail.assignment_percent} type="number" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="laboratory_percent" className="min-w-52">% Điểm thí nghiệm:</label>
                        <Input id="laboratory_percent" name="laboratory_percent" defaultValue={currentSubjectDetail.laboratory_percent} type="number" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="midterm_exam_percent" className="min-w-52">% Điểm giữa kì:</label>
                        <Input id="midterm_exam_percent" name="midterm_exam_percent" defaultValue={currentSubjectDetail.midterm_exam_percent} type="number" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="final_exam_percent" className="min-w-52">% Điểm cuối kì:</label>
                        <Input id="final_exam_percent" name="final_exam_percent" defaultValue={currentSubjectDetail.final_exam_percent} type="text" className="w-full font-normal" disable={!edit} />
                    </div>


                    <div className="w-full h-fit flex flex-col items-start justify-start text-black font-bold gap-4">
                        <label htmlFor="description" className="min-w-52">Mô tả:</label>
                        <TextArea id="description" name="description" className="w-full h-auto font-normal text-xl" defaultValue={currentSubjectDetail?.description} disable={!edit} />
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
                    Thông tin môn học
                </div>
                <div className="w-12/12 max-md:w-full h-fit flex text-xl flex-col gap-8 p-4 overflow-scroll">
                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="name" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tên môn học:</label>
                        <Input type="text" id="name" name="name" placeholder="" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="code" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Mã môn học:</label>
                        <Input type="text" id="code" name="code" placeholder="" className="w-full col-span-5" disable />
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
                        <label htmlFor="subject_type" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Loại môn:</label>
                        <Input type="text" id="subject_type" name="subject_type" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="class_duration" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Thời lượng tiết học:</label>
                        <Input type="number" id="class_duration" name="class_duration" placeholder="" className="w-full col-span-5" disable />
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

                    <div className="w-full h-fit flex flex-col items-start justify-center">
                        <label htmlFor="description" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Mô tả:</label>
                        <TextArea id="description" name="description" className="w-full min-h-32" disable />
                    </div>

                </div>

            </div>
        )
    }

    return (
        <>
            {openSubjectForm && <SubjectForm setOpenSubjectForm={setOpenSubjectForm} />}
            <div className="w-full h-full flex items-center justify-center p-4 bg-snow">

                <div className="w-full h-full flex flex-row items-center justify-center gap-2">

                    <div className="w-6/12 max-md:w-full h-full flex flex-col">

                        <Header />

                        <div className="w-full h-full flex flex-col p-4 gap-0 overflow-hidden">
                            <div className="w-full h-16 grid grid-cols-10 p-4">

                                <div className="w-full h-full col-span-5 text-xl font-bold text-gray-default flex items-center">Môn học</div>

                                <div className="w-full h-full col-span-4 text-xl font-bold text-gray-default flex items-center">Mã môn học</div>

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
                                    } else if (subjectList.length == 0 && searchValue != '') {
                                        return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                            Không có môn học nào với mã là {searchValue}!
                                        </div>
                                    } else if (count == 0) {
                                        return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                            Hãy thêm gì đó!
                                        </div>
                                    }
                                    return subjectList.map((subject, index) => {
                                        const class1 = "w-full h-14 max-md:h-20 grid grid-cols-10 p-4 gap-4 hover:bg-gray-50 bg-snow";
                                        const class2 = "w-full h-14 max-md:h-20 grid grid-cols-10 p-4 gap-4 hover:bg-gray-50 bg-white";
                                        return (
                                            <React.Fragment key={subject.id}>
                                                <div className={(index % 2 != 0) ? class1 : class2}>

                                                    <div className="w-full h-full col-span-5 text-base font-bold text-black">{subject.name}</div>

                                                    <div className="w-full h-full col-span-4 text-base font-bold text-black">{subject.code}</div>

                                                    <motion.button
                                                        onClick={(e) => {
                                                            setcurrentSubjectID(e.currentTarget.getAttribute('data-key') as string);
                                                            setOpenSubjectInfor(true)
                                                        }}
                                                        data-key={subject.id} whileTap={{ scale: .9 }} className="w-fit h-fit rounded-md flex justify-center items-center">
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
                        {openSubjectInfor ? <SubjectInfor /> : <PlaceHolder />}
                    </div>

                </div>

            </div>
        </>
    )
}
export default SubjectManagement