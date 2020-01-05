import { ISamplePapSmear } from '~/models/reception/ISamplePapSmear';
import { IPatientStatementsPapSmear, ITreatingPhysicianStatementsPapSmear } from '~/models/reception/IStatementPapSmear';

export function mapResponseToSamplePapSmear(item, receptionId): ISamplePapSmear {
    let samplePapSmear: ISamplePapSmear = Object.assign(item, {
        TreatingPhysicianStatements: mapResponseToTreatingPhysicianStatementPapSmear(
            item.TreatingPhysicianStatements||{}
        ),
        PatientStatements: mapResponseToPatientStatementPapSmear(
            item.PatientStatements||{}
        )
    })
    samplePapSmear.ReceptionId = receptionId
    return samplePapSmear
}

export function mapResponseToPatientStatementPapSmear(response): IPatientStatementsPapSmear {
    let statement: IPatientStatementsPapSmear = {
        Id: response.Id,
        NumberOfPregnancy: response.NumberOfPregnancy,
        NumberOfDeliveries: response.NumberOfDeliveries,
        NumberOfAbortions: response.NumberOfAbortions,
        FirstDayOfLastMenstruation: response.FirstDayOfLastMenstruation,
        Pregnant: response.Pregnant,
    }

    if (response.ContraceptionMethods) {
        statement.ContraceptionMethodList = []
        for (let item in response.ContraceptionMethods) {
            if (response.ContraceptionMethods[item]) {
                if (statement.ContraceptionMethodList)
                    statement.ContraceptionMethodList.push(item)
            }
        }
    }

    if (response.PatientComplaints) {
        statement.PatientComplaintList = []
        for (let item in response.PatientComplaints) {
            if (response.PatientComplaints[item]) {
                if (statement.PatientComplaintList)
                    statement.PatientComplaintList.push(item)
            }
        }
    }

    if (response.ClinicalFindings) {
        statement.ClinicalFindingList = []
        for (let item in response.ClinicalFindings) {
            if (response.ClinicalFindings[item]) {
                if (statement.ClinicalFindingList)
                    statement.ClinicalFindingList.push(item)
            }
        }
    }

    return statement
}

export function mapResponseToTreatingPhysicianStatementPapSmear(response): ITreatingPhysicianStatementsPapSmear {
    
    let statement: ITreatingPhysicianStatementsPapSmear = {
        Id: response.Id,
        OtherExaminationFindings: response.OtherExaminationFindings
    }

    if (response.SamplingReason) {
        statement.SamplingReasonList = []

        for (let item in response.SamplingReason) {
            if (response.SamplingReason[item]) {
                if (statement.SamplingReasonList)
                    statement.SamplingReasonList.push(item)
            }
        }
    }

    if (response.ExaminationFindings) {
        statement.ExaminationFindingList = []
        for (let item in response.ExaminationFindings) {
            if (response.ExaminationFindings[item]) {
                if (statement.ExaminationFindingList)
                    statement.ExaminationFindingList.push(item)
            }
        }
    }

    return statement
}

export function mapResponseToTreatingPhysicianInfo(response) {
    return {
        Id: response.User.Id,
        RoleUserId: response.Id,
        FirstName: response.User.FirstName,
        LastName: response.User.LastName,
        Gender: response.User.Gender,
        PhoneNumber: response.User.PhoneNumber,
        MobileNumber: response.User.MobileNumber,
        Address: response.User.Address,
        Expertise: response.Expertise,
        MedicalSystemCode: response.MedicalSystemCode
    }
}

export function mapResponseToPatientInfo(response) {
    return {
        RoleUserId: response.Id,
        Id: response.User.Id,
        FirstName: response.User.FirstName,
        LastName: response.User.LastName,
        NationalCode: response.User.NationalCode,
        Gender: response.User.Gender,
        PhoneNumber: response.User.PhoneNumber,
        MobileNumber: response.User.MobileNumber,
        Address: response.User.Address,
        BirthDate: response.User.BirthDate
    }
}