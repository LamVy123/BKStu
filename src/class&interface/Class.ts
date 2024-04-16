import { DocumentData } from "firebase/firestore" 

interface ClassInterface {
    id: string;
    code: string;
    majors: string;
    majors_code: string;
    academic_year: string;
    status: string;
}

export class Class implements ClassInterface {
    private _id: string;
    private _code: string;
    private _majors: string;
    private _faculty: string;
    private _academic_year: string;
    private _status : string
    constructor(
        id: string,
        code: string,
        majors: string,
        majors_code: string,
        academic_year: string,
        status : string,
    ) {
        this._id = id;
        this._code = code;
        this._majors = majors;
        this._faculty = majors_code;
        this._academic_year = academic_year;
        this._status = status;
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
    public get majors_code(): string {
        return this._faculty;
    }
    public get academic_year(): string {
        return this._academic_year;
    }
    public get status(): string {
        return this._status;
    }
    // Method to get interface
    public getInterface(): ClassInterface {
        return {
            id: this._id,
            code: this._code,
            majors : this._majors,
            majors_code: this._faculty,
            academic_year: this._academic_year,
            status: this._status
        };
    }
}

interface ClassDetailInterface {
    faculty: string,
    teacher_name: string;
    teacher_id: string
    teacher_email : string
}

export class ClassDetail implements ClassDetailInterface {
    private _faculty: string;
    private _teacher_name: string;
    private _teacher_id: string;
    private _teacher_email: string;

    constructor(
        faculty: string,
        teacher_name: string,
        teacher_id: string,
        teacher_email: string,
    ) {
        this._faculty = faculty;
        this._teacher_name = teacher_name;
        this._teacher_id = teacher_id;
        this._teacher_email = teacher_email;
    }

    // Getters
    public get faculty(): string {
        return this._faculty;
    }
    public get teacher_name(): string {
        return this._teacher_name;
    }
    public get teacher_id(): string {
        return this._teacher_id
    }
    public get teacher_email(): string {
        return this._teacher_email
    }

    // Setters (if needed)

    // Method to get interface
    public getInterface(): ClassDetailInterface {
        return {
            faculty: this._faculty,
            teacher_name: this._teacher_name,
            teacher_id: this._teacher_id,
            teacher_email: this._teacher_email
        };
    }
}


export class ClassFactory {
    constructor () {}
    public CreateClassWithDocumentData (data : DocumentData | undefined) {
        return new Class (
            data?.id,
            data?.code,
            data?.majors,
            data?.majors_code,
            data?.academic_year,
            data?.status,
        )
    }
}

export class ClassDetailFactory {
    constructor () {}
    public CreateClassDetailWithDocumentData (data : DocumentData | undefined) {
        return new ClassDetail (
            data?.faculty,
            data?.teacher_name,
            data?.teacher_id,
            data?.teacher_email,
        )
    }
}
