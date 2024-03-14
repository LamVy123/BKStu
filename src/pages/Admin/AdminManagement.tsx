import Container from "../../component/Container";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { AddUserIcon, DropDownIcon, SearchIcon} from "../../assets/Icon";

const AdminManagement : React.FC = () => {
    const auth = useAuth();
    if (auth.role != 'admin') return <Navigate to={'/'} />

    const [ AddModel , setOpenAddModel ] = useState<boolean>(false)
    const openAddModel = () => { setOpenAddModel(true) }
    const closeAddModel = (e : React.ChangeEvent<any>) => { 
        if(e.target.classList.contains('model')){setOpenAddModel(false)}
    }

//Section 1
    //Order selection
    const Order : React.FC = () => {
        return (
            <div className="h-full w-40 border border-solid border-black rounded bg-white shadow-sm shadow-gray-700 flex items-center justify-center hover:bg-gray-200 hover:cursor-pointer">
                <motion.div 
                whileHover={{scale:1.1}}
                className="h-full w-full flex flex-row items-center justify-center gap-1"
                >
                    <h1 className="text-sm font-bold">Order</h1>
                    <DropDownIcon width={7} height={7} color="black" />
                </motion.div>
            </div>
        )
    }
    //Search By selection
    const SearchBy : React.FC = () => {
        return (
            <div className="h-full w-40 border border-solid border-black rounded bg-white shadow-sm shadow-gray-700 flex items-center justify-center hover:bg-gray-200 hover:cursor-pointer">
                <motion.div 
                whileHover={{scale:1.1}}
                className="h-full w-full flex flex-row items-center justify-center gap-1"
                >
                    <h1 className="text-sm font-bold">Search By</h1>
                    <DropDownIcon width={7} height={7} color="black" />
                </motion.div>
            </div>
        )
    }
    //Search Bar
    const SearchBar : React.FC = () => {
        return (
            <div className="w-full h-full border border-solid border-black rounded bg-white shadow-sm shadow-gray-700 px-2 py-1 gap-2 flex items-center justify-start">
                <SearchIcon height={7} width={7} color="black" />
                <input type="text" className="w-full h-full focus:outline-none text-lg font-bold" placeholder="Search"/>
            </div>
        )
    }
    //Add Admin Model
    const AddAdminModel : React.FC = () => {

        const addAdmin = () => {}

        const AddAdminForm : React.FC = () => {
            return (
                <form onSubmit={() => addAdmin()}>

                </form>
            )
        }

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
                    className="w-4/5 h-160 bg-white rounded-md"
                    >
                        <AddAdminForm />
                    </motion.div>
                </div>
            </div>
        )
    }
    //Add Admin button
    const AddAdminButton : React.FC = () => {
        return (
            <button 
                onClick={() => openAddModel()}
                className="h-full w-20 border border-solid border-black rounded bg-white shadow-sm shadow-gray-700 text-xs p-1 font-bold hover:bg-gray-200 flex items-center justify-center"
                >
                <motion.div whileHover={{scale:1.2}}>
                    <AddUserIcon width={8} height={8} color="black" />
                </motion.div>
            </button>
        )
    }


//Section 2

    //Admin Informaiton Model
    const AdminInformationModel : React.FC = () => {
        return (
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 background hidden"></div>
        )
    }
    

    //Main Component
    return (
        <Container>
            <AddAdminModel />
            <AdminInformationModel />
            <div className="w-full h-full flex flex-col items-start p-4 gap-4 bg-zinc-200">
                    <div className="section_1 w-full h-16 border border-solid border-black rounded-md bg-white shadow-sm shadow-gray-700 flex flex-row items-start p-2 gap-2">
                        <Order/>
                        <SearchBy />
                        <SearchBar />
                        <AddAdminButton />
                    </div>
                    
                    <div className="section_2 w-full h-full border border-solid border-black rounded-md bg-white shadow-sm shadow-gray-700">

                    </div>

            </div>
        </Container>
    )
}

export default AdminManagement