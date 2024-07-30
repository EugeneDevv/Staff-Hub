namespace Api.Models.Dtos {
    public class SecurityAnswerDTO {
        public  Guid UserId { get; set; }
        public required int SecurityQuestionId { get; set; }
        public required string Answer { get; set; }
    }
}
