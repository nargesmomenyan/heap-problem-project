type slidingTechnique =
    | '1'
    | '2'

export interface ISlidingTechnique {
    1: number
    2: number
    toSelect: { text: string, value: string }
}

const slidingTechnique = {
    1: 'روش شماره 1',
    2: 'روش شماره 2'
}
export default slidingTechnique

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        slidingTechnique: ISlidingTechnique
    }
}