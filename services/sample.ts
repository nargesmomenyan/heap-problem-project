import baseService from './base/baseService';
import { NuxtAxiosInstance } from 'vrwebdesign-nuxt/modules/nuxt-axios/types';
import { IProcessingReception, IProcessingReceptionFilter } from '~/models/reception/IProcessingReception';
import { mapResponseToSamplePapSmear } from './base/receptionUtil';
import { IListOption } from '~/models/base/IListOption';
import { ISample } from '~/models/reception/ISample';
import { ISlide } from '~/models/reception/ISlide';
import { IPassRequest } from '~/models/reception/IPassRequest';
import { ISamplePapSmear } from '~/models/reception/ISamplePapSmear';
import { IPass } from '~/models/reception/IPass';
import { IFileCredential } from '~/models/base/IFileCredential';

export default class sample extends baseService<any>{
    path: string
    constructor($axios: NuxtAxiosInstance) {
        super($axios)
        this.path = 'samples'
    }

    getSample(sampleId: number): Promise<ISample> {
        return this.$axios.$get(`samples/${sampleId}`)
            .then(res => {
                return <ISample>(res.Result)
            })
    }

    getSamplePapSmear(
        receptionId: number,
        sampleId: number
    ): Promise<ISamplePapSmear> {
        return this.$axios
            .$get(`/Samples/PapSmears/${sampleId}`)
            .then(res => {
                let sample = mapResponseToSamplePapSmear(res.Result, receptionId)
                return sample
            })
    }

    getSampleKidney(
        receptionId: number,
        sampleId: number
    ): Promise<ISamplePapSmear> {

        return this.$axios
            .$get(`/Samples/PapSmears2/${sampleId}`)
            .then(res => {
                let sample = mapResponseToSamplePapSmear(res.Result, receptionId)
                return sample
            })
    }

    slideList(receptionId: number, sampleId: number): Promise<ISlide[]> {
        return this.$axios
            .$get(`/samples/${sampleId}/slides`)
            .then(res => {
                let list: ISlide[] = []
                res.Result.forEach(item => {
                    list.push(<ISlide>{
                        ReceptionId: receptionId,
                        SampleId: sampleId,
                        ...item
                    })
                })
                return list
            })
    }

    slideGet(slideId: number): Promise<ISlide> {
        return this.$axios
            .$get(
                `samples/slides/${slideId}`)
            .then(res => {
                return <ISlide>{ ...res.Result }
            })
    }

    sampleGetPasses(sampleId: number): Promise<IPass[]> {
        return this.$axios.$get(`/samples/${sampleId}/passes`)
            .then(response => {
                let list: IPass[] = []
                response.Result.forEach(item => {
                    list.push({ ...item })
                })
                return list
            })

    }

    slideScannedLayerGetToken(slideId: number = 1, layerNumber: number = 0): Promise<IFileCredential> {
        return super.AWS_GetTempToken(
            this.$axios.$get(`samples/slide/${slideId}/ScanLayer/${layerNumber}`)
        )
    }
}

declare module 'vue/types/vue' {
    interface NuxtServiceInstance {
        sample: sample
    }
}