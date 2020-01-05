import baseService from './base/baseService';
import { NuxtAxiosInstance } from 'vrwebdesign-nuxt/modules/nuxt-axios/types';
import { IAnswerDisplayPropertyGroup, IAnswerDisplayProperty } from '~/modules/mobayyen-form-answer-generator/types/index'

export default class answerTemplate extends baseService<any>{
    path: string
    constructor($axios: NuxtAxiosInstance) {
        super($axios)
        this.path = ''
    }

    getAnswerTemplate(templateId: number = 1) {
        return this.$axios.$get(`AnswerTemplates/${templateId}/Elements`)
            .then(res => {
                let groupList = <IAnswerDisplayPropertyGroup[]>[]

                res.Result.forEach(node => {
                    if (node.ElementType == 2 /* Container  */ && node.Elements) {
                        let group = this.mapResponseToDisplayGroupElement(node)
                        group.title = node.Header
                        group.Id = node.Id
                        groupList.push(group)
                    }
                    else if (node.ElementType == 1 /* Property */) {
                        let dummyGroup = <IAnswerDisplayPropertyGroup>{ innerPropertyList: <IAnswerDisplayProperty[]>[] }
                        let property = this.mapResponseToDisplayPropertyElement(node)
                        dummyGroup.innerPropertyList.push(property)
                        groupList.push(dummyGroup)
                    }
                })
                console.log('groupList', groupList)
                return groupList
            })
    }

    mapResponseToDisplayGroupElement(groupNode: any) {
        let propertyGroup = <IAnswerDisplayPropertyGroup>{
            innerPropertyList: <IAnswerDisplayProperty[]>[], innerGroupList: <IAnswerDisplayPropertyGroup[]>[],
            title: groupNode.Header, Id: groupNode.Id
        }
        groupNode.Elements.forEach(node => {
            if (node.ElementType == 2 /* Container  */ && node.Elements) {
                let group = this.mapResponseToDisplayGroupElement(node)
                propertyGroup.innerGroupList.push(group)
            }
            else if (node.ElementType == 1 /* Property */) {
                let property = this.mapResponseToDisplayPropertyElement(node)
                propertyGroup.innerPropertyList.push(property)
            }
        })
        
        return propertyGroup
    }

    mapResponseToDisplayPropertyElement(resElement) {
        let property = <IAnswerDisplayProperty>{}

        if (resElement.DataType == 4 && resElement.Items) {
            //  list
            property.multiple = true
            if (resElement.ListType && resElement.ListType == 1) {
                property.chips = true
            }
            property.items = []
            property.type = "checkbox"
            resElement.Items.forEach(resListItem => {

                if (property && property.items) {
                    let innerProperty = this.mapResponseToDisplayPropertyElement(resListItem)
                    property.items.push(innerProperty)
                }
            })
        } else if (resElement.DataType == 5) {
            property.type = "checkbox"
        }
        else if (resElement.DataType == 3) {
            property.type = "datePicker"
        }
        else if (resElement.DataType == 1 /*text*/ || resElement.DataType == 2 /*number*/ || resElement.DataType == 6 /* field */) {
            // number
            property.type = "textField"
        }
        else {
            
            property.type = "textField"
        }

        property.label = resElement.DisplayLabel
        property.model = resElement.Id.toString()
        property.validation = resElement.Required ? 'required' : undefined
        return property
    }
}


declare module 'vue/types/vue' {
    interface NuxtServiceInstance {
        answerTemplate: answerTemplate
    }
}
