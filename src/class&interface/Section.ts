import { DocumentData, DocumentReference, collection, getDocs, query } from "firebase/firestore";

export interface SectionInterface {
    title: string;
    id: string;
    time_created: string,
}

export class Section implements SectionInterface {
    private _title: string;
    private _id: string;
    private _time_created: string;
    private _sub_sections: SubSection[];
    private _is_new: boolean;

    constructor(
        title: string,
        id: string,
        time_created: string,
        sub_sections: SubSection[],
        is_new: boolean,
    ) {
        this._title = title;
        this._id = id;
        this._time_created = time_created
        this._sub_sections = sub_sections;
        this._is_new = is_new
    }

    // Getters
    public get title(): string {
        return this._title;
    }

    public get id(): string {
        return this._id;
    }

    public get time_created(): string {
        return this._time_created
    }

    public get sub_sections(): SubSection[] {
        return this._sub_sections;
    }

    public get is_new(): boolean {
        return this._is_new
    }

    // Method to get interface
    public getInterface(): SectionInterface {
        return {
            title: this._title,
            id: this._id,
            time_created: this._time_created
        };
    }
}

export class SectionFactory {
    constructor () {}

    public async CreateSectionWithDocumentData (data : DocumentData | undefined, docRef : DocumentReference<DocumentData, DocumentData>) {  
        const sectionID: string = data?.id
        const subSectionCol = collection(docRef, 'sub_section')
            
        const subSectionQuery = query(subSectionCol)
            
        let subSectionList : SubSection[] = []
        const subSectionFactory = new SubSectionFactory()
        const subSectionSnapshot = await getDocs(subSectionQuery)

        subSectionSnapshot.forEach((subSectionData) => {
            const n_subSection = subSectionFactory.CreateSubSectionWithDocumentData(subSectionData.data())
            subSectionList = [...subSectionList, n_subSection] 
        })

        subSectionList.sort((a, b) => {
            const dateA = new Date(a.time_created);
            const dateB = new Date(b.time_created);

            if (dateA < dateB) {
                return -1;
            } else if (dateA > dateB) {
                return 1;
            } else {
                return 0;
            }
        });

        const n_section = new Section (
            data?.title as string,
            sectionID,
            data?.time_created as string,
            subSectionList,
            false,
        )
        
        return n_section
    }
}



export interface SubSectionInterface {
    id : string,
    time_created: string,
    description: string,
}

export class SubSection implements SubSectionInterface {
    private _id : string;
    private _time_created : string;
    private _description : string;
    constructor (
        id : string,
        time_created: string,
        description : string
    ) {
        this._id = id;
        this._time_created = time_created
        this._description = description
    }
    public get id() : string {
        return this._id
    }
    public get description(): string {
        return this._description
    }
    public get time_created(): string {
        return this._time_created
    }

    public getInterface() : SubSectionInterface {
        return {
            id: this._id,
            time_created: this._time_created,
            description: this._description
        }
    }
}

export class SubSectionFactory {
    constructor () {}
    public CreateSubSectionWithDocumentData (data : DocumentData | undefined) {
        return new SubSection(
            data?.id,
            data?.time_created,
            data?.description,
        )
    }
}