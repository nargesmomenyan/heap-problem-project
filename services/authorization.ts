import baseService from './base/baseService'
import { Permission } from '~/models/Permission'
import { NuxtAxiosInstance } from 'vrwebdesign-nuxt/modules/nuxt-axios/types'
import { Iparams } from '~/models/base/Iparams'
import { IListOption } from '~/models/base/IListOption'
import { customizeParams, setListPagination_fromResult } from './base/util'

export default class authorization extends baseService<Permission> {
  path: string

  constructor($axios: NuxtAxiosInstance) {
    super($axios)
    this.path = 'Action'
  }

  permissions(params?: Iparams): Promise<IListOption<Permission>> {
    return this.$axios
      .$get(`actions`, { params: customizeParams(params) })
      .then(res => {
        let list: IListOption<Permission> = {
          total: 0,
          lastPage: 0,
          page: 0,
          perPage: 0,
          data: []
        }
        if (res.Result) {
          setListPagination_fromResult(list, res.Result)
          res.Result.Results.forEach(item => {
            let permission = <Permission>{
              ControllerName: item.Controller,
              ActionName: item.Action,
              SuperAdminGranted: false,
              AdminGranted: false,
              DiagnosticianDoctorGranted: false,
              TreatingDoctorGranted: false,
              TechnicianGranted: false,
              PatientGranted: false,
              SecretaryGranted: false,
              ShareholderGranted: false
            }

            if (item.Roles) {
              if (item.Roles.find(x => x.Name == 'SuperAdmin'))
                permission.SuperAdminGranted = true

              if (item.Roles.find(x => x.Name == 'Admin'))
                permission.AdminGranted = true

              if (item.Roles.find(x => x.Name == 'DiagnosticianDoctor'))
                permission.DiagnosticianDoctorGranted = true

              if (item.Roles.find(x => x.Name == 'Patient'))
                permission.PatientGranted = true

              if (item.Roles.find(x => x.Name == 'Secretary'))
                permission.SecretaryGranted = true

              if (item.Roles.find(x => x.Name == 'TreatingDoctor'))
                permission.TreatingDoctorGranted = true

              if (item.Roles.find(x => x.Name == 'Technician'))
                permission.TechnicianGranted = true

              if (item.Roles.find(x => x.Name == 'Shareholder'))
                permission.ShareholderGranted = true
            }
            list.data.push(permission)
          })
        }

        return list
      })
  }
}

declare module 'vue/types/vue' {
  interface NuxtServiceInstance {
    authorization: authorization
  }
}
