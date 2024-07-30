namespace Api.Models.Entities {
    public class Experience {
        public Guid Id { get; set; }
        public required string JobTitle { get; set; } 
        public required string CompanyName { get; set; }
        public string? startMonth{ get; set; }
        public int? startYear{ get; set; }
        public string? endMonth{ get; set; }
        public int? endYear{ get; set; }

        public bool IsDeleted { get; set; } = false;
        public bool IsOngoing { get; set; } = false;
        
        public Guid? UserId { get; set; }
        //Navigation property
        public required User? User { get; set; }
    }
}
