import { DocumentData } from "firebase/firestore" 

export interface SemesterInterface {
    code: string;
    id: string;
    academic_year: string;
    status: string;
}

export class Semester implements SemesterInterface {
    private _code: string;
    private _id: string;
    private _academic_year: string;
    private _status: string;

    constructor(
        code: string,
        id: string,
        academic_year: string,
        status: string
    ) {
        this._code = code;
        this._id = id;
        this._academic_year = academic_year;
        this._status = status;
    }

    // Getters
    public get code(): string {
        return this._code;
    }
    public get id(): string {
        return this._id;
    }
    public get academic_year(): string {
        return this._academic_year;
    }
    public get status(): string {
        return this._status;
    }

    // Setters (if needed)

    // Method to get interface
    public getInterface(): SemesterInterface {
        return {
            code: this._code,
            id: this._id,
            academic_year: this._academic_year,
            status: this._status,
        };
    }
}


export interface SemesterDetailInterface {
    day_start: string;
    number_of_weeks: number;
}

export class SemesterDetail implements SemesterDetailInterface {
    private _day_start: string;
    private _number_of_weeks: number;

    constructor(
        day_start: string,
        number_of_weeks: number
    ) {
        this._day_start = day_start;
        this._number_of_weeks = number_of_weeks;
    }

    // Getters
    public get day_start(): string {
        return this._day_start;
    }
    public get number_of_weeks(): number {
        return this._number_of_weeks;
    }

    // Method to get interface
    public getInterface(): SemesterDetailInterface {
        return {
            day_start: this._day_start,
            number_of_weeks: this._number_of_weeks,
        };
    }
}


export class SemesterFactory {
    constructor () {}
    public CreateSemesterWithDocumentData (data : DocumentData | undefined) {
        return new Semester (
            data?.code,
            data?.id,
            data?.academic_year,
            data?.status ,
        )
    }
}

export class SemesterDetailFactory {
    constructor () {}
    public CreateSemesterDetailWithDocumentData (data : DocumentData | undefined) {
        return new SemesterDetail (
            data?.day_start,
            data?.number_of_weeks,
        )
    }
}