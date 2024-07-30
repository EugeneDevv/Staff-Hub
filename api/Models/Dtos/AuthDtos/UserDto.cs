namespace Api.Models.Dtos.AuthDtos {
    public class UserDto {
        public Guid UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        //true or false
        public bool? SecurityQuestion { get; set; } = false;
        //user, admin, super
        public string Role { get; set; } = "user";
        //new, active, suspended, deleted
        public string AccountStatus { get; set; } = "new";
        //pending, complete
        public string ProfileStatus { get; set; } = "pending";
        public bool Suspended { get; set; } = false;
        public bool Deleted { get; set; } = false;
        public string? SuspensionReason { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;
        public DateTime DateUpdated { get; set; }
    }
}
