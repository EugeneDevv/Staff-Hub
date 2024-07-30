using Api.Database;

using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.IdentityModel.Tokens;

using YourNamespace;

using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Api.Services {
    public class PasswordService: IPassword {
        private readonly AppDbContext _appDbContext;
        private readonly IEmailService _emailService;

        public PasswordService(AppDbContext appDbContext, IEmailService emailService ) {
            _appDbContext = appDbContext;
            _emailService = emailService;
        }
       public async Task<ServiceResponse<object>> InitiateResetPassword(string email) {

            var serviceResponse = new ServiceResponse<object>();

            try {
                email.ToLower().Trim();
                var user = await _appDbContext.Users.FirstOrDefaultAsync(u=>u.Email == email);
                if(user == null) {
                    serviceResponse.Message = "User doesn't exist";
                    serviceResponse.StatusCode = StatusCodes.Status409Conflict;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
                
                    Random rand = new Random();

                    int randomNumber = rand.Next(100000, 999999);
                    string randomNumberString = randomNumber.ToString();

                    serviceResponse.Message = "Sending Otp";
                serviceResponse.Data = user.UserId;
                    user.Otp = randomNumber;
                await _appDbContext.SaveChangesAsync();
                string htmlMessage = $"<div> <h1>Your OTP for resetting your password is: {randomNumber}</h1></div>";
                string subject = "RESET PASSWORD OTP";
                await _appDbContext.SaveChangesAsync();
                    await _emailService.SendEmailAsync(email, subject, htmlMessage);

     


                return  serviceResponse;
                


            }catch (Exception ex) {
            
                serviceResponse.Message = ex.Message;
                serviceResponse.Success = false;
                serviceResponse.StatusCode =  StatusCodes.Status500InternalServerError;
                return serviceResponse;
            
            }
        }

        public async Task<ServiceResponse<object>> VerifyOtp(int otp, string email) {
            var serviceResponse = new ServiceResponse<object>();
            var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
            if(user == null) {
                serviceResponse.Message = "User doesn't exist";
                serviceResponse.Success = false;
                serviceResponse.StatusCode = 409;
                return serviceResponse;
            }
            else {
                if(user.Otp != otp) {
                    serviceResponse.Message = "Invalid Otp";
                    serviceResponse.Success = false;
                    serviceResponse.StatusCode = 409;
                    return serviceResponse;
                }
                else {
                    serviceResponse.Message = "Otp Verfied";
                    return serviceResponse;
                }
            }
            
        }
        public async Task<ServiceResponse<object>> SetNewPassword(string email, string password) {
            var serviceResponse = new ServiceResponse<object>();
            if (
             !ContainsSpecialCharacter(password) ||
            !ContainsSmallCase(password) ||
            !ContainUpperCase(password) ||
            !ContainInt(password)
            ) {
                serviceResponse.Message = "Please ensure your password is at least 8 characters long and includes at least one uppercase letter, one lowercase letter, one number, and one special character.";
                serviceResponse.Success=false;
                serviceResponse.StatusCode = 409;
                return serviceResponse;
            }
          
            try {
                var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
                
                if (user == null) {
                    serviceResponse.Message = "User doesn't exist";
                    serviceResponse.Success = false;
                     serviceResponse.StatusCode = StatusCodes.Status409Conflict;
                    return serviceResponse;
                }
                else {
                    var otp = user.Otp;
                    var userStatus = user.AccountStatus;
                   
                    if (otp == 0) {
                        if(userStatus == "new") {
                            var hashedPassoword = BCrypt.Net.BCrypt.HashPassword(password);
                            user.Password = hashedPassoword;
                            user.AccountStatus = "active";
                            await _appDbContext.SaveChangesAsync();
                            serviceResponse.Message = "Password saved successfully";

                            return serviceResponse;
                        }
                        else {
                            serviceResponse.Message = "Opt not verified";
                            serviceResponse.Success = false;
                             serviceResponse.StatusCode = StatusCodes.Status409Conflict;
                            return serviceResponse;
                        }
                      
                    }
                    else {
                        var hashedPassoword = BCrypt.Net.BCrypt.HashPassword(password);
                        user.Password = hashedPassoword;
                        user.Otp = 0;
                        await _appDbContext.SaveChangesAsync();
                        serviceResponse.Message = "Password changed successfully";
                        serviceResponse.StatusCode = 200;
                        
                        return serviceResponse;
                    }
                   

                }

            }catch (Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.Success = false; 
                  serviceResponse.StatusCode =  StatusCodes.Status500InternalServerError;
                return serviceResponse;
            }
        }
        public async Task<ServiceResponse<object>> ResetPassword(Guid userId, string password, string currentPassword) {
            var serviceResponse = new ServiceResponse<object>();

            try { 
                if(password.IsNullOrEmpty()) {
                    serviceResponse.Message ="Password can't be empty" ;
                    serviceResponse.Success = false;
                    serviceResponse.StatusCode = 409;
                    return serviceResponse;
                }
                if(userId == Guid.Empty) {
                    serviceResponse.Message = "UserId cannot be empty";
                    serviceResponse.Success = false;
                    serviceResponse.StatusCode = 409;
                    return serviceResponse;
                }
                
                var user = await _appDbContext.Users.FirstOrDefaultAsync(u=> u.UserId == userId);
               
                if (user != null) {
                    var isPasswordCorrect = BCrypt.Net.BCrypt.Verify(currentPassword, user.Password);
                    if (!isPasswordCorrect) {
                        serviceResponse.Message = "You entered a wrong password";
                        serviceResponse.StatusCode = 409;
                        serviceResponse.Success = false;
                        return serviceResponse;
                    }
                    var hashedPassoword = BCrypt.Net.BCrypt.HashPassword(password);
                    user.Password = hashedPassoword;
                    await _appDbContext.SaveChangesAsync();
                    serviceResponse.Message = "Password reset successfully";
                    return serviceResponse;
                }
                else {
                    serviceResponse.Message = "User doesn't exist";
                    serviceResponse.Success = false;
                    serviceResponse.StatusCode = 404;
                    return serviceResponse;
                }
            }catch(Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.Success = false;
                serviceResponse.StatusCode = StatusCodes.Status500InternalServerError;
                return serviceResponse;
            }
        }
        public bool ContainsSpecialCharacter(string str) {
            string specialCharacters = "!@#$%^&*()-_=+";
            foreach (char c in str) {
                if (specialCharacters.Contains(c)) {
                    return true;
                }
            }
            return false;
        }
        public bool ContainsSmallCase(string str) {
            string specialCharacters = "abcdefghijklmnopqrstuvwxyz";
            foreach (char c in str) {
                if (specialCharacters.Contains(c)) { return true; }
            }
            return false;
        }
        public bool ContainUpperCase(string str) {
            string upperCaseChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            foreach (char c in str) {
                if (upperCaseChar.Contains(c)) {
                    return true;
                }
            }
            return false;
        }
        public bool ContainInt(string str) {
            var nums = "1234567890";
            foreach (char c in str) {
                if (nums.Contains(c)) {
                    return true;
                }

            }
            return false;
        }
        private string ValidatePassword(string password) {
            if (password.Length < 8)
                return "Password must be at least 8 characters long.";

            if (!password.Any(char.IsUpper))
                return "Password must contain at least one uppercase letter.";

            if (!password.Any(char.IsDigit))
                return "Password must contain at least one digit.";

            if (!password.Any(char.IsLower))
                return "Password must contain at least one lowercase letter.";

            if (!password.Any(c => !char.IsLetterOrDigit(c)))
                return "Password must contain at least one special character.";

            return ""; 
        }
    }

}
