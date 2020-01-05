type sampleProcessingMethod =
    | '1'
    | '2'
    | '3'

export interface ISampleProcessingMethod {
    1: number
    2: number
    3: number
    toSelect: { text: string; value: number }
}

const sampleProcessingMethod = {
    1: 'one slide',
    2: 'two slide',
    3: 'سایر',
}

export enum sampleProcessingMethodEnum {
    ConventionalPapSmearOnSlide = 1,
    ConventionalPapSmearTwoSlide = 2,
    Other = 3 
}
export default sampleProcessingMethod

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        sampleProcessingMethod: ISampleProcessingMethod
    }
}