type gender =
    | 3
    | 1
    | 2
export interface IGender {
    3: number
    1: number
    2: number
    toSelect: { text: string; value: number }[]
}
const gender = {
    3: 'نامشخص',
    2: 'زن',
    1: 'مرد',
}
export default gender

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        gender: IGender
    }
}
