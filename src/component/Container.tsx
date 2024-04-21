import { ReactNode } from "react"

interface ContainerProps {
    children: ReactNode
}

const Container: React.FC<ContainerProps> = ({ children }) => {
    return (
        <div className="container min-w-full h-screen pt-14 flex justify-center items-center overflow-hidden">
            {children}
        </div>
    )
}

export default Container