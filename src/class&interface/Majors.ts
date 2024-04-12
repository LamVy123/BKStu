import { DocumentData } from "firebase/firestore" 
export interface MajorsInterface {
    name : string,
    code : string,
    id : string,
    faculty : string,
}

export class Majors implements MajorsInterface {
    private _name : string
    private _code : string
    private _id : string
    private _faculty : string
    //contructor
    constructor (
        name : string,
        code : string,
        id : string,
        faculty: string,
    ) {
        this._name = name
        this._code = code
        this._id = id
        this._faculty = faculty
    }
    //getter
    public get name () : string { return this._name }
    public get code () : string { return this._code }
    public get id () : string { return this._id }
    public get faculty () : string { return this._faculty }
    //setter
    protected set name (name : string) { this._name = name }
    protected set code (code : string) { this._code = code }
    protected set id (id : string) { this._id = id }
    protected set faculty (faculty : string) { this._faculty = faculty }
    //method
    public getInterface = () : MajorsInterface => {
        return {
            name : this.name,
            code : this.code,
            id : this.id,
            faculty : this.faculty
        }
    }
}


export interface MajorsDetailInterface {
    degree_type : string,
    required_credits : number,
    duration : string,
    description : string,
}

export class MajorsDetail implements MajorsDetailInterface {
    private _degree_type: string;
    private _required_credits: number;
    private _duration: string;
    private _description: string;
    //constructor
    constructor(
        degree_type: string,
        required_credits: number,
        duration: string,
        description: string
    ) {
        this._degree_type = degree_type;
        this._required_credits = required_credits;
        this._duration = duration;
        this._description = description;
    }
    //getter
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
            degree_type : this.degree_type,
            required_credits : this.required_credits,
            duration : this.duration,
            description : this.description
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
            data?.faculty
        )
    }
}