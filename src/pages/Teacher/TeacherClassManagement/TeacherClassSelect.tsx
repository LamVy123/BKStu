import { FormEvent, useEffect, useState } from "react";
import { Class, ClassFactory } from "../../../class&interface/Class";
import { useAuth } from "../../../context/AuthContext";
import { collection, doc, getDocs, or, query, where } from "firebase/firestore";
import { userDetaiColRef } from "../../../config/firebase";
import { motion } from "framer-motion";
import { LoadingIcon, RefreashIcon, SearchIcon } from "../../../assets/Icon";
import Input from "../../../component/Input";
import { useNavigate } from "react-router-dom";

interface ClassSelectProp {

}


const ClassSelect: React.FC<ClassSelectProp> = ({ }) => {

    const auth = useAuth()

    const navigate = useNavigate()

    const [isLoading, setLoading] = useState<boolean>(true);

    const [classList, setClassList] = useState<Class[]>([])

    const [reset, setReset] = useState<boolean>(false);

    const [searchValue, setSearchValue] = useState<string>('')

    useEffect(() => {
        const fetchClassList = async () => {
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
    }, [reset, searchValue, auth.userInfor.uid])

    const search = (e: FormEvent) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget as HTMLFormElement)
        const value = data.get("search")?.toString() as string
        setSearchValue(value)
    }


    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="w-6/12 h-full text-start font-bold text-4xl py-10">
                Các lớp học của tôi
            </div>
            <div className="w-6/12 min-h-128 h-128 border-solid border border-black rounded-md shadow-sm shadow-gray-700 flex flex-col items-start justify-start bg-snow">
                <div className="w-full flex items-center justify-between p-4 text-2xl font-bold bg-white rounded-md">
                    Danh sách lớp học
                    <form onSubmit={search} className="w-96 h-fit flex flex-row justify-center items-center gap-2">
                        <div className="h-10 flex justify-center items-center">
                            <motion.button whileTap={{ scale: 0.9 }} type="submit">
                                <SearchIcon width={8} height={8} color="black" />
                            </motion.button>
                        </div>
                        <Input type="search" name="search" id="search" className="w-full h-10 text-sm" defaultValue={searchValue} placeholder="Tìm kiếm bằng mã hoặc niên khóa của lớp"></Input>
                    </form>
                    <motion.button whileTap={{ scale: .9 }} onClick={() => { setLoading(true); setReset(reset => !reset) }} className="hover:bg-gray-200 p-2 rounded-md">
                        <RefreashIcon width={7} height={7} color="gray" />
                    </motion.button>
                </div>
                <div className="w-full border-t border-b-0 border-black border-solid grid grid-cols-3" />
                {isLoading ?
                    <div className="w-full h-full flex justify-center items-center">
                        <LoadingIcon width={10} height={10} />
                    </div> :
                    <div className="w-full h-full flex justify-center items-center">
                        {(() => {
                            if (classList.length == 0 && searchValue == '') {
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
                            return (
                                <div className="w-full h-full grid grid-cols-3 gap-4 p-4">
                                    {
                                        classList.map((clas) => {
                                            return (
                                                <div key={clas.id} className="col-span-1 h-40 border border-gray-300 border-solid rounded-md flex flex-col hover:cursor-pointer hover:border-black"
                                                    onClick={() => {
                                                        if (clas.id != '') {
                                                            navigate('/class_management/' + clas.id)
                                                        }
                                                    }}>
                                                    <div className="w-full h-full col-span-1 bg-blue-300 rounded-t-md flex justify-center items-center font-bold text-2xl">
                                                        {clas.code}
                                                    </div>
                                                    <div className="w-full min-h-fit bg-white flex items-center p-4 rounded-b-md text-base font-semibold">
                                                        {clas.majors + ' - ' + clas.academic_year}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        }
                        )()}
                    </div>}
            </div>
        </div>
    )
}

export default ClassSelect