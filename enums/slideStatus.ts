type slideStatus =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
export interface ISlideStatus {
    1: number
    2: number
    3: number
    4: number
    5: number
    6: number
    7: number
    toSelect: { text: string; value: number }[]
}
const slideStatus = {
    1: 'ثبت اولیه',
    2: 'در حال فرآوری',
    3: 'فرآوری شده',
    4: 'در حال اسکن',
    5: 'اسکن شده',
    6: 'آماده تشخیص',
    7: 'ناتمام'
}

export default slideStatus

export enum slideStatusEnum {
    Added = 1,
    Processing = 2,
    Processed = 3,
    Scanning = 4,
    Scanned = 5,
    Done = 6,
    Fail = 7
}

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        slideStatus: ISlideStatus
    }
}
