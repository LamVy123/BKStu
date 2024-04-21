import React, { useEffect, useState } from "react";
import { Course, CourseDetail, CourseDetailFactory, CourseFactory } from "../../../class&interface/Course";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { courseColRef, courseDetailColRef } from "../../../config/firebase";
import { v4 } from "uuid";
import { Section, SectionFactory } from "../../../class&interface/Section";
import CSection from "../../../component/CSection";
import { ArrowLeftIcon, LoadingIcon } from "../../../assets/Icon";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface CourseProp {
    currentCourseID: string
}

const CourseInfor: React.FC<CourseProp> = ({ currentCourseID }) => {

    const navigate = useNavigate();

    const [currentCourse, setCurrentCourse] = useState<Course>()
    const [currentCourseDetail, setCurrentCourseDetail] = useState<CourseDetail>()

    const [currentPage, setCurrentPage] = useState<number>(0);

    const [isLoading, setLoading] = useState<boolean>(true)

    interface PageInterface {
        name: string,
        pageNumber: number,
    }

    const pageList: PageInterface[] = [
        { pageNumber: 0, name: 'Khóa học' },
    ]

    useEffect(() => {
        const fetchCourse = async () => {
            const courseRef = doc(courseColRef, currentCourseID)
            const courseDetailRef = doc(courseDetailColRef, currentCourseID)

            const courseFactory = new CourseFactory()
            await getDoc(courseRef)
                .then((course) => {
                    if (course.data()?.id != undefined) {
                        setCurrentCourse(courseFactory.CreateCourseWithDocumentData(course.data()))
                    } else {
                        navigate('/my_class')
                    }
                })

            const courseDetailFactoty = new CourseDetailFactory()
            await getDoc(courseDetailRef)
                .then((courseDetail) => {
                    setCurrentCourseDetail(courseDetailFactoty.CreateCourseDetailWithDocumentData(courseDetail.data()))
                })
            setLoading(false)
        }
        fetchCourse()

    }, [])


    const getDateTime = () => {
        const date = new Date()
        return (date.getFullYear() + "/" + date.getMonth() + "/" + date.getDay() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds())
    }

    const CourseSection: React.FC = () => {
        const [currentSectionList, setCurrentSectionList] = useState<Section[]>([])

        useEffect(() => {
            const fetchSection = async () => {
                const courseDetailDocRef = doc(courseDetailColRef, `${currentCourseID}`);
                const courseSectionCol = collection(courseDetailDocRef, 'section');
                const courseSectionQuery = query(courseSectionCol)

                let sectionList: Section[] = []
                const sectionFacoty = new SectionFactory()
                const courseSectionSnapShot = await getDocs(courseSectionQuery)

                courseSectionSnapShot.forEach((sectionData) => {
                    const sectionDocRef = doc(courseSectionCol, sectionData.data()?.id)
                    sectionFacoty.CreateSectionWithDocumentData(sectionData.data(), sectionDocRef).then((n_section) => {
                        sectionList = [...sectionList, n_section]
                        sectionList.sort((a, b) => {
                            const dateA = new Date(a.time_created);
                            const dateB = new Date(b.time_created);

                            if (dateA < dateB) {
                                return -1;
                            } else if (dateA > dateB) {
                                return 1;
                            } else {
                                return 0;
                            }
                        })
                        setCurrentSectionList(sectionList)
                    })
                })

            }

            fetchSection()
        }, [])

        return (
            <div className="w-full h-full flex items-start justify-center mt-16">
                <div className="w-full h-full flex flex-col justify-start items-center">
                    {currentSectionList.map((section, index) => {
                        const courseDocRef = doc(courseDetailColRef, currentCourseID)
                        const courseSectionCol = collection(courseDocRef, 'section')
                        const sectionDocRef = doc(courseSectionCol, section.id)
                        return (
                            <CSection key={section.id} section={section} index={index} setCurrentSectionList={setCurrentSectionList} sectionDocRef={sectionDocRef} disableEdit />
                        )
                    })}
                </div>
            </div>
        )
    }

    const Header: React.FC = () => {
        return (
            <div className="w-full min-h-fit flex flex-col justify-center items-center gap-4">
                <div className="w-full h-fit flex flex-col justify-center items-center gap-2 text-3xl font-extrabold">
                    <div>
                        {`${currentCourse?.subject_name} - (${currentCourse?.subject_code}) - ${currentCourseDetail?.teacher}`}
                    </div>
                    <div>
                        {`${currentCourse?.semester} - ${currentCourse?.code}`}
                    </div>
                </div>
                <div className="w-full min-h-fit flex justify-center items-center">
                    {pageList.map((page, index) => {
                        return (
                            <button key={page.pageNumber} onClick={() => { setCurrentPage(page.pageNumber) }}
                                className="p-4 relative w-fit h-10 font-bold cursor-pointer flex items-center justify-center text-xl max-md:text-xs text-black">
                                <div className="text-black">
                                    {page.name}
                                </div>
                                {currentPage == index &&
                                    <motion.div
                                        transition={{ duration: 0.1 }}
                                        className="absolute inset-0 rounded-md bg-primary border border-solid border-black z-0" layoutId="pill">
                                        <span className="w-full h-full flex items-center justify-center absolute z-10 text-white">{page.name}</span>
                                    </motion.div>
                                }
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

    const Body: React.FC = () => {
        switch (currentPage) {
            case 0:
                return <CourseSection />
            default:
                return null
        }
    }


    if (isLoading) {
        return (
            <div className="w-full h-screen border-solid  bg-white  flex flex-col items-center justify-center">
                <LoadingIcon width={10} height={10} />
            </div>
        )
    }

    return (
        <div className="w-full h-full border-solid  bg-white  flex flex-col items-center justify-start">
            <Header />
            <Body />
        </div>
    )
}

export default CourseInfor