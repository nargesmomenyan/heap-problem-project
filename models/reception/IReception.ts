import { IPatient } from '~/models/user-roles/IPatient';
import { ITreatingPhysician } from '~/models/user-roles/ITreatingPhysician';

export interface IReception {
    Id: number
    OrganizationId?: number
    SecretaryId?: number
    Status?: number
    ReceptionNumber: string
    Patient: IPatient
    TreatingPhysician: ITreatingPhysician
    DeliveryDate?: Date   
    SampleCount: number
    Description?:string
}

export interface IRecptionDisplayList {
    Id: number
    ReceptionDate?: Date
    ReceptionNumber: string
    PatientFullName: string
    PatientUserId?: number
    PatientRoleUserId?: number
    PatientNationalCode: string
    TreatingPhysicianFullName: string
    TreatingPhysicianUserId?: number
    TreatingPhysicianRoleUserId?: number
    SampleCount?: number
    DeliveryDate?: Date
}