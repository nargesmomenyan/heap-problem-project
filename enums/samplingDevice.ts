type samplingDevice =
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'

export interface ISamplingDevice {
    1: number
    2: number
    3: number
    4: number
    5: number
    toSelect: { text: string; value: number }
}

const samplingDevice = {
    1: 'ThinPrep',
    2: 'SurPath',
    3: 'LiquiPrep',
    4: 'SurPrep',
    5: 'سایر',
}

export enum samplingDeviceEnum {
    LiquidBasedSmearThinPrep = 1,
    LiquidBasedSmearSurPath = 2,
    LiquidBasedSmearLiquiPrep = 3,
    LiquidBasedSmearSurPrep = 4,
    LiquidBasedSmearOther = 5
}
export default samplingDevice

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        samplingDevice: ISamplingDevice
    }
}