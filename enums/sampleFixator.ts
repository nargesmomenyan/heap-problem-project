type sampleFixator =
    | 1
    | 2
export interface ISampleFixator {
    1: number
    2: number
    toSelect: { text: string; value: number }[]
}
const sampleFixator = {
    1: 'آب',
    2: 'فرمالین',
}

export default sampleFixator

export enum sampleFixatorEnum {
    water = 1,
    formalin = 2,
}

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        sampleFixator: ISampleFixator
    }
}
