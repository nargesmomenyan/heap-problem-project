import baseService from './base/baseService';
import { IProcessingReceptionFilter, IProcessingReception } from '~/models/reception/IProcessingReception';
import { NuxtAxiosInstance } from 'vrwebdesign-nuxt/modules/nuxt-axios/types';
import { mapFilterModelToApiParams, customizeResultItems } from './base/util';
import { IListOption } from '~/models/base/IListOption';
import { IAssignSample } from '~/models/reception/IAssignSample';

export default class diagnostication extends baseService<any>{

    path: string
    constructor($axios: NuxtAxiosInstance) {
        super($axios)
        this.path = 'diagnostication'
    }

    getReceptions(filter: IProcessingReceptionFilter): Promise<IListOption<IProcessingReception>> {

        let apiPath = ''
        switch (filter.category) {
            case 'Answer':
                apiPath = 'Diagnostication/Receptions/InProgress'
                break;
            case 'DiagnosticianDoctorAnswerAssignment':
                apiPath = 'Diagnostication/Receptions/SampleAssignings'
                break;

            case 'DiagnosticianDoctorPassAssignment':
                apiPath = `/Processing/Receptions/PassAssignments`
                break

            case 'Passing':
                apiPath = '/Processing/Receptions/Passings'
                break

            case 'Failed':
                apiPath = '/Processing/Receptions/Faileds'
                break
        }
        filter.category = undefined
        let params = mapFilterModelToApiParams(filter)

        return customizeResultItems(
            this.$axios.$get(`${apiPath}`, { params })
        )
    }

    diagnosticianDoctorGetReceptionsWorkItemsReport(isSupervisor: boolean) {
        let path = ''
        if (isSupervisor) {
            path = 'roles/DiagnosticianDoctorSupervisor/Me/WorkItems'
        }
        else {
            path = '/roles/DiagnosticianDoctor/Me/WorkItems'
        }
        return this.$axios.$get(path)
            .then(response => {
                return response.Result
            })
    }

    assignSampleToDiagnosticationDoctor(assing: IAssignSample) {
        return this.$axios.$post(`/Diagnostication/DiagnosticianDoctor/${assing.RoleUserId}/Samples/${assing.SampleId}`, { comment: assing.Comment })
    }

    requestAssingSampleToOtherDiagnosticationDoctor(sampleId: number, doctorId: number) {
        return this.$axios.$post(`/Diagnostication/DiagnosticianDoctor/${doctorId}/Sample/${sampleId}/AssignRequest`)
    }

}

declare module 'vue/types/vue' {
    interface NuxtServiceInstance {
        diagnostication: diagnostication
    }
}