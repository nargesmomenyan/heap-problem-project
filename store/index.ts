export const state = () => ({
  locales: ['en', 'fa'],
  locale: 'fa',
  organizations: null,
  errorMessage: null
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale;
    }
  },
  changeLanguage(state) {
    state.locale = (state.locale === 'fa') ? 'en' : 'fa'
  },
  set_organizations(state, items) {
    state.organizations = items
  },
  set_errorMessage(state, msg) {
    
    state.errorMessage = msg
  }
}

export const actions = {
  async nuxtClientInit({ state, commit, dispatch }, { req, $axios }) {
    return new Promise((resolve, reject) => {
      commit('authentication/init', $axios)
      resolve(true)
    })
  }
}

export const getters = {
  currentLanguage(state) {
    return state.locale
  },
  organizations(state) {
    return state.organizations
  }
}

// import Vuex from 'vuex'
// import Vue from 'vue'
// import { getModule } from 'vuex-module-decorators'
// import CurrentUser from './currentUser'

// let currentUserStore: CurrentUser

// const initializer = (store: Store<any>): void => {
//   
//   currentUserStore = getModule(CurrentUser, store)
// }

// export const plugins = [initializer]
// export {
//   currentUserStore,
// }

// Vue.use(Vuex)
// const store = new Vuex.Store({
//   modules: {
//     currentUser: CurrentUser
//   }
// })

// export default store
// export const currentUserModule = getModule(CurrentUser, store)

