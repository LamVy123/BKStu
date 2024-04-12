import Input from "../../../../component/Input"
import { SearchIcon, PlusIcon, RefreashIcon, InformationIcon, TrashIcon, LoadingIcon } from "../../../../assets/Icon"
import { motion } from "framer-motion"
import FacultyForm from "./FacultyForm"
import React, { useEffect, useState, FormEvent } from "react"
import { Faculty, FacultyDetail, FacultyFactory } from "../../../../class&interface/Faculty"
import { getDocs, query, getDoc, doc, setDoc, deleteDoc, where, getCountFromServer } from "firebase/firestore"
import { facultyColRef, facultyDetailColRef } from "../../../../config/firebase"
import TextArea from "../../../../component/TextArea"
import Model from "../../../../component/Model"

const FacultyManagement: React.FC = () => {
    const [openFacultyForm, setOpenFacultyForm] = useState<boolean>(false);

    const [openFacultyInfor, setOpenFacultyInfor] = useState<boolean>(false);

    const [reset, setReset] = useState<boolean>(false);

    const [facultyList, setFacultyList] = useState<Faculty[]>([])

    const [currentFacultyID, setcurrentFacultyID] = useState<string>('');

    const [searchValue, setSearchValue] = useState<string>('')

    const [isLoading, setLoading] = useState<boolean>(true);

    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const fetchFacultyList = async () => {
            setLoading(true);
            setCount((await getCountFromServer(facultyColRef)).data().count);
            let facultyQuerry = query(facultyColRef);

            if (searchValue != '') {
                facultyQuerry = query(facultyQuerry, where('code', '>=', searchValue), where('code', '<=', searchValue + '~'));
            }

            let list: Faculty[] = [];
            const facultyQuerrySnapshot = await getDocs(facultyQuerry)
            const facultyFactory = new FacultyFactory();
            facultyQuerrySnapshot.forEach((doc) => {
                list = [...list, facultyFactory.CreateFacultyWithDocumentData(doc.data())]
            })
            setFacultyList(list);
            setLoading(false)
        }

        fetchFacultyList();
    }, [reset, searchValue])

    const Header: React.FC = () => {
        const search = (e: FormEvent) => {
            e.preventDefault();

            const data = new FormData(e.currentTarget as HTMLFormElement)

            const value = data.get("search")?.toString() as string

            setSearchValue(value.toUpperCase())

            setOpenFacultyInfor(false);
        }

        return (
            <div className="w-full h-fit flex flex-row max-md:flex-col p-2 gap-4 items-center max-md:items-end ml-auto">

                <div className="w-full h-fit flex flex-row items-center gap-20 max-md:gap-8">

                    <div className="h-fit w-fit flex flex-col">
                        <h1 className="text-4xl max-md:text-3xl font-bold">Khoa</h1>
                        <h1 className="text-base max-md:text-xs text-gray-default">{count} Khoa</h1>
                    </div>

                    <form onSubmit={search} className="w-full h-fit flex flex-row justify-center items-center gap-2">
                        <div className="h-10 flex justify-center items-center">
                            <motion.button whileTap={{ scale: 0.9 }} type="submit">
                                <SearchIcon width={8} height={8} color="black" />
                            </motion.button>
                        </div>
                        <Input type="search" name="search" id="search" className="w-full h-10 text-sm" defaultValue={searchValue} placeholder="Tìm kiếm bằng code của khoa"></Input>
                    </form>

                </div>

                <motion.button
                    className="min-w-fit h-10 bg-gray-200 hover:bg-gray-300 rounded flex flex-row justify-center items-center p-2 gap-2 font-bold max-md:text-xs"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpenFacultyForm(true)}
                >
                    <PlusIcon width={5} height={5} color="black" />
                    Thêm Khoa mới
                </motion.button>
            </div>
        )
    }

    const FacultyInfor: React.FC = () => {
        const [currentFaculty, setcurrentFaculty] = useState<Faculty>();
        const [currentFacultyDetail, setcurrentFacultyDetail] = useState<FacultyDetail>();
        const [edit, setEdit] = useState<boolean>(false);

        useEffect(() => {
            const fetchFaculty = async () => {
                const facultyDoc = doc(facultyColRef, currentFacultyID)
                await getDoc(facultyDoc).then((doc) => {
                    setcurrentFaculty(new Faculty(
                        doc.data()?.name,
                        doc.data()?.code,
                        doc.data()?.id,
                    ))
                })

                const facultyDetailDoc = doc(facultyDetailColRef, currentFacultyID)
                await getDoc(facultyDetailDoc).then((doc) => {
                    setcurrentFacultyDetail(new FacultyDetail(
                        doc.data()?.email,
                        doc.data()?.phone_number,
                        doc.data()?.description,
                    ))
                })

            }
            fetchFaculty();

        }, [currentFacultyID])

        const submit = async (e: FormEvent) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget as HTMLFormElement)

            const id = currentFacultyID;
            const facultyDocRef = doc(facultyColRef, id);
            const faculty = new Faculty(
                data.get('name')?.toString() as string,
                data.get('code')?.toString() as string,
                id
            )
            setDoc(facultyDocRef, faculty.getInterface());
            setcurrentFaculty(faculty);


            const facultyDetail = new FacultyDetail(
                data.get('email')?.toString() as string,
                data.get('phone_number')?.toString() as string,
                data.get('description')?.toString() as string,
            )
            const facultyDetailDocRef = doc(facultyDetailColRef, id);
            setDoc(facultyDetailDocRef, facultyDetail.getInterface());
            setcurrentFacultyDetail(facultyDetail);

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
                                    <button type="button" onClick={() => setOpen(false)} className="w-28 h-12 bg-red-500 flex justify-center items-center font-bold rounded-md hover:bg-red-700 text-white p-4">No</button>
                                    <button type="submit" className="w-28 h-12 bg-green-400 flex justify-center items-center font-bold rounded-md hover:bg-green-600 text-white p-4">Yes</button>
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
                const delFaculty = doc(facultyColRef, currentFacultyID);
                const delFacultyDetail = doc(facultyDetailColRef, currentFacultyID);

                await deleteDoc(delFacultyDetail)
                await deleteDoc(delFaculty).then(() => {
                    setFacultyList(facultyList.filter(item => item.id != currentFacultyID));
                })
            }
            const [open, setOpen] = useState<boolean>(false);
            return (
                <>
                    {open && <Model>
                        <div className="w-full h-full flex justify-center items-center">
                            <div className="w-fit h-fit p-8 gap-8 rounded-2xl bg-white border border-black border-solid flex flex-col justify-end items-end">
                                <h1 className="text-xl text-black font-bold">Bạn có chắc muốn xóa khoa này không ?</h1>
                                <div className="w-fit h-fit flex flex-row gap-8">
                                    <button type="button" onClick={() => delDoc()} className="w-28 h-12 bg-red-500 flex justify-center items-center font-bold rounded-md hover:bg-red-700 text-white p-4">Yes</button>
                                    <button type="button" onClick={() => setOpen(false)} className="w-28 h-12 bg-green-400 flex justify-center items-center font-bold rounded-md hover:bg-green-600 text-white p-4">No</button>
                                </div>
                            </div>
                        </div>
                    </Model>}
                    <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => setOpen(true)} className="w-fit h-fit ml-auto"><TrashIcon width={8} height={8} color="red" /></motion.button>
                </>
            )
        }

        return (
            <form className="w-full h-full max-md:hidden flex flex-col gap-2 overflow-hidden" onSubmit={submit}>

                <div className="w-full h-fit bg-primary rounded-t-2xl flex items-center justify-start text-white font-bold p-4 text-4xl">
                    Thông tin Khoa
                    {edit && <DeleteButton />}
                </div>
                {(currentFaculty && currentFacultyDetail) ? <div className="w-full h-full flex flex-col p-4 gap-8 text-xl overflow-scroll">
                    <div className="w-full h-fit flex flex-row items-center justify-between text-black font-bold gap-4">
                        <label htmlFor="name" className="min-w-52">Tên Khoa:</label>
                        <Input id="name" name="name" defaultValue={currentFaculty?.name} type="text" className="w-full text-base font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="code" className="min-w-52">Mã khoa:</label>
                        <Input id="code" name="code" defaultValue={currentFaculty?.code} type="text" className="w-full text-base font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="email" className="min-w-52">Email Khoa:</label>
                        <Input id="email" name="email" defaultValue={currentFacultyDetail?.email} type="text" className="w-full text-base font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="phone_number" className="min-w-52">SDT:</label>
                        <Input id="phone_number" name="phone_number" defaultValue={currentFacultyDetail?.phone_number} type="text" className="w-full text-base font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-col items-start justify-start text-black font-bold gap-4">
                        <label htmlFor="description" className="min-w-52">Mô tả:</label>
                        <TextArea id="description" name="description" className="w-full h-auto font-normal text-lg" defaultValue={currentFacultyDetail?.description} disable={!edit} />
                    </div>
                    <div className="w-full h-fit mt-auto flex items-center justify-start">
                        {edit ?
                            <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => setEdit(false)} className="w-fit h-fit bg-gray-400 hover:bg-gray-500 rounded-md text-white text-xl font-bold flex items-center justify-center px-4 py-2">Cancel</motion.button> :
                            <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => setEdit(true)} className="w-fit h-fit bg-primary hover:bg-blue-700 rounded-md text-white text-xl font-bold flex items-center justify-center px-4 py-2">Edit</motion.button>}

                        {edit && <ConfirmButton />}
                    </div>
                </div> : <div className="w-full h-full flex items-center justify-center"><LoadingIcon width={10} height={10} /></div>}

            </form>
        )
    }

    const PlaceHolder: React.FC = () => {
        return (
            <div className="w-full h-full max-md:hidden flex flex-col gap-2 ">
                <div className="w-full h-fit bg-primary rounded-t-2xl flex items-center justify-start text-white font-bold p-4 text-4xl">
                    Thông tin Khoa
                </div>
                <div className="w-full h-full flex flex-col p-4 gap-8 text-xl overflow-scroll">
                    <div className="w-full h-fit flex flex-row items-center justify-between text-black font-bold gap-4">
                        <label htmlFor="name" className="min-w-52">Tên Khoa:</label>
                        <Input id="name" name="name" type="text" className="w-full text-base font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="code" className="min-w-52">Mã khoa:</label>
                        <Input id="code" name="code" type="text" className="w-full text-base font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="email" className="min-w-52">Email Khoa:</label>
                        <Input id="email" name="email" type="text" className="w-full text-base font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="phone_number" className="min-w-52">SDT:</label>
                        <Input id="phone_number" name="phone_number" type="text" className="w-full text-base font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-col items-start justify-start text-black font-bold gap-4">
                        <label htmlFor="description" className="min-w-52">Mô tả:</label>
                        <TextArea id="description" name="description" className="w-full h-auto font-normal text-lg" disable />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {openFacultyForm && <FacultyForm setOpenFacultyForm={setOpenFacultyForm} />}
            <div className="w-full h-full flex items-center justify-center p-4">

                <div className="w-full h-full flex flex-row items-center justify-center gap-2">

                    <div className="w-6/12 max-md:w-full h-full flex flex-col">

                        <Header />

                        <div className="w-full h-full flex flex-col p-4 gap-0 overflow-hidden">
                            <div className="w-full h-16 grid grid-cols-10 p-4">

                                <div className="w-full h-full col-span-6 text-xl font-bold text-gray-default flex items-center">Khoa</div>

                                <div className="w-full h-full col-span-3 text-xl font-bold text-gray-default flex items-center">Mã khoa</div>

                                <div className="w-full h-full flex justify-center items-center">
                                    <motion.button whileTap={{ scale: .9 }} onClick={() => { setFacultyList([]); setReset(reset => !reset) }} className="hover:bg-gray-300 p-2 rounded-md">
                                        <RefreashIcon width={7} height={7} color="gray" />
                                    </motion.button>
                                </div>
                            </div>

                            <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>

                            <div className="w-full h-full flex flex-col p-0 overflow-scroll no-scrollbar">
                                {(() => {
                                    if (isLoading) {
                                        return <div className="w-full h-full flex items-center justify-center"><LoadingIcon width={10} height={10} /></div>
                                    } else if (facultyList.length == 0 && searchValue != '') {
                                        return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                            Không có khoa nào với code là {searchValue}!
                                        </div>
                                    } else if (facultyList.length == 0) {
                                        return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                            Hãy thêm gì đó!
                                        </div>
                                    }
                                    return facultyList.map((faculty, index) => {
                                        const class1 = "w-full h-14 max-md:h-20 grid grid-cols-10 p-4 gap-4 hover:bg-gray-200 bg-white";
                                        const class2 = "w-full h-14 max-md:h-20 grid grid-cols-10 p-4 gap-4 hover:bg-gray-200 bg-gray-100";
                                        return (
                                            <React.Fragment key={faculty.id}>
                                                <div className={(index % 2 != 0) ? class1 : class2}>

                                                    <div className="w-full h-full col-span-6 text-base font-bold text-black">{faculty.name}</div>

                                                    <div className="w-full h-full col-span-3 text-base font-bold text-black">{faculty.code}</div>

                                                    <motion.button
                                                        onClick={(e) => {
                                                            setcurrentFacultyID(e.currentTarget.getAttribute('data-key') as string);
                                                            setOpenFacultyInfor(true)
                                                        }}
                                                        data-key={faculty.id} whileTap={{ scale: .9 }} className="w-fit h-fit rounded-md flex justify-center items-center">
                                                        <InformationIcon width={6} height={6} color="gray" />
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
                        {openFacultyInfor ? <FacultyInfor /> : <PlaceHolder />}
                    </div>

                </div>

            </div>
        </>
    )
}
export default FacultyManagement