type receptionCategoryDiagnosticianDoctor =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
export interface IReceptionCategoryDiagnosticianDoctor {
    3: number
    4: number
    5: number
    6: number
    7: number
    8: number
    9: number
    1: number
    2: number
    toSelect: { text: string; value: number }[]
}
const receptionCategoryDiagnosticianDoctor = {
    7: 'در انتظار بررسی برای تشخیص',
    9: 'در انتظار بررسی برای پاس',
    3: 'در حال پاس',
    4: 'در حال تشخیص',
    8: 'انتصاب مجدد',
    5: 'عدم تأیید',
    6: 'از موعدگذشته',
    1: 'درخواست مشاوره از شما',
    2: 'در حال مشورت'
}

export default receptionCategoryDiagnosticianDoctor

export enum receptionCategoryDiagnosticianDoctorEnum {
    ReviewRequest = 1,
    Review = 2,
    Passing = 3,
    Answer = 4,
    Failed = 5,
    OutDatedAssignment = 6,
    DiagnosticianDoctorAnswerAssignment = 7,
    DiagnosticianDoctorAnswerReAssignment = 8,
    DiagnosticianDoctorPassAssignment = 9
}

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        receptionCategoryDiagnosticianDoctor: IReceptionCategoryDiagnosticianDoctor
    }
}
