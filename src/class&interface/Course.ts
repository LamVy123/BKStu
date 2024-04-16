import { DocumentData } from "firebase/firestore" 

export interface CourseInterface {
    code: string
    id: string
    academic_year: string
    semester: string
    faculty: string
    majors: string
    subject_name: string
    subject_type: string
    subject_code: string
    day_semester_start : string,
    number_of_weeks: number,
    study_schedule: string;
    lab_schedule: string;
    number_of_credit: number;
    status : string;
}

export class Course implements CourseInterface {
    private _code: string;
    private _id: string;
    private _academic_year: string;
    private _semester: string;
    private _faculty: string;
    private _majors: string;
    private _subject_name: string;
    private _subject_type: string;
    private _subject_code: string;
    private _day_semester_start: string;
    private _number_of_weeks: number;
    private _study_schedule: string;
    private _lab_schedule: string;
    private _number_of_credit: number;
    private _status: string;

    constructor(
        code: string,
        id: string,
        academic_year: string,
        semester: string,
        faculty: string,
        majors: string,
        subject_name: string,
        subject_type: string,
        subject_code: string,
        day_semester_start: string,
        number_of_weeks: number,
        study_schedule: string,
        lab_schedule: string,
        number_of_credit: number,
        status: string,
    ) {
        this._code = code;
        this._id = id;
        this._academic_year = academic_year;
        this._semester = semester;
        this._faculty = faculty;
        this._majors = majors;
        this._subject_name = subject_name;
        this._subject_type = subject_type;
        this._subject_code = subject_code;
        this._day_semester_start = day_semester_start,
        this._number_of_weeks = number_of_weeks,
        this._study_schedule = study_schedule;
        this._lab_schedule = lab_schedule;
        this._number_of_credit = number_of_credit;
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
    public get semester(): string {
        return this._semester;
    }
    public get faculty(): string {
        return this._faculty;
    }
    public get majors(): string {
        return this._majors;
    }
    public get subject_name(): string {
        return this._subject_name;
    }
    public get subject_type(): string {
        return this._subject_type;
    }
    public get subject_code(): string {
        return this._subject_code
    }
    public get day_semester_start(): string {
        return this._day_semester_start;
    }
    public get number_of_weeks(): number {
        return this._number_of_weeks;
    }
    public get study_schedule(): string {
        return this._study_schedule;
    }
    public get lab_schedule(): string {
        return this._lab_schedule;
    }
    public get number_of_credit(): number {
        return this._number_of_credit;
    }
    public get status(): string {
        return this._status;
    }
    // Method to get interface
    public getInterface(): CourseInterface {
        return {
            code: this._code,
            id: this._id,
            academic_year: this._academic_year,
            semester: this._semester,
            faculty: this._faculty,
            majors: this._majors,
            subject_name: this._subject_name,
            subject_type: this._subject_type,
            subject_code: this._subject_code,
            day_semester_start: this._day_semester_start,
            number_of_weeks: this._number_of_weeks,
            study_schedule: this._study_schedule,
            lab_schedule: this._lab_schedule,
            number_of_credit: this._number_of_credit,
            status: this._status,
        };
    }
}

export interface CourseDetailInterface {
    teacher: string;
    teacher_email: string;
    teacher_id: string;
    class_duration : number;
    hours_needed: number;
    home_work_percent: number;
    assignment_percent: number;
    laboratory_percent: number;
    midterm_exam_percent: number;
    final_exam_percent: number;
}

export class CourseDetail implements CourseDetailInterface {
    private _teacher: string;
    private _teacher_email: string;
    private _teacher_id: string;
    private _class_duration: number;
    private _hours_needed: number;
    private _home_work_percent: number;
    private _assignment_percent: number;
    private _laboratory_percent: number;
    private _midterm_exam_percent: number;
    private _final_exam_percent: number;

    constructor(
        
        teacher: string,
        teacher_email: string,
        teacher_id: string,
        class_duration: number,
        hours_needed: number,
        home_work_percent: number,
        assignment_percent: number,
        laboratory_percent: number,
        midterm_exam_percent: number,
        final_exam_percent: number
    ) {
        
        this._teacher = teacher;
        this._teacher_email = teacher_email;
        this._teacher_id = teacher_id;
        this._class_duration = class_duration;
        this._hours_needed = hours_needed;
        this._home_work_percent = home_work_percent;
        this._assignment_percent = assignment_percent;
        this._laboratory_percent = laboratory_percent;
        this._midterm_exam_percent = midterm_exam_percent;
        this._final_exam_percent = final_exam_percent;
    }

    // Getters
    
    public get teacher(): string {
        return this._teacher;
    }
    public get teacher_email(): string {
        return this._teacher_email;
    }
    public get teacher_id(): string {
        return this._teacher_id;
    }
    public get class_duration(): number {
        return this._class_duration;
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
    // Method to get interface
    public getInterface(): CourseDetailInterface {
        return {
            teacher: this._teacher,
            teacher_email: this._teacher_email,
            teacher_id: this._teacher_id,
            class_duration: this._class_duration,
            hours_needed: this._hours_needed,
            home_work_percent: this._home_work_percent,
            assignment_percent: this._assignment_percent,
            laboratory_percent: this._laboratory_percent,
            midterm_exam_percent: this._midterm_exam_percent,
            final_exam_percent: this._final_exam_percent,
        };
    }
}




export class CourseFactory {
    constructor () {}
    public CreateCourseWithDocumentData = (data : DocumentData | undefined) => {
        return new Course (
            data?.code,
            data?.id,
            data?.academic_year,
            data?.semester,
            data?.faculty,
            data?.majors,
            data?.subject_name,
            data?.subject_type,
            data?.subject_code,
            data?.day_semester_start,
            data?.number_of_weeks,
            data?.study_schedule,
            data?.lab_schedule,
            data?.number_of_credit,
            data?.status,
        )
    }
}

export class CourseDetailFatory {
    constructor () {}
    public CreateCourseDetailWithDocumentData = (data : DocumentData | undefined) => {
        return new CourseDetail (
            data?.teacher,
            data?.teacher_email,
            data?.teacher_id,
            data?.class_duration,
            data?.hours_needed,
            data?.home_work_percent,
            data?.assignment_percent,
            data?.laboratory_percent,
            data?.midterm_exam_percent,
            data?.final_exam_percent,
        )
    }
}
