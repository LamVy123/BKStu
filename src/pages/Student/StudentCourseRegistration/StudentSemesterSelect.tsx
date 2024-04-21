import React, { FormEvent, useEffect, useState } from "react";
import { Semester, SemesterFactory } from "../../../class&interface/Semester";
import { semesterColRef } from "../../../config/firebase";
import { getDocs, or, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { LoadingIcon, RefreashIcon, SearchIcon } from "../../../assets/Icon";
import Input from "../../../component/Input";
import { useNavigate } from "react-router-dom";

interface SemesterSelectProp {
    setcurrentSemester: React.Dispatch<React.SetStateAction<Semester | undefined>>
}

const SemesterSelect: React.FC<SemesterSelectProp> = ({ setcurrentSemester }) => {

    const navigate = useNavigate()

    const [semesterList, setSemesterList] = useState<Semester[]>([])

    const [reset, setReset] = useState<boolean>(false);

    const [isLoading, setLoading] = useState<boolean>(true);

    const [searchValue, setSearchValue] = useState<string>('')

    const Header: React.FC = () => {
        return (
            <div className="w-6/12 h-fit flex flex-row max-md:flex-col p-8 gap-4 items-center">
                <div className="h-fit w-full flex items-center justify-center">
                    <h1 className="text-5xl font-bold w-full text-center">Đăng kí khóa học</h1>
                </div>
            </div>
        )
    }

    const search = (e: FormEvent) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget as HTMLFormElement)

        const value = data.get("search")?.toString() as string

        console.log(value)

        setSearchValue(value)

    }

    useEffect(() => {
        const fetchSemesterList = async () => {
            setLoading(true);
            let semesterQuerry = query(semesterColRef, or(where('status', '==', 'open'), where('status', '==', 'on_going'), where('status', '==', 'end')));

            if (searchValue.toUpperCase() == '@ALL') {

            } else if (searchValue != '') {
                semesterQuerry = query(semesterQuerry, or(where('code', '==', searchValue), where('academic_year', '==', searchValue)))
            } else {
                semesterQuerry = query(semesterQuerry, where('status', '==', 'open'))
            }

            let list: Semester[] = [];
            try {
                const semesterQuerrySnapshot = await getDocs(semesterQuerry)
                const semesterFactory = new SemesterFactory();
                semesterQuerrySnapshot.forEach((doc) => {
                    list = [...list, semesterFactory.CreateSemesterWithDocumentData(doc.data())]
                })
            } catch { }
            setSemesterList(list);
            setLoading(false)
        }

        fetchSemesterList();
    }, [reset, searchValue])

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <Header />
            <div className="w-8/12 max-md:w-full h-full flex flex-col bg-snow border border-black border-solid rounded-md shadow-md shadow-gray-default">

                <div className=" w-6/12 h-fit p-4">
                    <form onSubmit={search} className="w-full h-fit flex flex-row justify-center items-center gap-2">
                        <div className="h-10 flex justify-center items-center">
                            <motion.button whileTap={{ scale: 0.9 }} type="submit">
                                <SearchIcon width={8} height={8} color="black" />
                            </motion.button>
                        </div>
                        <Input type="search" name="search" id="search" className="w-full h-10 text-sm" defaultValue={searchValue} placeholder="Tìm kiếm bằng mã học kì, niên khóa hoặc @all"></Input>
                    </form>
                </div>

                <div className="w-full h-full flex flex-col p-4 gap-0 overflow-hidden">
                    <div className="w-full h-16 grid grid-cols-12 p-4">

                        <div className="w-full h-full col-span-2 text-xl font-bold text-gray-default flex items-center">Mã học kì</div>

                        <div className="w-full h-full col-span-2 text-xl font-bold text-gray-default flex items-center justify-center">Niên khóa</div>

                        <div className="w-full h-full col-span-5 text-xl font-bold text-gray-default flex items-center justify-center">Mô tả</div>

                        <div className="w-full h-full col-span-2 text-xl font-bold text-gray-default flex items-center justify-center">Trạng thái</div>

                        <div className="w-full h-full flex justify-center items-center">
                            <motion.button whileTap={{ scale: .9 }} onClick={() => { setSemesterList([]); setReset(reset => !reset) }} className="hover:bg-gray-200 p-2 rounded-md">
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
                                    Không có học kì nào phù hợp với tìm kiếm của bạn!
                                </div>
                            } else if (semesterList.length == 0) {
                                return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                    Hiện tại không có học kì nào đang mở đăng kí!
                                </div>
                            }
                            return semesterList.map((semester, index) => {
                                const class1 = "w-full h-14 max-md:h-20 grid grid-cols-12 p-4 gap-4 hover:bg-gray-200 bg-white";
                                const class2 = "w-full h-14 max-md:h-20 grid grid-cols-12 p-4 gap-4 hover:bg-gray-200 bg-gray-100";
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
                                    <React.Fragment key={semester.code}>
                                        <div className={(index % 2 != 0) ? class1 : class2}
                                            onClick={() => {
                                                setcurrentSemester(semester)
                                                navigate('/course_registration/' + semester.id)
                                            }}
                                        >

                                            <div className="w-full h-full col-span-2 text-base font-bold text-black">{semester.code}</div>

                                            <div className="w-full h-full col-span-2 text-base font-bold text-black text-center">{semester.academic_year}</div>

                                            <div className="w-full h-full col-span-5 text-base font-bold text-black text-center">{ }</div>

                                            <div style={{ color: color }} className="w-full h-full col-span-2 text-base font-bold text-black text-center">{label}</div>
                                        </div>
                                        <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>
                                    </React.Fragment>
                                )
                            })
                        })()}
                    </div>

                </div>

            </div>
        </div>
    )
}

export default SemesterSelect