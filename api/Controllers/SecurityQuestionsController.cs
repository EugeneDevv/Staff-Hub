using Api.Models.Dtos;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using SendGrid;

namespace Api.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class SecurityQuestionsController : ControllerBase {

        private readonly ISecurityQuestion _securityQuestion;
        private readonly IUser _user;

        public SecurityQuestionsController(ISecurityQuestion securityQuestion, IUser user) {
            _securityQuestion = securityQuestion;
            _user = user;
        }

        [HttpPost]

        public async Task<IActionResult> SetSecurityQuestion(List<SecurityAnswerDTO> answerDTO) {
            foreach (var answer in answerDTO) {
                if (await _securityQuestion.SecurityQuestionExists(answer)) {
                    return Conflict(new ResponseDto {
                        ErrorMessage = "Security question already exist",
                        IsSuccess = false
                    });
                }
                if (!await _user.UserExists(answer.UserId)) {
                    return NotFound(new ResponseDto {
                        ErrorMessage = "User does not exist",
                        IsSuccess = false
                    });

                }

            }

            return Ok(await _securityQuestion.SetSecuriyQuestion(answerDTO));
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> AnswerSecurityQuestion(SecurityAnswerDTO answerDTO, Guid userId, string email, int otp) {
            var response = await _securityQuestion.AnswerSecurityQuestion(answerDTO, userId, email, otp);

            if (!await _user.UserExists(userId)) {
                return NotFound(new ResponseDto {
                    ErrorMessage = "User does not exist",
                    IsSuccess = false
                });
            }

            return StatusCode(response.Code, response );
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSecurityQuestions() {

            List<SecurityQuestion> allQuestions = await _securityQuestion.GetSecurityQuestions();
            return Ok(allQuestions);
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> updateSecurityQuestion(List<SecurityAnswerDTO> answerDTO, Guid userId) {
            if (!await _user.UserExists(userId)) {
                return NotFound(new ResponseDto {
                    ErrorMessage = "User does not exist",
                    IsSuccess = false
                });
            }
            return Ok(await _securityQuestion.UpdateSecurityQuestion(userId, answerDTO));

        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserQuestions(Guid userId) {
            if(!await _user.UserExists(userId)) {
                                return NotFound(new ResponseDto {
                    ErrorMessage = "User does not exist",
                    IsSuccess = false
                });
            }
            return Ok(await _securityQuestion.GetUserQuestions(userId));

        }
    }
}
