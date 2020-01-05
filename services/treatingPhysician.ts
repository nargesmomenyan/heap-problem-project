import baseService from './base/baseService'
import { ITreatingPhysician } from '~/models/user-roles/ITreatingPhysician'
import { NuxtAxiosInstance } from 'vrwebdesign-nuxt/modules/nuxt-axios/types'
export default class treatingPhysician extends baseService<ITreatingPhysician> {
  path: string
  constructor($axios: NuxtAxiosInstance) {
    super($axios)
    this.path = ''
  }

  search(name_medicalSystemCode: string): Promise<ITreatingPhysician[]> {
    return this.$axios
      .$get(`roles/treatingPhysician/${name_medicalSystemCode}`)
      .then(res => {
        const list = <ITreatingPhysician[]>[]
        res.Result.forEach(element => {
          list.push({
            FirstName: element.User.FirstName,
            LastName: element.User.LastName,
            Gender: element.User.Gender,
            Id: element.User.Id,
            MedicalSystemCode: element.MedicalSystemCode,
            Expertise: element.Expertise,
            RoleUserId: element.Id,
            Username: element.User.Username,
            Email: element.User.Email,
            Address: element.User.Address,
            PhoneNumber: element.User.PhoneNumber,
            MobileNumber: element.User.MobileNumber,
            text:
              element.User.FirstName +
              ' ' +
              element.User.LastName +
              ' تخصص ' +
              element.Expertise +
              ' شماره نظام پزشکی ' +
              element.MedicalSystemCode
          } as ITreatingPhysician)
        })
        return list
      })
  }

  saveIndividualUserWithRoleTreatingPhysician(
    user: ITreatingPhysician
  ): Promise<ITreatingPhysician> {
    if (!user.Id) {
      user.Id = 0
    }
    return this.$axios
      .$post('roles/TreatingPhysicians/Immediate', {
        TreatingPhysicianBindingModel: {
          Expertise: user.Expertise,
          MedicalSystemCode: user.MedicalSystemCode,
          IndividualUserId: user.Id
        },
        IndividualUserBindingModel: user
      })
      .then(res => {
        let physician = {
          FirstName: res.Result.User.FirstName,
          LastName: res.Result.User.LastName,
          Gender: res.Result.User.Gender,
          PhoneNumber: res.Result.User.PhoneNumber,
          MobileNumber: res.Result.User.MobileNumber,
          Email: res.Result.User.Email,
          RoleUserId: res.Result.Id,
          Id: res.Result.User.Id
        } as ITreatingPhysician

        return physician
      })
  }
}

declare module 'vue/types/vue' {
  interface NuxtServiceInstance {
    treatingPhysician: treatingPhysician
  }
}
