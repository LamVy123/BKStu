import { Link } from "react-router-dom"

function Navbar () {
    return (
        <nav className="navigation min-w-full h-fit bg-primary fixed top-0 flex justify-between z-50 border-solid border border-black">
            <ul className="list-none text-center">
                <li className="inline-block h-full my-2.5 mx-4 text-white font-bold"><Link to='/' className="text-2xl">BKStu</Link></li>
            </ul>
            <ul className="list-none text-center">
                <li className="inline-block h-full my-2.5 mx-4"><Link to='/login' className="text-lg font-bold rounded p-1 bg-white hover:bg-gray-300">Log in</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar