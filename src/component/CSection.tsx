import { FormEvent, useState } from "react";
import { ArrowDownIcon, ArrowRightIcon, MinusIcon, PlusIcon, TrashIcon } from "../assets/Icon";
import { Section, SubSection } from "../class&interface/Section";
import { v4 } from "uuid";
import Model from "./Model";
import { DocumentData, DocumentReference, collection, deleteDoc, doc, setDoc } from "firebase/firestore";

interface CSectionProps {
    section: Section
    index: number
    setCurrentSectionList: React.Dispatch<React.SetStateAction<Section[]>>
    sectionDocRef: DocumentReference<DocumentData, DocumentData>
    disableEdit?: boolean
}

const CSection: React.FC<CSectionProps> = ({ section, index, setCurrentSectionList, sectionDocRef, disableEdit }) => {

    const [isOpen, setOpen] = useState<boolean>(section.title == '');

    const [edit, setEdit] = useState<boolean>(section.title == '');

    const [prevSection, setPrevSection] = useState<Section>(section)

    const [deleteSubsectionList, setDeleteSubSectionList] = useState<string[]>([])


    const save = (e: FormEvent) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget as HTMLFormElement);

        const subSectionCol = collection(sectionDocRef, 'sub_section')

        let subSectionList: SubSection[] = [];
        section.sub_sections.forEach((subSection) => {
            if (deleteSubsectionList.indexOf(subSection.id) > -1) {
                const subSectionDocRef = doc(subSectionCol, subSection.id)
                deleteDoc(subSectionDocRef)
            } else {
                const description = document.getElementById(subSection.id)?.innerHTML.toString() as string;
                const n_subsection = new SubSection(subSection.id, subSection.time_created, description);
                subSectionList = [...subSectionList, n_subsection];
                const subSectionDocRef = doc(subSectionCol, n_subsection.id)
                setDoc(subSectionDocRef, n_subsection.getInterface())
            }
        });

        const title = data.get('title')?.toString() as string;
        const n_section = new Section(title, section.id, section.time_created, subSectionList, false);
        setDoc(sectionDocRef, n_section.getInterface())

        setCurrentSectionList(prevSectionList => {
            let newSectionList = [...prevSectionList]
            newSectionList[index] = n_section
            return newSectionList
        })

        setDeleteSubSectionList([])
        setEdit(false);
    };

    const renderParagraphWithLinks = (description: string) => {
        const urlRegex = /(https:\/\/[^\s]+(?=\s|$))/g; // Updated regex
        if (description) {

            const replacedText = description.replace(urlRegex, '<a target="blank" class="text-blue-500 hover:underline" href="$1">$1</a>');
            return { __html: replacedText };
        }
        return { __html: '' };
    };

    const getDateTime = () => {
        const date = new Date()
        return date.toString()
    }

    const addSubSection = () => {
        const n_subsection = new SubSection(v4(), getDateTime(), '')
        const n_section = new Section(section.title, section.id, section.time_created, [...section.sub_sections, n_subsection], false)
        setCurrentSectionList(prevSectionList => {
            let newSectionList = [...prevSectionList]
            newSectionList[index] = n_section
            return newSectionList
        })
    }

    const deleteSubSection = (id: string) => {
        setDeleteSubSectionList([...deleteSubsectionList, id])
    };

    const deleteSection = (id: string) => {
        const subSectionCol = collection(sectionDocRef, 'sub_section')
        section.sub_sections.forEach((subSection) => {
            const subSectionDocRef = doc(subSectionCol, subSection.id)
            deleteDoc(subSectionDocRef)
        })

        deleteDoc(sectionDocRef)

        setCurrentSectionList(prevItems => prevItems.filter(item => item.id !== id))
    }


    const handleEdit = () => {
        setEdit(true);
        setOpen(true);
        setPrevSection(section)
    };

    const handleCancel = () => {
        setEdit(false);
        setCurrentSectionList(prevSectionList => {
            let newSectionList = [...prevSectionList]
            newSectionList[index] = prevSection
            return newSectionList
        })
        setDeleteSubSectionList([])
    }


    const SaveButton: React.FC = () => {
        const [open, setOpen] = useState<boolean>(false);
        return (
            <>
                {open && <Model>
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-fit h-fit p-8 gap-8 rounded-2xl bg-white border border-black border-solid flex flex-col justify-end items-end">
                            <h1 className="text-xl font-bold">Bạn có chắc muốn lưu thay đổi không ?</h1>
                            <div className="w-fit h-fit flex flex-row gap-8 text-xl">
                                <button type="button" onClick={() => setOpen(false)} className="w-28 h-12 bg-red-500 hover:bg-red-600 flex justify-center items-center font-bold rounded-md text-white p-4">Cancel</button>
                                <button type="submit" className="w-28 h-12 bg-green-500 hover:bg-green-600 flex justify-center items-center font-bold rounded-md text-white p-4">Confirm</button>
                            </div>
                        </div>
                    </div>
                </Model>}
                <button type="button" onClick={() => setOpen(true)} className="text-white py-2 px-4 bg-primary ml-3 text-xs font-normal rounded-md">Lưu</button>
            </>
        )
    }

    const DeleteSectionButton: React.FC = () => {
        const [open, setOpen] = useState<boolean>(false);
        return (
            <>
                {open && <Model>
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-fit h-fit p-8 gap-8 rounded-2xl bg-white border border-black border-solid flex flex-col justify-end items-end">
                            <h1 className="text-xl text-black font-bold">Bạn có chắc muốn xóa section này không ?</h1>
                            <div className="w-fit h-fit flex flex-row gap-8 text-xl">
                                <button type="button" onClick={() => deleteSection(section.id)} className="w-28 h-12 bg-red-500 flex justify-center items-center font-bold rounded-md hover:bg-red-600 text-white p-4">Confirm</button>
                                <button type="button" onClick={() => setOpen(false)} className="w-28 h-12 bg-green-500 flex justify-center items-center font-bold rounded-md hover:bg-green-600 text-white p-4">Cancel</button>
                            </div>
                        </div>
                    </div>
                </Model>}
                <button onClick={() => setOpen(true)} type="button" className="mr-auto"><TrashIcon width={7} height={7} color="red" /></button>
            </>
        )
    }

    if (disableEdit) {
        return (
            <div className="w-8/12 h-fit flex flex-col gap-4">
                <form onSubmit={save} className="w-full h-fit flex flex-col">
                    <div className="w-full h-fit p-2 gap-2 flex flex-row items-center justify-start text-2xl font-bold bg-white">
                        {!isOpen ?
                            <button type="button" onClick={() => setOpen(true)} className="w-fit h-fit bg-gray-100 hover:bg-gray-200 rounded-full p-1">
                                <ArrowRightIcon width={7} height={7} color="black" />
                            </button>
                            :
                            <button type="button" onClick={() => { setOpen(false); setEdit(false) }} className="w-fit h-fit bg-gray-100 hover:bg-gray-200 rounded-full p-1" disabled={edit}>
                                <ArrowDownIcon width={7} height={7} color="black" />
                            </button>
                        }
                        <div className="min-w-fit py-1 px-2 border-2 border-transparent">
                            {section.title}
                        </div>
                    </div>
                    {isOpen &&
                        <div className="w-full h-fit p-2 flex flex-col gap-4 items-center justify-start text-base bg-white">
                            {
                                section.sub_sections.map((subsection) => {
                                    if (deleteSubsectionList.indexOf(subsection.id) > -1) return null
                                    return (
                                        <div key={subsection.id} className="w-full h-fit flex flex-row">
                                            <blockquote id={subsection.id} style={{ minHeight: '43.25px' }}
                                                className="w-full h-fit border-2 p-2 border-gray-300 rounded-md bg-snow whitespace-pre-wrap hover:border-sky-300"
                                                dangerouslySetInnerHTML={renderParagraphWithLinks(subsection.description)} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </form>
                <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>
            </div>
        )
    }

    return (
        <div className="w-8/12 h-fit flex flex-col gap-4">
            <form onSubmit={save} className="w-full h-fit flex flex-col">
                <div className="w-full h-fit p-2 gap-2 flex flex-row items-center justify-start text-2xl font-bold bg-white">
                    {!isOpen ?
                        <button type="button" onClick={() => setOpen(true)} className="w-fit h-fit bg-gray-100 hover:bg-gray-200 rounded-full p-1">
                            <ArrowRightIcon width={7} height={7} color="black" />
                        </button>
                        :
                        <button type="button" onClick={() => { setOpen(false); setEdit(false) }} className="w-fit h-fit bg-gray-100 hover:bg-gray-200 rounded-full p-1" disabled={edit}>
                            <ArrowDownIcon width={7} height={7} color="black" />
                        </button>
                    }


                    {
                        !edit ?
                            <>
                                <div className="min-w-fit py-1 px-2 border-2 border-transparent">
                                    {section.title}
                                </div>
                                <button type="button"
                                    onClick={() => handleEdit()}
                                    className="text-blue-500 py-2 px-4 ml-auto text-xs font-normal">
                                    Chỉnh sửa
                                </button>
                            </>
                            :
                            <>
                                <input type="text" id="title" name="title" required disabled={!edit} defaultValue={section.title}
                                    className="bg-white border-2 border-solid border-black rounded-md py-1 px-2 outline-none focus:border-transparent 
                                focus:outline-blue-300 focus:outline-2 focus:ring-2 focus:ring-blue-300 disabled:border-gray-300 w-8/12"
                                />
                                <DeleteSectionButton />
                                {!section.is_new && <button type="button" onClick={() => handleCancel()} className="text-primary py-2 px-4 text-xs font-normal">Hủy</button>}
                                <SaveButton />
                            </>
                    }
                </div>
                {isOpen &&
                    <div className="w-full h-fit p-2 flex flex-col gap-4 items-center justify-start text-base bg-white">
                        {
                            section.sub_sections.map((subsection) => {
                                if (deleteSubsectionList.indexOf(subsection.id) > -1) return null

                                if (edit) {
                                    return (
                                        <div key={subsection.id} className="w-full h-fit flex flex-row">
                                            <blockquote id={subsection.id} contentEditable
                                                className="w-full h-fit border-2 p-2 border-black rounded-md bg-snow whitespace-pre-wrap"
                                                dangerouslySetInnerHTML={{ __html: subsection.description }} />
                                            <div className="w-8 h-full flex justify-center items-center">
                                                <button onClick={() => deleteSubSection(subsection.id)} type="button" className="w-8 h-8 p-2 flex items-center justify-center">
                                                    <MinusIcon width={6} height={6} color="red" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                                return (
                                    <div key={subsection.id} className="w-full h-fit flex flex-row">
                                        <blockquote id={subsection.id} style={{ minHeight: '43.25px' }}
                                            className="w-full h-fit border-2 p-2 border-gray-300 rounded-md bg-snow whitespace-pre-wrap hover:border-sky-300"
                                            dangerouslySetInnerHTML={renderParagraphWithLinks(subsection.description)} />
                                    </div>
                                )
                            })
                        }
                        {edit && <button type="button" onClick={() => addSubSection()} className="w-fit h-fit bg-primary rounded-full"><PlusIcon width={8} height={8} color="white" /></button>}
                    </div>
                }
            </form>
            <hr className="solid bg-gray-200 border-gray-200 border rounded-full"></hr>
        </div>
    )
}

export default CSection

