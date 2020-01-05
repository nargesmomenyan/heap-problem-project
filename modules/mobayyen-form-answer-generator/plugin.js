import Vue from 'vue'
// import FormAnswerGenerator from '~/modules/mobayyen-form-answer-generator/components/form-answer-generator.vue'
import AnswerFormGenerator from '~/modules/mobayyen-form-answer-generator/components/answer-form-generator.vue'
import autocomplete from '~/modules/mobayyen-form-answer-generator/components/form-controlls/autocomplete.vue'
import comboBox from '~/modules/mobayyen-form-answer-generator/components/form-controlls/comboBox.vue'
import checkbox from '~/modules/mobayyen-form-answer-generator/components/form-controlls/checkbox.vue'
import datePicker from '~/modules/mobayyen-form-answer-generator/components/form-controlls/datePicker.vue'
import timePicker from '~/modules/mobayyen-form-answer-generator/components/form-controlls/timePicker.vue'
import fileUpload from '~/modules/mobayyen-form-answer-generator/components/form-controlls/fileUpload.vue'
import radio from '~/modules/mobayyen-form-answer-generator/components/form-controlls/radio.vue'
import select from '~/modules/mobayyen-form-answer-generator/components/form-controlls/select.vue'
import textArea from '~/modules/mobayyen-form-answer-generator/components/form-controlls/textArea.vue'
import textField from '~/modules/mobayyen-form-answer-generator/components/form-controlls/textField.vue'

Vue.component('answer-control-autocomplete', autocomplete)
Vue.component('answer-control-comboBox', comboBox)
Vue.component('answer-control-checkbox', checkbox)
Vue.component('answer-control-datePicker', datePicker)
Vue.component('answer-control-timePicker', timePicker)
Vue.component('answer-control-fileUpload', fileUpload)
Vue.component('answer-control-radio', radio)
Vue.component('answer-control-select', select)
Vue.component('answer-control-textArea', textArea)
Vue.component('answer-control-textField', textField)

// Vue.component('answer-control-form-answer-generator', FormAnswerGenerator)
Vue.component('answer-form-generator', AnswerFormGenerator)
