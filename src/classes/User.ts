class User {
    constructor (
        protected _first_name : string,
        protected _middle_name : string,
        protected _last_name : string,
        protected _email : string,
        protected _password : string,
        protected _uid : string,
        protected _role : string,
    ) {}

    public first_name() { return this._first_name }
    public middle_name() { return this._middle_name }
    public last_name() { return this._last_name }
    public name() { return this._last_name + ' ' + this._middle_name + ' ' + this._first_name }
    public uid() { return this._uid }
    public role() { return this._role }
}

export class Student extends User {
    constructor (
        protected _last_name : string,
        protected _middle_name : string,
        protected _first_name : string,
        protected _uid : string,
        protected _email : string,
        protected _password : string,
        protected _role : string,
    ) {
        super(_last_name,_middle_name,_first_name,_email,_password,_uid,_role)
        this._role = 'student'
    }
}

export class Teacher extends User {
    constructor (
        protected _last_name : string,
        protected _middle_name : string,
        protected _first_name : string,
        protected _uid : string,
        protected _email : string,
        protected _password : string,
        protected _role : string,
        protected _degree : string,
    ) {
        super(_last_name,_middle_name,_first_name,_email,_password,_uid,_role)
        this._role = 'teacher'
        this._degree = _degree
    }
}

export class Admin extends User {
    constructor (
        protected _last_name : string,
        protected _middle_name : string,
        protected _first_name : string,
        protected _uid : string,
        protected _email : string,
        protected _password : string,
        protected _role : string,
    ) {
        super(_last_name,_middle_name,_first_name,_email,_password,_uid,_role)
        this._role = 'admin'
    }
}

export class User_Ref {
    constructor (
        private _last_name : string,
        private _middle_name : string,
        private _first_name : string,
        private _uid : string,
        private _role : string,
    ) {}
    public first_name() { return this._first_name }
    public middle_name() { return this._middle_name }
    public last_name() { return this._last_name }
    public name() { return this._last_name + ' ' + this._middle_name + ' ' + this._first_name }
    public uid() { return this._uid }
    public role() { return this._role }
}