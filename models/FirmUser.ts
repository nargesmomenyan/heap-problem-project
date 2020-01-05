import { IBaseListModel } from './base/BaseListModel';
import { IUser } from './User';

export interface IFirmUser extends IUser {
   RegistrationCode: string;
   Name: string ;
   EconomicCode: string;
   RegistrationDate: Date;
}
