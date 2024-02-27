import Footer from "../../component/Footer"
import Navbar from "./Navbar"
import { Link } from "react-router-dom"

function Home() {
    return (
        <div className="container min-w-full h-screen">
            <Navbar />
            <div className="pt-16 w-full h-full p-4">
                <div className="h-full w-full bg-BKbg bg-cover bg-no-repeat bg-bottom border-solid border rounded border-black grid grid-cols-12 grid-rows-12">
                    <div className="col-start-2 col-end-6 row-start-3 row-end-11 w-full h-full bg-black bg-opacity-60 p-4 rounded-sm relative">
                        <h1 className="text-3xl font-bold text-primary">BKStu</h1>
                        <p className="text-white opacity-70 text-sm pt-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
                        <Link to='/login' className="text-lg text-white rounded py-2 px-3 bg-primary font-bold absolute bottom-4 left-4">Log in</Link>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Home