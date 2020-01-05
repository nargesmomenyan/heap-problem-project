import { IUser } from '~/models/User';

export interface ISecretary extends IUser {
    FirstName: string;
    LastName: string;
    RoleUserId: number
    text?: string
    value?:number
}

