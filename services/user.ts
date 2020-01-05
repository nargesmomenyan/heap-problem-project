import { IUser, UserBriefInfo } from '~/models/User'
import { NuxtAxiosInstance } from 'vrwebdesign-nuxt/modules/nuxt-axios/types'
import {
  ILoginServiceRequest,
  ILoginOrganization,
  ILoginServiceResponse
} from '~/models/Login'
import baseService from './base/baseService'
import { IOrganizationalRole } from '~/models/IOrganizationalRole'

export default class user extends baseService<IUser> {
  path: string

  constructor($axios: NuxtAxiosInstance) {
    super($axios)
    this.path = '/auth'
  }

  loginToService(model: ILoginServiceRequest): Promise<any> {
    return this.$axios
      .$post('auth/login', {
        Username: model.Username,
        Password: model.Password,
        LoginAsADifferentRole: model.LoginAsADifferentRole
      })
      .then(res => {
        let result: ILoginServiceResponse = {
          Token: res.Result.Token,
          SecondStepLoginIsNeeded: false
        }

        this.$axios.setToken(res.Result.Token)
        if (res.Infos && res.Infos.length > 0 && res.Infos[0].Message) {
          if (res.Infos[0].Message.MessageText === 'SecondStepLoginIsNeeded')
            result.SecondStepLoginIsNeeded = true
        }
        return result
      })
  }

  ListMyActions(): Promise<any> {
    return this.$axios.$get('Actions/Me').then(res => {
      return res
    })
  }

  loginToOrganization(model: ILoginOrganization): Promise<string> {
    return this.$axios
      .$patch('auth/login', {
        OrganizationId: model.OrganizationId,
        Role: model.RoleId,
        RememberMe: model.RememberRole
      })
      .then(response => {
        this.$axios.setToken(response.Result.Token)
        return response.Result.Token
      })
  }

  logout(token): Promise<any> {
    return this.$axios.$post(`auth/Logout?JWT=${token}`).then(response => {
      this.$axios.setToken(false)
    })
  }

  editProfile(user: IUser) {
    return this.$axios.patch(`Users/Me`, user)
  }

  resetPassword(userId): Promise<string> {
    return this.$axios.post(`Users/${userId}/ResetPassword`).then(res => {
      return res.data.Result.NewPassword
    })
  }

  resetMyPassword(): Promise<string> {
    return this.$axios.post(`Users/Me/ResetPassword`).then(res => {
      return res.data.Result.NewPassword
    })
  }

  search_userName(username): Promise<UserBriefInfo> {
    return this.$axios.$get(`Users/Search/${username}`).then(res => {
      return <UserBriefInfo>{
        Id: res.Result.UserId,
        DisplayName: res.Result.DisplayName,
        Username: res.Result.Username,
        NationalCode_RegistrationCode:
          res.Result.NationalCode + res.Result.RegistrationCode
      }
    })
  }

  myOrganizationalRoles(): Promise<IOrganizationalRole[]> {
    return this.$axios.$get(`users/Me/Memberships`).then(res => {
      let list: IOrganizationalRole[] = []
      if (res.Result) {
        for (let i = 0; i < res.Result.length; i++) {
          const element = res.Result[i]
          let item: IOrganizationalRole = {
            OrganizationId: element.OrganizationId,
            OrganizationName: element.OrganizationName,
            RoleId: element.RoleId,
            RoleTitle: element.RoleTitle,
            Id: i + 1
          }

          list.push(item)
        }
      }
      return list
    })
  }

  getSetting(userId: number): Promise<IOrganizationalRole> {
    return this.$axios.$get(`Users/${userId}/Settings`).then(res => {
      if (res.Result) {
        return <IOrganizationalRole>{
          RoleId: res.Result.DefaultRoleId,
          RoleTitle: res.Result.DefaultRoleTitle,
          OrganizationId: res.Result.DefaultOrganizationId,
          OrganizationName: res.Result.DefaultOrganizationTitle
        }
      } else {
        return <IOrganizationalRole>{}
      }
    })
  }

  editSetting(userId: number, obj: IOrganizationalRole): Promise<Boolean> {
    return this.$axios.$patch(`Users/${userId}/Settings`, obj).then(() => {
      return true
    })
  }

  editContactInfo(user: IUser): Promise<number> {
    return this.$axios
      .$patch(`users/${user.Id}/ContactInfo`, {
        Email: user.Email,
        Address: user.Address,
        MobileNumber: user.MobileNumber,
        PhoneNumber: user.PhoneNumber
      })
      .then(res => {
        return res.Result.Id
      })
  }
}

declare module 'vue/types/vue' {
  interface NuxtServiceInstance {
    user: user
  }
}
