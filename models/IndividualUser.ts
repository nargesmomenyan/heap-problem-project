import { IBaseListModel } from './base/BaseListModel';
import { IUser } from './User';
import gender from '~/enums/Gender';

export interface IIndividualUser extends IUser {

   FirstName: string;
   LastName: string;
   NationalCode: string;
   BirthDate: Date;
   Gender: string;
   FullName?: string
}

export interface IndividualUserFilterModel extends IIndividualUser {

   BirthDateFrom?: Date;
   BirthDateTo?: Date;
}
