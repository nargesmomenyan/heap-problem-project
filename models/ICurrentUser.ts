export class ICurrentUser {
    constructor(
        public DisplayName: string = '',
        public UserId: number = 0,
        public RoleTitle: string = '',
        public RoleId: number = 0,
        public OrganizationTitle: string = '',
        public OrganizationId: number = 0,
        public RoleUserId: number = 0,
        public OrganizationRoleTitle: string = '',
        public LoginExpireDate: number = 0,
        public UserTypeId: number = 0) { }
}