export interface IPatientStatementsPapSmear {
    Id?: number
    FirstDayOfLastMenstruation?: Date
    NumberOfPregnancy?: number
    NumberOfDeliveries?: number
    NumberOfAbortions?: number
    Pregnant?: boolean
    PregnancyDateEstimate?: Date
    ContraceptionMethodList?: string[]
    PreventionMethodDescription?: string
    PatientComplaintList?: string[]
    ClinicalFindingList?: string[]
    HormonTheraphyDetail?: string
    Attachments?: []
}

export interface ITreatingPhysicianStatementsPapSmear {
    Id?: number
    SamplingReasonList?: string[]
    OtherExaminationFindings?: string
    ExaminationFindingList?: string[]
}
