import { RefreashIcon } from "../assets/Icon"
import { motion } from "framer-motion"

const ErrorScreen: React.FC = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-10 bg-white text-4xl text-red-600 font-extrabold">
            Có lỗi gì đó đã xảy ra! Xin hãy refresh trang để thử lại
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => location.reload()}
                className="w-fit h-fit px-10 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg">
                <RefreashIcon width={15} height={15} color="white" />
            </motion.button>
        </div>
    )
}

export default ErrorScreen