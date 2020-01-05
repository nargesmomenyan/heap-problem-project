export const state = () => ({
    permissions: null,
})

export const mutations = {
    set_permissions(state, payload) {
        state.permissions = payload
        localStorage.setItem('permissions', JSON.stringify(state.permissions))
    }
}

export const actions = {
    setPermissions({ dispatch, commit }, payload) {
        commit('set_permissions', payload)
        dispatch('navigation/set_navItems', {}, { root: true })
    },
}

export const getters = {
    isAuthorized: state => permissionKey => {
        return isAuthorizedHelper(permissionKey)
    },
}

export function isAuthorizedHelper(permissionKey) {
    let foundAction = false
    let mapObject = MapApiPermissionsToFrontPermissions.find(x => x.front.toUpperCase() == permissionKey.toUpperCase())
    if (mapObject) {
        let apiPermissionKey = mapObject.api;
        let apiPermissionsRaw = localStorage.getItem('permissions')
        if (apiPermissionsRaw) {
            let apiPermissions = JSON.parse(apiPermissionsRaw.toString())
            let apiPermissionObject = apiPermissions.find(x =>
                apiPermissionKey.toUpperCase() === `${x.AreaName}/${x.ControllerName}/${x.ActionName}`.toUpperCase())
            if (apiPermissionObject)
                foundAction = true
        }
    }

    return foundAction;
}

const MapApiPermissionsToFrontPermissions = [

    { api: 'api/IndividualUser/View', front: 'IndividualUser/List' },
    { api: 'api/IndividualUser/ViewMe', front: 'IndividualUser/ViewMe' },
    { api: 'api/IndividualUser/Create', front: 'IndividualUser/Create' },
    { api: 'api/IndividualUser/Edit', front: 'IndividualUser/Edit' },
    { api: 'api/IndividualUser/Delete', front: 'IndividualUser/Delete' },

    { api: "api/organization/view", front: "organization/list" },
    { api: 'api/organization/ViewMembers', front: 'Organization/ListUsers' },
    { api: 'api/organization/ViewShareholders', front: 'Organization/ViewShareholders' },
    { api: 'api/organization/ViewCompactMembers', front: 'Organization/ListUsers' },
    { api: 'api/organization/create', front: 'Organization/Create' },
    { api: 'api/organization/edit', front: 'Organization/Edit' },
    { api: 'api/organization/delete', front: 'Organization/Delete' },
    { api: 'api/organization/ViewCandidateMembers', front: 'Organization/ViewCandidateMembers' },
    { api: 'api/organization/AddMember', front: 'Organization/AddMember' },
    { api: 'api/organization/RemoveMember', front: 'Organization/RemoveMember' },
    { api: 'api/organization/RemoveUser', front: 'Organization/RemoveUser' },
    { api: 'api/organization/AddShareholderMember', front: 'Organization/AddShareholderMember' },
    { api: 'api/organization/EditShareholderMember', front: 'Organization/EditShareholderMember' },

    { api: 'api/FirmUser/View', front: 'FirmUser/List' },
    { api: 'api/FirmUser/ViewMe', front: 'FirmUser/ViewMe' },
    { api: 'api/FirmUser/Create', front: 'FirmUser/Create' },
    { api: 'api/FirmUser/Edit', front: 'FirmUser/Edit' },
    { api: 'api/FirmUser/Delete', front: 'FirmUser/Delete' },

    { api: 'api/Role/ViewRoles', front: 'Role/' },
    { api: 'api/Role/ViewRoleDetail', front: 'Role/' },
    { api: 'api/Role/ViewDoctorExpertises', front: 'Role/' },
    { api: 'api/Role/CreateSuperAdmin', front: 'Role/' },
    { api: 'api/Role/EditSuperAdmin', front: 'Role/' },
    { api: 'api/Role/CreateAdmin', front: 'Role/' },
    { api: 'api/Role/EditAdmin', front: 'Role/' },
    { api: 'api/Role/CreatePatient', front: 'Role/' },
    { api: 'api/Role/EditPatient', front: 'Role/' },
    { api: 'api/Role/CreateSecretary', front: 'Role/' },
    { api: 'api/Role/EditSecretary', front: 'Role/' },
    { api: 'api/Role/CreateTechnecian', front: 'Role/' },
    { api: 'api/Role/EditTechnecian', front: 'Role/' },
    { api: 'api/Role/CreateDiagnosticianDoctor', front: 'Role/' },
    { api: 'api/Role/EditDiagnosticianDoctor', front: 'Role/' },
    { api: 'api/Role/CreateTreatingPhysician', front: 'Role/' },
    { api: 'api/Role/EditTreatingPhysician', front: 'Role/' },
    { api: 'api/Role/CreateShareholder', front: 'Role/' },
    { api: 'api/Role/EditShareholder', front: 'Role/' },
    { api: 'api/Role/DeleteRoleUser', front: 'Role/' },

    { api: 'api/Action/ViewMyActions', front: 'Action/' },
    { api: 'api/Action/ViewAllActions', front: 'Permission/List' },
    { api: 'api/Action/ViewRoleActions', front: 'Action/' },

    { api: 'api/Reception/View', front: 'Reception/View' },
    { api: 'api/Organization/ViewMyOrganizationReceptions', front: 'Reception/List' },
    { api: 'api/Reception/Create', front: 'Reception/Create' },
    { api: 'api/Reception/Edit', front: 'Reception/Edit' },
    { api: 'api/Reception/Delete', front: 'Reception/Delete' },

    { api: 'api/Reception/AddExistingSample', front: 'Reception/' },
    { api: 'api/Reception/RemoveExistingSample', front: 'Reception/' },
    { api: 'api/Reception/ListAllSamples', front: 'Reception/' },
    { api: 'api/Reception/ListSamples', front: 'Reception/' },
    { api: 'api/Reception/ViewSample', front: 'Reception/' },
    { api: 'api/Reception/CreateSample', front: 'Reception/' },
    { api: 'api/Reception/DeleteSample', front: 'Reception/' },
    { api: 'api/Reception/AssignRequesterDoctor', front: 'Reception/' },
    { api: 'api/Reception/DeassignRequesterDoctor', front: 'Reception/' },
    { api: 'api/Reception/DeleteSampleReception', front: 'Reception/' },
    { api: 'api/Reception/ListSlides', front: 'Reception/' },
    { api: 'api/Reception/ViewSlide', front: 'Reception/' },
    { api: 'api/Reception/CreateSlide', front: 'Reception/' },
    { api: 'api/Reception/EditSlide', front: 'Reception/' },
    { api: 'api/Reception/DeleteSlide', front: 'Reception/' },
    
    
    { api: 'api/Role/TechnicianReceptionWorkItemsReport', front: 'Technician/ReceptionList' },
    { api: 'api/Role/TechnicianSupervisorReceptionsWorkItemsReport', front: 'TechnicianSupervisor/ReceptionList' },

    { api: 'api/Role/DiagnosticianDoctorReceptionsWorkItemsReport', front: 'DiagnosticianDoctor/ReceptionList' },
    { api: 'api/Role/DiagnosticianDoctorSupervisorReceptionsWorkItemsReport', front: 'DiagnosticianDoctorSupervisor/ReceptionList' },
    
    
    { api: 'api/Processing/ViewTechnicianReceptionDetail', front: 'Technician/Reception' },
    
    { api: 'api/Processing/SampleAssignRequest', front: 'Technician/SampleAssignRequest' },
    { api: 'api/Processing/FailSample', front: 'Technician/FailSample' },
    { api: 'api/Processing/AddSlide', front: 'Technician/AddSlide' },
    { api: 'api/Processing/RemoveSlide', front: 'Technician/RemoveSlide' },
    
    { api: 'api/Processing/DeletePassRequest', front: 'Technician/DeletePassRequest' },
    { api: 'api/Processing/RemoveBlockFromPass', front: 'SampleProcessing/RemoveBlockFromPass' },
    

    { api: 'api/Answer/CreateAnswerRequest', front: 'Answer/' },
    { api: 'api/Answer/EditAnswerRequest', front: 'Answer/' },
    { api: 'api/Answer/DeleteAnswerRequest', front: 'Answer/' },
    { api: 'api/Answer/CreateAnswer', front: 'Answer/' },
    { api: 'api/Answer/EditAnswer', front: 'Answer/' },
    { api: 'api/Answer/DeleteAnswer', front: 'Answer/' },
    { api: 'api/Answer/CreateReportTemplate', front: 'Answer/' },
    { api: 'api/Answer/EditReportTemplate', front: 'Answer/' },
    { api: 'api/Answer/DeleteReportTemplate', front: 'Answer/' },
    { api: 'api/Answer/GenerateAnAnswerReport', front: 'Answer/' },
    { api: 'api/Answer/DeleteAnswerReport', front: 'Answer/' },

    { api: 'api/File/ListTypes', front: 'File/' },
    { api: 'api/File/ViewInfo', front: 'File/' },
    { api: 'api/File/Download', front: 'File/' },
    { api: 'api/File/Upload', front: 'File/' },
    { api: 'api/File/Upload', front: 'File/' },

    { api: 'api/User/RefreshToken', front: 'User/' },

    { api: 'api/User/ResetMyPassword', front: 'User/ResetMyPassword' },
    { api: 'api/User/ResetPassword', front: 'User/ResetPassword' },
    { api: 'api/User/View', front: 'User/' },
    { api: 'api/User/Edit', front: 'User/' },
    { api: 'api/User/Enable', front: 'User/' },
    { api: 'api/User/Disable', front: 'User/' },
    { api: 'api/User/ViewDisabledUsers', front: 'User/' },
    { api: 'api/User/Delete', front: 'User/' },
    { api: 'api/User/ViewSettings', front: 'User/' },
    { api: 'api/User/EditSettings', front: 'User/' },
    { api: 'api/User/ViewMyRoles', front: 'User/' },
    { api: 'api/User/ViewRoles', front: 'User/' },
    { api: 'api/User/ViewMemberships', front: 'User/' },
    { api: 'api/User/ViewMyMemberships', front: 'User/' },
]

const MapUrlToApiPermissions = [
    { url: 'index', apiPermissions: ['api/IndividualUser/View'] },
]
