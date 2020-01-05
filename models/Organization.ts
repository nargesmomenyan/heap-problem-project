import { IBaseModel } from './base/IBaseModel';


export interface IOrganization extends IBaseModel {
  Id: number
  Name: string;
  Domain: string;
  Email: string;
  Address: string;
  PhoneNumber: string;
  Website: string;
  RegistrationCode: string;
  RegistrationDate: Date;
  EconomicCode: string;
  NationalCode: string;
}

export interface IOrganizationUser {
  OrganizationId: Number,
  UserId: number,
  Username: string,
  UserFirstName: string,
  UserLastName: string,
  UserNationalCode: string,
  UserMobileNumber: string,
  Roles: IUserRole[]
}

export interface IUserRole {
  RoleId: number,
  RoleTitle: string,
  RoleUserId: number,
}

export interface IOrganizationCandidateUser {
  OrganizationId: Number,
  FirstName: string,
  LastName: string,
  NationalCode: string,
  RoleId: number,
  RoleTitle: string,
  RoleUserId: number
}


