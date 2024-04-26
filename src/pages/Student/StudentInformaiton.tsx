import { Student, StudentDetail } from "../../class&interface/User";
import Footer from "../../component/Footer";
import Input from "../../component/Input";
import { useAuth } from "../../context/AuthContext";

const StudentInfor: React.FC = () => {

    const auth = useAuth()

    const student = auth.userInfor as Student
    const studentDetail = auth.userDetail as StudentDetail

    const Form: React.FC = () => {

        const Avatar: React.FC = () => {
            return (
                <div className="w-full h-full col-span-3 max-md:col-span-6 flex justify-center items-center">
                    <div className="w-full h-full min-h-60 col-span-3 border border-black border-solid rounded-lg bg-user bg-no-repeat bg-contain bg-center">
                    </div>
                </div>
            )
        }

        const Section1: React.FC = () => {
            return (

                <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="last_name" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Họ </label>
                        <Input type="text" id="last_name" name="last_name" defaultValue={student?.last_name} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="middle_name" className="py-2 font-bold flex flex-row gap-2 w-fit col-span-2 max-md:col-span-full">Tên lót </label>
                        <Input type="text" id="middle_name" name="middle_name" defaultValue={student?.middle_name} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="first_name" className="py-2 font-bold flex flex-row gap-2 w-fit col-span-2 max-md:col-span-full">Tên </label>
                        <Input type="text" id="first_name" name="first_name" defaultValue={student?.first_name} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="gender" className="py-2 font-bold flex flex-row gap-2 w-fit col-span-2 max-md:col-span-full">Giới tính</label>
                        <Input type="text" id="gender" name="gender" defaultValue={studentDetail.gender} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                    </div>

                </div>
            )
        }

        const Section2: React.FC = () => {
            return (
                <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="date_of_birth" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Ngày sinh</label>
                        <Input type="date" id="date_of_birth" name="date_of_birth" defaultValue={studentDetail?.date_of_birth} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                    </div>
                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="identification_number" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Số CCCD </label>
                        <Input type="text" id="identification_number" name="identification_number" defaultValue={studentDetail?.identification_number} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                    </div>
                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="ethnic_group" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Dân tộc </label>
                        <Input type="text" id="ethnic_group" name="ethnic_group" defaultValue={studentDetail?.ethnic_group} placeholder="Vui lòng điền" className="w-full col-span-5" required disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="religion" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tôn giáo</label>
                        <Input type="text" id="religion" name="religion" defaultValue={studentDetail?.religion} placeholder="Bỏ trống nếu không có" className="w-full col-span-5" required disable />
                    </div>

                </div>
            )
        }

        const Section3: React.FC = () => {
            return (
                <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">
                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="academic_year" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Niên khóa</label>
                        <Input type="text" id="academic_year" name="academic_year" defaultValue={studentDetail?.academic_year} placeholder="VD: 2024" className="w-full col-span-5" required disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="faculty" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Khoa</label>
                        <Input type="text" id="faculty" name="faculty" defaultValue={studentDetail?.faculty} className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="specialized" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Ngành</label>
                        <Input type="text" id="specialized" name="specialized" defaultValue={student?.majors} className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="class_name" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Lớp</label>
                        <Input type="text" id="class_name" name="class_name" defaultValue={studentDetail?.classes_name} className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="display_id" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">MSSV</label>
                        <Input type="text" id="display_id" name="display_id" defaultValue={student?.display_id} placeholder={''} className="w-full col-span-5" disable />
                    </div>
                </div>
            )
        }

        const Section4: React.FC = () => {

            return (
                <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">
                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="nationality" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Quốc tịch</label>
                        <Input type="text" id="nationality" name="nationality" defaultValue={studentDetail?.nationality} placeholder="Vui lòng điền" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="province" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Tỉnh</label>
                        <Input type="text" id="province" name="province" defaultValue={studentDetail?.province} placeholder="Vui lòng điền" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="city" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Thành Phố</label>
                        <Input type="text" id="city" name="city" defaultValue={studentDetail?.city} placeholder="Vui lòng điền" className="w-full col-span-5" disable />
                    </div>

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="address" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Địa chỉ cụ thể</label>
                        <Input type="text" id="address" name="address" defaultValue={studentDetail?.address} placeholder="Vui lòng điền" className="w-full col-span-5" disable />
                    </div>

                </div>
            )
        }

        const Section5: React.FC = () => {
            return (
                <div className="w-full h-fit col-span-6 flex justify-center items-center flex-col gap-8">

                    <div className="w-full h-fit grid grid-cols-7 max-md:grid-cols-5 gap-2">
                        <label htmlFor="email" className="py-2 font-bold flex flex-row gap-2 col-span-2 max-md:col-span-full">Email trường</label>
                        <Input type="email" id="email" name="email" defaultValue={student?.email} placeholder="abc@bkstu.edu.vn" className="w-full col-span-5" required disable />
                    </div>
                </div>
            )
        }

        return (
            <form className="w-full h-full flex flex-row p-2 overflow-scroll">
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

                            <h1 className="text-3xl max-md:text-xl font-bold">Thông tin Sinh viên</h1>

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
                </div>
            </form>
        )
    }

    return (

        <div className="w-full h-full rounded-md overflow-hidden">


            <Form />

        </div>

    )
}

const StudentInformation: React.FC = () => {
    return (
        <>
            <div className="min-w-full min-h-screen h-full pt-14 flex flex-col justify-start items-center">
                <StudentInfor />
            </div>
            <Footer />
        </>
    )
}

export default StudentInformation