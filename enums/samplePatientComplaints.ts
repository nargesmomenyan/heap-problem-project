type samplePatientComplaints =
    | 'AbnormalUterineBleeding'
    | 'PostmenopausalBleeding'
    | 'BleedingAfterSex'
    | 'BleedingAfterGenitalWash'
    | 'GenitalPain'
    | 'GenitalWarts'
    | 'PainDuringSex'
    | 'ExcessiveDischarge'
    | 'BadColoredDischarge'
    | 'BloodDischarge'
    | 'FunkyDischarge'

export interface ISamplePatientComplaints {
    'AbnormalUterineBleeding': string
    'PostmenopausalBleeding': string
    'BleedingAfterSex': string
    'BleedingAfterGenitalWash': string
    'GenitalPain': string
    'GenitalWarts': string
    'PainDuringSex': string
    'ExcessiveDischarge': string
    'BadColoredDischarge': string
    'BloodDischarge': string
    'FunkyDischarge': string
    toSelect: { text: string; value: string }
}

const samplePatientComplaints = {
    'AbnormalUterineBleeding': 'خونریزی غیر طبیعی رحمی AUB',
    'PostmenopausalBleeding': 'خونریزی پس از یائسگی',
    'BleedingAfterSex': 'خونریزی پس از نزدیکی',
    'BleedingAfterGenitalWash': 'خونریزی پس از شستشوی ناحیه تناسلی',
    'GenitalPain': 'درد ناحیه تناسلی',
    'GenitalWarts': 'زگیل تناسلی',
    'PainDuringSex': 'درد هنگام نزدیکی',
    'ExcessiveDischarge': 'ترشح زیاد از حد',
    'BadColoredDischarge': 'ترشح بد رنگ',
    'BloodDischarge': 'ترشح خونی',
    'FunkyDischarge': 'ترشح بد بو',
}

export default samplePatientComplaints

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        samplePatientComplaints: ISamplePatientComplaints
    }
}