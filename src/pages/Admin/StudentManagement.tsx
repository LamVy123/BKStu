import Container from "../../component/Container";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { AddStudentIcon } from "../../assets/Icon";

const StudentManagement : React.FC = () => {
    const auth = useAuth();
    if (auth.role != 'admin') return <Navigate to={'/'} />

    const [ AddModel , setOpenAddModel ] = useState<boolean>(false)
    const openAddModel = () => { setOpenAddModel(true) }
    const closeAddModel = (e : React.ChangeEvent<any>) => { 
        if(e.target.classList.contains('model')){setOpenAddModel(false)}
    }

//Section 1
    //Search By selection
    const SearchBy : React.FC = () => {
        return (
            <div className="h-full w-20 border border-solid border-black rounded bg-white shadow-sm shadow-gray-700">

            </div>
        )
    }
    //Order selection
    const OrderBy : React.FC = () => {
        return (
            <div className="h-full w-20 border border-solid border-black rounded bg-white shadow-sm shadow-gray-700">

            </div>
        )
    }
    //Search Bar
    const SearchBar : React.FC = () => {
        return (
            <div className="w-full h-full border border-solid border-black rounded bg-white shadow-sm shadow-gray-700"></div>
        )
    }
    //Add Student Model
    const AddStudentModel : React.FC = () => {
        return (
            <div 
            style={{display: AddModel ? 'block' : 'none'}}
            onClick={(e) => closeAddModel(e)}
            className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 background hidden pt-14">
                <div className="model w-full h-full flex items-center justify-center">
                    <motion.div 
                    initial={{opacity:0.1,scale:0.1}}
                    animate={{opacity:1,scale:1}}
                    transition={{type:'spring', duration:0.5}}
                    className="w-3/5 h-160 bg-white rounded-md">

                    </motion.div>
                </div>
            </div>
        )
    }
    //Add Student button
    const AddStudentButton : React.FC = () => {
        return (
            <button 
                onClick={() => openAddModel()}
                className="h-full w-20 border border-solid border-black rounded bg-white shadow-sm shadow-gray-700 text-xs p-1 font-bold hover:bg-gray-200 flex items-center justify-center"
                >
                <motion.div whileHover={{scale:1.2}}>
                    <AddStudentIcon width={8} height={8} color="black" />
                </motion.div>
            </button>
        )
    }


//Section 2

    //Student Informaiton Model
    const StudentInformationModel : React.FC = () => {
        return (
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 background hidden"></div>
        )
    }
    

    //Main Component
    return (
        <Container>
            <AddStudentModel />
            <StudentInformationModel />
            <div className="w-full h-full flex flex-col items-start p-4 gap-4 bg-zinc-200">
                    <div className="section_1 w-full h-16 border border-solid border-black rounded-md bg-white shadow-sm shadow-gray-700 flex flex-row items-start p-2 gap-2">
                        <OrderBy/>
                        <SearchBy />
                        <SearchBar />
                        <AddStudentButton />
                    </div>
                    
                    <div className="section_2 w-full h-full border border-solid border-black rounded-md bg-white shadow-sm shadow-gray-700">

                    </div>

            </div>
        </Container>
    )
}

export default StudentManagement