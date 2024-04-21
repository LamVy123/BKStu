import Model from "../../../../component/Model"
import { ExitIcon } from "../../../../assets/Icon"
import { motion } from "framer-motion"
import Input from "../../../../component/Input"
import TextArea from "../../../../component/TextArea"
import { FormEvent, useState } from "react"
import { Majors, MajorsDetail } from "../../../../class&interface/Majors"
import { addDoc, setDoc, doc } from "firebase/firestore"
import { majorsColRef, majorsDetailColRef } from "../../../../config/firebase"
import { Faculty, FacultyFactory, FacultyInterface } from "../../../../class&interface/Faculty"
import { query, getDocs } from "firebase/firestore"
import { useEffect } from "react"
import { facultyColRef } from "../../../../config/firebase"
import Select, { OptionInterface } from "../../../../component/Select"

interface MajorsFormProps {
    setOpenMajorsForm: React.Dispatch<React.SetStateAction<boolean>>
}

const MajorsForm: React.FC<MajorsFormProps> = ({ setOpenMajorsForm }: MajorsFormProps) => {

    const [reset, setReset] = useState<boolean>(false);

    const [facultyList, setFacultyList] = useState<Faculty[]>([])

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

    const Header: React.FC = () => {
        return (
            <div className="w-full h-20 flex flex-row justify-start items-center p-4 bg-primary rounded-t-2xl">
                <h1 className="text-4xl max-md:text-2xl font-bold text-white">Thêm ngành mới</h1>

                <button className="w-fit h-full ml-auto" onClick={() => setOpenMajorsForm(false)}>
                    <ExitIcon width={10} height={10} color="black" />
                </button>
            </div>
        )
    }


    const Form: React.FC = () => {
        const [isSubmit, setIsSubmit] = useState<boolean>(false)

        const submit = async (e: FormEvent) => {
            setIsSubmit(true);
            e.preventDefault();

            const data = new FormData(e.currentTarget as HTMLFormElement)

            const faculty = JSON.parse(data.get('faculty')?.toString() as string)

            try {
                await addDoc(majorsColRef, {})
                    .then((target) => {
                        const id = target.id;
                        const majorsDocRef = doc(majorsColRef, id);
                        const majors = new Majors(
                            data.get('name')?.toString() as string,
                            data.get('code')?.toString() as string,
                            id,
                            faculty.code,
                        )
                        setDoc(majorsDocRef, majors.getInterface());

                        const majorsDetail = new MajorsDetail(
                            faculty.name,
                            data.get('degree_type')?.toString() as string,
                            parseInt(data.get('required_credits')?.toString() as string),
                            data.get('duration')?.toString() as string,
                            data.get('description')?.toString() as string,
                        )
                        const majorsDetailDocRef = doc(majorsDetailColRef, id);
                        setDoc(majorsDetailDocRef, majorsDetail.getInterface());
                    })
            } catch {
                alert("Đã xảy ra lỗi xin thử lại!")
                return
            }
            alert("Thêm Ngành mới thành công!")
            setReset(reset => !reset)
        }

        const Section1: React.FC = () => {

            const degreeTypeOption: OptionInterface[] = [
                { lable: 'Vui lòng chọn', value: '' },
                { lable: 'Cử Nhân', value: 'Cử Nhăn' },
                { lable: 'Kỹ sư', value: 'Kỹ sư' },
                { lable: 'Thạc sĩ', value: 'Thạc sĩ' },
                { lable: 'Tiến sĩ', value: 'Tiến sĩ' },
            ]

            let option: OptionInterface[] = [{ lable: 'Vui lòng chọn', value: '' }]
            facultyList.forEach((faculty) => {
                option = [...option, { lable: faculty.name, value: JSON.stringify(faculty.getInterface()) }]
            })

            return (
                <div className="w-full h-fit flex flex-col gap-8">

                    <div className="w-12/12 max-md:w-full h-fit flex flex-col gap-8">
                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="name" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tên ngành<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="name" name="name" placeholder="Vui lòng điền" className="w-full col-span-5" required />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="code" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Mã ngành<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="code" name="code" placeholder="Vui lòng điền" className="w-full col-span-5" />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="faculty" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Khoa<h1 className="text-red-500">*</h1></label>
                            <Select id="faculty" name="faculty" height={10} option={option} className="w-full col-span-5" />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="degree_type" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Học vị cao nhất<h1 className="text-red-500">*</h1></label>
                            <Select id="degree_type" name="degree_type" height={10} option={degreeTypeOption} className="w-full col-span-5" />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="required_credits" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Số tín chỉ yêu cầu<h1 className="text-red-500">*</h1></label>
                            <Input type="number" id="required_credits" name="required_credits" placeholder="Vui lòng điền số" className="w-full col-span-5" />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="duration" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Thời gian hoàn thành<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="duration" name="duration" placeholder="Ví dụ: 4 năm" className="w-full col-span-5" />
                        </div>

                    </div>

                    <div className="w-full h-fit flex flex-col items-start justify-center">
                        <label htmlFor="description" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Mô tả<h1 className="text-red-500">*</h1></label>
                        <TextArea id="description" name="description" className="w-full min-h-32" required />
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
                                <h1 className="text-xl font-bold">Bạn có chắc muốn thêm ngành mới không ?</h1>
                                <div className="w-fit h-fit flex flex-row gap-8">
                                    <button type="button" onClick={() => setOpen(false)} className="w-28 h-12 bg-red-500 hover:bg-red-600 flex justify-center items-center font-bold rounded-md  text-white p-4">Cancel</button>
                                    <button type="submit" disabled={isSubmit} className="w-28 h-12 bg-green-500 hover:bg-green-600 flex justify-center items-center font-bold rounded-md text-white p-4">Confirm</button>
                                </div>
                            </div>
                        </div>
                    </Model>}
                    <button type="button" onClick={() => setOpen(true)} className="w-28 h-12 bg-primary flex justify-center items-center font-bold rounded-md hover:bg-blue-700 text-white p-4">Submit</button>
                </>
            )
        }

        const ButtonSection: React.FC = () => {
            return (
                <div className="w-full h-fit col-span-full flex flex-row justify-between text-lg">
                    <button type="button" onClick={() => setReset(reset => !reset)} className="w-28 h-12 bg-gray-200 flex justify-center items-center font-bold rounded-md hover:bg-gray-300 text-black p-4">Clear</button>
                    <ConfirmButton />
                </div>
            )
        }

        return (
            <form
                onSubmit={(e) => submit(e)}
                className="w-full h-full flex flex-row p-2 overflow-scroll"
            >
                <div className="w-full h-full flex flex-col p-8 max-md:p-2 gap-12 text-base max-md:text-sx">
                    <Section1 />

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
                <div className="w-6/12 max-md:w-full max-md:h-5/6 max-h-full h-fit bg-snow rounded-2xl flex flex-col border border-black border-solid overflow-hidden">
                    <Header />
                    <Form />
                </div>
            </motion.div>
        </Model>
    )
}

export default MajorsForm