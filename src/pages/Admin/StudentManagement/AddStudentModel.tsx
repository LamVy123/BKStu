import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { StudentInfor, UserInfor } from "../../../types/User";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { ExitIcon } from "../../../assets/Icon";
import { useLayoutEffect, useState } from "react";

type AddStudentModelProps = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddStudentModel({ setOpen }: AddStudentModelProps) {
    const [index, setIndex] = useState<number>(0);
    const [autoID, setAutoID] = useState<string>("");
    const auth = useAuth();

    const generateID = (index: number) => {
        const currrent_date = new Date();
        return (
            "ST" +
            currrent_date.getFullYear().toString().substring(2, 4) +
            String(index).padStart(5, "0")
        );
    };

    let getIndexOnce = true;
    useLayoutEffect(() => {
        const getIndex = async () => {
            await getDoc(doc(db, "user_infor", "index")).then((doc) => {
                setAutoID(generateID(doc?.data()?.["index"]));
                setIndex(doc?.data()?.["index"]);
            });
        };
        if (getIndexOnce) {
            getIndex();
            getIndexOnce = false;
        }
    }, []);

    const AddStudentForm: React.FC = () => {
        const submit = (e: React.FormEvent) => {
            e.preventDefault();

            const data = new FormData(e.target as HTMLFormElement);
            const email = data.get("email")?.toString() as string;
            const password = data.get("password")?.toString() as string;

            if (email && password) {
                auth.CreateUser(email, password).then((user) => {
                    const uid = user.user.uid;

                    const student_infor: StudentInfor = {
                        identification_number: data
                            .get("identification_number")
                            ?.toString() as string,
                        date_of_birth: data
                            .get("date_of_birth")
                            ?.toString() as string,
                        gender: data.get("gender")?.toString() as string,
                        address: data.get("address")?.toString() as string,
                        phone_number: data
                            .get("phone_number")
                            ?.toString() as string,
                        display_id: autoID,
                    };

                    const user_infor: UserInfor = {
                        last_name: data.get("last_name")?.toString() as string,
                        middle_name: data
                            .get("middle_name")
                            ?.toString() as string,
                        first_name: data
                            .get("first_name")
                            ?.toString() as string,
                        display_id: autoID,
                        email: data.get("email")?.toString() as string,
                        role: "student",
                        majors: data.get("majors")?.toString() as string,
                    };
                    setDoc(doc(db, "student_infor", uid), student_infor);
                    setDoc(doc(db, "user_infor", uid), user_infor);
                    setDoc(doc(db, "user_infor", "index"), {
                        index: index + 1,
                    });

                    alert("Add Student Success!");
                    return;
                });
            }
        };

        const input_required = true;
        return (
            <form
                className="border-2 border-black border-solid rounded p-4 gap-4 w-full h-full flex flex-col justify-start overflow-scroll"
                onSubmit={(e) => submit(e)}
            >
                <div className="flex flex-initial flex-row justify-start w-full h-fit">

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
                            />
                            <input
                                id="middle_name"
                                name="middle_name"
                                type="text"
                                defaultValue=""
                                className="w-1/3 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                                required={input_required}
                            />
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                defaultValue=""
                                className="w-1/3 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                                required={input_required}
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
                            />
                            <input
                                id="date_of_birth"
                                name="date_of_birth"
                                type="date"
                                className="w-1/3 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                                required={input_required}
                            />
                            <select
                                id="gender"
                                name="gender"
                                className="w-1/3 h-12 border-2 border-black rounded p-2 focus:border-primary"
                                required={input_required}
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
                            />
                            <input
                                id="phone_number"
                                name="phone_number"
                                type="text"
                                className="w-1/2 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                                required={input_required}
                            />
                            <input
                                id="student_id"
                                name="student_id"
                                type="text"
                                className="w-1/2 h-12 border-2 border-black rounded p-2 focus:outline-primary disabled:bg-gray-200"
                                disabled
                                value={autoID}
                            />
                        </div>
                    </div>

                </div>

                <div className="w-full h-fit flex flex-col justify-start gap-4 pt-2">
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
                            defaultValue=""
                            className="w-1/3 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                            required
                        />
                        <input
                            id="password"
                            name="password"
                            type="text"
                            defaultValue=""
                            className="w-1/3 h-12 border-2 border-black rounded p-2 focus:outline-primary"
                            required
                        />
                        <input
                            id="majors"
                            name="majors"
                            type="text"
                            defaultValue=""
                            className="w-1/3 h-12 border-2 border-black rounded p-2 focus:outline-primay"
                        />
                    </div>
                </div>

                <div className="w-full h-full flex flex-row gap-2">
                    <div className="flex justify-start items-end w-1/2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="border-2 border-black rounded-md p-2 bg-zinc-200 hover:bg-zinc-400 text-black"
                            type="reset"
                        >
                            Clear
                        </motion.button>
                    </div>

                    <div className="flex justify-end items-end w-1/2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="border-2 border-black rounded-md p-2 bg-primary hover:bg-blue-700 text-white"
                            type="submit"
                        >
                            Submit
                        </motion.button>
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
                    <div className="w-full h-14 bg-primary flex flex-row items-center p-4 ">
                        <div className="h-full w-1/2 flex items-center justify-start">
                            <h1 className="text-white text-2xl font-bold w-fit">
                                Add Student
                            </h1>
                        </div>
                        <div className="h-full w-1/2 flex items-center justify-end">
                            <motion.button
                                className="rounded-full"
                                whileHover={{ scale: 1.3 }}
                                onClick={() => setOpen(false)}
                            >
                                <ExitIcon width={8} height={8} color="black" />
                            </motion.button>
                        </div>
                    </div>
                    <div className="w-full h-full p-4 flex overflow-hidden">
                        <AddStudentForm />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
