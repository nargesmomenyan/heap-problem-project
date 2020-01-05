type receptionType =
    | 1
    | 2
    | 3
export interface IReceptionType {
    1: number
    2: number
    3: number
    toSelect: { text: string; value: number }[]
}
const receptionType = {
    1: 'معمولی',
    2: 'فوری',
    3: 'VIP',
}

export default receptionType

export enum receptionTypeEnum {
    normal = 1,
    emergency = 2,
    VIP = 3
}

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        receptionType: IReceptionType
    }
}
