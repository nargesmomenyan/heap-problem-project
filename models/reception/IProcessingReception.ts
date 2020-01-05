import { IFilterBase } from '../base/IFilterBase';

export interface IProcessingReception {
    Id?: number
    ReceptionNumber?: string
    SecretaryId?: number
    SecretaryFullName?: string
    PatientId?: number
    PatientFullName?: string
    TreatingPhysicianId?: number
    TreatingPhysicianFullName?: string
    ReceptionDate?: Date
    NearstDeliveryDate?: Date
    Comment?: string
    Seen?: boolean
    SampleCount?: number
    WorkItemCount?: number
}

export interface IProcessingReceptionFilter extends IFilterBase {
    searchPhrase?:string
    receptionNumber?: string
    patientFullName?: string
    secretaryId?: number
    receptionDateFrom?: Date|null
    receptionDateTo?: Date|null
    deliveryDateFrom?: Date|null
    deliveryDateTo?: Date|null
    category?: string
}

export interface IProcessingReceptionSort {
    receptionNumber?: number

}