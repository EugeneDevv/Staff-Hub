using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models.Entities {
    public class SecurityAnswer {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid AnswerId { get; set; }
        public string? Answer { get; set; }
        public Guid UserId { get; set; }
        public int QuestionId { get; set; }
        public DateTime? UpdatedAt { get; set; }


    }
}
