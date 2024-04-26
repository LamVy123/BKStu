
import Container from "../component/Container"
import { EmailIcon, ExitIcon, UserIcon, DashboardIcon, StudentsIcon, ScheduleIcon, HomeIcon } from "../assets/Icon"

import Select, { OptionInterface } from "../component/Select"
import { useEffect } from "react"
import { doc, getDoc, collection, query, getDocs } from "firebase/firestore"
import { testRef } from "../config/firebase"
import { motion } from "framer-motion"

const Test: React.FC = () => {

    useEffect(() => {
        const Fetch = async () => {
            const bla = doc(testRef, 'UGpeGH2gC2Nmr024fAtb')
            await getDoc(bla).then((doc) => {
                console.log(doc.id)
            })
            const subcol = collection(bla, 'bla')
            const q = query(subcol)
            const datas = await getDocs(q)
            datas.forEach((data) => {
                console.log(data?.data())
            })
        }

        Fetch()

    }, [])


    const optionList: OptionInterface[] = [{ value: 'bla', lable: 'BLA' }, { value: 'blo', lable: 'BLO' }, { value: 'bli', lable: 'BLI' }]

    return (
        <Container>
            <div className="w-full h-full flex flex-row items-center justify-center gap-2">
                <ExitIcon width={10} height={10} color="black" />
                <EmailIcon width={10} height={10} color="black" />
                <UserIcon width={10} height={10} color="black" />
                <DashboardIcon width={10} height={10} color="black" />
                <StudentsIcon width={10} height={10} color="black" />
                <ScheduleIcon width={10} height={10} color="black" />
                <HomeIcon width={10} height={10} color="black" />

                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 bg-black rounded-md"></motion.button>
                <Select name="test" id="test" option={optionList} height={10} />
            </div>
        </Container>
    )
}

export default Test