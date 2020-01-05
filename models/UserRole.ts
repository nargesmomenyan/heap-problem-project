import { IIndividualUser } from './IndividualUser';

export interface IUserRoles {
    UserId: number
    DisplayName?: string

    IsSuperAdmin?: boolean
    RoleSuperAdminId?: number

    IsAdmin?: boolean,
    RoleAdminId?: number,

    IsTechnician?: boolean,
    RoleTechnicianId?: number,

    IsShareholder?: boolean,
    RoleShareholderId?: number,

    IsSecretary?: boolean,
    RoleSecretaryId?: number,

    IsDiagnosticianDoctor?: boolean,
    RoleDiagnosticianDoctorId?: number,
    RoleDiagnosticianDoctorInfo?: IRoleDoctor,

    IsTreatingPhysician?: boolean,
    RoleTreatingPhysicianId?: number,
    RoleTreatingPhysicianInfo?: IRoleDoctor,

    IsPatient?: boolean,
    RolePatientId?: number,
    RolePatient?: IRolePatient,
}

export interface IRolePatient {
    InsuranceNo?: string,
    InsuranceType?: string,
    Expiration?: Date,
    ExpireByPaperEnds?: Boolean
}

export interface IRoleDoctor {
    MedicalSystemCode?: string
    Expertise?: number
}

export interface ISimpleUserRole extends IIndividualUser {
    RoleUserId: number,
    RoleId:number
    RoleName: string
}
