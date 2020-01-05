type samplingArea =
    | '1'
    | '2'
    | '3'

export interface ISamplingArea {
    1: number
    2: number
    3: number
    toSelect: { text: string; value: number }
}

const samplingArea = {
    1: 'دهانه رحم',
    2: 'مهبل',
    3: 'سایر',
}

export enum samplingAreaEnum {
    Cervix = 1,
    Vaginal = 2,
    Other = 3 
}
export default samplingArea

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        samplingArea: ISamplingArea
    }
}