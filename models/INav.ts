export interface INav {
    icon: string
    title: string
    to: string
    subItems: INav[] | undefined
  }