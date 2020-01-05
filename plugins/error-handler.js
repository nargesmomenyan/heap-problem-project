import errorCodes from '~/static/errorCodes.json'

export default function ({ $axios, store, ctx, redirect }) {

  // $axios.onResponse(response => console.log('axios response: ', response))
  $axios.onError(error => {

    if (error.config.hasOwnProperty('errorHandle') && error.config.errorHandle === false) {
      return Promise.reject(error);
    }

    if (error.message === 'Network Error') {
      error.message = 'لطفا اتصال اینترنت خود را بررسی کنید';
      store.commit('set_errorMessage', error.message)
      return
    }

    if (error.response) {
      console.log('error.response', error.response.status, error.response)

      if (error.response.status == 404) {
        error.message = 'خطایی رخ داده است. کد خطا: 404'
        store.commit('set_errorMessage', error.message)
        return
      }
    }

    if (error.response.data.Errors) {
      let errMessage
      error.response.data.Errors.forEach(item => {

        switch (item.Message.MessageText) {
          case "AuthorizationHeaderNotFound": //6038 - 9000
          case "InvalidToken": //6039 -9001  
          case "TokenNotFound": //6040 - 9002
          case "ExpiredToken": //6041 - 9003 
            $axios.setToken(false)
            store.commit('authentication/logout')
            redirect('/auth')
            break

          case 'RoleAlreadyExists':
            let role = ''
            if (item.Message.RoleName) {
              let roleItem = errorCodes[`roleList.${item.Message.RoleName}`]
              if (roleItem)
                role = roleItem
              else
                role = item.Message.RoleName
            }
            errMessage = ` نقش ${role} قبلا برای این کاربر ثبت شده است `
            break

          case 'ModelValidationError':
            if (item.InnerEvents && item.InnerEvents.length > 0) {
              item.InnerEvents.forEach(innerEvent => {
                
                if (innerEvent.Message) {
                  let displayName = errorCodes[`fieldList`][`${innerEvent.Message.FieldName}`] || innerEvent.Message.FieldName
                  let displayText = errorCodes[`ModelValidationErrors`][`${innerEvent.Message.MessageText}`] || 'نامعتبر است'

                  errMessage = (errMessage || '') + ` ${displayName} ${displayText}`
                }
              })
            }
            break
        }

        if (!errMessage)
          errMessage = errorCodes[item.Message.MessageText]
      })
      if (errMessage)
        error.message = errMessage
      else
        error.message = 'خطایی رخ داده است'

      store.commit('set_errorMessage', error.message)
    }
  })

}
