type User = {
    last_name: string;
    middle_name: string;
    first_name: string;

    identification_number: string;
    date_of_birth: string;
    gender: string;
    address: string;
    phone_number: string;

    display_id: string;
    email: string;
    password: string;

    majors?: string;
    role: string;
};

export type UserInfor = Pick<
    User,
    | "last_name"
    | "middle_name"
    | "first_name"
    | "display_id"
    | "email"
    | "role"
    | "majors"
>;

export type UserPassword = Pick<User, "password">;

export type StudentInfor = Pick<
    User,
    | "identification_number"
    | "date_of_birth"
    | "gender"
    | "address"
    | "phone_number"
    | "display_id"
>;

export type TeacherInfor = Pick<User, 
| "last_name"
| "middle_name"
| "first_name"
| "display_id"
| "email"
| "role">