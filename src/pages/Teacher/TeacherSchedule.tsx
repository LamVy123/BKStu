import Container from "../../component/Container";

const TeacherSchedule : React.FC = () => {
    return (
        <Container>
            <div className="w-full h-full flex items-center justify-center p-4 bg-zinc-200">
                <div className="w-full h-full border-solid border border-black rounded-md shadow-sm bg-white shadow-gray-700 flex items-center justify-center">
                    <h1>Teacher Schedule</h1>
                </div>
            </div>
        </Container>
    )
}

export default TeacherSchedule