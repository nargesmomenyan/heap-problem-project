import { NuxtAxiosInstance } from 'vrwebdesign-nuxt/modules/nuxt-axios/types'
import baseService from './base/baseService'
import { AxiosResponse } from 'axios'
import { IListOption } from '~/models/base/IListOption'
import { Iparams } from '~/models/base/Iparams'
import { IIndividualUser } from '~/models/IndividualUser'
import { IUserRoles } from '~/models/UserRole'

export default class individualUser extends baseService<IIndividualUser> {
  path: string

  constructor($axios: NuxtAxiosInstance) {
    super($axios)
    this.path = 'IndividualUsers'
  }

  query(
    params?: Iparams
  ): Promise<AxiosResponse<IListOption<IIndividualUser>>> {
    this.path = 'IndividualUsers'
    return super.query(params)
  }

  $query(params?: Iparams): Promise<IListOption<IIndividualUser>> {
    this.path = 'IndividualUsers'
    return super.$query(params)
  }

  delete(id: number | string): Promise<AxiosResponse<IIndividualUser>> {
    this.path = 'Users'
    return super.delete(id)
  }

  $delete(id: number | string): Promise<IIndividualUser> {
    this.path = 'Users'
    return super.$delete(id)
  }

  $save(obj: IIndividualUser): Promise<IIndividualUser> {
    return this.$axios.$post(this.path, obj).then(res => {
      let item: IIndividualUser = this.mapResultToIndividualUser(res.Result)
      return item
    })
  }

  profile(): Promise<IIndividualUser> {
    this.path = 'IndividualUsers'

    return this.$axios.get(this.path + '/Me').then(res => {
      let item: IIndividualUser = this.mapResultToIndividualUser(
        res.data.Result
      )
      return item
    })
  }

  mapResultToIndividualUser(resData): IIndividualUser {
    return {
      Id: resData.Id,
      FirstName: resData.FirstName,
      LastName: resData.LastName,
      NationalCode: resData.NationalCode,
      Gender: resData.Gender,
      BirthDate: resData.BirthDate,
      Username: resData.Username,
      Address: resData.Address,
      MobileNumber: resData.MobileNumber,
      PhoneNumber: resData.PhoneNumber,
      Email: resData.Email,
      Type: resData.Type
    } as IIndividualUser
  }
}

declare module 'vue/types/vue' {
  interface NuxtServiceInstance {
    individualUser: individualUser
  }
}
