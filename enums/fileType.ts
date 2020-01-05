type fileType =
    | 0
    | 1
    | 2
export interface IFileType {
    0: number
    1: number
    2: number
    toSelect: { text: string; value: number }[]
}
const fileType = {
    0: 'نامشخص',
    1: 'تصویر',
    2: 'متن',
}

export default fileType

export enum fileTypeEnum {
    Unknown = 0,
    Image = 1,
    Text = 2
}

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        fileType: IFileType
    }
}
