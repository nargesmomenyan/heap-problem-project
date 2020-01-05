type receptionCategoryTechnician =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7

export interface IReceptionCategoryTechnician {
    1: number
    2: number
    3: number
    4: number
    5: number
    6: number
    7: number

    toSelect: { text: string; value: number }[]
}
const receptionCategoryTechnician = {
    5: 'در انتظار بررسی',
    1: 'در حال فرآوری',
    2: 'فرآوری شده',
    4: 'پاس شده',
    6: 'انتصاب مجدد',
    3: 'عدم تأیید',
    7: 'از موعد گذشته'
}

export default receptionCategoryTechnician

export enum receptionCategoryTechnicianEnum {
    InProgress = 1,
    Processed = 2,
    Failed = 3,
    Pass = 4,
    TehcnicianAssignment = 5,
    TechnicianReAssignment = 6,
    OutDatedAssignment = 7

}

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        receptionCategoryTechnician: IReceptionCategoryTechnician
    }
}
