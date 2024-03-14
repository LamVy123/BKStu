import Container from "../../../component/Container";
import { useAuth } from "../../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import {
    AddUserIcon,
    SearchIcon,
    InformationIcon,
    LoadingIcon,
} from "../../../assets/Icon";
import { UserInfor } from "../../../types/User";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import AddStudentModel from "./AddStudentModel";
import StudentInformationModel from "./StudentInformationModel";

const StudentManagement: React.FC = () => {
    const auth = useAuth();
    if (auth.role != "admin") return <Navigate to={"/"} />;

    const [isOpenAddModel, setOpenAddModel] = useState<boolean>(false);
    const [isOpenInformationModel, setOpenInformationModel] = useState<boolean>(false);

    const [currentStudentID, setCurrentStudentID] = useState<string>('');
    const [studentList, setStudentList] = useState<UserInfor[]>([]);

    let fetchDataOnce = true;
    useLayoutEffect(() => {
        const FetchData = async () => {
            const user_infor = collection(db, "user_infor");
            const q = query(user_infor, where("role", "==", "student"));
            const docs = await getDocs(q);
            docs.forEach((doc) => {
                setStudentList((studentList) => [
                    ...studentList,
                    {
                        last_name: doc.data().last_name,
                        middle_name: doc.data().middle_name,
                        first_name: doc.data().first_name,
                        display_id: doc.data().display_id,
                        email: doc.data().email,
                        role: doc.data().role,
                        majors: doc.data().majors,
                    },
                ]);
            });
        };
        if (fetchDataOnce) {
            FetchData();
            fetchDataOnce = false;
        }
    }, []);

    function search(e: React.FormEvent) {
        e.preventDefault();
    }

    //Section 1
    //Search By selection
    const SearchBy: React.FC = () => {
        return (
            <div className="h-full w-32">
                <motion.select
                    whileHover={{ scale: 1.05 }}
                    className="h-full w-full border border-solid border-black rounded bg-white shadow-sm shadow-gray-700 text-sm font-bold hover:bg-gray-200 hover:cursor-pointer p-2"
                >
                    <option value="" className="text-sm font-bold">
                        Search By
                    </option>
                    <option value="first_name" className="text-sm font-bold">
                        First Name
                    </option>
                    <option value="last_name" className="text-sm font-bold">
                        Last Name
                    </option>
                    <option value="student_id" className="text-sm font-bold">
                        Student ID
                    </option>
                </motion.select>
            </div>
        );
    };
    //Search Bar
    const SearchBar: React.FC = () => {
        return (
            <motion.div className="w-full h-full border border-solid border-black rounded bg-white hover:bg-gray-200 shadow-sm shadow-gray-700 px-2 py-1 gap-2 flex items-center justify-start">
                <button type="submit">
                    <SearchIcon height={7} width={7} color="black" />
                </button>
                <input
                    type="text"
                    className="w-full h-full focus:outline-none text-lg font-bold bg-transparent"
                    placeholder="Search"
                />
            </motion.div>
        );
    };
    //Add Student button
    const AddStudentButton: React.FC = () => {
        return (
            <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setOpenAddModel(true)}
                className="h-full w-20 border border-solid border-black rounded bg-white shadow-sm shadow-gray-700 text-xs p-1 font-bold hover:bg-gray-200 flex items-center justify-center"
            >
                <div>
                    <AddUserIcon width={8} height={8} color="black" />
                </div>
            </motion.button>
        );
    };

    //Section 2

    const StudentListing: React.FC = () => {

        const Label: React.FC = () => {
            return (
                <div className="w-full h-14 grid grid-cols-12 grid-rows-1 gap-1">
                    <div className="w-full h-full col-span-3 flex items-center justify-start font-bold p-2 pl-4">
                        Name
                    </div>
                    <div className="w-full h-full col-span-2 flex items-center justify-start font-bold p-2 pl-3">
                        Student ID
                    </div>
                    <div className="w-full h-full col-span-3 flex items-center justify-start font-bold p-2">
                        Email
                    </div>
                    <div className="w-full h-full col-span-3 flex items-center justify-start font-bold p-2">
                        Majors
                    </div>
                </div>
            )
        }

        return (
            <ul key={'ul'} className="section_2 w-full h-full border border-solid border-black rounded-md bg-white shadow-sm shadow-gray-700 p-2 list-none flex flex-col gap-0 overflow-hidden">
                <Label />

                <hr className="solid bg-gray-500 border-gray-500"></hr>

                <div className="overflow-scroll h-full">
                    {studentList.sort(function (a, b) {
                        if (a.first_name < b.first_name) { return -1; }
                        if (a.first_name > b.first_name) { return 1; }
                        return 0;
                    }).map((student) => (
                        <div key={student.display_id} className="card" id={student.display_id}>
                            <li
                                className="w-full h-16 grid grid-cols-12 grid-rows-1 gap-1 hover:bg-gray-100 rounded-md p-2 "
                            >
                                <div className="w-full h-full col-span-3 flex items-center justify-start font-bold p-2 gap-4">
                                    <div className="w-10 h-10 border-solid border-black border rounded-full"></div>
                                    {student.last_name +
                                        " " +
                                        student.middle_name +
                                        " " +
                                        student.first_name}
                                </div>
                                <div className="w-full h-full col-span-2 flex items-center justify-start font-bold p-2">
                                    {student.display_id}
                                </div>
                                <div className="w-full h-full col-span-3 flex items-center justify-start font-bold p-2">
                                    {student.email}
                                </div>
                                <div className="w-full h-full col-span-3 flex items-center justify-start font-bold p-2">
                                    {student.majors}
                                </div>
                                <div
                                    className="w-full h-full flex items-center justify-center font-bold p-2"
                                >
                                    <motion.button whileHover={{ scale: 1.1 }} onClick={(e) => {
                                        const target = e.target as HTMLElement
                                        setCurrentStudentID(target.closest(".card")?.id.toString() as string)
                                        setOpenInformationModel(true)
                                    }}>
                                        <InformationIcon
                                            width={10}
                                            height={10}
                                            color="gray"
                                        />
                                    </motion.button>
                                </div>
                            </li>
                            <hr
                                className="solid bg-gray-500 border-gray-500"
                            />
                        </div>
                    ))}
                </div>
            </ul >
        );
    };

    //Main Component
    return (
        <Container>
            {isOpenAddModel && <AddStudentModel setOpen={setOpenAddModel} />}
            {isOpenInformationModel && <StudentInformationModel setOpen={setOpenInformationModel} currentStudentID={currentStudentID} />}
            <div className="w-full h-full flex flex-col items-start p-4 gap-4 bg-zinc-200">
                <div className="section_1 w-full h-12 flex flex-row items-start gap-4">
                    <form
                        className="w-full h-full flex flex-row justify-start gap-4"
                        onSubmit={search}
                    >
                        <SearchBy />
                        <SearchBar />
                    </form>
                    <AddStudentButton />
                </div>
                <div className="w-full h-full flex justify-center items-center overflow-hidden">
                    {studentList.length == 0 ? <LoadingIcon width={15} height={15} /> : <StudentListing />}
                </div>
            </div>
        </Container>
    );
};

export default StudentManagement;
