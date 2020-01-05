type samplePatientClinicalFindings =
    | 'HistoryOfHPVVaccine'
    | 'Immunodeficiency'
    | 'UterineRemoval'
    | 'HistoryOfIUDUsage'
    | 'SuspiciousPapSmearHistory'
    | 'SuspiciousClinicalFindings'
    | 'AdenocarcinomaInSitu_AIS'
    | 'HistoryOfRadiotherapy'
    | 'HistoryOfChemotherapy'
    | 'ImpactUsingDiethylstilbestrol_DES'
    | 'Fasting'
    | 'UnderHormonalTherapy'

export interface ISamplePatientClinicalFindings {
    'HistoryOfHPVVaccine': string
    'Immunodeficiency': string
    'UterineRemoval': string
    'HistoryOfIUDUsage': string
    'SuspiciousPapSmearHistory': string
    'SuspiciousClinicalFindings': string
    'AdenocarcinomaInSitu_AIS': string
    'HistoryOfRadiotherapy': string
    'HistoryOfChemotherapy': string
    'ImpactUsingDiethylstilbestrol_DES': string
    'Fasting': string
    'UnderHormonalTherapy': string
    toSelect: { text: string; value: string }
}

const samplePatientClinicalFindings = {
    'HistoryOfHPVVaccine': 'سابقه واکسن HPV',
    'Immunodeficiency': 'نقص ایمنی',
    'UterineRemoval': 'برداشتن رحم',
    'HistoryOfIUDUsage': 'استفاده از IUD',
    'SuspiciousPapSmearHistory': 'سابقه پاپ اسمیر مشکوک',
    'SuspiciousClinicalFindings': 'یافته مشکوک بالینی',
    'AdenocarcinomaInSitu_AIS': 'سابقه کارسینومای درجا AIS',
    'HistoryOfRadiotherapy': 'سابقه پرتو درمانی',
    'HistoryOfChemotherapy': 'سابقه شیمی درمانی',
    'ImpactUsingDiethylstilbestrol_DES': 'برخورد با استفاده از دی اتیل استیل بسترول DES',
    'Fasting': 'ناشتا است',
    'UnderHormonalTherapy': 'درمان هورمونی میشود',
}

export default samplePatientClinicalFindings

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        samplePatientClinicalFindings: ISamplePatientClinicalFindings
    }
}