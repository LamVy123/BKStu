import { FormEvent, useEffect, useState } from "react";
import { Course, CourseFactory } from "../../../class&interface/Course";
import { useAuth } from "../../../context/AuthContext";
import { collection, doc, getDocs, or, query, where } from "firebase/firestore";
import { userDetaiColRef } from "../../../config/firebase";
import { motion } from "framer-motion";
import { LoadingIcon, RefreashIcon, SearchIcon } from "../../../assets/Icon";
import Input from "../../../component/Input";
import { useNavigate } from "react-router-dom";

interface CourseSelectProp {

}


const CourseSelect: React.FC<CourseSelectProp> = ({ }) => {

    const auth = useAuth()

    const navigate = useNavigate()

    const [isLoading, setLoading] = useState<boolean>(true);

    const [courseList, setCourseList] = useState<Course[]>([])

    const [reset, setReset] = useState<boolean>(false);

    const [searchValue, setSearchValue] = useState<string>('')

    useEffect(() => {
        const fetchCourseList = async () => {
            if (auth.userInfor.uid) {
                const student_uid = auth.userInfor.uid as string
                const studentDocRef = doc(userDetaiColRef, student_uid)
                const studentCourseCol = collection(studentDocRef, 'course')
                let studentCourseQuery = query(studentCourseCol)

                if (searchValue == '') {
                    studentCourseQuery = query(studentCourseQuery, where('status', '==', 'on_going'))
                } else {
                    studentCourseQuery = query(studentCourseQuery, or(where('subject_code', '==', searchValue), where('semester', '==', searchValue)))
                }

                let list: Course[] = [];
                const courseQuerrySnapshot = await getDocs(studentCourseQuery)
                const courseFactory = new CourseFactory();
                courseQuerrySnapshot.forEach((data) => {
                    list = [...list, courseFactory.CreateCourseWithDocumentData(data.data())]
                })
                setCourseList(list);
                setLoading(false)
            }
        }


        fetchCourseList();
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
                Các khóa học của tôi
            </div>
            <div className="w-6/12 min-h-128 h-128 border-solid border border-black rounded-md shadow-sm shadow-gray-700 flex flex-col items-start justify-start bg-snow">
                <div className="w-full flex items-center justify-between p-4 text-2xl font-bold bg-white rounded-md">
                    Danh sách khóa học
                    <form onSubmit={search} className="w-96 h-fit flex flex-row justify-center items-center gap-2">
                        <div className="h-10 flex justify-center items-center">
                            <motion.button whileTap={{ scale: 0.9 }} type="submit">
                                <SearchIcon width={8} height={8} color="black" />
                            </motion.button>
                        </div>
                        <Input type="search" name="search" id="search" className="w-full h-10 text-sm" defaultValue={searchValue} placeholder="Tìm kiếm mã môn hoặc học kì của khóa"></Input>
                        <motion.button whileTap={{ scale: .9 }} onClick={() => { setLoading(true); setReset(reset => !reset) }} className="hover:bg-gray-200 p-2 rounded-md">
                            <RefreashIcon width={7} height={7} color="gray" />
                        </motion.button>
                    </form>
                </div>
                <div className="w-full border-t border-b-0 border-black border-solid grid grid-cols-3" />
                {isLoading ?
                    <div className="w-full h-full flex justify-center items-center">
                        <LoadingIcon width={10} height={10} />
                    </div> :
                    <div className="w-full h-full flex justify-center items-center">
                        {(() => {
                            if (courseList.length == 0 && searchValue == '') {
                                return (
                                    <div className="w-full h-full flex justify-center items-center text-xl font-bold">
                                        Hiện tại không có khóa học nào!
                                    </div>
                                )
                            } else if (courseList.length == 0) {
                                return (
                                    <div className="w-full h-full flex justify-center items-center text-xl font-bold">
                                        Không có khóa học nào phù hợp với tìm kiếm của bạn!
                                    </div>
                                )
                            }
                            return (
                                <div className="w-full h-full grid grid-cols-3 gap-4 p-4">
                                    {
                                        courseList.map((clas) => {
                                            return (
                                                <div key={clas.id} className="col-span-1 w-full h-40 border border-gray-300 border-solid rounded-md flex flex-col hover:cursor-pointer hover:border-black"
                                                    onClick={() => {
                                                        if (clas.id != '') {
                                                            navigate('/my_course/' + clas.id)
                                                        }
                                                    }}>
                                                    <div className="w-full h-full col-span-1 bg-blue-300 rounded-t-md flex flex-col justify-center items-center font-bold text-xl">
                                                        <div>{clas.subject_name}</div>
                                                        <div>{clas.subject_code}</div>
                                                    </div>
                                                    <div className="w-full min-h-fit bg-white flex justify-center items-center p-4 gap-2 rounded-b-md text-base font-semibold">
                                                        <div>{clas.code}</div>
                                                        <div>-</div>
                                                        <div>{clas.semester}</div>
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

export default CourseSelect