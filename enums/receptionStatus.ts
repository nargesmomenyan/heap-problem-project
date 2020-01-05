type receptionStatus =
    | 1
    | 2
    | 3
export interface IReceptionStatus {
    1: number
    2: number
    3: number
    toSelect: { text: string; value: number }[]
}
const receptionStatus = {
    1: 'ثبت اولیه',
    2: 'تأثید شده',
    3: 'عدم تأیید',
}

export default receptionStatus

export enum receptionStatusEnum {
    InProgress = 1,
    Done = 2,
    Failed = 3
}

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        receptionStatus: IReceptionStatus
    }
}
