type sampleStatus =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
export interface ISampleStatus {
    1: number
    2: number
    3: number
    4: number
    5: number
    6: number
    7: number
    8: number
    9: number
    10: number
    11: number
    12: number
    13: number
    14: number
    15: number
    16: number
    17: number
    18: number
    19: number
    20: number
    21: number
    22: number
    23: number
    24: number
    toSelect: { text: string; value: number }[]
}
const sampleStatus = {
    1: 'پذیرش',
    2: 'خطا در پذیرش',
    3: 'پذیرش شده',
    4: 'در انتظار انتصاب به تکنسین',
    5: 'در حال فرآوری',
    6: 'عدم تأیید',

    7: 'درخواست پاس',
    8: 'درخواست انتصاب مجدد',
    9: 'در انتظار پاس',

    10: 'در حال پاس',
    11: 'رد پاس',
    12: 'اتمام پاس',
    13: 'خطا در پاس',

    14: 'فرآوری شده',
    15: 'در انتظار انتصاب به دکتر تشخیص‌گر',
    16: 'درخواست انتصاب مجدد به دکتر تشخیص‌گر',
    17: 'در حال تشخیص‌',
    18: 'اتمام گزارش تشخیص',
    19: 'خطا در تشخیص',
    20: 'ارسال شده جهت بازبینی',
    21: 'رد بازبینی',
    22: 'در حال بازبینی',
    23: 'درخواست بازبینی',
    24: 'انتضای بازبینی'
}

export default sampleStatus

export enum sampleStatusEnum {
    Reception = 1,
    ReceptionFailed = 2,
    Recepted = 3,
    WaitForTechnicianAssignment = 4,
    Processing = 5,
    ProcessFailed = 6,
    PassRequest = 7,
    TechnicianAssignRequest = 8,
    WaitForPassAssignment = 9,
    Passing = 10,
    PassDone = 11,
    PassFailed = 13,
    Processed = 14,
    WaitForPathologistAssignment = 15,
    PathologistAssignRequest = 16,
    Answering = 17,
    AnswerReported = 18,
    AnsweringFailed = 19,
    SendForReview = 20,
    ReviewRejected = 21,
    Review = 22,
    ReviewRequest = 23,
    ReviewExpired = 24
}

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        sampleStatus: ISampleStatus
    }
}
