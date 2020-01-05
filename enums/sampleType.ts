type sampleType =
    | '2'
    | '3'

export interface ISampleType {
    2: number
    3: number
    toSelect: { text: string; value: number }
}

const sampleType = {
    2: 'پاپ اسمیر',
    3: 'کلیه',
}
export default sampleType

export enum sampleTypeEnum {
    kidney = 3,
    PapSmear = 2,
}

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        sampleType: ISampleType
    }
}