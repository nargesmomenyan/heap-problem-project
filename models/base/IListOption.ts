export interface IListOption<T> {
    data: T[]
    perPage: number
    page: number
    lastPage: number
    total: number
  }