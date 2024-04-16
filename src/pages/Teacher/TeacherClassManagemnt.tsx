import { Class, ClassFactory } from "../../class&interface/Class";
import Container from "../../component/Container";
import { useState, useEffect, FormEvent } from "react";
import { userDetaiColRef } from "../../config/firebase";
import { query, where, getDocs, getCountFromServer, doc, collection, or } from "firebase/firestore"
import { useAuth } from "../../context/AuthContext";
import { LoadingIcon, RefreashIcon, SearchIcon } from "../../assets/Icon";
import { motion } from "framer-motion";
import Input from "../../component/Input";



const TeacherClassManagement: React.FC = () => {

    const auth = useAuth()

    const [currentClassID, setCurrentClassID] = useState<string>('')

    const ClassSelect: React.FC = () => {

        const [isLoading, setLoading] = useState<boolean>(true);

        const [classList, setClassList] = useState<Class[]>([])

        const [reset, setReset] = useState<boolean>(false);

        const [count, setCount] = useState<number>(0);

        const [searchValue, setSearchValue] = useState<string>('')

        useEffect(() => {
            const fetchClassList = async () => {
                setLoading(true);

                if (auth.userInfor.uid) {
                    const teacher_uid = auth.userInfor.uid as string
                    const teacherDocRef = doc(userDetaiColRef, teacher_uid)
                    const teacherClassCol = collection(teacherDocRef, 'class')
                    let teacherClassQuery = query(teacherClassCol)

                    if (searchValue == '') {
                        teacherClassQuery = query(teacherClassQuery, where('status', '==', 'on_going'))
                    } else {
                        teacherClassQuery = query(teacherClassQuery, or(where('code', '==', searchValue), where('academic_year', '==', searchValue)))
                    }

                    setCount((await getCountFromServer(teacherClassQuery)).data().count);

                    let list: Class[] = [];
                    const classQuerrySnapshot = await getDocs(teacherClassQuery)
                    const classFactory = new ClassFactory();
                    classQuerrySnapshot.forEach((data) => {
                        list = [...list, classFactory.CreateClassWithDocumentData(data.data())]
                    })
                    setClassList(list);
                    setLoading(false)
                }
            }

            fetchClassList();
        }, [reset, searchValue])

        const search = (e: FormEvent) => {
            e.preventDefault();

            const data = new FormData(e.currentTarget as HTMLFormElement)

            const value = data.get("search")?.toString() as string

            setSearchValue(value)

        }


        return (
            <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="w-6/12 text-start font-bold text-4xl py-10">
                    Các lớp học của tôi
                </div>
                <div className="w-6/12 h-full border-solid border border-black rounded-md shadow-sm shadow-gray-700 flex flex-col items-start justify-start bg-gray-100">
                    <div className="w-full flex items-center justify-between p-4 text-2xl font-bold bg-white rounded-md">
                        Danh sách lớp học
                        <form onSubmit={search} className="w-96 h-fit flex flex-row justify-center items-center gap-2">
                            <div className="h-10 flex justify-center items-center">
                                <motion.button whileTap={{ scale: 0.9 }} type="submit">
                                    <SearchIcon width={8} height={8} color="black" />
                                </motion.button>
                            </div>
                            <Input type="search" name="search" id="search" className="w-full h-10 text-sm" defaultValue={searchValue} placeholder="Tìm kiếm bằng code hoặc niên khóa của lớp"></Input>
                        </form>
                        <motion.button whileTap={{ scale: .9 }} onClick={() => { setClassList([]); setReset(reset => !reset) }} className="hover:bg-gray-300 p-2 rounded-md">
                            <RefreashIcon width={7} height={7} color="gray" />
                        </motion.button>
                    </div>
                    <div className="w-full border-t border-b-0 border-black border-solid" />
                    {(() => {

                        if (isLoading) {
                            return (
                                <div className="w-full h-full flex justify-center items-center">
                                    <div className="w-full h-full flex items-center justify-center"><LoadingIcon width={10} height={10} /></div>
                                </div>
                            )
                        } else if (classList.length == 0 && searchValue == '') {
                            return (
                                <div className="w-full h-full flex justify-center items-center text-xl font-bold">
                                    Hiện tại không có lớp học nào!
                                </div>
                            )
                        } else if (classList.length == 0) {
                            return (
                                <div className="w-full h-full flex justify-center items-center text-xl font-bold">
                                    Không có lớp học nào phù hợp với tìm kiếm của bạn!
                                </div>
                            )
                        }

                        return classList.map((clas) => {
                            return (
                                <div className="w-full h-fit p-4 gap-4 grid grid-cols-3" onClick={() => { setCurrentClassID(clas.id) }}>
                                    <div key={clas.id} className="w-full h-40 border border-transparent border-solid rounded-md flex flex-col hover:cursor-pointer hover:border-black">
                                        <div className="w-full h-full bg-blue-300 rounded-t-md flex justify-center items-center font-bold text-2xl">
                                            {clas.code}
                                        </div>
                                        <div className="w-full min-h-fit bg-white flex items-center p-4 rounded-md text-base font-semibold">
                                            {clas.majors + ' - ' + clas.academic_year}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    )()}
                </div>
            </div>
        )
    }

    const Class: React.FC = () => {
        return (
            <div className="w-full h-full border-solid border border-black rounded-md shadow-sm bg-white shadow-gray-700 flex items-center justify-center">
                <h1>Teacher Class </h1>
            </div>
        )
    }

    const Body: React.FC = () => {

        return (
            <ClassSelect />
        )
    }

    return (
        <Container>
            <div className="w-full h-full flex items-center justify-center p-4 bg-white">
                <Body />
            </div>
        </Container>
    )
}

export default TeacherClassManagement