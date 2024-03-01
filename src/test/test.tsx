import React from "react";
import Container from "../component/Container";

const Test : React.FC = () => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    return (
        <Container>
            <div className="flex justify-center items-center h-full w-full">
                
            </div>
        </Container>
    )
}

export default Test