import { IAuthorization } from "~/models/IAuthorization";

export default function ({ store, route, redirect, error }) {
    let result: boolean = true;

    let authorization: Array<IAuthorization> = [];
    route.meta.forEach(item => {
        if (item.authorization && typeof item.authorization !== undefined) {
            authorization = item.authorization;
            result = false;
        }
    });

    for (let i = 0; i < authorization.length; i++) {
        result = store.getters['authorization/isAuthorized'](authorization[i]);
        if (result == false)
            break;
    }

    if (!result)
        return redirect('/error/?code=authorization')
}