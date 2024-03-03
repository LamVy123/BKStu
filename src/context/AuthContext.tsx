import { createContext, useContext, useState, useLayoutEffect } from "react";
import { auth , db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { 
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    NextOrObserver,
    User
} from "firebase/auth";
import { getDoc, doc } from "firebase/firestore/lite";

//AuthProvider using useContext from React to pass property through all components inside AuthProvider with out using nested props

//Define the type of properties needed to use for the AuthContext
interface AuthContextType {
    currentUser : User | null,
    setCurrentUser : React.Dispatch<React.SetStateAction<User | null>>,
    LogInUser : (email: string, password: string) => void,
    LogOutUser : () => Promise<void>,
    CreateUser : (email: string, password: string) => Promise<void>,
    isLogin : boolean | null,
    role : string,
    isLoading : boolean,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
//Export useAuth so other component can use AuthProvider's properties
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) { throw new Error("useAuth must be used within an AuthProvider");}
    return context;
}

//define the type of children which are other React Component / ReactNode
interface Props { children? : React.ReactNode }

//AuthProvider component
const AuthProvider = ({children} : Props) => {
    const [ currentUser , setCurrentUser ] = useState<User | null>(null)
    const localRole = localStorage.getItem('role');
    const [ role , setRole ] = useState<string>(localRole ? localRole : 'guest')
    const [ isLogin , setLogin ] = useState<boolean | null>(null)
    const [ isLoading , setLoading ] = useState<boolean>(false);
    const navigate = useNavigate()

    //Get current user and set login 
    useLayoutEffect(() => {
        const unsubscribe = userStateListener((user) => {
        if (user) {
            setCurrentUser(user)
            setLogin(true)
            const docRef = doc(db, 'users_ref', user.uid )
            getDoc(docRef)
            .then((doc) => {
                setRole(doc.data()?.['role'])
                localStorage.setItem('role',doc.data()?.['role'])
            })
        }});
        return unsubscribe
    }, [currentUser]);
    
//Auth function

    //Sign in User
    const LogInUser = async ( email : string , password : string ) => {
        if (!email || !password) return;
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/')
        } catch (err) {
            alert('Wrong Email or Password')
        }
        setLoading(false)
    }

    //Sign out User
    const LogOutUser = async () => {
        await signOut(auth)
        navigate('/')
        localStorage.setItem('role','guest')
        window.location.reload();
    }

    //Create User
    const CreateUser = async (email : string , password : string) => {
        if (!email || !password) return;
        try {
            await createUserWithEmailAndPassword(auth, email, password)
        } catch(err) {
            console.log(err)
        }
    }

    //From Internet :)) 
    const userStateListener = (callback:NextOrObserver<User>) => {
        return onAuthStateChanged(auth, callback)
    }

    //Create an object contain properties for the AuthContext.Provider
    const value = {
        currentUser,
        setCurrentUser,
        LogInUser,
        LogOutUser,
        CreateUser,
        isLogin,
        role,
        isLoading
    }
    
    //Return the Provider
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider