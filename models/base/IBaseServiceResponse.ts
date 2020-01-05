export interface IBaseServiceResponse<T> {
  Succeed: boolean;
  Result: T;
  Error: any;
}
