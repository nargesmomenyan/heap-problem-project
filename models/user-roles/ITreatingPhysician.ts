import { IUser } from '~/models/User';

export interface ITreatingPhysician extends IUser {
    FirstName: string;
    LastName: string;
    Gender: number;
    MedicalSystemCode: string;
    Expertise: number;
    ExpertiseTitle: string
    RoleUserId: number
    text?:string
}