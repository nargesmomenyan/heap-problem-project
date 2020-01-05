import { IExpertise } from '~/models/IExpertise';

let expertiseSetTitle = (list: IExpertise[], $i18n) => {
    if (list)
        list.forEach(
            item => (item.Title = $i18n.t(`expertises.${item.Title}`).toString())
        )
}

export default expertiseSetTitle