import { ISlide } from './ISlide';
import { IFilterBase } from '../base/IFilterBase';

export interface ISample {
    Id?: number
    ReceptionId?: number
    Type?: number
    SamplingMethod?: number
    SamplingDevice?: number
    SamplingDate?: Date
    ProcessingMethod?: number
    SamplingArea?: number
    SamplingAreaDetail?: string
    ContainerExists?: boolean
    Fixator?: number
    DeliveryDate?: Date
    ReceptionType?: number
    SamplingDetail?: string
    SampleStatus?: number
    PassRequired?:boolean
}
export interface ISampleDisplayList {
    Id?: number
    ReceptionId?: number
    ReceptionNumber?: string
    ReceptionType?: number
    ReceptionDate?: Date
    DeliveryDate?: Date
    PatientFullName?: string
    Type?: number
    PatientNationalCode?: string
    SampleStatus: number
    SlideCount?: number
    PassRequired?: boolean
    PassCount?: number
    AssigneeRoleId?: number
    AssigneeId?: number
    AssigneeFullName?: string
    Comment?: string
}

export interface ISampleFilter extends IFilterBase {
    receptionType?: number | null
    searchPhrase?: string
    receptionDateFrom?: Date | null
    receptionDateTo?: Date | null
    sampleDeliveryDateFrom?: Date | null
    sampleDeliveryDateTo?: Date | null
}

export interface ISampleSort {
    type?: number
    receptionType?: number
    receptionNumber?: string
    receptionDate?: Date
    deliveryDate?: Date
    patientFullName?: string
    patientNationalCode?: string
}