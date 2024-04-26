import Model from "../../../../component/Model"
import { ExitIcon } from "../../../../assets/Icon"
import { motion } from "framer-motion"
import Input from "../../../../component/Input"
import { FormEvent, useState } from "react"
import { Semester, SemesterDetail } from "../../../../class&interface/Semester"
import { addDoc, setDoc, doc } from "firebase/firestore"
import { semesterColRef, semesterDetailColRef } from "../../../../config/firebase"

interface SemesterFormProps {
    setOpenSemesterForm: React.Dispatch<React.SetStateAction<boolean>>
}

const SemesterForm: React.FC<SemesterFormProps> = ({ setOpenSemesterForm }: SemesterFormProps) => {

    const [reset, setReset] = useState<boolean>(false);
    reset

    const Header: React.FC = () => {
        return (
            <div className="w-full h-20 flex flex-row justify-start items-center p-4 bg-primary rounded-t-2xl">
                <h1 className="text-4xl max-md:text-2xl font-bold text-white">Thêm học kì mới</h1>

                <button className="w-fit h-full ml-auto" onClick={() => setOpenSemesterForm(false)}>
                    <ExitIcon width={10} height={10} color="black" />
                </button>
            </div>
        )
    }


    const Form: React.FC = () => {
        const [isSubmit, setIsSubmit] = useState<boolean>(false)
        const submit = async (e: FormEvent) => {
            e.preventDefault();
            setIsSubmit(true)
            const data = new FormData(e.currentTarget as HTMLFormElement)
            const number_of_weeks = isNaN(parseInt(data.get('number_of_weeks')?.toString() as string)) ? 0 : parseInt(data.get('number_of_weeks')?.toString() as string)
            try {
                await addDoc(semesterColRef, {})
                    .then((target) => {
                        const id = target.id;
                        const semesterDocRef = doc(semesterColRef, id);
                        const semester = new Semester(
                            data.get('code')?.toString() as string,
                            id,
                            data.get('academic_year')?.toString() as string,
                            'not_open'
                        )
                        setDoc(semesterDocRef, semester.getInterface());

                        const semesterDetail = new SemesterDetail(
                            data.get('day_start')?.toString() as string,
                            number_of_weeks,
                        )
                        const semesterDetailDocRef = doc(semesterDetailColRef, id);
                        setDoc(semesterDetailDocRef, semesterDetail.getInterface());
                    })
            } catch {
                alert("Đã xảy ra lỗi xin thử lại")
                return;
            }
            alert("Thêm Học kì mới thành công!")
            setReset(reset => !reset)
        }

        const Section1: React.FC = () => {
            return (
                <div className="w-full h-fit flex flex-col gap-8">

                    <div className="w-12/12 max-md:w-full h-fit flex flex-col gap-8">

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="code" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Mã học kì<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="code" name="code" placeholder="Vui lòng điền" className="w-full col-span-5" />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="academic_year" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Niên khóa<h1 className="text-red-500">*</h1></label>
                            <Input type="text" id="academic_year" name="academic_year" placeholder="Vui lòng điền" className="w-full col-span-5" />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="day_start" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Ngày bắt đầu<h1 className="text-red-500">*</h1></label>
                            <Input type="date" id="day_start" name="day_start" placeholder="Vui lòng điền" className="w-full col-span-5" />
                        </div>

                        <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                            <label htmlFor="number_of_weeks" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Số tuần kéo dài<h1 className="text-red-500">*</h1></label>
                            <Input type="number" id="number_of_weeks" name="number_of_weeks" placeholder="Vui lòng điền" className="w-full col-span-5" />
                        </div>

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
                                <h1 className="text-xl font-bold">Bạn có chắc muốn thêm huọc kì mới không ?</h1>
                                <div className="w-fit h-fit flex flex-row gap-8">
                                    <button type="button" onClick={() => setOpen(false)} className="w-28 h-12 bg-red-500 flex justify-center items-center font-bold rounded-md hover:bg-red-600 text-white p-4">Cancel</button>
                                    <button type="submit" disabled={isSubmit} className="w-28 h-12 bg-green-500 flex justify-center items-center font-bold rounded-md hover:bg-green-600 text-white p-4">Confirm</button>
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

export default SemesterForm