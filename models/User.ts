import { IBaseModel } from './base/IBaseModel';

export interface IUser extends IBaseModel {

   Type: number;
   Id: number
   Username?: string;
   Email: string;
   Address: string;
   PhoneNumber: string;
   MobileNumber: string;
}

export class UserBriefInfo {
   constructor(
      public Id: number,
      public Username: string,
      public NationalCode_RegistrationCode: string,
      public DisplayName: string,
   ) { }
}

export interface UserSaveModel extends IUser {

   OldPassword: string | null;
   NewPassword: string | null;
   confirmpassword: string | null;
}


