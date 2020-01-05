import baseService from './base/baseService';
import { NuxtAxiosInstance } from 'vrwebdesign-nuxt/modules/nuxt-axios/types';
import { IProcessingReception, IProcessingReceptionFilter } from '~/models/reception/IProcessingReception';
import { mapFilterModelToApiParams, customizeResultItems } from './base/util';
import { IListOption } from '~/models/base/IListOption';
import { ISample, ISampleDisplayList } from '~/models/reception/ISample';
import { ISlide } from '~/models/reception/ISlide';
import { IPassRequest } from '~/models/reception/IPassRequest';
import { IAssignSample } from '~/models/reception/IAssignSample';
import { response } from 'express';
import { IFile } from '~/models/base/IFile';
import { IFileCredential } from '~/models/base/IFileCredential';
import AWS_S3_Util from './base/AWS_S3_Util';
import { ISendToDiagnosticianDoctor } from '~/models/reception/ISendToDiagnosticianDoctor';
import { IBlock } from '~/models/reception/IBlock';
import { IPass } from '~/models/reception/IPass';

export default class processingReception extends baseService<any>{
    path: string
    constructor($axios: NuxtAxiosInstance) {
        super($axios)
        this.path = 'processing'
    }

    getProcessingReceptions(filter: IProcessingReceptionFilter): Promise<IListOption<IProcessingReception>> {
        let apiPath = ''
        switch (filter.category) {
            case 'InProgress':
                apiPath = 'InProgresses'
                break;
            case 'Processed':
                apiPath = 'Processeds'
                break;
            case 'Failed':
                apiPath = 'Faileds'
                break;
            case 'Pass':
                apiPath = 'Passes'
                break;
            case 'TehcnicianAssignment':
                apiPath = 'Assignings'
                break;
            case 'TechnicianReAssignment':
                apiPath = 'Reassignings'
                break;
        }
        filter.category = undefined
        let params = mapFilterModelToApiParams(filter)

        return customizeResultItems(
            this.$axios.$get(`Processing/Receptions/${apiPath}`, { params })
        )
    }

    assignSampleToTechnician(assing: IAssignSample) {
        return this.$axios.$post(`/Processing/Technician/${assing.RoleUserId}/Sample/${assing.SampleId}`, { comment: assing.Comment })
    }

    requestAssingSampleToOtherTechnician(sampleId: number, technicianId: number) {
        return this.$axios.$post(`/Processing/Technician/${technicianId}/Sample/${sampleId}/AssignRequest`)
    }

    getReceptionSamples(receptionId: number): Promise<ISampleDisplayList[]> {
        return this.$axios.$get(`Processing/Receptions/${receptionId}/Samples`).then(res => {
            let data = <ISampleDisplayList[]>[]
            res.Result.forEach(item => {
                data.push({ ReceptionId: receptionId, ...item })
            })
            return data
        })
    }

    saveSlide(slide: ISlide): Promise<ISlide> {
        return this.$axios
            .$post(
                `processing/samples/${slide.SampleId}/slides`,
                slide
            )
            .then(res => {
                return <ISlide>{
                    ReceptionId: slide.ReceptionId,
                    SampleId: slide.SampleId, ...res.Result
                }
            })
    }
    editSlide(slide: ISlide): Promise<ISlide> {
        return this.$axios
            .$patch(
                `processing/slides/${slide.Id}`,
                slide
            )
            .then(res => {
                return <ISlide>{ ...res.Result }
            })
    }

    startProccessingSlide(slide: ISlide): Promise<ISlide> {
        return this.$axios
            .$post(
                `processing/slides/${slide.Id}/startProcessing`,
                slide
            )
            .then(res => {
                return <ISlide>{ ...res.Result }
            })
    }

    finishProcessingSlide(slide: ISlide): Promise<ISlide> {
        return this.$axios
            .$post(
                `processing/slides/${slide.Id}/EndProcessing`,
                slide
            )
            .then(res => {
                return <ISlide>{ ...res.Result }
            })
    }

    startProccessingSampleAllSlides(sampleId: number) {
        return this.$axios
            .$post(
                `processing/samples/${sampleId}/slides/All/startProcessing`)
    }

    finishProccessingSampleAllSlides(sampleId: number) {
        return this.$axios
            .$post(
                `processing/samples/${sampleId}/slides/All/EndProcessing`)
    }

    startScanningSlide(slide: ISlide): Promise<ISlide> {
        return this.$axios
            .$post(
                `processing/slides/${slide.Id}/startScanning`,
                slide
            )
            .then(res => {
                return <ISlide>{ ...res.Result }
            })
    }

    confirmSlide(slide: ISlide): Promise<ISlide> {
        return this.$axios
            .$post(
                `processing/slides/${slide.Id}/confirm`,
                slide
            )
            .then(res => {
                return <ISlide>{ ...res.Result }
            })
    }

    finishScanningSlide(slide: ISlide): Promise<ISlide> {
        return this.$axios
            .$post(
                `processing/slides/${slide.Id}/EndScanning`,
                slide
            )
            .then(res => {
                return <ISlide>{ ...res.Result }
            })
    }
    startScanningSampleAllSlides(sampleId: number) {
        return this.$axios
            .$post(
                `processing/samples/${sampleId}/slides/All/startScanning`)
    }

    confirmSampleAllSlides(sampleId: number) {
        return this.$axios
            .$post(
                `processing/samples/${sampleId}/slides/All/confirm`)
    }

    finishScanningSampleAllSlides(sampleId: number) {
        return this.$axios
            .$post(
                `processing/samples/${sampleId}/slides/All/EndScanning`)
    }

    slideGetProgressPercentage(slideId: number): Promise<number> {
        return this.$axios
            .$get(
                `processing/slides/${slideId}/GetProgressPercentage`
            )
            .then(res => {
                return <number>res.Result
            })
    }

    failSlide(slide: ISlide): Promise<ISlide> {
        return this.$axios
            .$post(
                `processing/samples/${slide.SampleId}/slides/${slide.Id}/Fail`,
                slide
            )
            .then(res => {
                return <ISlide>{ ...res.Result }
            })
    }

    failSample(sampleId: number, comment: string) {
        return this.$axios
            .$post(
                `Processing/Samples/${sampleId}/Fail`, { Comment: comment }
            )
    }

    deleteSlide(slide: ISlide) {
        return this.$axios.$delete(
            `processing/slides/${slide.Id}`
        )
    }

    samplePassRequest(passRequest: IPassRequest) {
        return this.$axios.$post(`/Processing/Samples/${passRequest.SampleId}/Pass`, passRequest)
    }

    sampleAssignToDiagnosticianDoctorForPass(passRequest: IAssignSample) {
        return this.$axios.$post(`/Processing/Sample/${passRequest.SampleId}/DiagnosticianDoctor/${passRequest.RoleUserId}`, passRequest)
    }

    sampleCancelPassRequest(sampleId: number) {
        return this.$axios.$delete(`/Processing/samples/${sampleId}/Pass`)
    }

    samplePassSetReport(pass: IPass) {
        return this.$axios
            .$patch(
                `Processing/Sample/${pass.SampleId}/Pass/TextReport`, { Report: pass.Report }
            )
    }

    samplePassConfirm(sampleId: number, comment: string) {
        return this.$axios
            .$post(
                `Processing/Samples/${sampleId}/ConfirmPass`, { Comment: comment }
            )
    }

    technicianGetReceptionsWorkItemsReport(isTechnicianSupervisor: boolean) {
        let path = ''
        if (isTechnicianSupervisor) {
            path = 'roles/TechnicianSupervisor/Me/WorkItems'
        }
        else {
            path = '/roles/Technicians/Me/WorkItems'
        }
        return this.$axios.$get(path)
            .then(response => {
                return response.Result
            })
    }

    sampleSendToDiagnosticianDoctor(request: ISendToDiagnosticianDoctor) {
        return this.$axios.$post(`/Processing/Samples/${request.SampleId}/DiagnosticianDoctorSupervisor/${request.DiagnosticianDoctorSupervisorId}`, { Comment: request.Comment })
    }

    saveBlock(block: IBlock): Promise<IBlock> {
        return this.$axios
            .$post(
                `processing/sample/${block.SampleId}/blocks`,
                block
            )
            .then(res => {
                return <IBlock>{
                    SampleId: block.SampleId, ...res.Result
                }
            })
    }
    editBlock(block: IBlock): Promise<IBlock> {
        return this.$axios
            .$patch(
                `processing/blocks/${block.Id}`,
                block
            )
            .then(res => {
                return <IBlock>{ ...res.Result }
            })
    }
    deleteBlock(block: IBlock) {
        return this.$axios.$delete(
            `processing/blocks/${block.Id}`
        )
    }

    sampleGetBlocksWithSlides(sampleId: number): Promise<IBlock[]> {
        return this.$axios.$get(`Samples/${sampleId}/Blocks/Slides`)
            .then(response => {
                let list = <IBlock[]>[]
                response.Result.forEach(item => {
                    list.push({
                        Detail: item.Detail,
                        Id: item.Id,
                        SampleId: sampleId,
                        Slides: item.Slides ? item.Slides.map(slide => {
                            return {
                                Id: slide.Id,
                                SlideNumber: slide.SlideNumber,
                                SampleId: slide.SampleId,
                                SlidingTechnique: slide.SlidingTechnique,
                                SlidingDetail: slide.SlidingDetail,
                                SlideStatus: slide.SlideStatus
                            }
                        }) : []
                    })
                })
                return list
            })
    }
    sampleGetBlocks(sampleId: number): Promise<IBlock[]> {
        return this.$axios.$get(`Samples/${sampleId}/Blocks`)
            .then(response => {
                let list = <IBlock[]>[]
                response.Result.forEach(item => {
                    list.push({
                        Detail: item.Detail,
                        Id: item.Id,
                        SampleId: sampleId,
                        Slides: []
                    })
                })
                return list
            })
    }

    async saveFile(fileInfo: IFile, entity: { slideId: number }): Promise<string> {

        const fileCredential = await super.AWS_GetTempToken(
            this.$axios.$post(`processing/slide/${entity.slideId}/CompressedScanFile`, {
                'model.extension': fileInfo.Extension,
                'model.fileName': fileInfo.FileName
            })
        )

        if (fileCredential && fileCredential.Key) {
            let awsS3: AWS_S3_Util = new AWS_S3_Util(fileCredential)
            await awsS3.putObject(fileInfo, fileCredential)

            let result = await super.AWS_ConfirmFileKey(this.$axios.$patch(`Processing/slide/${entity.slideId}/CompressedScanFile`))
            if (result) {
                return Promise.resolve(fileCredential.Key)
            }
        }
        return Promise.resolve('')
    }

    async slideScanAreaGetFile(slideId: number = 1, layerNumber: number = 0) {

        const fileCredential = await super.AWS_GetTempToken(
            this.$axios.$get(`samples/slide/${slideId}/ScanLayer/${layerNumber}`)
        )

        let awsS3: AWS_S3_Util = new AWS_S3_Util(fileCredential)
        return awsS3.getObject(fileCredential)
    }

    async passSaveAudioReport(fileInfo: IFile, sampleId: number) {
        debugger
        const fileCredential = await super.AWS_GetTempToken(
            this.$axios.$post(`processing/sample/${sampleId}/Pass/AudioReport`, {
                extension: fileInfo.Extension,
                fileName: fileInfo.FileName
            }));
        if (fileCredential && fileCredential.Key) {
            let awsS3: AWS_S3_Util = new AWS_S3_Util(fileCredential)
            await awsS3.putObject(fileInfo, fileCredential)

            let result = await super.AWS_ConfirmFileKey(this.$axios.$patch(`Processing/sample/${sampleId}/Pass/AudioReport`))
            if (result) {
                return Promise.resolve(fileCredential.Key)
            }
        }
        return Promise.resolve('')
    }

    async passGetAudioReport(sampleId: number) {
        const fileCredential = await super.AWS_GetTempToken(
            this.$axios.$get(`processing/sample/${sampleId}/Pass/AudioReport`));
        if (fileCredential) {
            let awsS3: AWS_S3_Util = new AWS_S3_Util(fileCredential)
            return awsS3.getObject(fileCredential)
        }
    }

}


declare module 'vue/types/vue' {
    interface NuxtServiceInstance {
        processingReception: processingReception
    }
}