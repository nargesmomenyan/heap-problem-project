type sampleTreatingPhysicianExaminationFindings =
    | 'NotStated'
    | 'Punctuation'
    | 'Leukoplakia'
    | 'Mosaism'
    | 'Ectropion'
    | 'ThinAcetowhite'
    | 'DenseAcetowhite'
    | 'FinePunctuation'
    | 'CoarsePunctuation'
    | 'FineMosaism'
    | 'CoarseMosaism'
    | 'AtypicalVessels'
    | 'FragileVessels'
    | 'IrregularSurface'
    | 'ExophyticLesion'
    | 'NecrosisUlceration_Necrotic'
    | 'Condyloma'
    | 'Polyp'
    | 'Cyst'
    | 'Others'

export interface ISampleTreatingPhysicianExaminationFindings {
    'NotStated': string
    'Punctuation': string
    'Leukoplakia': string
    'Mosaism': string
    'Ectropion': string
    'ThinAcetowhite': string
    'DenseAcetowhite': string
    'FinePunctuation': string
    'CoarsePunctuation': string
    'FineMosaism': string
    'CoarseMosaism': string
    'AtypicalVessels': string
    'FragileVessels': string
    'IrregularSurface': string
    'ExophyticLesion': string
    'NecrosisUlceration_Necrotic': string
    'Condyloma': string
    'Polyp': string
    'Cyst': string
    'Others': string

    toSelect: { text: string; value: string }
}

const sampleTreatingPhysicianExaminationFindings = {
    'NotStated': 'ذکر نشده است',
    'Punctuation': 'Punctuation',
    'Leukoplakia': 'Leukoplakia',
    'Mosaism': 'Mosaism',
    'Ectropion': 'Ectropion',
    'ThinAcetowhite': 'ThinAcetowhite',
    'DenseAcetowhite': 'DenseAcetowhite',
    'FinePunctuation': 'FinePunctuation',
    'CoarsePunctuation': 'CoarsePunctuation',
    'FineMosaism': 'FineMosaism',
    'CoarseMosaism': 'CoarseMosaism',
    'AtypicalVessels': 'AtypicalVessels',
    'FragileVessels': 'FragileVessels',
    'IrregularSurface': 'IrregularSurface',
    'ExophyticLesion': 'ExophyticLesion',
    'NecrosisUlceration_Necrotic': 'Necrosis Ulceration (necrotic)',
    'Condyloma': 'Condyloma',
    'Polyp': 'Polyp',
    'Cyst': 'Cyst',
    'Others': 'سایر'
}

export default sampleTreatingPhysicianExaminationFindings

declare module 'vue/types/vue' {
    interface NuxtEnumInstance {
        sampleTreatingPhysicianExaminationFindings: ISampleTreatingPhysicianExaminationFindings
    }
}