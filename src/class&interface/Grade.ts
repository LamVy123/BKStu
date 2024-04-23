import { DocumentData } from "firebase/firestore";
import { CourseDetail } from "./Course";

export interface GradeInterface {
    id: string
    home_work: number;
    assignment: number;
    laboratory: number;
    midterm_exam: number;
    final_exam: number;
    total: number;
}

export class Grade implements GradeInterface {
    private _id: string;
    private _home_work: number;
    private _assignment: number;
    private _laboratory: number;
    private _midterm_exam: number;
    private _final_exam: number;
    private _total: number;

    constructor(
        id: string,
        home_work: number,
        assignment: number,
        laboratory: number,
        midterm_exam: number,
        final_exam: number,
        totel: number,
    ) {
        this._id = id;
        this._home_work = home_work;
        this._assignment = assignment;
        this._laboratory = laboratory;
        this._midterm_exam = midterm_exam;
        this._final_exam = final_exam;
        this._total =totel;
    }

    // Getters
    public get id(): string {
        return this._id;
    }
    public get home_work(): number {
        return this._home_work;
    }
    public get assignment(): number {
        return this._assignment;
    }
    public get laboratory(): number {
        return this._laboratory;
    }
    public get midterm_exam(): number {
        return this._midterm_exam;
    }
    public get final_exam(): number {
        return this._final_exam;
    }
    public get total(): number {
        return this._total;
    }
    private between(x : number, min: number, max: number) {
        return x >= min && x <= max;
    }
    public calculateTotal(coureDetail: CourseDetail | undefined): void {
        if(coureDetail && 
            (this.between(this._home_work, 0,10) || coureDetail.home_work_percent == 0) && 
            (this.between(this._assignment, 0,10) || this._assignment * coureDetail.assignment_percent == 0) && 
            (this.between(this._laboratory, 0,10) || this._laboratory * coureDetail.laboratory_percent == 0) && 
            (this.between(this._midterm_exam, 0,10) || this._midterm_exam * coureDetail.midterm_exam_percent == 0) && 
            (this.between(this._final_exam, 0,10) || this._final_exam * coureDetail.final_exam_percent == 0)
        ) {
            this._total = (
                this._home_work * coureDetail.home_work_percent + 
                this._assignment * coureDetail.assignment_percent + 
                this._laboratory * coureDetail.laboratory_percent + 
                this._midterm_exam * coureDetail.midterm_exam_percent + 
                this._final_exam * coureDetail.final_exam_percent
            ) / 100;
        } else {
            this._total = 15
        }
    }

    // Method to get interface
    public getInterface(): GradeInterface {
        return {
            id: this._id,
            home_work: this._home_work,
            assignment: this._assignment,
            laboratory: this._laboratory,
            midterm_exam: this._midterm_exam,
            final_exam: this._final_exam,
            total: this._total,
        };
    }
}


export class GradeFactory {
    constructor () {}
    public CreateGradeWithDocumnetData(id: string, data : DocumentData | undefined) {
        if(data) {
            return new Grade (
                id,
                data?.home_work,
                data?.assignment,
                data?.laboratory,
                data?.midterm_exam,
                data?.final_exam,
                data?.total,
            )
        }

        return new Grade (
            id,
            15,
            15,
            15,
            15,
            15,
            15,
        )
    }
}
