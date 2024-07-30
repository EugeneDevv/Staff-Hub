using System.Text;
using System.Text.RegularExpressions;

using api.Mappers;
using api.Models.Dtos.User;
using api.Models.Entities;

using Api.Database;
using Api.Models.Dtos;
using Api.Models.Dtos.AuthDtos;

using AutoMapper;

using Serilog;

using YourNamespace;

namespace Api.Services {
    public class UserService : IUser {
        private readonly AppDbContext _dbcontext;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public UserService(AppDbContext context, IMapper mapper, IEmailService emailService) {
            _dbcontext = context;
            _mapper = mapper;
            _emailService = emailService;
        }

        public async Task<ServiceResponse<object>> AddUser(RegisterDto data) {

            var serviceResponse = new ServiceResponse<object>();

            try {

                data.Email = data.Email.ToLower().Trim();
                data.PhoneNumber = data.PhoneNumber.Trim();



                if (data.Email.Length < 0) {
                    serviceResponse.Message = "Email is required";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
                if (!IsEmailValid(data.Email)) {
                    serviceResponse.Message = "Invalid email";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }

                if (!data.Email.EndsWith("@griffinglobaltech.com")) {
                    serviceResponse.Message = "Please enter a valid GRIFFIN email";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
                if (data.Role != "User" && data.Role != "SuperAdmin" && data.Role != "Admin") {
                    serviceResponse.Message = "Invalid Role";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }

                if (!string.IsNullOrEmpty(data.PhoneNumber) && data.PhoneNumber.ToLower() != "string") {
                    if (!IsValidPhoneNumber(data.PhoneNumber)) {
                        serviceResponse.Message = "Invalid Phone number format";
                        serviceResponse.StatusCode = 409;
                        serviceResponse.Success = false;
                        return serviceResponse;
                    }


                    var phoneNumberExist = await _dbcontext.Users.FirstOrDefaultAsync(u => u.PhoneNumber == data.PhoneNumber);

                    if (phoneNumberExist != null) {
                        serviceResponse.Message = "Phone number already in use.";
                        serviceResponse.StatusCode = 409;
                        serviceResponse.Success = false;
                        return serviceResponse;
                    }

                }

                if (data.ProjectRoleId > 0 && data.ProjectId <= 0) {
                    serviceResponse.Message = "Select a project to continue";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
                if (data.ProjectRoleId <= 0 && data.ProjectId > 0) {
                    serviceResponse.Message = "Select a project role to continue";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
                if (ContainInt(data.FirstName)) {
                    serviceResponse.Message = "Invalid first name";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
                if (ContainInt(data.LastName)) {
                    serviceResponse.Message = "Invalid last  name";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }

                var user = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Email == data.Email);

                if (user != null) {

                    serviceResponse.Message = "User already exists";
                    serviceResponse.StatusCode = StatusCodes.Status409Conflict;
                    serviceResponse.Success = false;
                    return serviceResponse;

                }

                else {

                    var unhashedPassword = GenerateRandomPassword(8);

                    while (
                     !ContainsSpecialCharacter(unhashedPassword) ||
                    !ContainsSmallCase(unhashedPassword) ||
                    !ContainUpperCase(unhashedPassword) ||
                    !ContainInt(unhashedPassword)
                    ) {
                        unhashedPassword = GenerateRandomPassword(8);
                    }



                    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(unhashedPassword);

                    Guid guidId = Guid.NewGuid();

                    User userData = new User();
                    UserProjectRole userprojectrole = new UserProjectRole();
                    userData.UserId = guidId;
                    userData.Password = hashedPassword;
                    userData.Email = data.Email;
                    userData.FirstName = data.FirstName;
                    userData.LastName = data.LastName;
                    userData.PhoneNumber = data.PhoneNumber;
                    userData.Role = data.Role;

                    await _dbcontext.Users.AddAsync(userData);


                    if (data.ProjectId > 0 && data.ProjectRoleId > 0) {

                        userprojectrole.UserId = guidId;
                        userprojectrole.ProjectId = data.ProjectId;
                        userprojectrole.ProjectRoleId = data.ProjectRoleId;

                        await _dbcontext.UserProjectRoles.AddAsync(userprojectrole);
                    }
                    await _dbcontext.SaveChangesAsync();
                    var htmlMessage = $"<div>" +

                        $"<h1>Welcome to Global Griffin Technology!</h1> " +

                        $"<h3>To Login To Your Newly Created Account</h3>" +

                        $" <h4>Your Credentials are</h4>" +

                        $"  <p>Email: {data.Email}</p>  " +

                        $"<p>Password: {unhashedPassword}</p> " +

                        $"<a href='http://localhost:5173/login' style='background-color: rgb(123, 184, 58); color: white; border-radius: 10px; padding: 10px 20px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);'>Go To Login</a>" +

                        $"</div>";

                    var email = data.Email;

                    var subject = "Join the Employee Registry";

                    await _emailService.SendEmailAsync(email, subject, htmlMessage);

                    serviceResponse.Message = "User added successfully";
                    serviceResponse.StatusCode = 200;
                    return serviceResponse;
                }

            }
            catch (Exception) {

                serviceResponse.Success = false;

                serviceResponse.Message = "Not able to add User";

                serviceResponse.StatusCode = StatusCodes.Status500InternalServerError;

                return serviceResponse;

            }

        }

        public string GenerateRandomPassword(int length) {
            string characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_=+";
            var random = new Random();
            StringBuilder randomString = new StringBuilder();

            while (0 < length--) {
                randomString.Append(characters[random.Next(characters.Length)]);
            }
            Console.WriteLine(randomString.ToString());

            string password = randomString.ToString();

            return password;
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
        public static bool IsValidPhoneNumber(string phoneNumber) {

            string pattern = @"^\+\d{10,15}$";


            Regex regex = new Regex(pattern);


            return regex.IsMatch(phoneNumber);
        }

        static bool IsEmailValid(string email) {

            string pattern = @"\s";

            return !Regex.IsMatch(email, pattern);
        }
        public async Task<bool> UserExists(Guid userId) {
            try {
                return await _dbcontext.Users.AnyAsync(u => u.UserId == userId);
            }
            catch (Exception ex) {
                Log.Error("An Exception occurred while checking for a user " + ex.Message);
                return false;
            }
        }

        public async Task<MessageResponse> SuspendUser(Guid userId, string reason) {

            var existingUser = await _dbcontext.Users.FirstOrDefaultAsync(user => user.UserId == userId);

            if (existingUser != null) {
                if (reason.Length < 10 || reason.Length > 450) {
                    return new MessageResponse {
                        Message = "Reason must be between 10 and 450 characters",
                        Status = false,
                        Code = 400
                    };
                }
                existingUser.Suspended = true;
                existingUser.SuspensionReason = reason;
                await _dbcontext.SaveChangesAsync();
                return new MessageResponse {
                    Message = "User has been suspended successfully",
                    Status = true,
                    Code = 200
                };
            }
            else {
                return new MessageResponse {
                    Message = "User does not exist",
                    Status = false,
                    Code = 404
                };
            }
        }

        public async Task<MessageResponse> UnsuspendUser(Guid userId) {

            var existingUser = await _dbcontext.Users.FirstOrDefaultAsync(user => user.UserId == userId);

            if (existingUser != null) {
                existingUser.Suspended = false;
                existingUser.SuspensionReason = "";
                await _dbcontext.SaveChangesAsync();
                return new MessageResponse {
                    Message = "User has been unsuspended successfully",
                    Status = true,
                    Code = 200
                };
            }
            else {
                return new MessageResponse {
                    Message = "User does not exist",
                    Status = false,
                    Code = 404
                };
            }
        }

        public async Task<MessageResponse> DeleteUser(Guid userId) {
            try {
                var existingUser = await _dbcontext.Users.FirstOrDefaultAsync(user => user.UserId == userId);
                var userProjects = await _dbcontext.UserProjectRoles.Where(upr => upr.UserId == userId).ToListAsync();
                if (userProjects != null) {
                    _dbcontext.UserProjectRoles.RemoveRange(userProjects);
                    await _dbcontext.SaveChangesAsync();

                }
                if (existingUser == null) {
                    return new MessageResponse {
                        Message = "User does not exist",
                        Code = 404,
                        Status = false
                    };
                }
                else {
                    existingUser.Deleted = true;
                    await _dbcontext.SaveChangesAsync();
                    return new MessageResponse {
                        Message = "User has been successfully deleted",
                        Code = 200,
                        Status = true
                    };
                }
            }
            catch {
                return new MessageResponse {
                    Message = "Oops! Something went wrong",
                    Code = 500,
                    Status = false
                };
            }
        }

        public async Task<ServiceResponse<List<GetUserDto>>> AllUsers(string? searchQuery, int? client, int? role, string? skill, int? page, int? pageSize) {
            var serviceResponse = new ServiceResponse<List<GetUserDto>>();

            try {
                var query = _dbcontext.Users.Where(u => !u.Deleted); // Exclude deleted users

                // Apply search filter if searchQuery is provided
                if (!string.IsNullOrEmpty(searchQuery)) {
                    var searchQueryLower = searchQuery.ToLower();
                    query = query.Where(u => u.FirstName.ToLower().Contains(searchQueryLower) || u.LastName.ToLower().Contains(searchQueryLower));
                }

                if (client != null) {
                    query = query.Where(u => u.UserProjectRoles.Any(p => p.Projects.ClientsId == client));
                }
                if (role != null) {
                    query = query.Where(u => u.UserProjectRoles.Any(p => p.ProjectRoleId == role));
                }
                if (skill != null) {
                    query = query.Where(u => u.UserSkills.Any(p => p.SkillId.ToString() == skill));
                }

                // Order users alphabetically by first name and then by last name
                query = query.OrderBy(u => u.FirstName).ThenBy(u => u.LastName);

                // Separate suspended users from active users
                var activeUsers = await query.Where(u => !u.Suspended)
                  .Include(e => e.Educations)
                .Include(s => s.UserSkills)
                .ThenInclude(x => x.Skill)
                .Include(x => x.Experiences)
                .Include(c => c.Certifications)
                .Include(p => p.UserProjectRoles)
                .ThenInclude(a => a.Projects)
                .ThenInclude(b => b.Clients)
                .Include(b => b.UserProjectRoles)
                .ThenInclude(x => x.ProjectRole)
                .ToListAsync();

                var suspendedUsers = await query.Where(u => u.Suspended)
                  .Include(e => e.Educations)
                .Include(s => s.UserSkills)
                .ThenInclude(x => x.Skill)
                .Include(x => x.Experiences)
                .Include(c => c.Certifications)
                .Include(p => p.UserProjectRoles)
                .ThenInclude(a => a.Projects)
                .ThenInclude(b => b.Clients)
                .Include(b => b.UserProjectRoles)
                .ThenInclude(x => x.ProjectRole)
                .ToListAsync();

                // Concatenate active users and suspended users (suspended users at the bottom)
                var users = activeUsers.Concat(suspendedUsers).ToList();

                // Pagination
                var totalCount = users.Count;
                var totalPages = (int)Math.Ceiling((double)totalCount / (pageSize ?? 20));
                var skipCount = ((page ?? 1) - 1) * (pageSize ?? 20);
                users = users.Skip(skipCount).Take(pageSize ?? 20).ToList();

                // Convert users to DTOs
                serviceResponse.Data = users.Select(u => u.ToGetUserDto()).ToList();

                // Populate pagination model
                var paginationModel = new PaginationModel {
                    TotalRecords = totalCount,
                    CurrentPage = page ?? 1,
                    Size = pageSize ?? 20,
                    TotalPages = totalPages,
                    NextPage = (page ?? 1) + 1,
                    PreviousPage = (page ?? 1) - 1
                };

                serviceResponse.Message = "Users retrieved successfully";
                serviceResponse.Pagination = paginationModel;
                return serviceResponse;
            }
            catch (Exception ex) {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
                serviceResponse.StatusCode = StatusCodes.Status400BadRequest;
                return serviceResponse;
            }
        }




        public async Task<ServiceResponse<GetUserDto>> GetUser(Guid userId) {
            var serviceResponse = new ServiceResponse<GetUserDto>();

            try {

                var users = await _dbcontext.Users.Where(s => s.UserId == userId)
                .Include(e => e.Educations)
                .Include(s => s.UserSkills)
                .ThenInclude(x => x.Skill)
                .Include(x => x.Experiences)
                .Include(c => c.Certifications)
                .Include(p => p.UserProjectRoles)
                .ThenInclude(a => a.Projects)
                .ThenInclude(b => b.Clients)
                .Include(b => b.UserProjectRoles)
                .ThenInclude(x => x.ProjectRole)
                .ToListAsync();

                serviceResponse.Data = users.Select(s => s.ToGetUserDto()).ToList().FirstOrDefault();

                serviceResponse.Message = "User retrieved successfully";
                return serviceResponse;
            }
            catch (Exception ex) {

                serviceResponse.Success = false;

                serviceResponse.Message = ex.Message;

                serviceResponse.StatusCode = StatusCodes.Status400BadRequest;

                return serviceResponse;
            }
        }
        public async Task<ServiceResponse<object>> SearchUsers(string name) {
            var serviceResponse = new ServiceResponse<object>();
            try {
                var users = await _dbcontext.Users
           .Where(u => u.FirstName.ToLower().Contains(name.ToLower()) || u.LastName.ToLower().Contains(name.ToLower()) && u.Suspended == false && u.Deleted == false)
           .ToListAsync();

                serviceResponse.Data = users;
                serviceResponse.Message = "Successful Fetch";
                return serviceResponse;
            }
            catch (Exception ex) {
                serviceResponse.Success = false;

                serviceResponse.Message = ex.Message;

                serviceResponse.StatusCode = StatusCodes.Status400BadRequest;

                return serviceResponse;
            }
        }
    }
}
