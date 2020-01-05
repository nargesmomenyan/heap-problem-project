import { ISample } from './ISample';
import { IPatientStatementsPapSmear, ITreatingPhysicianStatementsPapSmear } from './IStatementPapSmear';

export interface ISamplePapSmear extends ISample {
    PatientStatements: IPatientStatementsPapSmear,
    TreatingPhysicianStatements: ITreatingPhysicianStatementsPapSmear
}