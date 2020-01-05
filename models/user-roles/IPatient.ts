import { IUser } from '~/models/User';

export interface IPatient extends IUser {
    FirstName: string;
    LastName: string;
    Gender: number;
    NationalCode: string;
    BirthDate?: Date
    RoleUserId: number
    text?: string    
}

