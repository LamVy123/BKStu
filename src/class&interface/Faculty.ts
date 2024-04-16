import { DocumentData } from "firebase/firestore" 

export interface FacultyInterface {
    name : string
    code : string
    id : string
}

export class Faculty implements FacultyInterface {
    private _name! : string
    private _code! : string
    private _id! : string
    //constructor
    constructor (
        name : string,
        code : string,
        id : string,
    ) {
        this.name = name
        this.code = code
        this.id = id
    }
    //getter
    public get name () : string { return this._name }
    public get code () : string { return this._code }
    public get id () : string { return this._id }
    //setter 
    protected set name (name : string) { this._name = name }
    protected set code (code : string) { this._code = code }
    protected set id (id : string) { this._id = id }
    //method
    public getInterface = () : FacultyInterface => {
        return {
            name : this.name,
            code : this.code,
            id : this.id,
        }
    }
}


export interface FacultyDetailInterface {
    email : string
    phone_number : string
    description : string
}

export class FacultyDetail implements FacultyDetailInterface {
    private _email! : string
    private _phone_number! : string
    private _description! : string
    //constructor
    constructor (
        email : string,
        phone_number : string,
        description : string,
    ) {
        this.email = email
        this.phone_number = phone_number
        this.description = description
    }
    //getter
    public get email () : string { return this._email }
    public get phone_number () : string { return this._phone_number}
    public get description () : string { return this._description }
    //setter
    protected set email (email : string) { this._email = email }
    protected set phone_number (phone_number : string) { this._phone_number = phone_number }
    protected set description (description : string) { this._description = description }
    //method
    public getInterface = () : FacultyDetailInterface => {
        return {
            email : this.email,
            phone_number : this.phone_number,
            description : this.description
        }
    }
}

export class FacultyFactory {
    constructor () {}
    public CreateFacultyWithDocumentData = (data : DocumentData | undefined) => {
        return new Faculty (
            data?.name,
            data?.code,
            data?.id,
        )
    }
}

export class FacultyDetailFactory {
    constructor () {}
    public CreateFacultyDetailWithDocumentData = (data : DocumentData | undefined) => {
        return new FacultyDetail (
            data?.email,
            data?.phone_number,
            data?.description
        )
    }
}