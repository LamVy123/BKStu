import { DocumentData } from "firebase/firestore" 

interface ClassInterface {
    id: string;
    code: string;
    majors: string;
}

export class Class implements ClassInterface {
    private _id: string;
    private _code: string;
    private _majors: string;
    constructor(
        id: string,
        code: string,
        majors: string,
    ) {
        this._id = id;
        this._code = code;
        this._majors = majors;
    }
    // Getters
    public get id(): string {
        return this._id;
    }
    public get code(): string {
        return this._code;
    }
    public get majors(): string {
        return this._majors;
    }
    // Method to get interface
    public getInterface(): ClassInterface {
        return {
            id: this._id,
            code: this._code,
            majors : this._majors
        };
    }
}

interface ClassDetailInterface {
    academic_year: string;
    faculty: string;
    teacher_name: string;
}

export class ClassDetail implements ClassDetailInterface {
    private _academic_year: string;
    private _faculty: string;
    private _teacher_name: string;

    constructor(
        academic_year: string,
        faculty: string,
        teacher_name: string
    ) {
        this._academic_year = academic_year;
        this._faculty = faculty;
        this._teacher_name = teacher_name;
    }

    // Getters
    public get academic_year(): string {
        return this._academic_year;
    }
    public get faculty(): string {
        return this._faculty;
    }
    public get teacher_name(): string {
        return this._teacher_name;
    }

    // Setters (if needed)

    // Method to get interface
    public getInterface(): ClassDetailInterface {
        return {
            academic_year: this._academic_year,
            faculty: this._faculty,
            teacher_name: this._teacher_name,
        };
    }
}


export class ClassFactory {
    constructor () {}

    public CreateClassWithDocumentData (data : DocumentData | undefined) {
        return new Class (
            data?.id,
            data?.code,
            data?.majors
        )
    }
}
