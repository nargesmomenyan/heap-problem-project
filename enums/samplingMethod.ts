type samplingMethod =
    | '1'
    | '2'
    | '3'

export interface ISamplingMethod {
    1: number
    2: number
    3: number
    toSelect: { text: string; value: number }
}

const samplingMethod = {
    1: 'هنگام کولپوسکوپی',
    2: 'هنگام معاینه',
    3: 'توسط خود بیمار',
}

export enum samplingMethodEnum {
    DuringColposcopy = 1,
    DuringExamination = 2,
    SampledByPatient = 3
}
export default samplingMethod

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        samplingMethod: ISamplingMethod
    }
}