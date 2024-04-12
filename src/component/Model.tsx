type ModelProps = {
    children: React.ReactNode,
}

function Model({ children }: ModelProps) {
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-15 background pt-14 flex items-center justify-center overflow-hidden z-50">
            {children}
        </div>
    )
}

export default Model