import React, { useEffect, useState } from "react";
import { Class, ClassDetail, ClassDetailFactory, ClassFactory } from "../../class&interface/Class";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { classColRef, classDetailColRef } from "../../config/firebase";
import { Section, SectionFactory } from "../../class&interface/Section";
import CSection from "../../component/CSection";
import { LoadingIcon, } from "../../assets/Icon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { StudentDetail } from "../../class&interface/User";
import Footer from "../../component/Footer";

interface ClassProp {

}

const MyClass: React.FC<ClassProp> = ({ }) => {

    const navigate = useNavigate();

    const auth = useAuth()
    const userDetail = auth.userDetail as StudentDetail
    const currentClassID = userDetail.classes_id

    const [currentClass, setCurrentClass] = useState<Class>()
    const [currentClassDetail, setCurrentClassDetail] = useState<ClassDetail>()


    const [isLoading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchClass = async () => {
            const classRef = doc(classColRef, currentClassID)
            const classDetailRef = doc(classDetailColRef, currentClassID)

            const classFactory = new ClassFactory()
            await getDoc(classRef)
                .then((classes) => {
                    if (classes.data()?.id != undefined) {
                        setCurrentClass(classFactory.CreateClassWithDocumentData(classes.data()))
                    } else {
                        navigate('/class_management')
                    }
                })

            const classDetailFactoty = new ClassDetailFactory()
            await getDoc(classDetailRef)
                .then((classesDetail) => {
                    setCurrentClassDetail(classDetailFactoty.CreateClassDetailWithDocumentData(classesDetail.data()))
                })
            setLoading(false)
        }
        if (currentClassID) {
            fetchClass()
        }

    }, [currentClassID])

    const ClassSection: React.FC = () => {
        const [currentSectionList, setCurrentSectionList] = useState<Section[]>([])

        useEffect(() => {
            const fetchSection = async () => {
                const classDetailDocRef = doc(classDetailColRef, `${currentClassID}`);
                const classSectionCol = collection(classDetailDocRef, 'section');
                const classSectionQuery = query(classSectionCol)

                let sectionList: Section[] = []
                const sectionFacoty = new SectionFactory()
                const classSectionSnapShot = await getDocs(classSectionQuery)

                classSectionSnapShot.forEach((sectionData) => {
                    const sectionDocRef = doc(classSectionCol, sectionData.data()?.id)
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
                        const classDocRef = doc(classDetailColRef, currentClassID)
                        const classSectionCol = collection(classDocRef, 'section')
                        const sectionDocRef = doc(classSectionCol, section.id)
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
            <div className="w-full min-h-fit flex flex-col justify-center items-center gap-4 text-3xl font-extrabold">
                <div>
                    {currentClassDetail ? (currentClassDetail.faculty) : null}
                </div>

                <div>
                    {currentClassDetail ? (currentClass?.majors) : null}
                </div>

                <div>
                    {currentClassDetail ? ('Lớp chủ nhiệm' + ' - ' + currentClassDetail?.teacher_name + " - " + currentClass?.code) : null}
                </div>
            </div>
        )
    }


    if (isLoading) {
        return (
            <div className="w-full h-screen border-solid  bg-white  flex flex-col items-center justify-center">
                <LoadingIcon width={10} height={10} />
            </div>
        )
    }

    return (
        <>
            <div className="min-w-full min-h-screen h-full pt-14 flex flex-col justify-start items-center">
                <div className="w-full h-full flex items-start justify-start p-4 ">
                    <div className="w-full min-h-screen h-full border-solid  bg-white  flex flex-col items-center justify-start">
                        <Header />
                        <ClassSection />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default MyClass