import { motion } from "framer-motion";
import { ExitIcon, LoadingIcon } from "../../../assets/Icon";
import { useLayoutEffect, useState } from "react";
import { StudentInfor, UserInfor } from "../../../types/User";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db } from "../../../config/firebase";

type StudentInformationModelProps = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    currentStudentID: string,
}

export default function StudentInformationModel({ setOpen, currentStudentID }: StudentInformationModelProps) {
    const [userInfor, setUserInfor] = useState<UserInfor>()
    const [studentInfor, setStudentInfor] = useState<StudentInfor>()
    const [isLoading, setLoading] = useState<boolean>(true);

    useLayoutEffect(() => {
        const FetchData = async () => {
            const userInforDocs = await getDocs(query(collection(db, "user_infor"), where("display_id", "==", currentStudentID)));
            userInforDocs.forEach((doc) => {
                setUserInfor(
                    {
                        last_name: doc.data().last_name,
                        middle_name: doc.data().middle_name,
                        first_name: doc.data().first_name,
                        display_id: doc.data().display_id,
                        email: doc.data().email,
                        role: doc.data().role,
                        majors: doc.data().majors,
                    },
                );
            });
            const studentInforDocs = await getDocs(query(collection(db, "student_infor"), where("display_id", "==", currentStudentID)));
            studentInforDocs.forEach((doc) => {
                setStudentInfor(
                    {
                        address: doc.data().address,
                        date_of_birth: doc.data().date_of_birth,
                        display_id: doc.data().display_id,
                        gender: doc.data().gender,
                        identification_number: doc.data().identification_number,
                        phone_number: doc.data().phone_number
                    },
                );
            });
            setLoading(false);
        };
        FetchData()

    }, [currentStudentID])

    const Header: React.FC = () => {
        return (
            <div className="w-full h-14 bg-primary flex flex-row items-center p-4 ">
                <div className="h-full w-1/2 flex items-center justify-start">
                    <h1 className="text-white text-2xl font-bold w-fit">
                        Student Information
                    </h1>
                </div>
                <div className="h-full w-1/2 flex items-center justify-end">
                    <motion.button
                        className="rounded-full"
                        whileHover={{ scale: 1.3 }}
                        onClick={() => { setLoading(true); setOpen(false) }}
                    >
                        <ExitIcon width={8} height={8} color="black" />
                    </motion.button>
                </div>
            </div>
        )
    }

    const StudentInforForm: React.FC = () => {


        const input_required = true;
        const is_disable = true;
        return (
            <form
                className="border-2 border-black border-solid rounded p-4 gap-4 w-full h-full flex flex-col justify-start"
            >
                <div className="flex flex-initial flex-row max-sm:flex-col justify-start w-full h-fit gap-4">
                    <div className="w-full h-fit flex flex-col justify-start gap-4">
                        <div className="w-full flex gap-4 flex-row">
                            <label
                                htmlFor="last_name"
                                className="w-1/3 font-bold"
                            >
                                Last Name <b className="text-red-600">*</b>
                            </label>
                            <label
                                htmlFor="middle_name"
                                className="w-1/3 font-bold"
                            >
                                Middle Name <b className="text-red-600">*</b>
                            </label>
                            <label
                                htmlFor="first_name"
                                className="w-1/3 font-bold"
                            >
                                First Name <b className="text-red-600">*</b>
                            </label>
                        </div>
                        <div className="w-full flex gap-2">
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                defaultValue=""
                                className="w-1/3 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                                required={input_required}
                                disabled={is_disable}
                                value={userInfor?.last_name}
                            />
                            <input
                                id="middle_name"
                                name="middle_name"
                                type="text"
                                defaultValue=""
                                className="w-1/3 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                                required={input_required}
                                disabled={is_disable}
                                value={userInfor?.middle_name}
                            />
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                defaultValue=""
                                className="w-1/3 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                                required={input_required}
                                disabled={is_disable}
                                value={userInfor?.first_name}
                            />
                        </div>

                        <div className="w-full flex gap-2 flex-row">
                            <label
                                htmlFor="identification_number"
                                className="w-1/3 font-bold"
                            >
                                Identification Number{" "}
                                <b className="text-red-600">*</b>
                            </label>
                            <label
                                htmlFor="date_of_birth"
                                className="w-1/3 font-bold"
                            >
                                Date of birth (mm/dd//yyyy){" "}
                                <b className="text-red-600">*</b>
                            </label>
                            <label htmlFor="gender" className="w-1/3 font-bold">
                                Gender <b className="text-red-600">*</b>
                            </label>
                        </div>
                        <div className="w-full flex gap-2">
                            <input
                                id="identification_number"
                                name="identification_number"
                                type="text"
                                className="w-1/3 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                                required={input_required}
                                disabled={is_disable}
                                value={studentInfor?.identification_number}
                            />
                            <input
                                id="date_of_birth"
                                name="date_of_birth"
                                type="date"
                                className="w-1/3 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                                required={input_required}
                                disabled={is_disable}
                                value={studentInfor?.date_of_birth}
                            />
                            <select
                                id="gender"
                                name="gender"
                                className="w-1/3 h-12 border-2 border-black rounded p-2 focus:border-primary"
                                required={input_required}
                                disabled={is_disable}
                                value={studentInfor?.gender}
                            >
                                <option value="">Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div className="w-full flex gap-2 flex-row">
                            <label
                                htmlFor="address"
                                className="w-1/2 font-bold"
                            >
                                Address <b className="text-red-600">*</b>
                            </label>
                            <label
                                htmlFor="phone_number"
                                className="w-1/2 font-bold"
                            >
                                Phone number <b className="text-red-600">*</b>
                            </label>
                            <label
                                htmlFor="student_id"
                                className="w-1/2 font-bold"
                            >
                                Student ID ( auto generate ){" "}
                                <b className="text-red-600">*</b>
                            </label>
                        </div>
                        <div className="w-full flex gap-2">
                            <input
                                id="address"
                                name="address"
                                type="text"
                                className="w-1/2 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                                required={input_required}
                                disabled={is_disable}
                                value={studentInfor?.address}
                            />
                            <input
                                id="phone_number"
                                name="phone_number"
                                type="text"
                                className="w-1/2 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                                required={input_required}
                                disabled={is_disable}
                                value={studentInfor?.phone_number}
                            />
                            <input
                                id="student_id"
                                name="student_id"
                                type="text"
                                className="w-1/2 h-12 border-2 border-black rounded p-2 focus:outline-primary disabled:bg-gray-200"
                                value={userInfor?.display_id}
                                disabled={is_disable}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full h-fit flex flex-col justify-start gap-3.5 pt-2">
                    <div className="w-full flex gap-2 flex-row">
                        <label htmlFor="email" className="w-1/3 font-bold">
                            Email <b className="text-red-600">*</b>
                        </label>
                        <label htmlFor="password" className="w-1/3 font-bold">
                            Password <b className="text-red-600">*</b>
                        </label>
                        <label htmlFor="majors" className="w-1/3 font-bold">
                            Majors <b className="text-red-600">*</b>
                        </label>
                    </div>
                    <div className="w-full flex gap-2 flex-row">
                        <input
                            id="email"
                            name="email"
                            type="text"
                            className="w-1/3 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                            required
                            disabled={is_disable}
                            value={userInfor?.email}
                        />
                        <input
                            id="password"
                            name="password"
                            type="text"
                            className="w-1/3 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                            required
                            disabled={is_disable}
                            value={"************"}
                        />
                        <input
                            id="majors"
                            name="majors"
                            type="text"
                            className="w-1/3 h-12 border-2 border-black rounded p-2 focus:outline-primay"
                            disabled={is_disable}
                            value={userInfor?.majors}
                        />
                    </div>
                </div>
            </form>
        );
    };

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 background pt-14 block">
            <div className="w-full h-full flex items-center justify-center rounded">
                <motion.div

                    initial={{ opacity: 0.1, scale: 0.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-4/5 h-176 bg-white rounded flex flex-col overflow-scroll scroll-smooth no-scrollbar"
                >
                    <Header />

                    <div className="h-full w-full flex justify-center items-center">
                        {isLoading ? <LoadingIcon width={15} height={15} /> : <StudentInforForm />}
                    </div>

                </motion.div>
            </div>
        </div>
    );
};
