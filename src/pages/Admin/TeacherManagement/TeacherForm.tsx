import { ExitIcon, LoadingIcon } from "../../../assets/Icon"
import Model from "../../../component/Model"
import { motion } from "framer-motion"
import Input from "../../../component/Input"
import Select, { OptionInterface } from "../../../component/Select"
import { FormEvent } from "react"
import { useState, useEffect } from "react"
import { Faculty, FacultyFactory, FacultyInterface } from "../../../class&interface/Faculty"
import { Majors, MajorsFactory, MajorsInterface } from "../../../class&interface/Majors"
import { query, getDocs, where } from "firebase/firestore"
import { facultyColRef, majorsColRef, userColRef, userDetaiColRef } from "../../../config/firebase"
import { useAuth } from "../../../context/AuthContext"
import { setDoc, getDoc, doc } from "firebase/firestore"
import { Teacher, TeacherDetail } from "../../../class&interface/User"

interface TeacherFormProps {
    setOpenTeacherForm: React.Dispatch<React.SetStateAction<boolean>>
}

const TeacherForm: React.FC<TeacherFormProps> = ({ setOpenTeacherForm }: TeacherFormProps) => {

    const auth = useAuth();

    const [reset, setReset] = useState<boolean>(false);
    reset

    const [loading, setLoading] = useState<boolean>(true);

    const [teacherCount, setTeacherCount] = useState<number>(0);

    useEffect(() => {
        const fetchCount = async () => {
            const teacherCountRef = doc(userColRef, 'teacher_count');
            const teacherCountDoc = await getDoc(teacherCountRef);
            if (teacherCountDoc.data()?.count) {
                setTeacherCount(teacherCountDoc.data()?.count)
            }
            setLoading(false);
        }

        fetchCount()
    }, [])

    const generateID = (): string => {
        const year = new Date().getFullYear().toString().slice(-2);
        const countStr = (teacherCount + 1).toString().padStart(6, '0');
        return `TE${year}${countStr}`;
    }

    const clear = () => {
        setReset(reset => !reset);
    }

    const Header: React.FC = () => {
        return (
            <div className="w-full h-20 flex flex-row justify-start items-center p-4 bg-primary rounded-t-2xl">
                <h1 className="text-4xl max-md:text-2xl font-bold text-white">Thêm giảng viên mới</h1>

                <button className="w-fit h-full ml-auto" onClick={() => setOpenTeacherForm(false)}>
                    <ExitIcon width={10} height={10} color="black" />
                </button>
            </div>
        )
    }

    const Form: React.FC = () => {
        const [isSubmit, setIsSubmit] = useState<boolean>(false)
        const submit = (e: FormEvent) => {
            e.preventDefault();
            setIsSubmit(true)
            const data = new FormData(e.currentTarget as HTMLFormElement)

            const email = data.get('email')?.toString() as string;
            const password = data.get('password')?.toString() as string;

            try {
                auth.CreateUser(email, password)
                    .then((userCredential) => {
                        const uid = userCredential.user.uid;
                        const faculty = JSON.parse(data.get('faculty')?.toString() as string) as FacultyInterface
                        const majors = JSON.parse(data.get('specialized')?.toString() as string) as MajorsInterface

                        const user = new Teacher(
                            data.get('last_name')?.toString() as string,
                            data.get('middle_name')?.toString() as string,
                            data.get('first_name')?.toString() as string,
                            uid,
                            generateID(),
                            data.get('email')?.toString() as string,
                            'teacher',
                            majors.name,
                        )

                        const userDetail = new TeacherDetail(
                            data.get('gender')?.toString() as string,
                            data.get('date_of_birth')?.toString() as string,
                            data.get('identification_number')?.toString() as string,
                            data.get('ethnic_group')?.toString() as string,
                            data.get('religion')?.toString() as string,
                            data.get('academic_year')?.toString() as string,
                            faculty.name,
                            data.get('nationality')?.toString() as string,
                            data.get('province')?.toString() as string,
                            data.get('city')?.toString() as string,
                            data.get('address')?.toString() as string,
                            data.get('degree')?.toString() as string,
                        )

                        const userRef = doc(userColRef, uid);
                        const userDetailRef = doc(userDetaiColRef, uid);
                        const teacherCountRef = doc(userColRef, 'teacher_count');

                        console.log(user.getInterface())
                        console.log(userDetail.getInterface())

                        setDoc(userRef, user.getInterface())
                        setDoc(userDetailRef, userDetail.getInterface())
                        setDoc(teacherCountRef, { count: (teacherCount + 1) });
                    })
            } catch {
                alert("Đã xảy ra lỗi xin thử lại")
                return
            }

            alert('Thêm giảng viên thành công!')
            clear()
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
            const genderOption: OptionInterface[] = [{ value: '', lable: 'Vui lòng chọn' }, { value: 'nam', lable: 'Nam' }, { value: 'nữ', lable: 'Nữ' }]
            return (

                <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="last_name" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Họ <h1 className="text-red-500">*</h1></label>
                        <Input type="text" id="last_name" name="last_name" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="middle_name" className="py-2 font-bold flex flex-row gap-2 w-fit col-span-2 max-md:col-span-full">Tên lót <h1 className="text-red-500">*</h1></label>
                        <Input type="text" id="middle_name" name="middle_name" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="first_name" className="py-2 font-bold flex flex-row gap-2 w-fit col-span-2 max-md:col-span-full">Tên <h1 className="text-red-500">*</h1></label>
                        <Input type="text" id="first_name" name="first_name" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="gender" className="py-2 font-bold flex flex-row gap-2 w-fit col-span-2 max-md:col-span-full">Giới tính<h1 className="text-red-500">*</h1></label>
                        <Select id="gender" name="gender" option={genderOption} height={10} className="w-full col-span-5" required />
                    </div>

                </div>
            )
        }

        const Section2: React.FC = () => {
            return (
                <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="date_of_birth" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Ngày sinh<h1 className="text-red-500">*</h1></label>
                        <Input type="date" id="date_of_birth" name="date_of_birth" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                    </div>
                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="identification_number" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Số CCCD <h1 className="text-red-500">*</h1></label>
                        <Input type="text" id="identification_number" name="identification_number" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                    </div>
                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="ethnic_group" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Dân tộc <h1 className="text-red-500">*</h1></label>
                        <Input type="text" id="ethnic_group" name="ethnic_group" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="religion" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tôn giáo</label>
                        <Input type="text" id="religion" name="religion" placeholder="Vui lòng điền Không nếu không có" className="w-full col-span-5" required />
                    </div>

                </div>
            )
        }

        const Section3: React.FC = () => {

            const FacultySelect: React.FC = () => {
                const [facultyList, setFacultyList] = useState<Faculty[]>([])

                const [currnetFacultyCode, setCurrentFacultyCode] = useState<string>('');

                const [majorsList, setMajorsList] = useState<Majors[]>([])

                useEffect(() => {
                    const fetchFacultyList = async () => {
                        let facultyQuerry = query(facultyColRef);

                        let list: Faculty[] = [];
                        const facultyQuerrySnapshot = await getDocs(facultyQuerry)
                        const facultyFactory = new FacultyFactory();
                        facultyQuerrySnapshot.forEach((doc) => {
                            const faculty = facultyFactory.CreateFacultyWithDocumentData(doc.data())
                            list = [...list, faculty]
                        })
                        setFacultyList(list);
                    }

                    fetchFacultyList();
                }, [])

                useEffect(() => {
                    const fetchMajorsList = async () => {
                        let majorsQuerry = query(majorsColRef, where('faculty_code', '==', currnetFacultyCode));

                        let list: Majors[] = [];
                        const majorsQuerrySnapshot = await getDocs(majorsQuerry)
                        const majorsFactory = new MajorsFactory();
                        majorsQuerrySnapshot.forEach((doc) => {
                            const majors = majorsFactory.CreateMajorsWithDocumentData(doc.data())
                            list = [...list, majors]
                        })
                        setMajorsList(list);
                    }
                    if (currnetFacultyCode != '') {
                        fetchMajorsList();
                    }
                }, [currnetFacultyCode])


                const onChangeFaculty = (e: React.ChangeEvent<HTMLSelectElement>) => {
                    e.preventDefault();
                    if (e.target.value) {
                        const faculty = JSON.parse(e.target.value) as FacultyInterface
                        setCurrentFacultyCode(faculty.code);
                    } else {
                        setCurrentFacultyCode('');
                    }
                }

                let facultyOptionList: OptionInterface[] = [{ lable: 'Vui lòng chọn', value: '' }]
                let majorsOptionList: OptionInterface[] = [{ lable: 'Vui lòng chọn', value: '' }]

                facultyList.forEach((faculty) => {
                    facultyOptionList = [...facultyOptionList, { lable: faculty.name, value: JSON.stringify(faculty.getInterface()) }]
                })

                majorsList.forEach((majors) => {
                    majorsOptionList = [...majorsOptionList, { lable: majors.name, value: JSON.stringify(majors.getInterface()) }]
                })

                return (
                    <>
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="faculty" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Khoa<h1 className="text-red-500">*</h1></label>
                            <Select id="faculty" name="faculty" option={facultyOptionList} className="w-full col-span-5" height={10} onChange={onChangeFaculty} required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="specialized" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Chuyên ngành<h1 className="text-red-500">*</h1></label>
                            <Select id="specialized" name="specialized" option={majorsOptionList} className="w-full col-span-5" height={10} disable={(currnetFacultyCode == '')} required />
                        </div>
                    </>
                )
            }

            const degreeTypeOption: OptionInterface[] = [
                { lable: 'Vui lòng chọn', value: '' },
                { lable: 'Cử Nhân', value: 'Cử Nhăn' },
                { lable: 'Kỹ sư', value: 'Kỹ sư' },
                { lable: 'Thạc sĩ', value: 'Thạc sĩ' },
                { lable: 'Tiến sĩ', value: 'Tiến sĩ' },
            ]

            return (
                <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">
                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="academic_year" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Niên khóa<h1 className="text-red-500">*</h1></label>
                        <Input type="text" id="academic_year" name="academic_year" placeholder="VD: 2024" className="w-full col-span-5" required />
                    </div>

                    <FacultySelect />

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="degree" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Học vị<h1 className="text-red-500">*</h1></label>
                        <Select id="degree" name="degree" option={degreeTypeOption} className="w-full col-span-5" height={10} required />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="display_id" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">ID<h1 className="text-red-500">*</h1></label>
                        <Input type="text" id="display_id" name="display_id" placeholder={generateID()} className="w-full col-span-5" disable />
                    </div>
                </div>
            )
        }

        const Section4: React.FC = () => {
            const nationOptionList: OptionInterface[] = [
                { lable: 'Vui lòng chọn', value: '' },
                { lable: 'Việt Nam', value: 'Việt Nam' }
            ]

            return (
                <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">
                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="nationality" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Quốc tịch</label>
                        <Select id="nationality" name="nationality" option={nationOptionList} className="w-full col-span-5" height={10} />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="province" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tỉnh</label>
                        <Input type="text" id="province" name="province" placeholder="Vui lòng điền" className="w-full col-span-5" />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="city" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Thành phố</label>
                        <Input type="text" id="city" name="city" placeholder="Vui lòng điền" className="w-full col-span-5" />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="address" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Địa chỉ cụ thể</label>
                        <Input type="text" id="address" name="address" placeholder="Vui lòng điền" className="w-full col-span-5" />
                    </div>

                </div>
            )
        }

        const Section5: React.FC = () => {
            return (
                <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="email" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Email trường<h1 className="text-red-500">*</h1></label>
                        <Input type="email" id="email" name="email" placeholder="abc@bkstu.edu.vn" className="w-full col-span-5" required />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="password" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Mật khẩu<h1 className="text-red-500">*</h1></label>
                        <Input type="text" id="password" name="password" placeholder="Vui lòng điền" className="w-full col-span-5" required />
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
                                <h1 className="text-xl font-bold">Bạn có chắc muốn thêm giảng viên mới hay không ?</h1>
                                <div className="w-fit h-fit flex flex-row gap-8">
                                    <button type="button" onClick={() => setOpen(false)} className="w-28 h-12 bg-red-500 flex justify-center items-center font-bold rounded-md hover:bg-red-600 text-white p-4">Cancel</button>
                                    <button type="submit" disabled={isSubmit} className="w-28 h-12 bg-green-500 flex justify-center items-center font-bold rounded-md hover:bg-green-600 text-white p-4">Confirm</button>
                                </div>
                            </div>
                        </div>
                    </Model>}
                    <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => setOpen(true)} className="ml-auto w-fit h-fit bg-primary hover:bg-blue-700 rounded-md text-white text-xl font-bold flex items-center justify-center px-4 py-2">Submit</motion.button>
                </>
            )
        }

        const ButtonSection: React.FC = () => {
            return (
                <div className="w-full h-fit col-span-full flex flex-row justify-between text-lg">
                    <button type="button" onClick={clear} className="w-28 h-12 bg-gray-200 flex justify-center items-center font-bold rounded-md hover:bg-gray-300 p-4">Clear</button>

                    <ConfirmButton />
                </div>
            )
        }

        return (
            <form onSubmit={(e) => submit(e)} className="w-full h-full flex flex-row p-2 overflow-scroll">
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
                <div className="w-11/12 max-md:w-full max-md:h-5/6 max-h-full h-full bg-snow rounded-2xl flex flex-col border border-black border-solid overflow-hidden">

                    <Header />

                    {loading ? <div className="w-full h-full flex items-center justify-center"><LoadingIcon width={15} height={15} color="gray" /></div> : <Form />}

                </div>
            </motion.div>
        </Model>
    )
}

export default TeacherForm