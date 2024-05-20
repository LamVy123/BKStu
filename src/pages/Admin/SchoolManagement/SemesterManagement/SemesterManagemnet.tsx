import Input from "../../../../component/Input"
import { SearchIcon, PlusIcon, RefreashIcon, InformationIcon, TrashIcon, LoadingIcon } from "../../../../assets/Icon"
import { motion } from "framer-motion"
import SemesterForm from "./SemesterForm"
import React, { useEffect, useState, FormEvent } from "react"
import { Semester, SemesterDetail, SemesterDetailFactory, SemesterFactory } from "../../../../class&interface/Semester"
import { getDocs, query, getDoc, doc, setDoc, deleteDoc, where, getCountFromServer, or } from "firebase/firestore"
import { semesterColRef, semesterDetailColRef } from "../../../../config/firebase"
import Model from "../../../../component/Model"
import Select, { OptionInterface } from "../../../../component/Select"
import TextArea from "../../../../component/TextArea"

const SemesterManagement: React.FC = () => {
    const [openSemesterForm, setOpenSemesterForm] = useState<boolean>(false);

    const [openSemesterInfor, setOpenSemesterInfor] = useState<boolean>(false);

    const [reset, setReset] = useState<boolean>(false);

    const [semesterList, setSemesterList] = useState<Semester[]>([])

    const [currentSemesterID, setcurrentSemesterID] = useState<string>('');

    const [searchValue, setSearchValue] = useState<string>('')

    const [isLoading, setLoading] = useState<boolean>(true);

    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const fetchSemesterList = async () => {
            setCount((await getCountFromServer(semesterColRef)).data().count);
            let semesterQuerry = query(semesterColRef);

            if (searchValue.toUpperCase() == '@ALL') {

            } else if (searchValue != '') {
                semesterQuerry = query(semesterQuerry, where('code', '==', searchValue));
            } else {
                semesterQuerry = query(semesterQuerry, or(where('status', '==', 'open'), where('status', '==', 'not_open'), where('status', '==', 'on_going')))
            }

            let list: Semester[] = [];
            const semesterQuerrySnapshot = await getDocs(semesterQuerry)
            const semesterFactory = new SemesterFactory();
            semesterQuerrySnapshot.forEach((doc) => {
                list = [...list, semesterFactory.CreateSemesterWithDocumentData(doc.data())]
            })
            setSemesterList(list);
            setLoading(false)
        }

        fetchSemesterList();
    }, [reset, searchValue])

    const Header: React.FC = () => {
        const search = (e: FormEvent) => {
            e.preventDefault();

            const data = new FormData(e.currentTarget as HTMLFormElement)

            const value = data.get("search")?.toString() as string

            setSearchValue(value)

            setOpenSemesterInfor(false);
        }

        return (
            <div className="w-full h-fit flex flex-row max-md:flex-col p-2 gap-4 items-center max-md:items-end ml-auto">

                <div className="w-full h-fit flex flex-row items-center gap-20 max-md:gap-8">

                    <div className="h-fit w-fit flex flex-col">
                        <h1 className="text-4xl max-md:text-3xl font-bold w-32">Học kì</h1>
                        <h1 className="text-base max-md:text-xs text-gray-default">{count} Học kì</h1>
                    </div>

                    <form onSubmit={search} className="w-full h-fit flex flex-row justify-center items-center gap-2">
                        <div className="h-10 flex justify-center items-center">
                            <motion.button whileTap={{ scale: 0.9 }} type="submit">
                                <SearchIcon width={8} height={8} color="black" />
                            </motion.button>
                        </div>
                        <Input type="search" name="search" id="search" className="w-full h-10 text-sm" defaultValue={searchValue} placeholder="Tìm kiếm bằng mã học kì hoặc @all"></Input>
                    </form>

                </div>

                <motion.button
                    className="min-w-fit h-10 bg-primary rounded flex justify-center items-center font-bold text-base"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpenSemesterForm(true)}
                >
                    <div className="w-full h-full bg-blue-500 rounded-l hover:bg-primary flex items-center justify-center p-2 text-white">
                        Thêm học kì mới
                    </div>
                    <div className=" flex justify-center items-center p-2">
                        <PlusIcon width={7} height={7} color="white" />
                    </div>
                </motion.button>
            </div>
        )
    }

    const SemesterInfor: React.FC = () => {
        const [currentSemester, setcurrentSemester] = useState<Semester>();
        const [currentSemesterDetail, setcurrentSemesterDetail] = useState<SemesterDetail>();
        const [edit, setEdit] = useState<boolean>(false);

        useEffect(() => {
            const fetchSemester = async () => {
                const semesterDoc = doc(semesterColRef, currentSemesterID)
                const semesterFactory = new SemesterFactory()
                await getDoc(semesterDoc).then((doc) => {
                    setcurrentSemester(semesterFactory.CreateSemesterWithDocumentData(doc.data()))
                })

                const semesterDetailDoc = doc(semesterDetailColRef, currentSemesterID)
                const semesterDetailFactory = new SemesterDetailFactory()
                await getDoc(semesterDetailDoc).then((doc) => {
                    setcurrentSemesterDetail(semesterDetailFactory.CreateSemesterDetailWithDocumentData(doc.data()))
                })

            }
            fetchSemester();

        }, [currentSemesterID])

        const submit = async (e: FormEvent) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget as HTMLFormElement)
            const id = currentSemesterID;
            const semesterDocRef = doc(semesterColRef, id);
            const semester = new Semester(
                data.get('code')?.toString() as string,
                id,
                data.get('academic_year')?.toString() as string,
                data.get('status')?.toString() as string,
                data.get('description')?.toString() as string,
            )
            setDoc(semesterDocRef, semester.getInterface());
            setcurrentSemester(semester);


            const number_of_weeks = isNaN(parseInt(data.get('number_of_weeks')?.toString() as string)) ? 0 : parseInt(data.get('number_of_weeks')?.toString() as string)
            const semesterDetail = new SemesterDetail(
                data.get('day_start')?.toString() as string,
                number_of_weeks,
            )
            const semesterDetailDocRef = doc(semesterDetailColRef, id);
            setDoc(semesterDetailDocRef, semesterDetail.getInterface());
            setcurrentSemesterDetail(semesterDetail);

            setEdit(false);
            setReset(reset => !reset)
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
                const delSemester = doc(semesterColRef, currentSemesterID);
                const delSemesterDetail = doc(semesterDetailColRef, currentSemesterID);

                await deleteDoc(delSemesterDetail)
                await deleteDoc(delSemester).then(() => {
                    setSemesterList(semesterList.filter(item => item.id != currentSemesterID));
                })
            }
            const [open, setOpen] = useState<boolean>(false);
            return (
                <>
                    {open && <Model>
                        <div className="w-full h-full flex justify-center items-center">
                            <div className="w-fit h-fit p-8 gap-8 rounded-2xl bg-white border border-black border-solid flex flex-col justify-end items-end">
                                <h1 className="text-xl text-black font-bold">Bạn có chắc muốn xóa học kì này không ?</h1>
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

        const option1: OptionInterface[] = [{ lable: 'Chưa mở ĐK', value: 'not_open' }, { lable: 'Đang mở ĐK', value: 'open' }, { lable: 'Đang diễn ra', value: 'on_going' }, { lable: 'Đã kết thúc', value: 'end' }]
        const option2: OptionInterface[] = [{ lable: 'Đang mở ĐK', value: 'open' }, { lable: 'Đang diễn ra', value: 'on_going' }, { lable: 'Đã kết thúc', value: 'end' }, { lable: 'Chưa mở ĐK', value: 'not_open' }]
        const option3: OptionInterface[] = [{ lable: 'Đang diễn ra', value: 'on_going' }, { lable: 'Đã kết thúc', value: 'end' }, { lable: 'Chưa mở ĐK', value: 'not_open' }, { lable: 'Đang mở ĐK', value: 'open' }]
        const option4: OptionInterface[] = [{ lable: 'Đã kết thúc', value: 'end' }, { lable: 'Chưa mở ĐK', value: 'not_open' }, { lable: 'Đang mở ĐK', value: 'open' }, { lable: 'Đang diễn ra', value: 'on_going' }]

        let statusOption: OptionInterface[];
        switch (currentSemester?.status) {
            case 'not_open':
                statusOption = option1
                break
            case 'open':
                statusOption = option2
                break
            case 'on_going':
                statusOption = option3
                break
            default:
                statusOption = option4
        }
        return (
            <form className="w-full h-full max-md:hidden flex flex-col gap-2 p-2 overflow-scroll" onSubmit={submit}>

                <div className="w-full h-fit bg-primary rounded-t-2xl flex items-center justify-start text-white font-bold p-4 text-4xl">
                    Thông tin học kì
                    {edit && <DeleteButton />}
                </div>
                {(currentSemester && currentSemesterDetail) ? <div className="w-full h-full flex flex-col p-4 gap-8 text-xl overflow-scroll">
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="code" className="min-w-52">Mã học kì:</label>
                        <Input id="code" name="code" defaultValue={currentSemester?.code} type="text" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="academic_year" className="min-w-52">Niên khóa:</label>
                        <Input id="academic_year" name="academic_year" defaultValue={currentSemester?.academic_year} type="text" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="day_start" className="min-w-52">Ngày bắt đầu:</label>
                        <Input id="day_start" name="day_start" defaultValue={currentSemesterDetail?.day_start} type="date" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="number_of_weeks" className="min-w-52">Số tuần kéo dài:</label>
                        <Input id="number_of_weeks" name="number_of_weeks" defaultValue={currentSemesterDetail?.number_of_weeks.toString()} type="number" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="status" className="min-w-52">Trạng thái học kì:</label>
                        <Select id="status" name="status" className="w-full font-normal" disable={!edit} height={12} option={statusOption} />
                    </div>
                    <div className="w-full h-fit flex flex-col items-start justify-start text-black font-bold gap-4">
                        <label htmlFor="description" className="min-w-52">Mô tả:</label>
                        <TextArea id="description" name="description" defaultValue={currentSemester.description} className="w-full min-h-32 font-normal" disable={!edit} />
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
            <div className="w-full h-full max-md:hidden flex flex-col gap-2 p-2 overflow-scroll">
                <div className="w-full h-fit bg-primary rounded-t-2xl flex items-center justify-start text-white font-bold p-4 text-4xl">
                    Thông tin học kì
                </div>
                <div className="w-full h-full flex flex-col p-4 gap-8 text-xl overflow-scroll">
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="code" className="min-w-52">Mã học kì:</label>
                        <Input id="code" name="code" type="text" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="academic_year" className="min-w-52">Niên khóa:</label>
                        <Input id="academic_year" name="academic_year" type="text" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="day_start" className="min-w-52">Ngày bắt đầu:</label>
                        <Input id="day_start" name="day_start" type="text" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="number_of_weeks" className="min-w-52">Số tuần kéo dài:</label>
                        <Input id="number_of_weeks" name="number_of_weeks" type="number" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="status" className="min-w-52">Trạng thái học kì:</label>
                        <Input id="status" name="status" type="number" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-col items-start justify-start text-black font-bold gap-4">
                        <label htmlFor="description" className="min-w-52">Mô tả:</label>
                        <TextArea id="description" name="description" className="w-full min-h-32" disable />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {openSemesterForm && <SemesterForm setOpenSemesterForm={setOpenSemesterForm} />}
            <div className="w-full h-full flex items-center justify-center p-4 bg-snow">

                <div className="w-full h-full flex flex-row items-center justify-center gap-2">

                    <div className="w-6/12 max-md:w-full h-full flex flex-col">

                        <Header />

                        <div className="w-full h-full flex flex-col p-4 gap-0 overflow-hidden">
                            <div className="w-full h-16 grid grid-cols-10 p-4">

                                <div className="w-full h-full col-span-3 text-xl font-bold text-gray-default flex items-center">Mã học kì</div>

                                <div className="w-full h-full col-span-3 text-xl font-bold text-gray-default flex items-center">Niên khóa</div>

                                <div className="w-full h-full col-span-3 text-xl font-bold text-gray-default flex items-center">Trạng thái</div>

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
                                    } else if (semesterList.length == 0 && searchValue != '') {
                                        return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                            Không có học kì nào với mã là {searchValue}!
                                        </div>
                                    } else if (count == 0) {
                                        return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                            Hãy thêm gì đó!
                                        </div>
                                    }
                                    return semesterList.map((semester, index) => {
                                        const class1 = "w-full h-14 max-md:h-20 grid grid-cols-10 p-4 gap-4 hover:bg-gray-50 bg-snow";
                                        const class2 = "w-full h-14 max-md:h-20 grid grid-cols-10 p-4 gap-4 hover:bg-gray-50 bg-white";
                                        let color: string
                                        let label: string = ''
                                        switch (semester.status) {
                                            case 'not_open':
                                                color = 'blue'
                                                label = 'Chưa mở ĐK'
                                                break
                                            case 'open':
                                                color = 'green'
                                                label = 'Đang mở ĐK'
                                                break
                                            case 'on_going':
                                                color = 'green'
                                                label = 'Đang diễn ra'
                                                break
                                            default:
                                                color = 'red'
                                                label = 'Đã kết thúc'
                                        }
                                        return (
                                            <React.Fragment key={semester.id}>
                                                <div className={(index % 2 != 0) ? class1 : class2}>

                                                    <div className="w-full h-full col-span-3 text-base font-bold text-black">{semester.code}</div>

                                                    <div className="w-full h-full col-span-3 text-base font-bold text-black">{semester.academic_year}</div>

                                                    <div style={{ color: color }} className="w-full h-full col-span-3 text-base font-bold text-black">{label}</div>

                                                    <motion.button
                                                        onClick={(e) => {
                                                            setcurrentSemesterID(e.currentTarget.getAttribute('data-key') as string);
                                                            setOpenSemesterInfor(true)
                                                        }}
                                                        data-key={semester.id} whileTap={{ scale: .9 }} className="w-fit h-fit rounded-md flex justify-center items-center">
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
                        {openSemesterInfor ? <SemesterInfor /> : <PlaceHolder />}
                    </div>

                </div>

            </div>
        </>
    )
}
export default SemesterManagement