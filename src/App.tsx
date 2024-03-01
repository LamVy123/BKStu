import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AuthProvider from "./context/AuthContext"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Test from "./test/test"

function App() {

    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/test" element={<Test />}/>
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default App
