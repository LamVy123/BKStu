import { DocumentData } from "firebase/firestore"

export interface UserDetailInterface {
    gender : string

    date_of_birth : string
    identification_number : string
    ethnic_group : string,
    religion : string,
    
    academic_year : string
    faculty : string    

    nationality : string
    province : string
    city : string
    address : string
}

export class UserDetail implements UserDetailInterface {
    //attributes
    private _gender! : string

    private _date_of_birth! : string
    private _identification_number! : string
    private _ethnic_group! : string
    private _religion! : string

    private _semester! : string
    private _faculty! : string

    private _nationality! : string
    private _province! : string
    private _city! :string
    private _address! : string
    //constructor
    constructor () {}
    //getter
    public get gender () : string { return this._gender }

    public get date_of_birth () : string { return this._date_of_birth }
    public get identification_number () : string { return this._identification_number }
    public get ethnic_group () : string { return this._ethnic_group }
    public get religion () : string { return this._religion }

    public get academic_year () : string { return this._semester }
    public get faculty () : string { return this._faculty }

    public get nationality () : string { return this._nationality }
    public get province () : string { return this._province }
    public get city () : string { return this._city }
    public get address () : string { return this._address }
    //setter 
    protected set gender (gender : string) { this._gender = gender }

    protected set date_of_birth (date_of_birth : string) { this._date_of_birth = date_of_birth }
    protected set identification_number (identification_number : string) { this._identification_number = identification_number }
    protected set ethnic_group  (ethnic_group : string) { this._ethnic_group = ethnic_group }
    protected set religion (religion : string) { this._religion = religion }

    protected set academic_year (academic_year : string) { this._semester = academic_year }
    protected set faculty (faculty : string) { this._faculty = faculty }

    protected set nationality (nationality : string) { this._nationality = nationality }
    protected set province (province : string) { this._province = province }
    protected set city (city : string) { this._city = city }
    protected set address (address : string) { this._address = address }
    //method
    public getInterface = () : UserDetailInterface => {
        return {
            gender : this.gender,

            date_of_birth : this.date_of_birth,
            identification_number : this.identification_number,
            ethnic_group : this.ethnic_group,
            religion : this.religion,

            academic_year : this.academic_year,
            faculty : this.faculty,

            nationality : this.nationality,
            province : this.province,
            city : this.city,
            address : this.address,
        }
    }
}



export interface StudentDetailInterface extends UserDetailInterface {
    classes_name : string
    classes_id : string
}
export class StudentDetail extends UserDetail implements StudentDetailInterface {
    //attributes
    private _classes_name : string
    private _classes_id : string
    //constructor
    constructor (
        gender : string,

        date_of_birth : string,
        identification_number : string,
        ethnic_group : string,
        religion : string,

        academic_year : string,
        faculty : string,

        nationality : string,
        province : string,
        city : string,
        address : string,

        classes_name : string,
        classes_id : string,
    ) {
        super()
        this.gender = gender

        this.date_of_birth = date_of_birth
        this.identification_number = identification_number
        this.ethnic_group = ethnic_group
        this.religion = religion

        this.academic_year = academic_year
        this.faculty = faculty


        this.nationality = nationality
        this.province = province
        this.city = city
        this.address = address

        this._classes_name = classes_name
        this._classes_id = classes_id
    }
    //getter
    public get classes_name () : string { return this._classes_name }
    public get classes_id () : string { return this._classes_id }
    //setter
    protected set classes_name (classes_name : string ) { this._classes_name = classes_name }
    protected set classes_id (classes_id : string ) { this._classes_id = classes_id }
    //method
    public override getInterface = () : StudentDetailInterface => {
        return {
            gender : this.gender,

            date_of_birth : this.date_of_birth,
            identification_number : this.identification_number,
            ethnic_group : this.ethnic_group,
            religion : this.religion,

            academic_year : this.academic_year,
            faculty : this.faculty,

            nationality : this.nationality,
            province : this.province,
            city : this.city,
            address : this.address,

            classes_name : this.classes_name,
            classes_id : this.classes_id,
        }
    }
}



export interface TeacherDetailInterface extends UserDetailInterface {
    degree : string
}
export class TeacherDetail extends UserDetail implements TeacherDetailInterface {
    //attributes
    private _degree : string
    //constructor
    constructor (
        gender : string,

        date_of_birth : string,
        identification_number : string,
        ethnic_group : string,
        religion : string,

        academic_year : string,
        faculty : string,

        nationality : string,
        province : string,
        city : string,
        address : string,

        degree : string,
    ) {
        super()
        this.gender = gender

        this.date_of_birth = date_of_birth
        this.identification_number = identification_number
        this.ethnic_group = ethnic_group
        this.religion = religion

        this.academic_year = academic_year
        this.faculty = faculty


        this.nationality = nationality
        this.province = province
        this.city = city
        this.address = address

        this._degree = degree
    }
    //getter
    public get degree () : string { return this._degree }
    //setter
    protected set degree (degree : string ) { this._degree = degree }
    //method
    public override getInterface = () : TeacherDetailInterface => {
        return {
            gender : this.gender,

            date_of_birth : this.date_of_birth,
            identification_number : this.identification_number,
            ethnic_group : this.ethnic_group,
            religion : this.religion,

            academic_year : this.academic_year,
            faculty : this.faculty,

            nationality : this.nationality,
            province : this.province,
            city : this.city,
            address : this.address,

            degree : this.degree,
        }
    }
}



export interface AdminDetailInterface extends UserDetailInterface {

}
export class AdminDetail extends UserDetail implements AdminDetailInterface { 
    //constructor
    constructor (
        gender : string,

        date_of_birth : string,
        identification_number : string,
        ethnic_group : string,
        religion : string,

        academic_year : string,
        faculty : string,

        nationality : string,
        province : string,
        city : string,
        address : string,
    ) {
        super()
        this.gender = gender

        this.date_of_birth = date_of_birth
        this.identification_number = identification_number
        this.ethnic_group = ethnic_group
        this.religion = religion

        this.academic_year = academic_year
        this.faculty = faculty


        this.nationality = nationality
        this.province = province
        this.city = city
        this.address = address
    }
    //method
    public override getInterface = () : AdminDetailInterface => {
        return {
            gender : this.gender,

            date_of_birth : this.date_of_birth,
            identification_number : this.identification_number,
            ethnic_group : this.ethnic_group,
            religion : this.religion,

            academic_year : this.academic_year,
            faculty : this.faculty,

            nationality : this.nationality,
            province : this.province,
            city : this.city,
            address : this.address,
        }
    }
}



export class UserDetailFactory {
    constructor () {}

    public CreateUserDetailWithDocumentData = (role : string, data : DocumentData | undefined) : UserDetail => {
        switch(role) {
            case 'student':
                return new StudentDetail (
                    data?.gender,

                    data?.date_of_birth,
                    data?.identification_number,
                    data?.ethnic_group,
                    data?.religion,

                    data?.academic_year,
                    data?.faculty,

                    data?.nationality,
                    data?.province,
                    data?.city,
                    data?.address,

                    data?.classes_name,
                    data?.classes_id,
                )
            case 'teacher':
                return new TeacherDetail (
                    data?.gender,

                    data?.date_of_birth,
                    data?.identification_number,
                    data?.ethnic_group,
                    data?.religion,

                    data?.academic_year,
                    data?.faculty,

                    data?.nationality,
                    data?.province,
                    data?.city,
                    data?.address,
                    
                    data?.degree,
                )
            case 'admin':
                return new AdminDetail (
                    data?.gender,

                    data?.date_of_birth,
                    data?.identification_number,
                    data?.ethnic_group,
                    data?.religion,

                    data?.academic_year,
                    data?.faculty,

                    data?.nationality,
                    data?.province,
                    data?.city,
                    data?.address,
                )
            default:
                return new UserDetail()
        }
    }
}



export interface UserInterface {
    last_name: string
    middle_name: string
    first_name: string

    display_id: string
    uid: string

    email: string
    role: string
}
export class User implements UserInterface {
    //attributes
    private _last_name! : string
    private _middle_name! : string
    private _first_name! : string
    private _uid! : string
    private _display_id! : string
    private _email! : string
    private _role! : string
    //constructor
    constructor () {}
    //getter
    public get last_name () : string { return this._last_name }
    public get middle_name () : string { return this._middle_name }
    public get first_name () : string { return this._first_name }
    public get uid () : string { return this._uid }
    public get display_id () : string { return this._display_id }
    public get email () : string { return this._email }
    public get role () : string { return this._role }
    //setter
    protected set last_name (last_name : string) { this._last_name = last_name }
    protected set middle_name (middle_name : string) { this._middle_name = middle_name }
    protected set first_name (first_name : string) { this._first_name = first_name }
    protected set uid (uid : string) { this._uid = uid }
    protected set display_id (display_id : string) { this._display_id = display_id }
    protected set email (email : string) { this._email = email }
    protected set role (role : string) { this._role = role }
    //method
    public getInterface = () : UserInterface => {
        return {
            last_name : this.last_name,
            middle_name : this.middle_name,
            first_name : this.first_name,
            uid : this.uid,
            display_id : this.display_id,
            email : this.email,
            role : this.role
        }
    }
}



export interface StudentInterface extends UserInterface {
    majors : string
}
export class Student extends User implements StudentInterface {
    //attributes
    private _majors! : string
    //constructor
    constructor (
        last_name: string,
        middle_name: string,
        first_name: string,
        uid: string,
        display_id: string,
        email: string,
        role: string,
        majors: string,
    ) {
        super()
        this.last_name = last_name
        this.middle_name = middle_name
        this.first_name = first_name
        this.uid = uid
        this.display_id = display_id
        this.email = email
        this.role = role
        this.majors = majors
    }
    //getter
    public get majors () : string { return this._majors}
    //setter
    protected set majors (majors : string) { this._majors = majors }
    //method
    public getInterface = () : StudentInterface => {
        return {
            last_name : this.last_name,
            middle_name : this.middle_name,
            first_name : this.first_name,
            uid : this.uid,
            display_id : this.display_id,
            email : this.email,
            role : this.role,
            majors : this.majors
        }
    }
}



export interface TeacherInterface extends UserInterface {
    specialized : string
}
export class Teacher extends User implements TeacherInterface { 
    //attributes
    private _specialized! : string
    //constructor
    constructor (
        last_name: string,
        middle_name: string,
        first_name: string,
        uid: string,
        display_id: string,
        email: string,
        role: string,
        specialized : string,
    ) {
        super()
        this.last_name = last_name
        this.middle_name = middle_name
        this.first_name = first_name
        this.uid = uid
        this.display_id = display_id
        this.email = email
        this.role = role
        this.specialized = specialized
    }
    //getter
    public get specialized () : string { return this._specialized}
    //setter
    protected set specialized (specialized : string) { this._specialized = specialized }
    //method
    public getInterface = () : TeacherInterface => {
        return {
            last_name : this.last_name,
            middle_name : this.middle_name,
            first_name : this.first_name,
            uid : this.uid,
            display_id : this.display_id,
            email : this.email,
            role : this.role,
            specialized : this.specialized
        }
    }
}



export interface AdminInterface extends UserInterface {

}
export class Admin extends User implements AdminInterface {
    //constructor
    constructor (
        last_name: string,
        middle_name: string,
        first_name: string,
        uid: string,
        display_id: string,
        email: string,
        role: string,
    ) {
        super()
        this.last_name = last_name
        this.middle_name = middle_name
        this.first_name = first_name
        this.uid = uid
        this.display_id = display_id
        this.email = email
        this.role = role
    }
    //method
    public getInterface = () : AdminInterface => {
        return {
            last_name : this.last_name,
            middle_name : this.middle_name,
            first_name : this.first_name,
            uid : this.uid,
            display_id : this.display_id,
            email : this.email,
            role : this.role
        }
    }
}



export class UserFactory {
    constructor () {}
    //method
    public CreateUserWithDocumentData = (role : string, data : DocumentData | undefined) : User => {
        switch (role) {
            case 'student':
                return new Student (
                    data?.last_name,
                    data?.middle_name,
                    data?.first_name,
                    data?.uid,
                    data?.display_id,
                    data?.email,
                    data?.role,
                    data?.majors,
                )
            case 'teacher':
                return new Teacher (
                    data?.last_name,
                    data?.middle_name,
                    data?.first_name,
                    data?.uid,
                    data?.display_id,
                    data?.email,
                    data?.role,
                    data?.specialized
                )
            case 'admin':
                return new Admin (
                    data?.last_name,
                    data?.middle_name,
                    data?.first_name,
                    data?.uid,
                    data?.display_id,
                    data?.email,
                    data?.role,
                )
            default:
                return new User()
        }
    }
}

