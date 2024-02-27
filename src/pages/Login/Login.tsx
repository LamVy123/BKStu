import { useRef } from "react";
import Navbar from "./Navbar";

function Login() {
    let emailRef = useRef<HTMLInputElement>(null);
    let passwordRef = useRef<HTMLInputElement>(null);   

    function login(e: React.ChangeEvent<any>) {
        e.preventDefault();
        console.log(emailRef.current?.value)
        console.log(passwordRef.current?.value)
        alert('Wrong Email or Password')
    }

    return (
        <div className="container min-w-full h-screen flex justify-center items-center pt-16 bg-Loginbg bg-cover bg-no-repeat">
            <Navbar />
            <div className="w-64 h-1/2 border-solid border-black border-2 rounded-tl-md rounded-bl-md p-8 pt-14 flex items-center flex-col relative gap-4 bg-white">
                <div className="w-24 h-24 bg-usericon bg-contain border-solid border-black border-2 rounded-full absolute -top-12"/>
                <h1 className="text-4xl font-bold">Login</h1>
                <form className="flex items-center gap-4 flex-col" onSubmit={(e) => login(e)}>
                    <input type="email" className="border-solid border-2 border-gray-500 rounded-lg w-52 h-10 p-4 text-xs" placeholder="Email" 
                    ref={emailRef} required/>
                    <input type="password" className="border-solid border-2 border-gray-500 rounded-lg w-52 h-10 p-4 text-xs" placeholder="Password" 
                    ref={passwordRef} required/>
                    <button className="text-lg text-white rounded py-1 px-8 bg-primary font-bold hover:bg-blue-700 border-solid border-black border-2">Log in</button>
                </form>
            </div>
            <div id='pop' className="w-64 h-1/2 bg-white border-solid border-2 border-l-0 border-black">

            </div>
        </div>
    )
}

export default Login