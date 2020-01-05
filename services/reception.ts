import baseService from './base/baseService'
import { mapResponseToSamplePapSmear, mapResponseToPatientInfo, mapResponseToTreatingPhysicianInfo } from './base/receptionUtil';
import {
  customizeResultItems,
  customizeParams,
  setListPagination_fromResult,
  mapFilterModelToApiParams
} from './base/util'
import { IReception, IRecptionDisplayList } from '~/models/reception/IReception'

import { NuxtAxiosInstance } from 'vrwebdesign-nuxt/modules/nuxt-axios/types'
import { IListOption } from '~/models/base/IListOption'
import { Iparams } from '~/models/base/Iparams'
import {
  ISample,
  ISampleFilter,
  ISampleSort,
  ISampleDisplayList
} from '~/models/reception/ISample'
import { ISamplePapSmear } from '~/models/reception/ISamplePapSmear'
import { ISlide } from '~/models/reception/ISlide'
import { IPatientStatementsPapSmear, ITreatingPhysicianStatementsPapSmear } from '~/models/reception/IStatementPapSmear'
import samplingReason from '~/enums/samplingReason'
import { IFile } from '~/models/base/IFile';
import AWS_S3_Util from './base/AWS_S3_Util';

export default class reception extends baseService<IReception> {
  path: string
  constructor($axios: NuxtAxiosInstance) {
    super($axios)
    this.path = 'receptions'
  }

  saveReception(reception: IReception): Promise<IReception> {
    return this.$axios
      .$post(
        'Receptions',
        Object.assign(reception, {
          PatientId: reception.Patient.RoleUserId,
          TreatingPhysicianId: reception.TreatingPhysician.RoleUserId,
          InsuranceInfo: {
            InsuranceNo: 'string',
            InsuranceType: 'string',
            Expiration: '2019-09-04T11:01:38.387Z',
            ExpireByPaperEnds: false
          }
        })
      )
      .then(response => {
        return this.mapResponseToReception(response)
      })
  }

  deleteRception(id: number) {
    return this.$axios.$delete(`receptions/${id}`)
  }

  saveSamplePapSmear(sample: ISamplePapSmear): Promise<ISamplePapSmear> {
    let request = this.mapSampleToRequest(sample)
    let pathSampleType = 'PapSmears'
    if (sample.Type != 2) {
      pathSampleType = 'PapSmears2'
    }
    if (sample.Id && sample.Id > 0) {
      return this.$axios
        .$patch(
          `receptions/${sample.ReceptionId}/${pathSampleType}/${sample.Id}`,
          request
        )
        .then(res => {
          return mapResponseToSamplePapSmear(res.Result, sample.ReceptionId)
        })
    } else {
      return this.$axios
        .$post(`receptions/${sample.ReceptionId}/${pathSampleType}`, request)
        .then(res => {
          return mapResponseToSamplePapSmear(res.Result, sample.ReceptionId)
        })
    }
  }

  mapSampleToRequest(sample: ISamplePapSmear): any {

    let request: any = {}
    if (!sample)
      return request

    request = Object.assign({}, sample)

    if (sample.TreatingPhysicianStatements) {
      request.TreatingPhysicianStatements = sample.TreatingPhysicianStatements

      if (sample.TreatingPhysicianStatements.SamplingReasonList) {
        let samplingReasonObject = {}
        sample.TreatingPhysicianStatements.SamplingReasonList.forEach(item => {
          samplingReasonObject[item] = true
        })
        request.TreatingPhysicianStatements.SamplingReason = samplingReasonObject
      }

      if (sample.TreatingPhysicianStatements.ExaminationFindingList) {
        let ExaminationFindingsObject = {}
        sample.TreatingPhysicianStatements.ExaminationFindingList.forEach(item => {
          ExaminationFindingsObject[item] = true
        })
        request.TreatingPhysicianStatements.ExaminationFindings = ExaminationFindingsObject
      }
    }
    else {
      sample.TreatingPhysicianStatements = {}
    }

    if (sample.PatientStatements) {
      request.PatientStatements = sample.PatientStatements

      if (sample.PatientStatements.ContraceptionMethodList) {
        let contraceptionMethodsObject = {}
        sample.PatientStatements.ContraceptionMethodList.forEach(item => {
          contraceptionMethodsObject[item] = true
        })
        request.PatientStatements.ContraceptionMethods = contraceptionMethodsObject
      }

      if (sample.PatientStatements.ClinicalFindingList) {

        let clinicalFindingsObject = {}
        sample.PatientStatements.ClinicalFindingList.forEach(item => {
          clinicalFindingsObject[item] = true
        })
        request.PatientStatements.ClinicalFindings = clinicalFindingsObject
      }

      if (sample.PatientStatements.PatientComplaintList) {
        let PatientComplaintsObject = {}
        sample.PatientStatements.PatientComplaintList.forEach(item => {
          PatientComplaintsObject[item] = true
        })
        request.PatientStatements.PatientComplaints = PatientComplaintsObject
      }
    } else {
      request.PatientStatements = {}
    }

    return request
  }

  confirmReception(reception: IReception, technicianSupervisorId: number = 13): Promise<IReception> {
    return this.$axios
      .$post(`receptions/${reception.Id}/Confirm`, {
        DeliveryDate: reception.DeliveryDate,
        TechnicianSupervisorId: technicianSupervisorId,
        comment: reception.Description
      })
      .then(res => {
        return this.mapResponseToReception(res)
      })
  }

  receptionList(params?: Iparams): Promise<IListOption<IReception>> {
    const customizedParams = customizeParams(params)
    const OrganizationId: number = +customizedParams[
      'filterModel.organizationId'
    ]
    let path: string
    if (OrganizationId && OrganizationId > 0)
      path = `organizations/${OrganizationId}/receptions`
    else path = 'organizations/Me/receptions'

    return customizeResultItems(
      this.$axios.$get(path, { params: customizedParams })
    )
  }

  async receptionSampleListForGrid(
    params: Iparams
  ): Promise<IListOption<ISample>> {
    let customizedParams = customizeParams(params)
    let receptionId: number = +customizedParams['filterModel.receptionId']

    let list: IListOption<ISample> = {
      total: 0,
      lastPage: 0,
      page: 0,
      perPage: 0,
      data: []
    }

    if (!isNaN(receptionId)) {
      // list.data = await this.receptionSampleList(receptionId)
      return this.$axios.$get(`receptions/${receptionId}/samples`).then(res => {
        list.data = <ISample[]>[]
        res.Result.forEach(item => {
          let sample = {
            Id: item.Id,
            ReceptionId: receptionId,
            ReceptionType: item.ReceptionType,
            SamplingDate: item.SamplingDate,
            DeliveryDate: item.DeliveryDate,
            SampleStatus: item.SampleStatus,
            ContainerExists: item.ContainerExists,
            Type: item.Type,
            Fixator: item.Fixator,
            SamplingDetail: item.SamplingDetail
          } as ISample
          list.data.push(sample)
        })
        if (list.data) {
          list.lastPage = list.page = 1
          list.total = list.data.length
          list.perPage = list.data.length
        }
        return list
      })
    } else {
      return Promise.resolve(list)
    }
  }

  async receptionSampleList(receptionId: number): Promise<ISample[]> {
    return this.$axios.$get(`receptions/${receptionId}/samples`).then(res => {
      let data = <ISample[]>[]
      res.Result.forEach(item => {
        data.push(this.mapResponseToSampleBaseInfo(item, receptionId))
      })
      return data
    })
  }

  SampleReport(
    filter?: ISampleFilter,
    sort?: ISampleSort
  ): Promise<IListOption<ISampleDisplayList>> {

    let params = mapFilterModelToApiParams(filter, sort)
    // let params ={ PageNumber: 1, PageSize: 10 }
    // if (filter) {
    //   params = Object.assign(params, { PageNumber: filter.PageNumber || 1 })
    //   params = Object.assign(params, { PageSize: filter.PageSize || 10 })
    //   for (let prop in filter) {
    //     params['filterModel.' + prop] = filter[prop]
    //   }
    // }
    // if (sort) {
    //   params = Object.assign(params, { sortModel: sort })
    // }
    return customizeResultItems(
      this.$axios.$get('/Organizations/Me/Samples', { params })
    )
  }

  mapResponseToSampleBaseInfo(item, receptionId: number): ISample {
    let sample: ISample = {
      Id: item.Id,
      ReceptionId: receptionId,
      ReceptionType: item.ReceptionType,
      SamplingDate: item.SamplingDate,
      SamplingMethod: item.SamplingMethod,
      DeliveryDate: item.DeliveryDate,
      SampleStatus: item.SampleStatus,
      ContainerExists: item.ContainerExists,
      Type: item.Type,
      Fixator: item.Fixator,
      SamplingDetail: item.SamplingDetail
    }
    return sample
  }

  deleteSample(sample: ISample) {
    return this.$axios.$delete(
      `receptions/${sample.ReceptionId}/sample/${sample.Id}`
    )
  }

  getReception(id): Promise<IReception> {
    return this.$axios.$get(`receptions/${id}`).then(res => {
      return this.mapResponseToReception(res)
    })
  }

  private mapResponseToReception(res) {
    let reception = {
      Id: res.Result.Id,
      ReceptionNumber: res.Result.ReceptionNumber,
      DeliveryDate: res.Result.DeliveryDate,
      OrganizationId: res.Result.Organization.Id,
      SecretaryId: res.Result.Secretary.Id,
      Status: res.Result.Status,
      SampleCount: res.Result.SampleCount,
      Patient: mapResponseToPatientInfo(res.Result.Patient),
      TreatingPhysician: mapResponseToTreatingPhysicianInfo(res.Result.TreatingPhysician)
    } as IReception
    return reception
  }

  slideList(receptionId: number, sampleId: number): Promise<ISlide[]> {
    return this.$axios
      .$get(`receptions/${receptionId}/samples/${sampleId}/slides`)
      .then(res => {
        let list: ISlide[] = []
        res.Result.forEach(item => {
          let slide = this.mapResponseToSlide(item)
          slide.ReceptionId = receptionId
          slide.SampleId = sampleId
          list.push(slide)
        })
        return list
      })
  }

  saveSlide(slide: ISlide): Promise<ISlide> {
    return this.$axios
      .$post(
        `receptions/${slide.ReceptionId}/samples/${slide.SampleId}/slides`,
        slide
      )
      .then(res => {
        let slide = this.mapResponseToSlide(res.Result)
        slide.ReceptionId = slide.ReceptionId
        slide.SampleId = slide.SampleId
        return slide
      })
  }

  mapResponseToSlide(item): ISlide {
    return {
      Id: item.Id,
      SlideNumber: item.SlideNumber,
      SlidingTechnique: item.SlidingTechnique,
      SlidingDetail: item.SlidingDetail,
      SlideStatus: item.SlideStatus
    } as ISlide
  }

  deleteSlide(slide: ISlide) {
    return this.$axios.$delete(
      `receptions/${slide.ReceptionId}/samples/${slide.SampleId}/slides/${slide.Id}`
    )
  }

  getRandomReceptionNumber(): Promise<string> {
    return this.$axios.$get('Receptions/RandomReceptionNumber')
      .then(response => { return response.Result })
  }

  async receptionSaveAttachment(fileInfo: IFile, entity: { receptionId: number }): Promise<string> {
    const fileCredential = await super.AWS_GetTempToken(
      this.$axios.$post(`receptions/${entity.receptionId}/Attachments`,
        {
          Extension: fileInfo.Extension,
          FileName: fileInfo.FileName,
          Type: 1
        })
    )
    if (fileCredential && fileCredential.Key) {
      let awsS3: AWS_S3_Util = new AWS_S3_Util(fileCredential)
      await awsS3.putObject(fileInfo, fileCredential)

      let result = await super.AWS_ConfirmFileKey(this.$axios.$patch(`receptions/${entity.receptionId}/Attachments/${fileCredential.Key}`))
      
      if (result) {
        return Promise.resolve(fileCredential.Key)
      }
    }

    return Promise.resolve('')
  }

  async receptionGetAttachment(fileKey: string, entity: { receptionId: number }): Promise<string> {
    let result = ''
    const fileCredential = await super.AWS_GetTempToken(
      this.$axios.$get(`receptions/${entity.receptionId}/Attachments/${fileKey}`)
    )

    if (fileCredential) {
      let awsS3: AWS_S3_Util = new AWS_S3_Util(fileCredential)
      result = await awsS3.getObject(fileCredential)
    }
    return Promise.resolve(result)
  }

  receptionGetAllAttachments(receptionId: number) {
    this.$axios.$get(`receptions/${receptionId}/attachments`)
  }

}

declare module 'vue/types/vue' {
  interface NuxtServiceInstance {
    reception: reception
  }
}
