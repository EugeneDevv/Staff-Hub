using System.ComponentModel.DataAnnotations;

namespace Api.Models.Dtos {
    public class CertificationDTO {
        public Guid? Id { get; set; }

        [Required(ErrorMessage = "Certificate name cannot be empty")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "Issuer cannot be empty")]
        public required string Issuer { get; set; }
        public string? Code { get; set; }

        [Required(ErrorMessage = "Issue month cannot be empty")]
        public required string? IssueMonth { get; set; }
        public int? IssueYear { get; set; }
        public string? ExpiryMonth { get; set; }
        public int? ExpiryYear { get; set; }
        public string? CertificateLink { get; set; }

        public bool IsOngoing { get; set; } = false;
    }
}
