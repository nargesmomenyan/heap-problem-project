import jwtDecode from 'jwt-decode'

export default function ({ $axios, store, redirect, context }) {
    // $axios.onRequest(request => {
    //     console.log('axios request: ', request)
    //     if (request.url.includes('token') || request.url.includes('Token') || request.url.includes('Login') || request.url.includes('login')
    //         || request.url.includes('Logout') || request.url.includes('logout'))
    //         return request

    //     const token = store.getters['authentication/token']
    //     if (!token) {
    //         redirect('/auth')
    //         return false
    //     }

    //     const rememberMe = store.getters['authentication/rememberMe']
    //     if (token && rememberMe == true) {

    //         let data = jwtDecode(token)
    //         //  number of seconds since Unix epoch
    //         const currentDate = Date.now() / 1000;

    //         const diff = data.exp - parseInt(currentDate);
    //         if (diff > 0 && diff <= 5 * 60) {
    //             
    //             //  get new token
    //             $axios.get('auth/RefreshToken')
    //                 .then(res => {
    //                     $axios.setToken(res.data.Result.Token)
    //                     store.commit('authentication/set_token', res.data.Result.Token)
    //                 })
    //                 .catch(err => {
    //                     console.log('handle refresh token', err)
    //                 })
    //         }
    //     }
    //     return request
    // })

}