import Input from "../../../../component/Input"
import { SearchIcon, PlusIcon, RefreashIcon, InformationIcon, TrashIcon, LoadingIcon } from "../../../../assets/Icon"
import { motion } from "framer-motion"
import MajorsForm from "./MajorsForm"
import React, { useEffect, useState, FormEvent } from "react"
import { Majors, MajorsDetail, MajorsDetailFactory, MajorsFactory } from "../../../../class&interface/Majors"
import { getDocs, query, getDoc, doc, setDoc, deleteDoc, where, getCountFromServer, or } from "firebase/firestore"
import { majorsColRef, majorsDetailColRef } from "../../../../config/firebase"
import TextArea from "../../../../component/TextArea"
import Model from "../../../../component/Model"

const MajorsManagement: React.FC = () => {
    const [openMajorsForm, setOpenMajorsForm] = useState<boolean>(false);

    const [openMajorsInfor, setOpenMajorsInfor] = useState<boolean>(false);

    const [reset, setReset] = useState<boolean>(false);

    const [majorsList, setMajorsList] = useState<Majors[]>([])

    const [currentMajorsID, setcurrentMajorsID] = useState<string>('');

    const [searchValue, setSearchValue] = useState<string>('');

    const [isLoading, setLoading] = useState<boolean>(true);

    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const fetchMajorsList = async () => {
            setCount((await getCountFromServer(majorsColRef)).data().count);
            let majorsQuerry = query(majorsColRef);

            if (searchValue.toUpperCase() == '@ALL') {
                //Do nothing
            } else if (searchValue != '') {
                majorsQuerry = query(majorsQuerry, or(where('code', '==', searchValue), where('faculty_code', '==', searchValue)));
            }

            let list: Majors[] = [];
            const majorsQuerrySnapshot = await getDocs(majorsQuerry)
            const majorsFactory = new MajorsFactory();
            majorsQuerrySnapshot.forEach((doc) => {
                list = [...list, majorsFactory.CreateMajorsWithDocumentData(doc.data())]
            })
            setMajorsList(list);
            setLoading(false)
        }

        fetchMajorsList();
    }, [reset, searchValue])

    const Header: React.FC = () => {
        const search = (e: FormEvent) => {
            e.preventDefault();

            const data = new FormData(e.currentTarget as HTMLFormElement)

            const value = data.get("search")?.toString() as string

            setSearchValue(value)

            setOpenMajorsInfor(false);
        }

        return (
            <div className="w-full h-fit flex flex-row max-md:flex-col p-2 gap-4 items-center max-md:items-end ml-auto">

                <div className="w-full h-fit flex flex-row items-center gap-16 max-md:gap-8">

                    <div className="h-fit w-fit flex flex-col">
                        <h1 className="text-4xl font-bold">Ngành</h1>
                        <h1 className="text-base max-md:text-xs text-gray-default">{count} Ngành</h1>
                    </div>

                    <form onSubmit={search} className="w-full h-fit flex flex-row justify-center items-end gap-2">
                        <div className="h-10 flex justify-center items-center">
                            <motion.button whileTap={{ scale: 0.9 }} type="submit">
                                <SearchIcon width={8} height={8} color="black" />
                            </motion.button>
                        </div>
                        <Input type="search" name="search" id="search" className="w-full h-10 text-sm" defaultValue={searchValue} placeholder="Tìm kiếm bằng mã ngành, mã khoa"></Input>
                    </form>

                </div>

                <motion.button
                    className="min-w-fit h-10 bg-primary rounded flex justify-center items-center font-bold text-base"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpenMajorsForm(true)}
                >
                    <div className="w-full h-full bg-blue-500 rounded-l hover:bg-primary flex items-center justify-center p-2 text-white">
                        Thêm ngành mới
                    </div>
                    <div className=" flex justify-center items-center p-2">
                        <PlusIcon width={7} height={7} color="white" />
                    </div>
                </motion.button>
            </div>
        )
    }

    const MajorsInfor: React.FC = () => {
        const [currentMajors, setcurrentMajors] = useState<Majors>();
        const [currentMajorsDetail, setcurrentMajorsDetail] = useState<MajorsDetail>();
        const [edit, setEdit] = useState<boolean>(false);

        useEffect(() => {
            const fetchMajors = async () => {
                const majorsDoc = doc(majorsColRef, currentMajorsID)
                const majorsFactory = new MajorsFactory()
                await getDoc(majorsDoc).then((doc) => {
                    setcurrentMajors(majorsFactory.CreateMajorsWithDocumentData(doc.data()))
                })

                const majorsDetailDoc = doc(majorsDetailColRef, currentMajorsID)
                const majorsDetailFactory = new MajorsDetailFactory()
                await getDoc(majorsDetailDoc).then((doc) => {
                    setcurrentMajorsDetail(majorsDetailFactory.CreateMajorsDetailWithDocumentData(doc.data()))
                })

            }
            fetchMajors();

        }, [currentMajorsID])

        const submit = async (e: FormEvent) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget as HTMLFormElement)

            const id = currentMajorsID;
            const majorsDocRef = doc(majorsColRef, id);
            const majors = new Majors(
                data.get('name')?.toString() as string,
                data.get('code')?.toString() as string,
                id,
                currentMajors?.faculty_code.toString() as string,
            )
            setDoc(majorsDocRef, majors.getInterface());
            setcurrentMajors(majors);


            const majorsDetail = new MajorsDetail(
                currentMajorsDetail?.faculty.toString() as string,
                currentMajorsDetail?.degree_type.toString() as string,
                parseInt(data.get('required_credits')?.toString() as string),
                data.get('duration')?.toString() as string,
                data.get('description')?.toString() as string,
            )
            const majorsDetailDocRef = doc(majorsDetailColRef, id);
            setDoc(majorsDetailDocRef, majorsDetail.getInterface());
            setcurrentMajorsDetail(majorsDetail);


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
                const delMajors = doc(majorsColRef, currentMajorsID);
                const delMajorsDetail = doc(majorsDetailColRef, currentMajorsID);

                await deleteDoc(delMajorsDetail)
                await deleteDoc(delMajors).then(() => {
                    setMajorsList(majorsList.filter(item => item.id != currentMajorsID));
                })
                setOpenMajorsForm(false)
            }
            const [open, setOpen] = useState<boolean>(false);
            return (
                <>
                    {open && <Model>
                        <div className="w-full h-full flex justify-center items-center">
                            <div className="w-fit h-fit p-8 gap-8 rounded-2xl bg-white border border-black border-solid flex flex-col justify-end items-end">
                                <h1 className="text-xl text-black font-bold">Bạn có chắc muốn xóa ngành này không ?</h1>
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

        return (
            <form className="w-full h-full max-md:hidden flex flex-col gap-2 p-2 overflow-scroll" onSubmit={submit}>

                <div className="w-full h-fit bg-primary rounded-t-2xl flex items-center justify-start text-white font-bold p-4 text-4xl">
                    Thông tin ngành
                    {edit && <DeleteButton />}
                </div>
                {(currentMajors && currentMajorsDetail) ? <div className="w-full h-full flex flex-col p-4 gap-8 text-xl overflow-scroll">
                    <div className="w-full h-fit flex flex-row items-center justify-between text-black font-bold gap-4">
                        <label htmlFor="name" className="min-w-52">Tên ngành:</label>
                        <Input id="name" name="name" defaultValue={currentMajors?.name} type="text" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="code" className="min-w-52">Mã ngành:</label>
                        <Input id="code" name="code" defaultValue={currentMajors?.code} type="text" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="faculty" className="min-w-52">Khoa:</label>
                        <Input id="faculty" name="faculty" defaultValue={currentMajorsDetail?.faculty} type="text" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="faculty_code" className="min-w-52">Mã khoa:</label>
                        <Input id="faculty_code" name="faculty_code" defaultValue={currentMajors?.faculty_code} type="text" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="degree_type" className="min-w-52">Văn bằng tốt nghiệp:</label>
                        <Input id="degree_type" name="degree_type" defaultValue={currentMajorsDetail?.degree_type} type="text" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="required_credits" className="min-w-52">Số tín chỉ yêu cầu:</label>
                        <Input id="required_credits" name="required_credits" defaultValue={currentMajorsDetail?.required_credits ? parseInt(currentMajorsDetail?.required_credits.toString()) : 0} type="number" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="duration" className="min-w-52">Thời gian hoàn thành:</label>
                        <Input id="duration" name="duration" defaultValue={currentMajorsDetail?.duration} type="text" className="w-full font-normal" disable={!edit} />
                    </div>
                    <div className="w-full h-fit flex flex-col items-start justify-start text-black font-bold gap-4">
                        <label htmlFor="description" className="min-w-52">Mô tả:</label>
                        <TextArea id="description" name="description" className="w-full h-auto font-normal text-xl" defaultValue={currentMajorsDetail?.description} disable={!edit} />
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
            <div className="w-full h-full max-md:hidden flex flex-col gap-2 p-2">
                <div className="w-full h-fit bg-primary rounded-t-2xl flex items-center justify-start text-white font-bold p-4 text-4xl">
                    Thông tin ngành
                </div>
                <div className="w-full h-full flex flex-col p-4 gap-8 text-xl overflow-scroll">
                    <div className="w-full h-fit flex flex-row items-center justify-between text-black font-bold gap-4">
                        <label htmlFor="name" className="min-w-52">Tên ngành:</label>
                        <Input id="name" name="name" type="text" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="code" className="min-w-52">Mã ngành:</label>
                        <Input id="code" name="code" type="text" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="faculty" className="min-w-52">Khoa:</label>
                        <Input id="faculty" name="faculty" type="text" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="degree_type" className="min-w-52">Văn bằng tốt nghiệp:</label>
                        <Input id="degree_type" name="degree_type" type="text" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="required_credits" className="min-w-52">Số tín chỉ yêu cầu:</label>
                        <Input id="required_credits" name="required_credits" type="text" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="duration" className="min-w-52">Thời gian hoàn thành:</label>
                        <Input id="duration" name="duration" type="text" className="w-full font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-col items-start justify-start text-black font-bold gap-4">
                        <label htmlFor="description" className="min-w-52">Mô tả:</label>
                        <TextArea id="description" name="description" className="w-full h-auto font-normal text-xl" disable />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {openMajorsForm && <MajorsForm setOpenMajorsForm={setOpenMajorsForm} />}
            <div className="w-full h-full flex items-center justify-center p-4 bg-snow">

                <div className="w-full h-full flex flex-row items-center justify-center gap-2">

                    <div className="w-6/12 max-md:w-full h-full flex flex-col">

                        <Header />

                        <div className="w-full h-full flex flex-col p-4 gap-0 overflow-hidden">
                            <div className="w-full h-16 grid grid-cols-10 p-4">

                                <div className="w-full h-full col-span-5 text-xl font-bold text-gray-default flex items-center">Ngành</div>

                                <div className="w-full h-full col-span-4 text-xl font-bold text-gray-default flex items-center">Mã ngành</div>

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
                                    } else if (majorsList.length == 0 && searchValue != '') {
                                        return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                            Không có ngành nào với mã là {searchValue}!
                                        </div>
                                    } else if (count == 0) {
                                        return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                            Hãy thêm gì đó!
                                        </div>
                                    }
                                    return majorsList.map((faculty, index) => {
                                        const class1 = "w-full h-14 max-md:h-20 grid grid-cols-10 p-4 gap-4 hover:bg-gray-50 bg-snow";
                                        const class2 = "w-full h-14 max-md:h-20 grid grid-cols-10 p-4 gap-4 hover:bg-gray-50 bg-white";
                                        return (
                                            <React.Fragment key={faculty.id}>
                                                <div className={(index % 2 != 0) ? class1 : class2}>

                                                    <div className="w-full h-full col-span-5 text-base font-bold text-black">{faculty.name}</div>

                                                    <div className="w-full h-full col-span-4 text-base font-bold text-black">{faculty.code}</div>

                                                    <motion.button
                                                        onClick={(e) => {
                                                            setcurrentMajorsID(e.currentTarget.getAttribute('data-key') as string);
                                                            setOpenMajorsInfor(true)
                                                        }}
                                                        data-key={faculty.id} whileTap={{ scale: .9 }} className="w-fit h-fit rounded-md flex justify-center items-center">
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
                        {openMajorsInfor ? <MajorsInfor /> : <PlaceHolder />}
                    </div>

                </div>

            </div>
        </>
    )
}
export default MajorsManagement