using Api.Database;
using Api.Models;
using Api.Models.Dtos.AuthDtos;
using Api.Models.Entities;
using Api.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Api.Services {
    public class AuthService : IAuth {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IJwt _JwtServices;

        public AuthService(AppDbContext context, IMapper mapper, IConfiguration configuration, IJwt jwtServices) {
            _dbContext = context;
            _mapper = mapper;
            _configuration = configuration;
            _JwtServices = jwtServices;
        }

        public async Task<List<User>> AllUsers() {
            return await _dbContext.Users.ToListAsync();
        }

        public async Task<ServiceResponse<UserDto>> GetUserData(LoginDto data) {
            var serviceResponse = new ServiceResponse<UserDto>();
            try {
                ////Convert to lowercase and remove leading/trailing spaces
                string email = data.Email.ToLower().Trim();

                // Check if email is valid
                if (!email.Any(c => !char.IsLetterOrDigit(c))) {
                    serviceResponse.Message = "Please enter a valid email address.";
                    serviceResponse.StatusCode = 400;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }

                //// Check if password meets requirements
                var validationMessage = ValidatePassword(data.Password);
                if (!string.IsNullOrEmpty(validationMessage)) {
                    serviceResponse.Message = validationMessage;
                    serviceResponse.Success = false;
                    serviceResponse.StatusCode = 400; 
                    return serviceResponse;
                }
                

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);

                if (user != null && user.Deleted == true) {
                    serviceResponse.Message = "Incorrect credentials";
                    serviceResponse.Success = false;
                    serviceResponse.StatusCode = 401;
                    return serviceResponse;
                }
                if (user != null && user.Suspended == true) {
                    serviceResponse.Message = $"Account supended, please contact your admin";
                    serviceResponse.Success = false;
                    serviceResponse.StatusCode = 403;
                    return serviceResponse;

                }

                if (user == null) {
                    serviceResponse.Message = "Incorrect credentials";
                    serviceResponse.Success = false;
                    serviceResponse.StatusCode = 401; 
                    return serviceResponse;
                }
                
                    bool isCorrectPassword = BCrypt.Net.BCrypt.Verify(data.Password, user.Password);
                    if (!isCorrectPassword) {
                        serviceResponse.Message = "Incorrect credentials";
                        serviceResponse.Success = false;
                        serviceResponse.StatusCode = 401;
                        return serviceResponse;
                    }
                    else {
                        var userData = _mapper.Map<UserDto>(user);
                        var token = _JwtServices.CreateToken(user);
                        serviceResponse.Data = userData;
                        serviceResponse.Message = token;
                        serviceResponse.Success = true;
                        serviceResponse.StatusCode = 200;
                        return serviceResponse;
                    }

                
            }
            catch (Exception ex) {
                serviceResponse.Message += ex.ToString();
                serviceResponse.StatusCode = 500;
                serviceResponse.Success = false;
                return serviceResponse;
            }
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

            return ""; // Empty string indicates password is valid
        }
    }
}
