import { AxiosResponse } from 'axios'
import { NuxtAxiosInstance } from 'vrwebdesign-nuxt/modules/nuxt-axios/types'
import { IListOption } from '~/models/base/IListOption'
import { Iparams } from '~/models/base/Iparams'
import {
  customizeParams,
  customizeResultItems,
  setListPagination_fromResult
} from './util'
import { IFileCredential } from '~/models/base/IFileCredential'

export default abstract class baseService<T> {
  protected abstract path: string

  constructor(protected $axios: NuxtAxiosInstance) { }

  query(params?: Iparams): Promise<AxiosResponse<IListOption<T>>> {
    return this.$axios.get(this.path, { params })
  }

  $query(params?: Iparams): Promise<IListOption<T>> {
    return customizeResultItems(
      this.$axios.$get(`${this.path}`, { params: customizeParams(params) })
    )
  }

  $get(id: number | string): Promise<T> {
    return this.$axios.$get(`${this.path}/${id}`).then(res => {
      let item
      item = res.Result
      item.id = res.Result.Id
      if (res.Result.RegistrationDate)
        item.RegistrationDate = res.Result.RegistrationDate.replace('T', ' ')
      if (res.Result.BirthDate)
        item.BirthDate = res.Result.BirthDate.replace('T', ' ')

      return item
    })
  }

  get(id: number | string): Promise<AxiosResponse<T>> {
    return this.$axios.get(this.path + '/' + id)
  }
  save(obj: any): Promise<AxiosResponse<T>> {
    return this.$axios.post(this.path, obj)
  }

  update(id: number | string, obj: any): Promise<AxiosResponse<T>> {
    return this.$axios.$patch(`${this.path}/${id}`, obj).then(response => {
      let result: AxiosResponse<T> = {
        data: {
          id: response.Result.Id,
          ...response.Result
        },
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: response.config
      }
      return result
    })
  }

  delete(id: number | string): Promise<AxiosResponse<T>> {
    return this.$axios.delete(`${this.path}/${id}`)
  }

  $save(obj: any): Promise<T> {
    return this.$axios.$post(this.path, obj)
  }

  $update(id: number | string, obj: any): Promise<T> {
    return this.$axios.$put(this.path + '/' + id, obj)
  }
  $delete(id: number | string): Promise<T> {
    return this.$axios.$delete(`${this.path}/${id}`)
  }

  AWS_GetTempToken(service): Promise<IFileCredential> {
    return service
      .then(response => {
        let data: IFileCredential = {
          EndPoint: response.Result.EndPoint,
          Key: response.Result.Key,
          AccessKey: response.Result.AccessKey,
          SecretKey: response.Result.SecretKey,
          SessionToken: response.Result.SessionToken,
          Bucket: response.Result.Bucket,
          Expiration: response.Result.Expiration,
        }
        return data
      })
  }

  AWS_ConfirmFileKey(service): Promise<boolean> {
    return service.then(response => {
      if (response.Result) {
        return true
      }
      else {
        return false
      }
    }).catch(error => {
      return false
    })
  }
}
