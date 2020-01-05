export interface IBaseListModel<VIEWTYPE> {
  Items: VIEWTYPE[];
  Paginated: boolean;
  CurrentPage: number;
  PageSize: number;
  PageCount: number;
  RowCount: number;
}


