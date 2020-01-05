export const state = () => ({
    inProgressReception: null,
    secretaries: null,
    allSecretaries: null
})

export const getters = {
    InProgressReception(state) {
        
        let reception = localStorage.getItem('inProgressReception')
        if (!reception) {
            return
        }

        return JSON.parse(reception)
    },
    Secretaries(state) {
        return state.secretaries
    },
    AllSecretaries(state) {
        return state.allSecretaries
    },
}

export const mutations = {
    set_inProgressReception(state, item) {
        
        state.inProgressReception = item
        localStorage.setItem('inProgressReception', JSON.stringify(item))
    },
    remove_inProgressReception(state) {
        state.inProgressReception = null
        localStorage.removeItem('inProgressReception')
    },
    set_secretaries(state, list) {
        state.secretaries = list
    },
    set_allSecretaries(state, list) {
        state.allSecretaries = list
    }
}