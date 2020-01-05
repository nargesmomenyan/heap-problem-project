type userType =
    | '1'
    | '2'

export interface IUserType {
    1: number
    2: number
    toSelect: { text: string; value: number }[]
}
const userType = {
    1: 'حقیقی',
    2: 'حقوقی'
}
export default userType

export enum userTypeEnum {
    Unknown = 0,
    Individual = 1,
    Firm = 2,
  }
  
declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        userType: IUserType
    }
}