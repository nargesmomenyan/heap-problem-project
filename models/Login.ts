export class ILoginServiceRequest {
    constructor(public Username: string,
        public Password: string,
        public LoginAsADifferentRole: boolean = false) {
    }
}
export interface ILoginServiceResponse {
    Token: string,
    SecondStepLoginIsNeeded: boolean,
}

export interface ILoginOrganization {
    OrganizationId: number,
    RoleId: number,
    RememberRole: boolean
}
