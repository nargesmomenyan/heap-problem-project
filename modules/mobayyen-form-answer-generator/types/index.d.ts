export interface IAnswerDisplayProperty {
  type?:
  | 'autocomplete'
  | 'comboBox'
  | 'checkbox'
  | 'currency'
  | 'datePicker'
  | 'timePicker'
  | 'fileUpload'
  | 'radio'
  | 'select'
  | 'textArea'
  | 'textField'
  model: string
  validation?: string | any
  ref?: string
  disabled?: boolean
  readonly?: boolean
  component?: any
  label?: string
  appendIcon?: string
  prependIcon?: string
  items?: IAnswerDisplayProperty[]
  suffix?: string
  placeholder?: string
  multiple?: boolean
  chips?: boolean
  async?: boolean

  returnObject?: boolean
  inputType?: string
  browserAutocomplete?: string
  hint?: string
  hide?: boolean
  onChange?: Function
  image_src?: string
  select_text?: string
  select_value?: string | number
  [key: string]: any
  elements: IAnswerDisplayProperty[]
}

export interface IAnswerDisplayPropertyGroup {
  title?: string
  Id?: string
  hide?: boolean
  innerPropertyList: IAnswerDisplayProperty[]
  innerGroupList: IAnswerDisplayPropertyGroup[]
}

