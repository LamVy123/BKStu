import Input from "../../../../component/Input"
import { SearchIcon, PlusIcon, RefreashIcon, InformationIcon, TrashIcon, LoadingIcon } from "../../../../assets/Icon"
import { motion } from "framer-motion"
import ClassForm from "./ClassForm"
import React, { useEffect, useState, FormEvent } from "react"
import { Class, ClassDetail, ClassFactory } from "../../../../class&interface/Class"
import { getDocs, query, getDoc, doc, setDoc, deleteDoc, where, getCountFromServer, or, collection } from "firebase/firestore"
import { classColRef, classDetailColRef } from "../../../../config/firebase"
import TextArea from "../../../../component/TextArea"
import Model from "../../../../component/Model"
import { Student, UserFactory } from "../../../../class&interface/User"

const ClassManagement: React.FC = () => {
    const [openClassForm, setOpenClassForm] = useState<boolean>(false);

    const [openClassInfor, setOpenClassInfor] = useState<boolean>(false);

    const [reset, setReset] = useState<boolean>(false);

    const [classList, setClassList] = useState<Class[]>([])

    const [currentClassID, setcurrentClassID] = useState<string>('');

    const [searchValue, setSearchValue] = useState<string>('')

    const [isLoading, setLoading] = useState<boolean>(true);

    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const fetchClassList = async () => {
            setLoading(true);
            setCount((await getCountFromServer(classColRef)).data().count);
            let classQuerry = query(classColRef);

            if (searchValue != '') {
                classQuerry = query(classQuerry, or(where('code', '==', searchValue), where('majors', '==', searchValue)));
            }

            let list: Class[] = [];
            const classQuerrySnapshot = await getDocs(classQuerry)
            const classFactory = new ClassFactory();
            classQuerrySnapshot.forEach((doc) => {
                list = [...list, classFactory.CreateClassWithDocumentData(doc.data())]
            })
            setClassList(list);
            setLoading(false)
        }

        fetchClassList();
    }, [reset, searchValue])

    const Header: React.FC = () => {
        const search = (e: FormEvent) => {
            e.preventDefault();

            const data = new FormData(e.currentTarget as HTMLFormElement)

            const value = data.get("search")?.toString() as string

            setSearchValue(value)

            setOpenClassInfor(false);
        }

        return (
            <div className="w-full h-fit flex flex-row max-md:flex-col p-2 gap-4 items-center max-md:items-end ml-auto">

                <div className="w-full h-fit flex flex-row items-center gap-20 max-md:gap-8">

                    <div className="h-fit w-fit flex flex-col">
                        <h1 className="text-4xl max-md:text-3xl font-bold">Lớp</h1>
                        <h1 className="text-base max-md:text-xs text-gray-default">{count} Lớp</h1>
                    </div>

                    <form onSubmit={search} className="w-full h-fit flex flex-row justify-center items-center gap-2">
                        <div className="h-10 flex justify-center items-center">
                            <motion.button whileTap={{ scale: 0.9 }} type="submit">
                                <SearchIcon width={8} height={8} color="black" />
                            </motion.button>
                        </div>
                        <Input type="search" name="search" id="search" className="w-full h-10 text-sm" defaultValue={searchValue} placeholder="Tìm kiếm bằng mã của lớp"></Input>
                    </form>

                </div>

                <motion.button
                    className="min-w-fit h-10 bg-gray-200 hover:bg-gray-300 rounded flex flex-row justify-center items-center p-2 gap-2 font-bold max-md:text-xs"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpenClassForm(true)}
                >
                    <PlusIcon width={5} height={5} color="black" />
                    Thêm Lớp mới
                </motion.button>
            </div>
        )
    }

    const ClassInfor: React.FC = () => {
        const [currentClass, setcurrentClass] = useState<Class>()
        const [currentClassDetail, setcurrentClassDetail] = useState<ClassDetail>()
        const [currentStudentList, setCurrentStudentList] = useState<Student[]>()

        useEffect(() => {
            const fetchClass = async () => {
                const classDoc = doc(classColRef, currentClassID)
                await getDoc(classDoc).then((doc) => {
                    setcurrentClass(new Class(
                        doc.data()?.id,
                        doc.data()?.code,
                        doc.data()?.majors,
                    ))
                })

                const classDetailDoc = doc(classDetailColRef, currentClassID)
                await getDoc(classDetailDoc).then((doc) => {
                    setcurrentClassDetail(new ClassDetail(
                        doc.data()?.academic_year,
                        doc.data()?.faculty,
                        doc.data()?.teacher_name,
                    ))
                })

                const studentListCol = collection(classDetailDoc, 'student_list');
                const student_query = await getDocs(query(studentListCol));
                let list: Student[] = []
                const studentFactory = new UserFactory();
                student_query.forEach((student) => {
                    list = [...list, studentFactory.CreateUserWithDocumentData('student', student.data()) as Student]
                })
                setCurrentStudentList(list);

            }
            fetchClass();

        }, [currentClassID])


        return (
            <form className="w-full h-full max-md:hidden flex flex-col gap-2 overflow-hidden">

                <div className="w-full h-fit bg-primary rounded-t-2xl flex items-center justify-start text-white font-bold p-4 text-4xl">
                    Thông tin Lớp
                </div>
                {(currentClass && currentClassDetail) ? <div className="w-full h-full flex flex-col p-4 gap-8 text-xl overflow-scroll">
                    <div className="w-full h-fit flex flex-row items-center justify-between text-black font-bold gap-4">
                        <label htmlFor="code" className="min-w-52">Mã lớp:</label>
                        <Input id="code" name="code" defaultValue={currentClass?.code} type="text" className="w-full text-base font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="academic_year" className="min-w-52">Niên khóa:</label>
                        <Input id="academic_year" name="academic_year" defaultValue={currentClassDetail?.academic_year} type="text" className="w-full text-base font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="faculty" className="min-w-52">Khoa:</label>
                        <Input id="faculty" name="faculty" defaultValue={currentClassDetail?.faculty} type="text" className="w-full text-base font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="majors" className="min-w-52">Ngành:</label>
                        <Input id="majors" name="majors" defaultValue={currentClass?.majors} type="text" className="w-full text-base font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="teacher_name" className="min-w-52">Giáo viên chủ nhiệm:</label>
                        <Input id="teacher_name" name="teacher_name" defaultValue={currentClassDetail?.teacher_name} type="text" className="w-full text-base font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-col items-start justify-start text-black font-bold gap-4">
                        <label htmlFor="teacher_name" className="min-w-52">Sinh viên:</label>
                        {currentStudentList?.map((student) => {
                            return (
                                <div key={student.uid} className="w-full h-fit p-2 grid grid-cols-12 text-base font-normal border-2 border-solid border-gray-300 rounded-md">
                                    <div className="col-span-4">{student.last_name + " " + student.middle_name + " " + student.first_name}</div>
                                    <div className="col-span-4">{student.display_id}</div>
                                    <div className="col-span-4">{student.email}</div>
                                </div>
                            )
                        })}
                    </div>
                </div> : <div className="w-full h-full flex items-center justify-center"><LoadingIcon width={10} height={10} /></div>}

            </form>
        )
    }

    const PlaceHolder: React.FC = () => {
        return (
            <div className="w-full h-full max-md:hidden flex flex-col gap-2 ">
                <div className="w-full h-fit bg-primary rounded-t-2xl flex items-center justify-start text-white font-bold p-4 text-4xl">
                    Thông tin Lớp
                </div>
                <div className="w-full h-full flex flex-col p-4 gap-8 text-xl overflow-scroll">
                    <div className="w-full h-fit flex flex-row items-center justify-between text-black font-bold gap-4">
                        <label htmlFor="code" className="min-w-52">Mã Lớp:</label>
                        <Input id="code" name="code" type="text" className="w-full text-base font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="academic_year" className="min-w-52">Giáo viên chủ nhiệm:</label>
                        <Input id="academic_year" name="academic_year" type="text" className="w-full text-base font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="faculty" className="min-w-52">Khoa:</label>
                        <Input id="faculty" name="faculty" type="text" className="w-full text-base font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="majors" className="min-w-52">Ngành:</label>
                        <Input id="majors" name="majors" type="text" className="w-full text-base font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-row items-center justify-start text-black font-bold gap-4">
                        <label htmlFor="teacher_name" className="min-w-52">Giáo viên chủ nhiệm:</label>
                        <Input id="teacher_name" name="teacher_name" type="text" className="w-full text-base font-normal" disable />
                    </div>
                    <div className="w-full h-fit flex flex-col items-start justify-start text-black font-bold gap-4">
                        <label htmlFor="teacher_name" className="min-w-52">Sinh viên:</label>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {openClassForm && <ClassForm setOpenClassForm={setOpenClassForm} />}
            <div className="w-full h-full flex items-center justify-center p-4">

                <div className="w-full h-full flex flex-row items-center justify-center gap-2">

                    <div className="w-6/12 max-md:w-full h-full flex flex-col">

                        <Header />

                        <div className="w-full h-full flex flex-col p-4 gap-0 overflow-hidden">
                            <div className="w-full h-16 grid grid-cols-10 p-4">

                                <div className="w-full h-full col-span-5 text-xl font-bold text-gray-default flex items-center">Mã Lớp</div>

                                <div className="w-full h-full col-span-4 text-xl font-bold text-gray-default flex items-center">Ngành</div>

                                <div className="w-full h-full flex justify-center items-center">
                                    <motion.button whileTap={{ scale: .9 }} onClick={() => { setClassList([]); setReset(reset => !reset) }} className="hover:bg-gray-300 p-2 rounded-md">
                                        <RefreashIcon width={7} height={7} color="gray" />
                                    </motion.button>
                                </div>
                            </div>

                            <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>

                            <div className="w-full h-full flex flex-col p-0 overflow-scroll no-scrollbar">
                                {(() => {
                                    if (isLoading) {
                                        return <div className="w-full h-full flex items-center justify-center"><LoadingIcon width={10} height={10} /></div>
                                    } else if (classList.length == 0 && searchValue != '') {
                                        return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                            Không có lớp nào với mã là {searchValue}!
                                        </div>
                                    } else if (classList.length == 0) {
                                        return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                            Hãy thêm gì đó!
                                        </div>
                                    }
                                    return classList.map((classes, index) => {
                                        const class1 = "w-full h-14 max-md:h-20 grid grid-cols-10 p-4 hover:bg-gray-200 bg-white";
                                        const class2 = "w-full h-14 max-md:h-20 grid grid-cols-10 p-4 hover:bg-gray-200 bg-gray-100";
                                        return (
                                            <React.Fragment key={classes.id}>
                                                <div className={(index % 2 != 0) ? class1 : class2}>

                                                    <div className="w-full h-full col-span-5 text-base font-bold text-black">{classes.code}</div>

                                                    <div className="w-full h-full col-span-4 text-base font-bold text-black">{classes.majors}</div>

                                                    <motion.button
                                                        onClick={(e) => {
                                                            setcurrentClassID(e.currentTarget.getAttribute('data-key') as string);
                                                            setOpenClassInfor(true)
                                                        }}
                                                        data-key={classes.id} whileTap={{ scale: .9 }} className="w-fit h-fit rounded-md flex justify-center items-center">
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
                        {openClassInfor ? <ClassInfor /> : <PlaceHolder />}
                    </div>

                </div>

            </div>
        </>
    )
}
export default ClassManagement