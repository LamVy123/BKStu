import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

import Footer from "../component/Footer"
import Container from "../component/Container"

const Home: React.FC = () => {
    const auth = useAuth()
    return (
        <>
            <Container>
                <div className="w-full h-full p-8">
                    <div className="h-full w-full bg-BKbg bg-cover bg-no-repeat bg-bottom border-solid border rounded border-black grid grid-cols-12 grid-rows-12 shadow-md shadow-gray-500">
                        <div className="col-start-2 col-end-6 row-start-3 row-end-11 w-full h-full bg-black bg-opacity-70 p-6 rounded-sm relative">
                            <h1 className="text-5xl font-bold text-primary text-start">BKStu</h1>
                            <h1 className="text-2xl font-bold text-primary text-start">Where Education Meets Innovation</h1>
                            <p className="text-white opacity-70 text-xl pt-4">Trường Đại học Bách khoa - Ho Chi Minh City University of Technology là trường đại học thành viên của hệ thống Đại học Quốc gia TP.HCM chuyên ngành kỹ thuật lớn và được xếp vào nhóm đại học trọng điểm quốc gia Việt Nam.</p>
                            {!auth.isLogin && <Link to={'/login'} className="text-2xl text-white rounded py-3 px-4 bg-primary font-bold absolute bottom-6 left-6 ">{'Log in'}</Link>}
                        </div>
                    </div>
                </div>
            </Container>
            <Footer />
        </>
    )
}

export default Home