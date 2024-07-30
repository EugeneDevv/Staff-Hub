using System.Collections;

using Api.Models.Dtos;

namespace Api.Services.IServices {
    public interface ISecurityQuestion {

        Task<Dictionary<string, object>> SetSecuriyQuestion(List<SecurityAnswerDTO> answerDTO);
        Task<MessageResponse> AnswerSecurityQuestion(SecurityAnswerDTO answerDTO, Guid userId, string email, int otp);
        Task<List<SecurityQuestion>> GetSecurityQuestions();
        Task<bool> SecurityQuestionExists(SecurityAnswerDTO answer);
        Task<Dictionary<string, object>> UpdateSecurityQuestion(Guid userId, List<SecurityAnswerDTO> answerDTO);
        Task<Dictionary<string, object>> GetUserQuestions(Guid userId);

    }
}
