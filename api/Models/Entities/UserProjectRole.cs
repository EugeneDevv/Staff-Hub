using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Api.Models.Entities {
    public class UserProjectRole {

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public Projects? Projects { get; set; }
        public int ProjectRoleId { get; set; }
        public ProjectRole ProjectRole { get; set; }
        public string? StartMonth { get; set; }
        public int? StartYear { get; set; }
        public string? EndMonth { get; set; }
        public int? EndYear { get; set; }
        public bool IsContinuing { get; set; }
        public Guid? UserId { get; set; }
        //Navigation property
        public User? User { get; set; }
    }
}
