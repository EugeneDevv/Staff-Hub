
using Api.Database;
using Api.Models.Dtos;
using Api.Models.Entities;

using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using SendGrid;

using Serilog;

using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Api.Services {
    public class SecurityQuestionService : ISecurityQuestion {

        private readonly AppDbContext _context;
        private readonly IUser _user;

        public SecurityQuestionService(AppDbContext context, IUser user) {
            _context = context;
            _user = user;
        }

        public async Task<MessageResponse> AnswerSecurityQuestion(SecurityAnswerDTO answerDTO, Guid userId, string email, int otp) {

            Dictionary<string, object> response = new Dictionary<string, object>();
            try {

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.Trim().ToLower());
                if (user == null) {
                    return new MessageResponse {
                        Message = "user with the given email does not exist",
                        Code = 404,
                        Status = false
                    };
                }
                if(user.Otp != otp) {
                    return new MessageResponse {
                        Message = "Invalid otp",
                        Code = 400,
                        Status = false
                    };

                }
                if (otp.Equals(null) || otp <= 0) {
                    return new MessageResponse {
                        Message = "OTP cannot be null or less than 0",
                        Code = 400,
                        Status = false
                    };
                }

                else {
                    var selectedQuestion = await _context.SecurityAnswers.FirstOrDefaultAsync(sa => sa.UserId == userId && sa.QuestionId == answerDTO.SecurityQuestionId);

                    if (selectedQuestion != null) {
                        var answer = await _context.SecurityAnswers.FirstOrDefaultAsync(sa => sa.Answer!.Equals(answerDTO.Answer.ToLower()));
                        if (answerDTO.Answer.IsNullOrEmpty()) {
                            return new MessageResponse {
                                Message = "Answer cannot be null or empty",
                                Code = 400,
                                Status = false
                            };
                        }
                        if (answer != null) {
                            return new MessageResponse {
                                Message = "Security question verified successfully",
                                Code = 200,
                                Status = true
                            };
                        }
                        else {
                            return new MessageResponse {
                                Message = "Wrong answer",
                                Code = 400,
                                Status = false
                            };

                        }
                    }

                    else {
                        return new MessageResponse {
                            Message = "Invalid security question",
                            Code = 400,
                            Status = false
                        };
                    }

                }

            }
            catch {
                return new MessageResponse {
                    Message = "Something went wrong while answering security question",
                    Code = 409,
                    Status = false
                };
            }


        }

        public async Task<List<SecurityQuestion>> GetSecurityQuestions() {
            try {
                List<SecurityQuestion> allQuestions = await _context.SecurityQuestions.ToListAsync();
                return allQuestions;
            }
            catch {

                return new List<SecurityQuestion>() { };

            }
        }

        public async Task<Dictionary<string, object>> SetSecuriyQuestion(List<SecurityAnswerDTO> answerDTO) {
            Dictionary<string, object> response = new Dictionary<string, object>();
            List<SecurityAnswer> securityQuestionAndAnswer = new List<SecurityAnswer>();
            User existingUser;

            try {
                if (answerDTO.Count != 3) {
                    response.Add("message", "You must select a maximum of 3 questions. " +answerDTO.Count +" question(s) answered");
                    response.Add("status", false);

                    return response;
                }
                foreach(var answer in answerDTO) {
                  var  user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == answer.UserId);

                    if(user != null) {
                        existingUser = user;
                    }

                    SecurityAnswer answerData = new SecurityAnswer();

                    var question = await _context.SecurityQuestions.FirstOrDefaultAsync(q => q.QuestionId == answer.SecurityQuestionId);
                    if(answer.Answer.Equals(null) || answer.Answer.Equals("")) {
                        response.Add("message", "Answer cannot be empty");
                        response.Add("status", false);

                        return response;
                    }
                    if (question != null) {

                        answerData.Answer = answer.Answer.ToLower();
                        answerData.QuestionId = question.QuestionId;
                        answerData.UserId = answer.UserId;
                        user!.SecurityQuestion = true;

                        securityQuestionAndAnswer.Add(answerData);

                    }
                    else {
                        response.Add("message", "Invalid security question");
                        response.Add("status", false);

                        return response;
                    }
                }
                await _context.AddRangeAsync(securityQuestionAndAnswer);
                await _context.SaveChangesAsync();

                response.Add("message", "Security question set successfully");
                response.Add("status", true);

                return response;

            }
            catch {

                response.Add("message", "Oops! Something went wrong with the server while setting securuty question");
                response.Add("status", false);

                return response;

            }
        }

        public async Task<bool> SecurityQuestionExists(SecurityAnswerDTO answer) {
            
            return await _context.SecurityAnswers.AnyAsync(sa => sa.QuestionId == answer.SecurityQuestionId && answer.UserId == sa.UserId);
            
        }

        public async Task<Dictionary<string, object>> UpdateSecurityQuestion(Guid userId, List<SecurityAnswerDTO> answerDTO) {
            Dictionary<string, object> response = new Dictionary<string, object>();
            

            using (var transaction = _context.Database.BeginTransaction()) {

                try {
                    if (answerDTO.Count != 3 ) {

                        response.Add("message", "Please select 3 questions");
                        response.Add("status", true);
                        return response;
                    }

                    List<SecurityAnswer> existingQuestionsAndAnswers =  _context.SecurityAnswers.Where(sa => sa.UserId == userId).ToList();
                   _context.SecurityAnswers.RemoveRange(existingQuestionsAndAnswers);
                   _context.SaveChanges();
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                    List<SecurityAnswer> securityQuestionAndAnswer = new List<SecurityAnswer>();

                    foreach (var answer in answerDTO) {
                        SecurityAnswer answerData = new SecurityAnswer();

                        var question = await _context.SecurityQuestions.FirstOrDefaultAsync(q => q.QuestionId == answer.SecurityQuestionId);
                        if (string.IsNullOrEmpty(answer.Answer)) {

                            response.Add("message", "Answer cannot be empty");
                            response.Add("status", false);

                            return response;
                        }
                        if (question != null) {

                            answerData.Answer = answer.Answer.ToLower();
                            answerData.QuestionId = question.QuestionId;
                            answerData.UserId = userId;

                            securityQuestionAndAnswer.Add(answerData);

                        }
                        else {
                            response.Add("message", "Invalid security question");
                            response.Add("status", false);
                            return response;
                        }
                    }
                   await  _context.AddRangeAsync(securityQuestionAndAnswer);
                   await _context.SaveChangesAsync();
                    transaction.Commit();
                    response.Add("message", "Security question updated successfully");
                    response.Add("status", true);
                    return response;

                }

                catch{
                    response.Add("message", "Oops! Something went wrong while updating security question");
                    response.Add("status", false);
                    return response;
                }
            }

        }

        public  Task<Dictionary<string, object>> GetUserQuestions(Guid userId) {
            Dictionary<string, object> response = new Dictionary<string, object>();
            try {
            
                var userQuestions = _context.SecurityQuestions
                    .GroupJoin(_context.SecurityAnswers.Where(a=>a.UserId==userId),
                    q => q.QuestionId,
                    a => a.QuestionId,
                    (q, answers) => new { Question = q, Answers = answers })
                    .SelectMany(x => x.Answers.DefaultIfEmpty(), (q, a) => new {

                        QuestionId = q.Question.QuestionId,
                        Question = q.Question.QuestionName,
                        Answer = a != null ? a.Answer : null,
                    });
                response.Add("message", "Data retrieved successfully.");
                response.Add("status", false);
                response.Add("data", userQuestions);
                return Task.FromResult(response);
            }
            catch {
                response.Add("message", "Oops! something went wrong");
                response.Add("status", false);
                return Task.FromResult(response);
            }
            

        }
    }
}
