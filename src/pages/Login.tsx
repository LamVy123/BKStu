import { FormEvent, useRef, useState } from "react";
import Container from "../component/Container";
import { EmailIcon, EyeIcon, EyeOffIcon, LoadingIcon } from "../assets/Icon";
import { useAuth } from "../context/AuthContext";



const Login: React.FC = () => {
    const auth = useAuth()



    const LoginForm: React.FC = () => {
        const emailRef = useRef<HTMLInputElement | null>(null)
        const passwordRef = useRef<HTMLInputElement | null>(null)
        const [email, setEmail] = useState<string>('')
        const [password, setPassword] = useState<string>('')
        const [showPassword, setShowPassword] = useState<boolean>(false)

        function toggleShowPassword() {
            setEmail(emailRef.current?.value ? emailRef.current.value : '');
            setPassword(passwordRef.current?.value ? passwordRef.current.value : '');
            setShowPassword(showPassword => !showPassword);
        }

        function login(e: FormEvent) {
            e.preventDefault();
            const data = new FormData(e.currentTarget as HTMLFormElement)
            auth.LogInUser(data.get('email')?.toString() as string, data.get('password')?.toString() as string);
        }
        return (
            <form className="min-w-full h-fit p-8 border-solid border-black border rounded-md flex flex-col bg-white shadow-sm shadow-gray-700"
                onSubmit={(e) => login(e)}>
                <h1 className="text-3xl font-bold">Welcome to BKStu</h1>
                <div className="flex flex-col w-full">
                    <label htmlFor="email" className="font-bold text-xl mt-6">Email</label>
                    <div className="flex flex-row gap-4 w-full items-center mt-2">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            ref={emailRef}
                            className="w-full p-2 border-black border border-solid focus:outline-primary rounded shadow-sm shadow-gray-700"
                            placeholder="your_mail@gmail.com"
                            defaultValue={email}
                            required
                        />
                        <div className="p-0 m-0">
                            <EmailIcon height={8} width={8} color="gray" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="password" className="font-bold text-xl mt-6">Password</label>
                    <div className="flex flex-row gap-4 w-full items-center mt-2">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            ref={passwordRef}
                            className="w-full p-2 border-black border border-solid focus:outline-primary rounded shadow-sm shadow-gray-700"
                            defaultValue={password}
                            required
                        />
                        <div className="p-0 m-0" onClick={() => toggleShowPassword()}>
                            {!showPassword ? <EyeIcon height={8} width={8} color="gray" /> : <EyeOffIcon height={8} width={8} color="gray" />}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-start gap-2 mt-4">
                    <input id="checkbox" type="checkbox" className="w-4 h-4" />
                    <label htmlFor="checkbox">Remember me</label>
                </div>
                <div className="">
                    <button
                        type="submit"
                        className="text-2xl text-white rounded py-2 w-full bg-primary font-bold hover:bg-blue-700 border-solid border-black border mt-4 shadow-md shadow-gray-700"
                    >
                        {auth.isLoading ? <LoadingIcon width={8} height={8} /> : 'Log in'}
                    </button>
                </div>
            </form>
        )
    }

    const Contact: React.FC = () => {
        return (
            <div className="w-full h-40 p-8 border-solid border-black border rounded-md flex flex-col bg-white shadow-sm shadow-gray-700">
                <h1 className="text-red-700 font-bold">Technical support:</h1>
                <h1>Email: AdminMail@gmail.com</h1>
                <h1>Telephone: +84 xxxxxxxxxx</h1>
                <h1>Facebook: <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="text-primary hover:text-blue-800 hover:underline" target="_blank">BKStu</a></h1>
            </div>
        )
    }


    return (
        <Container>
            <div className="w-full h-full flex bg-Loginbg bg-no-repeat bg-cover max-lg:justify-center">
                <div className="w-2/5 h-full p-8 max-md:w-full max-lg:w-4/5 flex flex-col justify-start gap-8 bg-zinc-100">
                    <LoginForm />
                    <Contact />
                </div>
                <div className="w-3/5 h-full p-8 max-lg:hidden">
                    <div className="w-full h-full bg-black bg-opacity-40 rounded-md ">

                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Login