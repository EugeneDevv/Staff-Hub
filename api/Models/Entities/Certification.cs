namespace Api.Models.Entities {
    public class Certification {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Issuer{ get; set; }
        public string? Code { get; set; }
        public string? IssueMonth { get; set; }
        public int? IssueYear { get; set; }
        public string? ExpiryMonth { get; set; }
        public int? ExpiryYear { get; set; }
        public string? CertificateLink { get; set; }

        public bool IsDeleted { get; set; } = false;
        public bool IsOngoing { get; set; } = false;
        public Guid? userId { get; set; }
        //Navigation property
        public required User? User { get; set; }
    }
}
