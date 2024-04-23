import { DocumentData } from "firebase/firestore" 

export interface SubjectInterface {
    name: string;
    code: string;
    id: string;
    majors: string;
    faculty: string;
    subject_type: string;
}

export class Subject implements SubjectInterface {
    private _name: string;
    private _code: string;
    private _id: string;
    private _majors: string;
    private _faculty: string;
    private _subject_type: string;

    constructor(
        name: string,
        code: string,
        id: string,
        majors: string,
        faculty: string,
        subject_type: string
    ) {
        this._name = name;
        this._code = code;
        this._id = id;
        this._majors = majors;
        this._faculty = faculty;
        this._subject_type = subject_type;
    }

    // Getters
    public get name(): string {
        return this._name;
    }
    public get code(): string {
        return this._code;
    }
    public get id(): string {
        return this._id;
    }
    public get majors(): string {
        return this._majors;
    }
    public get faculty(): string {
        return this._faculty;
    }
    public get subject_type(): string {
        return this._subject_type;
    }

    // Method to get interface
    public getInterface(): SubjectInterface {
        return {
            name: this._name,
            code: this._code,
            id: this._id,
            majors: this._majors,
            faculty: this._faculty,
            subject_type: this._subject_type,
        };
    }
}

export interface SubjectDetailInterface {
    class_duration: number,
    number_of_credit: number;
    hours_needed: number;
    home_work_percent: number;
    assignment_percent: number;
    laboratory_percent: number;
    midterm_exam_percent: number;
    final_exam_percent: number;
    description: string;
}

export class SubjectDetail implements SubjectDetailInterface {
    private _class_duration: number
    private _number_of_credit: number;
    private _hours_needed: number;
    private _home_work_percent: number;
    private _assignment_percent: number;
    private _laboratory_percent: number;
    private _midterm_exam_percent: number;
    private _final_exam_percent: number;
    private _description: string;

    constructor(
        class_duration: number,
        number_of_credit: number,
        hours_needed: number,
        home_work_percent: number,
        assignment_percent: number,
        laboratory_percent: number,
        midterm_exam_percent: number,
        final_exam_percent: number,
        description: string
    ) {
        this._class_duration = class_duration;
        this._number_of_credit = number_of_credit;
        this._hours_needed = hours_needed;
        this._home_work_percent = home_work_percent;
        this._assignment_percent = assignment_percent;
        this._laboratory_percent = laboratory_percent;
        this._midterm_exam_percent = midterm_exam_percent;
        this._final_exam_percent = final_exam_percent;
        this._description = description;
    }

    // Getters
    public get class_duration(): number {
        return this._class_duration;
    }
    public get number_of_credit(): number {
        return this._number_of_credit;
    }
    public get hours_needed(): number {
        return this._hours_needed;
    }
    public get home_work_percent(): number {
        return this._home_work_percent;
    }
    public get assignment_percent(): number {
        return this._assignment_percent;
    }
    public get laboratory_percent(): number {
        return this._laboratory_percent;
    }
    public get midterm_exam_percent(): number {
        return this._midterm_exam_percent;
    }
    public get final_exam_percent(): number {
        return this._final_exam_percent;
    }
    public get description(): string {
        return this._description;
    }
    // Method to get interface
    public getInterface(): SubjectDetailInterface {
        return {
            class_duration: this._class_duration,
            number_of_credit: this._number_of_credit,
            hours_needed: this._hours_needed,
            home_work_percent: this._home_work_percent,
            assignment_percent: this._assignment_percent,
            laboratory_percent: this._laboratory_percent,
            midterm_exam_percent: this._midterm_exam_percent,
            final_exam_percent: this._final_exam_percent,
            description: this._description,
        };
    }
}


export class SubjectFactory {
    constructor () {}
    public CreateSubjectWithDocumentData = (data : DocumentData | undefined) => {
        return new Subject (
            data?.name,
            data?.code,
            data?.id,
            data?.majors,
            data?.faculty,
            data?.subject_type,
        )
    }
}

export class SubjectDetailFactory {
    constructor () {}
    public CreateSubjectDetailWithDocumentData = (data : DocumentData | undefined) => {
        return new SubjectDetail (
            data?.class_duration,
            data?.number_of_credit,
            data?.hours_needed,
            data?.home_work_percent,
            data?.assignment_percent,
            data?.laboratory_percent,
            data?.midterm_exam_percent,
            data?.final_exam_percent,
            data?.description
        )
    }
}