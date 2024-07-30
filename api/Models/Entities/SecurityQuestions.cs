using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Api.Models.Entities {
    public class SecurityQuestion {
        [Key] 
        public int QuestionId { get; set; } 
        public string QuestionName { get; set; } = string.Empty;
    }
}
