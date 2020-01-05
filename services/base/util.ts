import { IListOption } from '~/models/base/IListOption';
import { Iparams } from '~/models/base/Iparams';
import { IFilterBase } from '~/models/base/IFilterBase';


export function customizeResultItems(p: Promise<any>): Promise<IListOption<any>> {
  return p.then(res => {
    
    let list: IListOption<any> = { total: 0, lastPage: 0, page: 0, perPage: 0, data: [] };
    if (res.Result) {
      setListPagination_fromResult(list, res.Result)
      list.data = res.Result.Results.map(item => {
        let modelItem = item;
        modelItem.id = item.Id;
        return modelItem;
      })
    }
    return list;
  });
}

export function setListPagination_fromResult(list: IListOption<any>, result: any) {
  list.total = result.RecordCount;
  list.lastPage = result.PageCount;
  list.page = result.CurrentPage;
  list.perPage = result.PageSize;
}

export function customizeParams(params?: Iparams) {

  let customizedParams = {};
  customizedParams['PageSize'] = 99;
  customizedParams['PageNumber'] = 1;

  if (!params)
    return customizedParams;

  if (params.page)
    customizedParams['PageNumber'] = params.page;
  if (params.perPage)
    customizedParams['PageSize'] = params.perPage;


  if (params.sort) {
    let sortOrder = 1; //asc
    let sortParam = ''
    if (params.sort[0] == '-') {
      sortOrder = 2; //desc
      sortParam = params.sort.replace(new RegExp('-', 'g'), '')
    }
    else {
      sortParam = params.sort;
    }
    customizedParams['sortModel.' + sortParam] = sortOrder;
  }

  if (params.filters) {
    //  replace all :like because of data-grid component
    params.filters = params.filters.replace(new RegExp(':like', 'g'), '');
    params.filters = params.filters.replace(new RegExp(':=', 'g'), '');
    params.filters = params.filters.replace(new RegExp(':>', 'g'), '');
    params.filters = params.filters.replace(new RegExp(':<', 'g'), '');

    var filterArray = JSON.parse(params.filters);
    filterArray.forEach(element => {
      let key = element.split(':')[0];
      let value = element.substring(element.indexOf(':') + 1, element.length)
      if (value.indexOf(',') > 0) {
        // this is an array
        value = value.split(',')
      }

      customizedParams['filterModel.' + key] = value;
    });
  }

  return customizedParams;
}

export function mapFilterModelToApiParams(filter?: IFilterBase, sort?: any) {
  let params = { PageNumber: 1, PageSize: 10 }
  if (filter) {
    params = Object.assign(params, { PageNumber: filter.PageNumber || 1 })
    params = Object.assign(params, { PageSize: filter.PageSize || 10 })
    for (let prop in filter) {
      params['filterModel.' + prop] = filter[prop]
    }
  }

  if (sort) {
    for (let prop in sort) {
      params['sortModel.' + prop] = sort[prop]
    }
  }

  return params
}

