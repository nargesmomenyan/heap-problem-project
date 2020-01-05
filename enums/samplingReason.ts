type samplingReason =
    | 'Screening'
    | 'Diagnostic'
    | 'RepeatSampleAfterPreviousInappropriateSample'
    | 'FollowUpTreatmentOfInfectiousAndInflammatoryDisease'
    | 'FollowUpOnAbnormalSignsOrSymptoms'
    | 'hrHPVHistory'
    | 'hrHPVHistoryAnd12MonthFollowUp'
    | 'DualTestSymptomaticPatient'
    | 'CervicalTestFollowUpForPreviusAbnormalTest'
    | 'DualTestFollowUpTreatment'
    | 'DualTestFollowUpInSituCarcinomaTreatment_AIS'
    | 'CytologyOnly'
export interface ISamplingReason {
    'Screening': string
    'Diagnostic': string
    'RepeatSampleAfterPreviousInappropriateSample': string
    'FollowUpTreatmentOfInfectiousAndInflammatoryDisease': string
    'FollowUpOnAbnormalSignsOrSymptoms': string
    'hrHPVHistory': string
    'hrHPVHistoryAnd12MonthFollowUp': string
    'DualTestSymptomaticPatient': string
    'CervicalTestFollowUpForPreviusAbnormalTest': string
    'DualTestFollowUpTreatment': string
    'DualTestFollowUpInSituCarcinomaTreatment_AIS': string
    'CytologyOnly': string

    toSelect: { text: string; value: string }[]
}
const samplingReason = {
    'Screening': 'غربالگری',
    'Diagnostic': 'تشخیصی',
    'RepeatSampleAfterPreviousInappropriateSample': 'تکرار نمونه پس از نمونه نامناسب قبلی',
    'FollowUpTreatmentOfInfectiousAndInflammatoryDisease': 'پیگیری درمان بیماری عفونی و التهابی',
    'FollowUpOnAbnormalSignsOrSymptoms': 'پیگیری علامت یا نشانه غیر طبیعی',
    'hrHPVHistory': 'سابقه +hrHPV',
    'hrHPVHistoryAnd12MonthFollowUp': 'سابقه  +hrHPVو پیگیری پس از  12ماه',
    'DualTestSymptomaticPatient': 'تست دوگانه (پاپ اسمیر و تست  ،)hrHPVبیمار علامتدار',
    'CervicalTestFollowUpForPreviusAbnormalTest': 'تست دهانه رحم (پاپ اسمیر)، پیگیری برای تست قبلی غیر طبیعی',
    'DualTestFollowUpTreatment': 'تست دوگانه (پاپ اسمیر و تست  ،)hrHPVپیگیری درمان ()',
    'DualTestFollowUpInSituCarcinomaTreatment_AIS': 'تست دوگانه (پاپ اسمیر و تست  ،)hrHPVپیگیری درمان کارسینومای درجا ()AI',
    'CytologyOnly': 'سیتولوژی',
}

export default samplingReason

export enum samplingReasonEnum {
    Screening = 'Screening',
    Diagnostic = 'Diagnostic',
    RepeatSampleAfterPreviousInappropriateSample = 'RepeatSampleAfterPreviousInappropriateSample',
    FollowUpTreatmentOfInfectiousAndInflammatoryDisease = 'FollowUpTreatmentOfInfectiousAndInflammatoryDisease',
    FollowUpOnAbnormalSignsOrSymptoms = 'FollowUpOnAbnormalSignsOrSymptoms',
    hrHPVHistory = 'hrHPVHistory',
    hrHPVHistoryAnd12MonthFollowUp = 'hrHPVHistoryAnd12MonthFollowUp',
    DualTestSymptomaticPatient = 'DualTestSymptomaticPatient',
    CervicalTestFollowUpForPreviusAbnormalTest = 'CervicalTestFollowUpForPreviusAbnormalTest',
    DualTestFollowUpTreatment = 'DualTestFollowUpTreatment',
    DualTestFollowUpInSituCarcinomaTreatment_AIS = 'DualTestFollowUpInSituCarcinomaTreatment_AIS',
    CytologyOnly = 'CytologyOnly'
}

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        samplingReason: ISamplingReason
    }
}
