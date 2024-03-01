import React from "react"                         //import dependency
import { Link } from "react-router-dom"

import Footer from "../component/Footer"          //import component
import Container from "../component/Container"
import Navigation from "../component/Navigation"

const Home : React.FC = () => {
    return (
        <>
            <Container>
                <Navigation/>
                <div className="w-full h-full p-8">
                    <div className="h-full w-full bg-BKbg bg-cover bg-no-repeat bg-bottom border-solid border rounded border-black grid grid-cols-12 grid-rows-12 shadow-md shadow-gray-500">
                        <div className="col-start-2 col-end-6 row-start-3 row-end-11 w-full h-full bg-black bg-opacity-60 p-6 rounded-sm relative">
                            <h1 className="text-4xl font-bold text-primary">BKStu</h1>
                            <p className="text-white opacity-70 text-lg pt-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
                            <Link to='/login' className="text-2xl text-white rounded py-3 px-4 bg-primary font-bold absolute bottom-6 left-6 ">Log in</Link>
                        </div>
                    </div>
                </div>
            </Container>
            <Footer/>
        </>
    )
}

export default Home