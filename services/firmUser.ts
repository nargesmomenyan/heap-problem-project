import { NuxtAxiosInstance } from 'vrwebdesign-nuxt/modules/nuxt-axios/types'
import { IFirmUser } from '~/models/FirmUser'
import baseService from './base/baseService'
import { AxiosResponse } from 'axios'
import { IListOption } from '~/models/base/IListOption'
import { Iparams } from '~/models/base/Iparams'

export default class firmUser extends baseService<IFirmUser> {
  path: string

  constructor($axios: NuxtAxiosInstance) {
    super($axios)
    this.path = 'FirmUsers'
  }

  query(params?: Iparams): Promise<AxiosResponse<IListOption<IFirmUser>>> {
    this.path = 'FirmUsers'
    return super.query(params)
  }

  $query(params?: Iparams): Promise<IListOption<IFirmUser>> {
    this.path = 'FirmUsers'
    return super.$query(params)
  }

  delete(id: number | string): Promise<AxiosResponse<IFirmUser>> {
    this.path = 'Users'
    return super.delete(id)
  }

  $delete(id: number | string): Promise<IFirmUser> {
    this.path = 'Users'
    return super.$delete(id)
  }

  profile(): Promise<IFirmUser> {
    this.path = 'FirmUsers'

    return this.$axios.get(this.path + '/Me').then(res => {
      let item: IFirmUser = this.mapResultToFirmUser(res.data.Result)
      return item
    })
  }

  $save(obj: IFirmUser): Promise<IFirmUser> {
    return this.$axios.$post(this.path, obj).then(res => {
      let item: IFirmUser = this.mapResultToFirmUser(res.Result)
      return item
    })
  }

  private mapResultToFirmUser(resData): IFirmUser {
    return {
      Id: resData.Id,
      Name: resData.Name,
      EconomicCode: resData.EconomicCode,
      RegistrationCode: resData.RegistrationCode,
      RegistrationDate: resData.RegistrationDate,
      Username: resData.Username,
      Address: resData.Address,
      MobileNumber: resData.MobileNumber,
      PhoneNumber: resData.PhoneNumber,
      Email: resData.Email,
      Type: resData.Type
    } as IFirmUser
  }
}

declare module 'vue/types/vue' {
  interface NuxtServiceInstance {
    firmUser: firmUser
  }
}
