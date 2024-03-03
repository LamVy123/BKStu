import Container from "./Container";
import { LoadingIcon } from "../assets/Icon";

const LoadingScreen : React.FC = () => {
    return (
        <Container>
            <div className="w-full h-full flex items-center justify-center p-4 bg-zinc-200">
                <LoadingIcon width={15} height={15} />
            </div>
        </Container>
    )
}

export default LoadingScreen