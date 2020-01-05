import { INav } from '~/models/INav.ts'
import { userInfoFromToken } from './authentication'
import { isAuthorizedHelper } from './authorization'

export const state = () => ({
    navItems: null,
    extraMenu: null
})

export const getters = {
    NavigationItems(state) {
        return state.navItems;
    },
    ExtraMenu(state) {
        return state.extraMenu
    }
}

export const actions = {
    set_navItems(ctx, payload) {
        let currentUser = userInfoFromToken(ctx.rootState.authentication.token)
        ctx.commit('set_navItems', getNavItems(currentUser))
    },
    set_extraMenu(ctx, payload) {
        ctx.commit('set_extraMenu', payload)
    }
}

export const mutations = {
    set_navItems(state, items) {
        state.navItems = items
    },
    set_extraMenu(state, payload) {
        state.extraMenu = payload
    }
}

function getNavItems(currentUser) {
    const items = <INav[]>[]
    let access = false

    items.push(<INav>{
        icon: 'apps',
        title: 'صفحه اصلی',
        to: '/'
    })
    access = isAuthorizedHelper('organization/list')
    if (access) {
        // const subItems: INav[] = [
        //   {
        //     icon: 'call_split',
        //     title: 'افزودن سازمان',
        //     to: '/organizations/create',
        //     subItems: undefined
        //   }
        // ]

        items.push(<INav>{
            icon: 'call_split',
            title: 'سازمان‌ها',
            to: '/organizations'
        })
    }

    access = isAuthorizedHelper('IndividualUser/list')
    if (access) {
        items.push(<INav>{
            icon: 'perm_identity',
            title: 'کاربران حقیقی',
            to: '/individualUsers'
        })
    }
    access = isAuthorizedHelper('IndividualUser/ViewMe')
    if (access && currentUser && currentUser.UserTypeId === 1) {
        items.push(<INav>{
            icon: 'account_box',
            title: 'پروفایل',
            to: '/IndividualUsers/profile'
        })
    }

    access = isAuthorizedHelper('FirmUser/list')
    if (access) {
        items.push(<INav>{
            icon: 'supervisor_account',
            title: 'کاربران حقوقی',
            to: '/firmUsers'
        })
    }
    access = isAuthorizedHelper('FirmUser/ViewMe')
    if (access && currentUser && currentUser.UserTypeId !== 1) {
        items.push(<INav>{
            icon: 'account_box',
            title: 'پروفایل',
            to: '/firmUsers/profile'
        })
    }
    access = isAuthorizedHelper('Permission/List')
    if (access && currentUser) {
        items.push(<INav>{
            icon: 'settings_ethernet',
            title: 'مجوزهای سامانه',
            to: '/authorization/permissions'
        })
    }
    access = isAuthorizedHelper('Reception/List')
    if (access) {
        items.push(<INav>{
            icon: 'aspect_ratio',
            title: 'آزمایش‌ها',
            to: '/secretaries/samples'
        })
    }
    access = isAuthorizedHelper('Technician/ReceptionList')
    if (access) {
        items.push(<INav>{
            icon: 'aspect_ratio',
            title: 'پذیرش‌ها',
            to: '/technicians/receptions'
        })
    }
    access = isAuthorizedHelper('TechnicianSupervisor/ReceptionList')
    if (access) {
        items.push(<INav>{
            icon: 'aspect_ratio',
            title: 'پذیرش‌ها',
            to: '/technicians/receptions'
        })
    }

    access = isAuthorizedHelper('DiagnosticianDoctor/ReceptionList')
    if (access) {
        items.push(<INav>{
            icon: 'aspect_ratio',
            title: 'پذیرش‌ها',
            to: '/DiagnosticianDoctors/receptions'
        })
    }
    access = isAuthorizedHelper('DiagnosticianDoctorSupervisor/ReceptionList')
    if (access) {
        items.push(<INav>{
            icon: 'aspect_ratio',
            title: 'پذیرش‌ها',
            to: '/DiagnosticianDoctors/receptions'
        })
    }

    // access = isAuthorizedHelper('Reception/Create')
    // if (access) {
    //     items.push(<INav>{
    //         icon: 'aspect_ratio',
    //         title: 'ثبت پذیرش جدید',
    //         to: '/receptions/create'
    //     })
    // }
    return items;
}
