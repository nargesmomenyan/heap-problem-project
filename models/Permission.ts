export class Permission {
    constructor(
        public ActionName: string,
        public ControllerName: string,
        public SuperAdminGranted: boolean = false,
        public AdminGranted: boolean = false,
        public TechnicianGranted: boolean = false,
        public SecretaryGranted: boolean = false,
        public DiagnosticianDoctorGranted: boolean = false,
        public TreatingDoctorGranted: boolean = false,
        public PatientGranted: boolean = false, 
        public ShareholderGranted: boolean = false) { }
}