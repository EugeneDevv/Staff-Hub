using System.Globalization;
using Api.Database;
using Api.Models.Dtos;
using Api.Models.Dtos.AuthDtos;
using Api.Models.Entities;
using Api.Services.IServices;
using AutoMapper;
using Serilog;

namespace Api.Services {
    public class TeamService : ITeam {

        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public TeamService(AppDbContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<object>> AddTeam(AddTeamDto team) {
            var response = new ServiceResponse<object>();

            UserProjectRole user = new UserProjectRole();

            if (team.UserId==null) {
                response.Message= "UserId is required";
                response.StatusCode= 400;
                response.Success= false;
                return response;
            }
            var users = await _context.Users.FirstOrDefaultAsync(x => x.UserId == team.UserId);
            if (users == null) {
                response.Message = "User not found";
                response.StatusCode = 400;
                response.Success = false;
                return response;
            }

            if (users != null && users.Deleted==true) {
                response.Message ="User not found";
                response.StatusCode = 404;
                response.Success = false;
                return response;
            }

            if (team.ProjectId <= 0) {
                response.Message = "ProjectId is required";
                response.StatusCode = 400;
                response.Success = false;
                return response;
            }
            var projects = await _context.Projects.FirstOrDefaultAsync(x=>x.ProjectId == team.ProjectId);
            if (projects == null) {
                response.Message = "Project not found";
                response.StatusCode = 404;
                response.Success = false;
                return response;
            }

            if (projects != null && projects.IsDeleted==true) {
                response.Message= "Project not found";
                response.StatusCode = 404;
                response.Success = false;
                return response;
            }

            if (team.ProjectRoleId <= 0) {
                response.Message = "Please assign role to user!";
                response.StatusCode = 400;
                response.Success = false;
                return response;
            }
            var roles = await _context.ProjectRole.FirstOrDefaultAsync(x=>x.ProjectRoleId == team.ProjectRoleId);
            if (roles == null) {
                response.Message = "Role not found";
                response.StatusCode = 404;
                response.Success = false;
                return response;
            }
            if (roles != null && roles.deleted ==true) {
                response.Message ="Role not found";
                response.StatusCode = 404;
                response.Success = false;
                return response;
            }

            var checkRemovedUser = await _context.UserProjectRoles.Where(x => x.UserId == team.UserId).FirstOrDefaultAsync(x => x.ProjectId == team.ProjectId && x.ProjectRoleId == team.ProjectRoleId && x.IsContinuing ==false);
            if (checkRemovedUser != null) {
                checkRemovedUser.EndMonth = null;
                checkRemovedUser.EndYear = null;
                checkRemovedUser.IsContinuing = true;
                _context.UserProjectRoles.Update(checkRemovedUser);
                await _context.SaveChangesAsync();
                response.Message= $"User was added back to project as {roles?.ProjectRoleName}";
                response.StatusCode = 200;
                response.Success = false;
                return response;
            }



            var checkUser = await _context.UserProjectRoles.Where(x => x.UserId == team.UserId).FirstOrDefaultAsync(x => x.ProjectId == team.ProjectId && x.ProjectRoleId == team.ProjectRoleId);
            if (checkUser != null) {
                response.Message = "User with this role exists on this project";
                response.StatusCode = 409;
                response.Success = false;
                return response;
            }


            using (var transaction = await _context.Database.BeginTransactionAsync()) {
                user.ProjectId = team.ProjectId;
                user.UserId = team.UserId;
                user.ProjectRoleId = team.ProjectRoleId;
                int month = DateTime.Now.Month;
                user.StartMonth = DateTimeFormatInfo.CurrentInfo.GetMonthName(month);
                user.StartYear = DateTime.Now.Year;
                user.EndMonth = null;
                user.EndYear = null;
                user.IsContinuing = true;
                await _context.UserProjectRoles.AddAsync(user);
                transaction.Commit();
            }
    
            await _context.SaveChangesAsync();
            response.Message = "User added to project successfully!";
            response.StatusCode = 200;
            response.Success = false;
            return response;
        }
        public async Task<ServiceResponse<object>> RemoveTeam(Guid userId, int projectId, int roleId) {

            var response = new ServiceResponse<object>();

            var users = await _context.Users.FirstOrDefaultAsync(x => x.UserId == userId);
            if (users == null) {
                response.Message = "User not found";
                response.StatusCode = 400;
                response.Success = false;
                return response;
            }

            if (projectId <= 0) {
                response.Message = "ProjectId is required";
                response.StatusCode = 400;
                response.Success = false;
                return response;
            }
            var projects = await _context.Projects.FirstOrDefaultAsync(x => x.ProjectId == projectId);
            if (projects == null) {
                response.Message = "Project not found";
                response.StatusCode = 404;
                response.Success = false;
                return response;
            }

            if (roleId <= 0) {
                response.Message = "ProjectId is required";
                response.StatusCode = 400;
                response.Success = false;
                return response;
            }
            var roles = await _context.ProjectRole.FirstOrDefaultAsync(x => x.ProjectRoleId == roleId);
            if (roles == null) {
                response.Message = "Role not found";
                response.StatusCode = 404;
                response.Success = false;
                return response;
            }

            var userProject = await _context.UserProjectRoles.Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.ProjectId == projectId );

            if (userProject == null) {
                response.Message = "User is not assigned to this project";
                response.StatusCode = 409;
                response.Success = false;
                return response;
            }

            var user = await _context.UserProjectRoles.Where(x=>x.UserId == userId).FirstOrDefaultAsync(x=>x.ProjectId==projectId && x.ProjectRoleId==roleId);

            if (user == null) {
                response.Message = "User is not assigned this role in the project";
                response.StatusCode = 409;
                response.Success = false;
                return response;
            }
          

            if (user != null) {
                int month = DateTime.Now.Month;
                user.EndMonth = DateTimeFormatInfo.CurrentInfo.GetMonthName(month);
                user.EndYear = DateTime.Now.Year;
                user.IsContinuing = false;
            }
          
            await _context.SaveChangesAsync();
            response.Message = "User removed from project successfully!";
            response.StatusCode = 200;
            response.Success = true;
            return response;
        }

        public async Task<Dictionary<string, object>> GetAllUsers() {
            Dictionary<string, object> response = new Dictionary<string, object>();
            try {
                List<User> users = await _context.Users.Where(s => !s.Deleted && !s.Suspended).ToListAsync();

                List<UserDto> userData = users.Select(u => _mapper.Map<UserDto>(u)).ToList();

                response.Add("message", "Data retrieved successfully");
                response.Add("status", true);
                response.Add("StatusCode", 200);
                response.Add("data", userData); 
                return response;
            }
            catch (Exception exception) {
                response.Add("message", "Oops! Something went wrong");
                Log.Error(exception.Message);
                response.Add("status", false);
                return response;
            }
        }

        public async Task<bool> UserExistWithId(Guid Id) {
            return await _context.Users.AnyAsync(x => x.UserId == Id);
        }
    }
}
