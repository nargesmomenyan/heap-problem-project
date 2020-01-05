import { NuxtAxiosInstance } from 'vrwebdesign-nuxt/modules/nuxt-axios/types'
import {
  IOrganization,
  IOrganizationUser,
  IOrganizationCandidateUser,
  IUserRole
} from '~/models/Organization'
import baseService from './base/baseService'
import { IListOption } from '~/models/base/IListOption'
import { Iparams } from '~/models/base/Iparams'
import { IOrganizationShareholder } from '~/models/IOrganizationShareholder'
import { customizeParams, setListPagination_fromResult } from './base/util'
import { IIndividualUser } from '~/models/IndividualUser'
import { response } from 'express'
import { ISimpleUserRole } from '~/models/UserRole'

export default class organization extends baseService<IOrganization> {
  path: string

  constructor($axios: NuxtAxiosInstance) {
    super($axios)
    this.path = '/organizations'
  }

  allOrganizations(): Promise<IOrganization[]> {
    let params = customizeParams({})
    return this.$axios.$get('organizations', { params: params }).then(res => {
      const list: IOrganization[] = []
      res.Result.Results.forEach(item => {
        list.push(<IOrganization>{
          Id: item.Id,
          id: item.Id,
          Name: item.Name,
          Email: item.Email,
          Domain: item.Domain,
          Address: item.Address,
          PhoneNumber: item.PhoneNumber,
          Website: item.Website,
          RegistrationCode: item.RegistrationCode,
          RegistrationDate: item.RegistrationDate,
          NationalCode: item.NationalCode
        })
      })
      return list
    })
  }

  userList(params?: Iparams): Promise<IListOption<IOrganizationUser>> {
    let customizedParams = customizeParams(params)
    return this.$axios
      .$get(
        `organizations/${+customizedParams[
        'filterModel.OrganizationId'
        ]}/CompactMembers`,
        { params: customizedParams }
      )
      .then(res => {
        let list: IListOption<IOrganizationUser> = {
          total: 0,
          lastPage: 1,
          page: 0,
          perPage: 0,
          data: []
        }
        if (res.Result) {
          setListPagination_fromResult(list, res.Result)
          list.data = res.Result.Results.map(item => {
            return {
              OrganizationId: customizedParams['filterModel.OrganizationId'],
              UserId: +item.User.Id,
              Username: item.User.Username,
              UserFirstName: item.User.FirstName,
              UserLastName: item.User.LastName,
              UserNationalCode: item.User.NationalCode,
              UserMobileNumber: item.User.MobileNumber,
              Roles: item.Roles.filter(
                role => role.Name != 'SuperAdmin' && role.Name != 'Guest'
              ).map(role => {
                return {
                  RoleId: role.Id,
                  RoleTitle: role.Name,
                  RoleUserId: role.RoleUserId
                } as IUserRole
              })
            } as IOrganizationUser
          })
        }
        return list
      })
  }

  candidateRoleUsers(
    params?: Iparams
  ): Promise<IListOption<IOrganizationCandidateUser>> {
    let customizedParams = customizeParams(params)
    return this.$axios
      .$get(
        `organizations/${+customizedParams[
        'filterModel.organizationId'
        ]}/CandidateMembers`,
        { params: customizedParams }
      )
      .then(res => {
        let list: IListOption<IOrganizationCandidateUser> = {
          total: 0,
          lastPage: 1,
          page: 0,
          perPage: 0,
          data: []
        }
        if (res.Result) {
          list = Object.assign(list, {
            total: res.Result.RowCount,
            lastPage: res.Result.PageCount,
            page: res.Result.CurrentPage,
            perPage: res.Result.PageSize,

            data: res.Result.Results.map(item => {
              return {
                OrganizationId: customizedParams['filterModel.organizationId'],
                FirstName: item.IndividualUser.FirstName,
                LastName: item.IndividualUser.LastName,
                NationalCode: item.IndividualUser.NationalCode,
                RoleTitle: item.Role.Name,
                RoleId: item.Role.Id,
                RoleUserId: item.Id
              } as IOrganizationCandidateUser
            })
          })
        }
        return list
      })
  }

  addUser(organizationId: number, roleUserId: number) {
    return this.$axios.$post(`${this.path}/${organizationId}/Members`, {
      RoleUserId: roleUserId
    })
  }

  deleteRoleUser(organizationId: number, roleUserId: number) {
    return this.$axios.$delete(
      `${this.path}/${organizationId}/Members/${roleUserId}`
    )
  }

  deleteUser(organizationId: number, userId: number) {
    return this.$axios.$delete(`${this.path}/${organizationId}/Users/${userId}`)
  }

  shareholderList(
    params?: Iparams
  ): Promise<IListOption<IOrganizationShareholder>> {
    let customizedParams = customizeParams(params)
    return this.$axios
      .$get(
        `organizations/${+customizedParams[
        'filterModel.OrganizationId'
        ]}/Shareholders`,
        { params: customizedParams }
      )
      .then(res => {
        let list: IListOption<IOrganizationShareholder> = {
          total: 0,
          lastPage: 1,
          page: 0,
          perPage: 0,
          data: []
        }
        if (res.Result) {
          ; (list.total = res.Result.RowCount),
            (list.lastPage = res.Result.PageCount),
            (list.page = res.Result.CurrentPage),
            (list.perPage = res.Result.PageSize),
            (list.data = res.Result.Results.map(item => {
              return {
                OrganizationId: item.OrganizationId,
                OrganizationName: item.OrganizationName,
                DisplayName: item.DisplayName,
                RoleUserId: item.RoleUserId,
                UserType: item.UserType,
                ShareValue: item.ShareValue,
                RoleId: item.RoleId,
                UserId: item.UserId,
                Username: item.Username,
                PhoneNumber: item.PhoneNumber
              } as IOrganizationShareholder
            }))
        }
        return list
      })
  }

  addShareholder(
    shareholder: IOrganizationShareholder
  ): Promise<IOrganizationShareholder> {
    return this.$axios
      .$post(`Organizations/${shareholder.OrganizationId}/Shareholders`, {
        ShareValue: shareholder.ShareValue,
        RoleUserId: shareholder.RoleUserId
      })
      .then(res => {
        return this.mapResultToShareholder(res.Result)
      })
  }

  editShareholder(
    shareholder: IOrganizationShareholder
  ): Promise<IOrganizationShareholder> {
    return this.$axios
      .$patch(
        `organizations/${shareholder.OrganizationId}/shareholders/${shareholder.RoleUserId}`,
        {
          ShareValue: shareholder.ShareValue
        }
      )
      .then(res => {
        return this.mapResultToShareholder(res.Result)
      })
  }

  private mapResultToShareholder(resData) {
    return {
      OrganizationId: resData.OrganizationId,
      OrganizationName: resData.OrganizationName,
      DisplayName: resData.DisplayName,
      RoleUserId: resData.RoleUserId,
      ShareValue: resData.ShareValue,
      RoleId: resData.RoleId,
      UserId: resData.UserId,
      Username: resData.Username,
      PhoneNumber: resData.PhoneNumber,
      UserType: resData.UserType
    } as IOrganizationShareholder
  }

  getMyOrganizationUsersByRole(roleName: string): Promise<ISimpleUserRole[]> {
    let path = ''
    switch (roleName) {
      case 'TechnicianSupervisor':
        path = 'Organizations/Me/TechnicianSupervisors'
        break

      case 'Technician':
        path = 'Organizations/Me/Technicians'
        break

      case 'DiagnosticianDoctor':
        path = '/Organizations/Me/DiagnosticianDoctors'
        break

      case 'DiagnosticianDoctorSupervisor':
        path = '/Organizations/Me/DiagnosticianDoctorSupervisors'
        break
    }
    return this.$axios.$get(path)
      .then(response => {
        let list: ISimpleUserRole[] = []
        response.Result.forEach(item => {
          list.push({
            RoleUserId: item.Id,
            RoleId: item.Role.Id, RoleName: item.Role.Name,
            FullName: item.User.FirstName + ' ' + item.User.LastName, ...item.User
          })
        }
        )
        
        return list
      })
  }
}

declare module 'vue/types/vue' {
  interface NuxtServiceInstance {
    organization: organization
  }
}
