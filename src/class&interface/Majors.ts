import { DocumentData } from "firebase/firestore" 
export interface MajorsInterface {
    name : string,
    code : string,
    id : string,
    faculty_code : string,
}

export class Majors implements MajorsInterface {
    private _name : string
    private _code : string
    private _id : string
    private _faculty_code : string
    //contructor
    constructor (
        name : string,
        code : string,
        id : string,
        faculty_code: string,
    ) {
        this._name = name
        this._code = code
        this._id = id
        this._faculty_code = faculty_code
    }
    //getter
    public get name () : string { return this._name }
    public get code () : string { return this._code }
    public get id () : string { return this._id }
    public get faculty_code () : string { return this._faculty_code }
    //setter
    protected set name (name : string) { this._name = name }
    protected set code (code : string) { this._code = code }
    protected set id (id : string) { this._id = id }
    protected set faculty_code (faculty_code : string) { this._faculty_code = faculty_code }
    //method
    public getInterface = () : MajorsInterface => {
        return {
            name : this.name,
            code : this.code,
            id : this.id,
            faculty_code : this.faculty_code
        }
    }
}


export interface MajorsDetailInterface {
    faculty : string;
    degree_type : string,
    required_credits : number,
    duration : string,
    description : string,
}

export class MajorsDetail implements MajorsDetailInterface {
    private _faculty: string;
    private _degree_type: string;
    private _required_credits: number;
    private _duration: string;
    private _description: string;
    //constructor
    constructor(
        faculty: string,
        degree_type: string,
        required_credits: number,
        duration: string,
        description: string
    ) {
        this._faculty = faculty;
        this._degree_type = degree_type;
        this._required_credits = required_credits;
        this._duration = duration;
        this._description = description;
    }
    //getter
    public get faculty () : string { return this._faculty }
    public get degree_type () : string { return this._degree_type }
    public get required_credits () : number { return this._required_credits }
    public get duration () : string { return this._duration }
    public get description () : string { return this._description }
    //setter
    protected set degree_type (degree_type : string) { this._degree_type = degree_type }
    protected set required_credits (required_credits : number) { this._required_credits = required_credits }
    protected set duration (duration : string) { this._duration = duration }
    protected set description (description : string) { this._description = description }
    //method
    public getInterface = () : MajorsDetailInterface => {
        return {
            faculty: this._faculty,
            degree_type : this._degree_type,
            required_credits : this._required_credits,
            duration : this._duration,
            description : this._description
        };
    }
}

export class MajorsFactory {
    constructor () {}

    public CreateMajorsWithDocumentData = (data : DocumentData | undefined) => {
        return new Majors (
            data?.name,
            data?.code,
            data?.id,
            data?.faculty_code
        )
    }
}

export class MajorsDetailFactory {
    constructor () {}

    public CreateMajorsDetailWithDocumentData = (data : DocumentData | undefined) => {
        return new MajorsDetail (
            data?.faculty,
            data?.degree_type,
            data?.required_credits,
            data?.duration,
            data?.description,
        )
    }
}