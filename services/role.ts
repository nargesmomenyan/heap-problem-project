import baseService from './base/baseService'
import * as util from './base/util'
import { NuxtAxiosInstance } from 'vrwebdesign-nuxt/modules/nuxt-axios/types'
import { IUserRoles, IRolePatient } from '~/models/UserRole'
import { IExpertise } from '~/models/IExpertise'
import { IPatient } from '~/models/user-roles/IPatient'
import { Iparams } from '~/models/base/Iparams'
import { IListOption } from '~/models/base/IListOption'
import { ITreatingPhysician } from '~/models/user-roles/ITreatingPhysician'
import { IIndividualUser } from '~/models/IndividualUser'
import { ISecretary } from '~/models/user-roles/ISecretary'

export default class role extends baseService<IUserRoles> {
  path: string
  constructor($axios: NuxtAxiosInstance) {
    super($axios)
    this.path = 'roles'
  }

  userRoles(individualUserId: number): Promise<IUserRoles> {
    return this.$axios.$get(`Users/${individualUserId}/Roles`).then(res => {
      return this.mapResponseToUserRoles(res)
    })
  }

  myRoles(): Promise<IUserRoles> {
    return this.$axios.$get(`Users/Me/Roles`).then(res => {
      return this.mapResponseToUserRoles(res)
    })
  }

  private mapResponseToUserRoles(res) {
    let userRoles: IUserRoles = {
      UserId: 0,
      RolePatient: {},
      RoleDiagnosticianDoctorInfo: {},
      RoleTreatingPhysicianInfo: {}
    }
    if (res.Result) {
      res.Result.forEach(item => {
        if (item.User) {
          userRoles.UserId = item.User.Id
          userRoles.DisplayName = item.User.DisplayName
        }
        if (item.Role) {
          switch (item.Role.Name) {
            case 'SuperAdmin':
              userRoles.IsSuperAdmin = true
              userRoles.RoleSuperAdminId = item.Id
              break
            case 'Admin':
              userRoles.IsAdmin = true
              userRoles.RoleAdminId = item.Id
              break
            case 'Technician':
              userRoles.IsTechnician = true
              userRoles.RoleTechnicianId = item.Id
              break
            case 'DiagnosticianDoctor':
              userRoles.IsDiagnosticianDoctor = true
              userRoles.RoleDiagnosticianDoctorId = item.Id
              userRoles.RoleDiagnosticianDoctorInfo = {
                Expertise: parseInt(item.Expertise),
                MedicalSystemCode: item.MedicalSystemCode.toString()
              }
              break

            case 'TreatingPhysician':
              userRoles.IsTreatingPhysician = true
              userRoles.RoleTreatingPhysicianId = item.Id
              userRoles.RoleTreatingPhysicianInfo = {
                Expertise: parseInt(item.Expertise),
                MedicalSystemCode: item.MedicalSystemCode.toString()
              }
              break

            case 'Secretary':
              userRoles.IsSecretary = true
              userRoles.RoleSecretaryId = item.Id
              break

            case 'Shareholder':
              userRoles.IsShareholder = true
              userRoles.RoleShareholderId = item.Id
              break

            case 'Patient':
              userRoles.IsPatient = true
              userRoles.RolePatientId = item.Id
              userRoles.RolePatient = {
                InsuranceNo: item.InsuranceNo,
                InsuranceType: item.InsuranceType,
                Expiration: item.Expiration
              }
              break
          }
        }
      })
    }
    return userRoles
  }

  doctorExpertises(): Promise<IExpertise[]> {
    return this.$axios.$get('/Roles/doctorExpertises').then(response => {
      const list: IExpertise[] = []
      response.Result.forEach(item => {
        list.push(<IExpertise>{
          Id: item.ExpertiseIndex,
          Title: item.ExpertiseTitle
        })
      })
      return list
    })
  }

  async saveUserRoles(userRoles: IUserRoles) {
    await this.saveUserRoleSuperAdmin(userRoles)
    await this.saveUserRoleAdmin(userRoles)
    await this.saveUserRoleSecretary(userRoles)
    await this.saveUserRoleTechnician(userRoles)
    await this.saveUserRoleDiagnosticianDoctor(userRoles)
    await this.saveUserRoleTreatingPhysician(userRoles)
    await this.saveUserRolePatient(userRoles)
    await this.saveUserRoleShareholder(userRoles)
  }

  saveUserRoleSuperAdmin(userRoles: IUserRoles): Promise<IUserRoles> {
    if (userRoles.IsSuperAdmin) {
      if (!userRoles.RoleSuperAdminId)
        return this.$axios
          .$post(`roles/SuperAdmins`, { IndividualUserId: userRoles.UserId })
          .then(res => {
            userRoles.RoleSuperAdminId = res.Result.Id
            return userRoles
          })
    } else if (userRoles.RoleSuperAdminId)
      return this.$axios
        .delete(`roles/Users/${userRoles.RoleSuperAdminId}`)
        .then(res => {
          return userRoles
        })
    return Promise.resolve(userRoles)
  }

  saveUserRoleAdmin(userRoles: IUserRoles): Promise<IUserRoles> {
    if (userRoles.IsAdmin) {
      if (!userRoles.RoleAdminId) {
        return this.$axios
          .$post(`roles/Admins`, { IndividualUserId: userRoles.UserId })
          .then(res => {
            userRoles.RoleAdminId = res.Result.Id
            return userRoles
          })
      }
    } else if (userRoles.RoleAdminId)
      return this.$axios
        .delete(`roles/Users/${userRoles.RoleAdminId}`)
        .then(res => {
          return userRoles
        })
    return Promise.resolve(userRoles)
  }

  saveUserRoleSecretary(userRoles: IUserRoles): Promise<IUserRoles> {
    if (userRoles.IsSecretary) {
      if (!userRoles.RoleSecretaryId) {
        return this.$axios
          .$post(`roles/Secretaries`, { IndividualUserId: userRoles.UserId })
          .then(res => {
            userRoles.RoleSecretaryId = res.Result.Id
            return userRoles
          })
      }
    } else if (userRoles.RoleSecretaryId)
      return this.$axios
        .delete(`roles/Users/${userRoles.RoleSecretaryId}`)
        .then(res => {
          return userRoles
        })
    return Promise.resolve(userRoles)
  }

  saveUserRoleTechnician(userRoles: IUserRoles): Promise<IUserRoles> {
    if (userRoles.IsTechnician) {
      if (!userRoles.RoleTechnicianId) {
        return this.$axios
          .$post(`roles/Technicians`, { IndividualUserId: userRoles.UserId })
          .then(res => {
            userRoles.RoleTechnicianId = res.Result.Id
            return userRoles
          })
      }
    } else if (userRoles.RoleTechnicianId)
      return this.$axios
        .delete(`roles/Users/${userRoles.RoleTechnicianId}`)
        .then(res => {
          return userRoles
        })
    return Promise.resolve(userRoles)
  }

  saveUserRoleShareholder(userRoles: IUserRoles): Promise<IUserRoles> {
    if (userRoles.IsShareholder) {
      if (!userRoles.RoleShareholderId) {
        return this.$axios
          .$post(`roles/Shareholders`, { UserId: userRoles.UserId })
          .then(res => {
            userRoles.RoleShareholderId = res.Result.Id
            return userRoles
          })
      }
    } else if (userRoles.RoleShareholderId)
      return this.$axios
        .delete(`roles/Users/${userRoles.RoleShareholderId}`)
        .then(res => {
          return userRoles
        })
    return Promise.resolve(userRoles)
  }

  saveUserRoleDiagnosticianDoctor(userRoles: IUserRoles): Promise<IUserRoles> {
    if (userRoles.IsDiagnosticianDoctor) {
      if (userRoles.RoleDiagnosticianDoctorId) {
        return this.$axios
          .patch(
            `roles/DiagnosticianDoctors/${userRoles.RoleDiagnosticianDoctorId}`,
            userRoles.RoleDiagnosticianDoctorInfo
          )
          .then(res => {
            return userRoles
          })
      } else {
        return this.$axios
          .$post(
            `roles/DiagnosticianDoctors`,
            Object.assign(
              { IndividualUserId: userRoles.UserId },
              userRoles.RoleDiagnosticianDoctorInfo
            )
          )
          .then(res => {
            userRoles.RoleDiagnosticianDoctorId = res.Result.Id
            return userRoles
          })
      }
    } else if (userRoles.RoleDiagnosticianDoctorId)
      return this.$axios
        .delete(`roles/Users/${userRoles.RoleDiagnosticianDoctorId}`)
        .then(res => {
          return userRoles
        })
    return Promise.resolve(userRoles)
  }

  saveUserRoleTreatingPhysician(userRoles: IUserRoles): Promise<IUserRoles> {
    if (userRoles.IsTreatingPhysician) {
      if (userRoles.RoleTreatingPhysicianId) {
        return this.$axios
          .patch(
            `roles/TreatingPhysicians/${userRoles.RoleTreatingPhysicianId}`,
            userRoles.RoleTreatingPhysicianInfo
          )
          .then(res => {
            return userRoles
          })
      } else {
        return this.$axios
          .$post(
            `roles/TreatingPhysicians`,
            Object.assign(
              { IndividualUserId: userRoles.UserId },
              userRoles.RoleTreatingPhysicianInfo
            )
          )
          .then(res => {
            userRoles.RoleTreatingPhysicianId = res.Result.Id
            return userRoles
          })
      }
    } else if (userRoles.RoleTreatingPhysicianId)
      return this.$axios
        .delete(`roles/Users/${userRoles.RoleTreatingPhysicianId}`)
        .then(res => {
          return userRoles
        })
    return Promise.resolve(userRoles)
  }

  saveUserRolePatient(userRoles: IUserRoles): Promise<IUserRoles> {
    if (userRoles.IsPatient) {
      if (userRoles.RolePatientId) {
        return this.$axios
          .patch(
            `roles/Patients/${userRoles.RolePatientId}`,
            userRoles.RolePatient || {}
          )
          .then(res => {
            return userRoles
          })
      } else {
        return this.$axios
          .$post(
            `roles/Patients`,
            Object.assign(
              { IndividualUserId: userRoles.UserId },
              userRoles.RolePatient || {}
            )
          )
          .then(res => {
            userRoles.RolePatientId = res.Result.Id
            return userRoles
          })
      }
    } else if (userRoles.RolePatientId) {
      return this.$axios
        .delete(`roles/Users/${userRoles.RolePatientId}`)
        .then(res => {
          return userRoles
        })
    }
    return Promise.resolve(userRoles)
  }

  searchPatient(SearchPhrase: string): Promise<IPatient[]> {
    return this.$axios.$get(`roles/patients/${SearchPhrase}`).then(res => {
      let list: IPatient[] = []

      if (res.Result) {
        res.Result.forEach(item => {
          list.push({
            RoleUserId: item.PatientId,
            Id: item.PersonInfo.Id,
            text:
              item.PersonInfo.FirstName +
              ' ' +
              item.PersonInfo.LastName +
              '       ' +
              item.PersonInfo.NationalCode,
            FirstName: item.PersonInfo.FirstName,
            LastName: item.PersonInfo.LastName,
            NationalCode: item.PersonInfo.NationalCode,
            Gender: item.PersonInfo.Gender,
            PhoneNumber: item.PersonInfo.PhoneNumber,
            MobileNumber: item.PersonInfo.MobileNumber,
            BirthDate: item.PersonInfo.BirthDate,
            Address: item.PersonInfo.Address
          } as IPatient)
        })
      }
      return list
    })
  }

  saveIndividualUserWithRolePatient(
    user: IPatient,
    roleInfo: IRolePatient
  ): Promise<IPatient> {
    if (!user.Id) {
      user.Id = 0
    }
    return this.$axios
      .$post('roles/Patients/Immediate', {
        PatientBindingModel: {
          InsuranceInfo: {
            InsuranceNo: 'string',
            InsuranceType: 'string',
            Expiration: '2019-09-04T11:01:38.387Z',
            ExpireByPaperEnds: false
          },
          IndividualUserId: user.Id
        },
        IndividualUserBindingModel: user
      })
      .then(res => {
        let patient = {
          FirstName: res.Result.User.FirstName,
          LastName: res.Result.User.LastName,
          Gender: res.Result.User.Gender,
          NationalCode: res.Result.User.NationalCode,
          RoleUserId: res.Result.Id,
          Id: res.Result.User.Id
        } as IPatient
        return patient
      })
  }

  getSecretaries(): Promise<ISecretary[]> {
    return this.$axios.$get('organizations/Me/secretaries').then(res => {
      let list = <ISecretary[]>[]
      res.Result.forEach(item => {
        list.push({
          Id: item.User.Id,
          RoleUserId: item.Role.Id,
          FirstName: item.User.FirstName,
          LastName: item.User.LastName,
          text: item.User.FirstName + ' ' + item.User.LastName,
          value: item.Role.Id
        } as ISecretary)
      })

      return list
    })
  }

  getSecretariesByOrganizationId(
    organizationId: number
  ): Promise<ISecretary[]> {
    return this.$axios
      .$get(`organizations/${organizationId}/secretaries`)
      .then(res => {
        let list = <ISecretary[]>[]
        res.Result.forEach(item => {
          list.push({
            Id: item.User.Id,
            RoleUserId: item.Role.Id,
            FirstName: item.User.FirstName,
            LastName: item.User.LastName,
            text: item.User.FirstName + ' ' + item.User.LastName,
            value: item.Role.Id
          } as ISecretary)
        })

        return list
      })
  }

  mapResponseToSecretary(item) {
    let secretary: ISecretary = {
      Id: item.User.Id,
      RoleUserId: item.Role.Id,
      FirstName: item.User.FirstName,
      LastName: item.User.LastName,
      text: item.User.FirstName + ' ' + item.User.LastName,
      value: item.Role.Id,
      MobileNumber: '',
      Email: '',
      PhoneNumber: '',
      Address: '',
      Type: 1
    }
    return secretary
  }
}

declare module 'vue/types/vue' {
  interface NuxtServiceInstance {
    role: role
  }
}
