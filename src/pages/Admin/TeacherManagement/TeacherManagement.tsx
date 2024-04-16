import Container from "../../../component/Container";
import { AddUserIcon, InformationIcon, RefreashIcon, SearchIcon, UserIcon, ExitIcon, LoadingIcon } from "../../../assets/Icon";
import { Teacher, TeacherDetail, UserDetailFactory, UserFactory } from "../../../class&interface/User";
import TeacherForm from "./TeacherForm";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Input from "../../../component/Input";
import { getDocs, query, where, doc, getDoc, setDoc, or, getCountFromServer } from "firebase/firestore";
import { userColRef, userDetaiColRef } from "../../../config/firebase";
import Select, { OptionInterface } from "../../../component/Select";
import Model from "../../../component/Model";
import { FormEvent } from "react";







const TeacherManagement: React.FC = () => {
    const [openTeacherForm, setOpenTeacherForm] = useState<boolean>(false)

    const [openTeacherInfor, setOpenTeacherInfor] = useState<boolean>(false)

    const [currentTeacherID, setCurrentTeacherID] = useState<string>('')

    const [teacherList, setTeacherlist] = useState<Teacher[]>([])

    const [reset, setReset] = useState<boolean>(false)

    const [isLoading, setLoading] = useState<boolean>(true)

    const [searchValue, setSearchValue] = useState<string>('')

    const [teacherCount, setTeacherCount] = useState<number>(0)


    function delay(time: number) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    useEffect(() => {

        const fetchCount = async () => {
            const studentCount = query(userColRef, where('role', '==', 'teacher'))
            setTeacherCount((await getCountFromServer(studentCount)).data().count)
        }

        fetchCount()
    }, [])

    useEffect(() => {
        const fetchTeacherList = async () => {
            let teacherQuerryRef = query(userColRef, where('role', '==', 'teacher'))

            if (searchValue != '') {
                teacherQuerryRef = query(teacherQuerryRef, or(
                    where('last_name', '==', searchValue),
                    where('first_name', '==', searchValue),
                    where('display_id', '==', searchValue),
                    where('email', '==', searchValue),
                    where('specialized', '==', searchValue)
                ))
            }

            const teacherQuerry = await getDocs(teacherQuerryRef)
            const userFactory = new UserFactory()
            let list: Teacher[] = []
            teacherQuerry.forEach((doc) => {
                list = [...list, userFactory.CreateUserWithDocumentData('teacher', doc.data()) as Teacher]
            })
            setTeacherlist(list);
            setLoading(false);
        }

        fetchTeacherList()
    }, [reset, searchValue])


    const Header: React.FC = () => {

        const search = (e: FormEvent) => {
            e.preventDefault();

            const data = new FormData(e.currentTarget as HTMLFormElement)

            setSearchValue(data.get("search")?.toString() as string)

            console.log(data.get("search")?.toString() as string)
        }

        return (
            <div className="w-full h-fit flex flex-row max-md:flex-col justify-start items-center gap-4 bg-white">
                <div className="w-full h-12 flex flex-col justify-start items-start">
                    <p className="text-4xl max-md:text-2xl font-bold">Giảng viên</p>
                    <p className="text-lg max-md:text-sm text-gray-default">{teacherCount} Giảng viên</p>
                </div>

                <div className="w-full h-12 flex flex-row max-md:flex-col ml-auto">

                    <form onSubmit={search} className="w-full h-12 flex flex-row items-center justify-center gap-4">
                        <div className="h-10 flex justify-center items-center">
                            <motion.button whileTap={{ scale: 0.9 }} type="submit">
                                <SearchIcon width={8} height={8} color="black" />
                            </motion.button>
                        </div>
                        <Input type="search" name="search" id="search" defaultValue={searchValue} className="w-112 max-md:w-full h-10" placeholder="Tìm kiếm bằng Họ, Tên, ID, email hoặc chuyên ngành" />
                    </form>

                    <div className="w-fit h-12 flex flex-row justify-center items-center text-base max-md:text-xs">
                        <motion.button
                            onClick={() => { delay(100).then(() => setOpenTeacherForm(true)) }}
                            whileTap={{ scale: 0.95 }}
                            className="w-48 h-10 bg-gray-200 hover:bg-gray-300 rounded flex flex-row justify-center items-center p-2 gap-2 font-bold">
                            <AddUserIcon width={7} height={7} color="black" />
                            Thêm giảng viên
                        </motion.button>
                    </div>
                </div>
            </div>
        )
    }

    const TeacherInfor: React.FC = () => {

        const Header: React.FC = () => {
            return (
                <div className="w-full h-20 flex flex-row justify-start items-center p-4 bg-primary rounded-t-2xl">
                    <h1 className="text-4xl max-md:text-2xl font-bold">Thông tin Giảng viên</h1>

                    <button className="w-fit h-full ml-auto" onClick={() => setOpenTeacherInfor(false)}>
                        <ExitIcon width={10} height={10} color="black" />
                    </button>
                </div>
            )
        }

        const Form: React.FC = () => {
            const [loading, setLoading] = useState<boolean>(true);
            const [edit, setEdit] = useState<boolean>(false)
            const [teacher, setTeacher] = useState<Teacher>()
            const [teacherDetail, setTeacherDetail] = useState<TeacherDetail>()

            useEffect(() => {
                const fetchTeacher = async () => {
                    const teacherRef = doc(userColRef, currentTeacherID)

                    const teacherDetailRef = doc(userDetaiColRef, currentTeacherID)

                    const teacherDoc = await getDoc(teacherRef)
                    const userFactory = new UserFactory()
                    setTeacher(userFactory.CreateUserWithDocumentData('teacher', teacherDoc.data()) as Teacher)

                    const teacherDetailDoc = await getDoc(teacherDetailRef)
                    const userDetailFactory = new UserDetailFactory()
                    setTeacherDetail(userDetailFactory.CreateUserDetailWithDocumentData('teacher', teacherDetailDoc.data()) as TeacherDetail)

                    setLoading(false);
                }

                fetchTeacher()
            }, [])


            const submit = (e: FormEvent) => {
                e.preventDefault();

                const data = new FormData(e.currentTarget as HTMLFormElement)

                const uid = teacher?.uid as string;

                const user = new Teacher(
                    teacher?.last_name as string,
                    teacher?.middle_name as string,
                    teacher?.first_name as string,
                    uid,
                    teacher?.display_id as string,
                    teacher?.email as string,
                    'teacher',
                    teacher?.specialized as string,
                )

                const userDetail = new TeacherDetail(
                    data.get('gender')?.toString() as string,
                    data.get('date_of_birth')?.toString() as string,
                    data.get('identification_number')?.toString() as string,
                    data.get('ethnic_group')?.toString() as string,
                    data.get('religion')?.toString() as string,
                    teacherDetail?.academic_year as string,
                    teacherDetail?.faculty as string,
                    data.get('nationality')?.toString() as string,
                    data.get('province')?.toString() as string,
                    data.get('city')?.toString() as string,
                    data.get('address')?.toString() as string,
                    teacherDetail?.degree as string,
                )

                const userRef = doc(userColRef, uid);
                const userDetailRef = doc(userDetaiColRef, uid);

                setDoc(userRef, user.getInterface())
                setDoc(userDetailRef, userDetail.getInterface())

                setTeacher(user)
                setTeacherDetail(userDetail)

                //clear()
                setEdit(false);
                alert('Add teacher success!')
            }


            const Avatar: React.FC = () => {
                return (
                    <div className="w-full h-full col-span-3 max-md:col-span-6 flex justify-center items-center">
                        <div className="w-full h-full min-h-60 col-span-3 border border-black border-solid rounded-lg bg-user bg-no-repeat bg-contain bg-center">
                        </div>
                    </div>
                )
            }

            const Section1: React.FC = () => {
                const genderOption1: OptionInterface[] = [{ value: 'nam', lable: 'Nam' }, { value: 'nữ', lable: 'Nữ' }]
                const genderOption2: OptionInterface[] = [{ value: 'nữ', lable: 'Nữ' }, { value: 'nam', lable: 'Nam' }]

                return (

                    <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="last_name" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Họ <h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="last_name" name="last_name" defaultValue={teacher?.last_name} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="middle_name" className="py-2 font-bold flex flex-row gap-2 w-fit col-span-2 max-md:col-span-full">Tên lót <h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="middle_name" name="middle_name" defaultValue={teacher?.middle_name} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="first_name" className="py-2 font-bold flex flex-row gap-2 w-fit col-span-2 max-md:col-span-full">Tên <h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="first_name" name="first_name" defaultValue={teacher?.first_name} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="gender" className="py-2 font-bold flex flex-row gap-2 w-fit col-span-2 max-md:col-span-full">Giới tính<h1 className="text-red-500">*</h1></label>
                            <Select id="gender" name="gender" option={teacherDetail?.gender == 'nam' ? genderOption1 : genderOption2} height={10} className="w-full col-span-5" required disable={!edit} />
                        </div>

                    </div>
                )
            }

            const Section2: React.FC = () => {
                return (
                    <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="date_of_birth" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Ngày sinh<h1 className="text-red-500">*</h1></label>
                            <Input type="date" id="date_of_birth" name="date_of_birth" defaultValue={teacherDetail?.date_of_birth} placeholder="Vui lòng điền" className="w-full col-span-5" required disable={!edit} />
                        </div>
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="identification_number" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Số CCCD <h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="identification_number" name="identification_number" defaultValue={teacherDetail?.identification_number} placeholder="Vui lòng điền" className="w-full col-span-5" required disable={!edit} />
                        </div>
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="ethnic_group" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Dân tộc <h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="ethnic_group" name="ethnic_group" defaultValue={teacherDetail?.ethnic_group} placeholder="Vui lòng điền" className="w-full col-span-5" required disable={!edit} />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="religion" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tôn giáo</label>
                            <Input type="text" id="religion" name="religion" defaultValue={teacherDetail?.religion} placeholder="Bỏ trống nếu không có" className="w-full col-span-5" required disable={!edit} />
                        </div>

                    </div>
                )
            }

            const Section3: React.FC = () => {
                return (
                    <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="academic_year" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Niên khóa<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="academic_year" name="academic_year" defaultValue={teacherDetail?.academic_year} placeholder="VD: 2024" className="w-full col-span-5" required disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="faculty" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Khoa<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="faculty" name="faculty" defaultValue={teacherDetail?.faculty} className="w-full col-span-5" disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="specialized" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Chuyên Ngành<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="specialized" name="specialized" defaultValue={teacher?.specialized} className="w-full col-span-5" disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="degree" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Học vị<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="degree" name="degree" defaultValue={teacherDetail?.degree} className="w-full col-span-5" disable />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="display_id" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">ID<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="display_id" name="display_id" defaultValue={teacher?.display_id} placeholder={''} className="w-full col-span-5" disable />
                        </div>
                    </div>
                )
            }

            const Section4: React.FC = () => {

                return (
                    <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="nationality" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Quốc tịch</label>
                            <Input type="text" id="nationality" name="nationality" defaultValue={teacherDetail?.nationality} placeholder="Vui lòng điền" className="w-full col-span-5" disable={!edit} />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="province" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tỉnh</label>
                            <Input type="text" id="province" name="province" defaultValue={teacherDetail?.province} placeholder="Vui lòng điền" className="w-full col-span-5" disable={!edit} />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="city" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Thành Phố</label>
                            <Input type="text" id="city" name="city" defaultValue={teacherDetail?.city} placeholder="Vui lòng điền" className="w-full col-span-5" disable={!edit} />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="address" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Địa chỉ cụ thể</label>
                            <Input type="text" id="address" name="address" defaultValue={teacherDetail?.address} placeholder="Vui lòng điền" className="w-full col-span-5" disable={!edit} />
                        </div>

                    </div>
                )
            }

            const Section5: React.FC = () => {
                return (
                    <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="email" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Email trường<h1 className="text-red-500">*</h1></label>
                            <Input type="email" id="email" name="email" defaultValue={teacher?.email} placeholder="abc@bkstu.edu.vn" className="w-full col-span-5" required disable />
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

            const ButtonSection: React.FC = () => {
                if (edit) {
                    return (
                        <div className="w-full h-fit col-span-full flex flex-row justify-between text-lg">
                            <button type="button" onClick={() => setEdit(false)} className="w-28 h-12 bg-gray-200 flex justify-center items-center font-bold rounded-md hover:bg-gray-300 p-4">Cancel</button>

                            <ConfirmButton />
                        </div>
                    )
                }

                return (
                    <div className="w-full h-fit col-span-full flex flex-row justify-between text-lg">
                        <button type="button" onClick={() => setEdit(true)} className="w-28 h-12 bg-gray-200 flex justify-center items-center font-bold rounded-md hover:bg-gray-300 p-4">Edit</button>
                    </div>
                )
            }

            if (loading) return <div className="w-full h-full flex items-center justify-center"><LoadingIcon width={15} height={15} color="gray" /></div>

            return (
                <form onSubmit={submit} className="w-full h-full flex flex-row p-2 overflow-scroll">
                    <div className="w-full h-full flex flex-col p-8 max-md:p-2 gap-12 text-base max-md:text-sx">

                        <div className="w-full h-fit grid grid-cols-16 max-md:grid-cols-6 gap-x-8 gap-y-4">
                            <h1 className="text-3xl max-md:text-xl font-bold col-span-full">Thông tin cơ bản</h1>

                            <Avatar />

                            <Section1 />

                            <div></div>

                            <Section2 />

                        </div>

                        <div className="w-full h-fit col-span-full flex flex-row max-md:flex-col gap-20">

                            <div className="w-1/2 max-md:w-full h-fit flex flex-col gap-4">

                                <h1 className="text-3xl max-md:text-xl font-bold">Thông tin Giảng viên</h1>

                                <Section3 />

                            </div>

                            <div className="w-1/2 max-md:w-full h-fit flex flex-col gap-4">
                                <h1 className="text-3xl max-md:text-xl font-bold col-span-full">Thông tin cư trú</h1>

                                <Section4 />

                            </div>
                        </div>

                        <div className="w-full h-fit col-span-full flex flex-row max-md:flex-col gap-20">

                            <div className="w-1/2 max-md:w-full h-fit flex flex-col gap-4">

                                <h1 className="text-3xl max-md:text-xl font-bold">Thông tin tài khoản</h1>

                                <Section5 />

                            </div>
                            <div className="w-1/2 max-md:w-full h-fit flex flex-col gap-4"></div>
                        </div>


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
                    <div className="w-11/12 max-md:w-full max-md:h-5/6 max-h-full h-full bg-white rounded-2xl flex flex-col border border-black border-solid overflow-hidden">

                        <Header />

                        <Form />

                    </div>
                </motion.div>
            </Model>
        )
    }

    //Main Component
    return (
        <Container>
            {openTeacherForm && <TeacherForm setOpenTeacherForm={setOpenTeacherForm} />}
            {openTeacherInfor && <TeacherInfor />}
            <div className="w-full h-full flex justify-center items-center p-4 bg-slate-200 overflow-hidden">
                <div className="w-full h-full bg-white border border-solid border-black rounded-md shadow-md shadow-gray-default flex flex-col justify-start items-center p-4 gap-8">
                    <Header />

                    <div className="w-full h-full flex-col p-4 gap-4">

                        <div className="w-full h-fit grid grid-cols-12 max-md:grid-cols-6 p-4">
                            <div className="flex items-center justify-center"></div>

                            <div className="col-span-3 max-md:col-span-4 flex items-center justify-start text-xl max-md:text-sm text-gray-default font-bold">Họ và tên</div>

                            <div className="col-span-2 max-md:hidden flex items-center text-xl max-md:text-sm text-gray-default font-bold">ID</div>

                            <div className="col-span-3 max-md:hidden flex items-center text-xl text-gray-default font-bold">Email</div>

                            <div className="col-span-2 max-md:hidden flex items-center text-xl text-gray-default font-bold">Chuyên Ngành</div>

                            <div className="w-full h-full flex items-center text-xl max-md:text-sm text-gray-default font-bold">
                                <motion.div onClick={() => { setLoading(true); setTeacherlist([]); setReset(reset => !reset) }} whileTap={{ scale: 0.9 }} className="p-2 w-fit h-fit hover:bg-gray-300 rounded-md">
                                    <RefreashIcon width={7} height={7} color="gray" />
                                </motion.div>
                            </div>

                        </div>

                        <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>

                        {(() => {
                            if (isLoading) {
                                return <div className="w-full h-full flex items-center justify-center"><LoadingIcon width={10} height={10} /></div>
                            } else if (teacherList.length == 0 && searchValue != '') {
                                return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                    Không có giảng viên nào phù hợp với tìm kiếm của bạn!
                                </div>
                            } else if (teacherList.length == 0) {
                                return <div className="w-full h-full col-span-6 text-base font-bold text-black flex justify-center items-center">
                                    Hãy thêm giảng viên mới!
                                </div>
                            }
                            return teacherList.map((teacher, index) => {
                                const class1 = "w-full h-fit grid grid-cols-12 grid-rows-1 p-2 bg-white hover:bg-gray-200 cursor-pointer"
                                const class2 = "w-full h-fit grid grid-cols-12 grid-rows-1 p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer"

                                return (
                                    <React.Fragment key={teacher.uid}>
                                        <div className={(index % 2 != 0) ? class1 : class2}>
                                            <div className="w-full h-full flex items-center justify-center"><UserIcon width={12} height={12} color="gray" /></div>

                                            <div className="col-span-3 flex items-center text-base font-bold ">{teacher.last_name + " " + teacher.middle_name + " " + teacher.first_name}</div>

                                            <div className="col-span-2 flex items-center text-base font-bold">{teacher.display_id}</div>

                                            <div className="col-span-3 flex items-center text-base font-bold">{teacher.email}</div>

                                            <div className="col-span-2 flex items-center text-base font-bold">{teacher.specialized}</div>

                                            <div className="col-span-1 flex items-center">
                                                <motion.button
                                                    onClick={(e) => {
                                                        setCurrentTeacherID(e.currentTarget.getAttribute('data-key') as string);
                                                        setOpenTeacherInfor(true)
                                                    }}
                                                    data-key={teacher.uid}
                                                    whileTap={{ scale: 0.9 }} className="">
                                                    <InformationIcon width={8} height={8} color="gray" />
                                                </motion.button>
                                            </div>
                                        </div>
                                        <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>
                                    </React.Fragment>
                                )
                            })
                        })()}


                    </div>
                </div>
            </div>
        </Container>
    );
};

export default TeacherManagement;
