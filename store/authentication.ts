import jwtDecode from 'jwt-decode'
import { ICurrentUser } from '~/models/ICurrentUser';

export const state = () => ({
  token: null,
  organizationalRoles: null,
  rememberMe: null,

})
export const mutations = {
  set_token(state, token) {
    state.token = token

    localStorage.setItem(
      'auth',
      JSON.stringify({
        token: token
      })
    )
  },
  set_rememberMe(state, rememberMe) {
    state.rememberMe = rememberMe
    localStorage.setItem('rememberMe', rememberMe)
  },
  
  set_organizationalRoles(state, organizationalRoles) {
    state.organizationalRoles = organizationalRoles
    localStorage.setItem(
      'organizationalRoles',
      JSON.stringify(organizationalRoles)
    )
  },

  init(state, $axios) {
    let auth = localStorage.getItem('auth')
    if (!auth) {
      return
    }
    let parsed_auth = JSON.parse(auth)
    state.token = parsed_auth.token
    $axios.setToken(state.token)
  },
  logout(state) {
    state.permissions = null
    localStorage.removeItem('permissions')

    state.token = null
    localStorage.removeItem('auth')
    state.organizationalRoles = null
    localStorage.removeItem('organizationalRoles')
  }
}

export const getters = {
  token(state) {
    return state.token
  },
  rememberMe(state) {
    let result = state.rememberMe
    if (result === undefined || result === null) {
      result = localStorage.getItem('rememberMe')
    }
    return new Boolean(result)
  },
  
  currentUserInfo: state => {
    return userInfoFromToken(state.token)
  },
  organizationalRoles(state) {
    let result = state.organizationalRoles
    return result
  },

}

export function userInfoFromToken(token) {
  let user: ICurrentUser = new ICurrentUser()
  if (token) {
    let data = jwtDecode(token)
    if (data) {
      user = {
        DisplayName: data.udn,
        UserId: data.ud,
        RoleTitle: data.ro,
        RoleId: data.rd,
        OrganizationId: data.od,
        OrganizationTitle: data.ot,
        RoleUserId: data.rud,
        OrganizationRoleTitle: '',
        LoginExpireDate: data.exp,
        UserTypeId: data.ut
      } as ICurrentUser
    }
    return user
  }
}
