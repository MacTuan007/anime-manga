export interface UserWithUsername {
    email: string;
    password: string;
}

export interface User extends UserWithUsername {
    dateoff: number;
    ho: string;
    tacgia: number;
    ten: string;
    vip: number
}

export interface UserWithId extends User {
  id: string;
}