type contraceptionMethod =
    | 'NotStated'
    | 'Caput'
    | 'TwoPhasePill'
    | 'MenCondoms'
    | 'WomenCondoms'
    | 'ContraceptiveImplantMaterial'
    | 'ContraceptiveInjectionMaterial'
    | 'Diaphragm'
    | 'FallopianTubeBlockage'
    | 'IUD'
    | 'IUS'
    | 'ManInfertailty'
    | 'MonthdaysScheduling'
    | 'Non'
    | 'ProgesteronePills'
    | 'ContraceptiveRing'
    | 'Refusing'
    | 'OtherMethods'
export interface IContraceptionMethod {
    'NotStated': string
    'Caput': string
    'TwoPhasePill': string
    'MenCondoms': string
    'WomenCondoms': string
    'ContraceptiveImplantMaterial': string
    'ContraceptiveInjectionMaterial': string
    'Diaphragm': string
    'FallopianTubeBlockage': string
    'IUD': string
    'IUS': string
    'ManInfertailty': string
    'MonthdaysScheduling': string
    'Non': string
    'ProgesteronePills': string
    'ContraceptiveRing': string
    'Refusing': string
    'OtherMethods': string
    toSelect: { text: string; value: string }[]
}
const contraceptionMethod = {
    'NotStated': 'ذکر نشده',
    'Caput': 'کاپوت',
    'TwoPhasePill': 'قرص دوگانه',
    'MenCondoms': 'کاندوم مردانه',
    'WomenCondoms': 'کاندوم زنانه',
    'ContraceptiveImplantMaterial': 'کاشت ماده ضد بارداری',
    'ContraceptiveInjectionMaterial': 'تزریق ماده ضد بارداری',
    'Diaphragm': 'پرده گذاری Diaphrag',
    'FallopianTubeBlockage': 'نابارورکردن زن (بستن لوله',
    'IUD': 'IUD',
    'IUS': 'IUS',
    'ManInfertailty': 'نابارور کردن مرد',
    'MonthdaysScheduling': 'برنامه‌ریزی براساس روزهای ماه',
    'Non': 'روش پیشگیری ندارد',
    'ProgesteronePills': 'قرص پروژسترون',
    'ContraceptiveRing': 'حلقه واژنی',
    'Refusing': 'پس کشیدن',
    'OtherMethods': 'سایر',
}

export default contraceptionMethod

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        contraceptionMethod: IContraceptionMethod
    }
}
