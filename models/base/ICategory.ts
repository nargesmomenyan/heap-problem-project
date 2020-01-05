export interface ICategory {
    key: string,
    id: number,
    text: string
    count?: number
    icon?: string
    iconActive?: string
    priority?: number
    bottomZone?: boolean
}