using Api.Database;
using Api.Models;
using Api.Models.Dtos;
using Api.Models.Entities;

using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using SendGrid;
using SendGrid.Helpers.Mail;

namespace Api.Services {
    public class ProjectsService : IProjects {
        private readonly AppDbContext _dbcontext;

        public ProjectsService(AppDbContext dbContext) {
            _dbcontext = dbContext;
        }

        public async Task<ServiceResponse<List<object>>> FetchClients() {
            var serviceResponse = new ServiceResponse<List<object>>();
            try {
                var clients = await _dbcontext.Clients.Where(c=>c.IsDeleted !=true).ToListAsync();
                var clientObj = clients.Cast<object>().ToList();
                serviceResponse.Data = clientObj;
                return serviceResponse;

            }
            catch (Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.StatusCode = 500;
                serviceResponse.Success = false;
                return serviceResponse;
            }
        }
        public async Task<Dictionary<string, object>> getClientsProjects(int cleintId) {
            Dictionary<string, object> response = new Dictionary<string, object>();
            try {
                List<Projects> projects = await _dbcontext.Projects.Where(pr => pr.ClientsId == cleintId).ToListAsync();
                response.Add("message", "data retrieved successfully");
                response.Add("status", true);
                response.Add("data", projects);
                return response;
            }
            catch {
                response.Add("message", "Oops! Something went wrong getting projects");
                response.Add("status", false);
                return response;
            }
        }
        public async Task<ServiceResponse<List<object>>> FetchProjects(int id) {
            var serviceResponse = new ServiceResponse<List<object>>();
            try {
                var projects = await _dbcontext.Projects.Where(p => p.ClientsId == id).ToListAsync();
                if (projects.Count < 0) {
                    serviceResponse.Message = "Client does not exist";
                    serviceResponse.StatusCode = 500;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
                var projectObj = projects.Cast<object>().ToList();
                serviceResponse.Data = projectObj;
                return serviceResponse;
            }
            catch (Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.StatusCode = 500;
                serviceResponse.Success = false;
                return serviceResponse;
            }
        }
        public async Task<ServiceResponse<List<object>>> FetchProjectRoles() {
            var serviceResponse = new ServiceResponse<List<object>>();
            try {
                var projectRoles = await _dbcontext.ProjectRole.Where(r => r.deleted != true).ToListAsync();
                var projectObj = projectRoles.Cast<object>().ToList();
                serviceResponse.Data = projectObj;
                return serviceResponse;
            }
            catch (Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.StatusCode = 500;
                serviceResponse.Success = false;
                return serviceResponse;
            }
        }
        public async Task<ServiceResponse<List<object>>> FetchUserProjectAndRole(int projectId) {
            var serviceResponse = new ServiceResponse<List<object>>();
            try {
                var userProjectRoles = await _dbcontext.UserProjectRoles
                .Where(upr => upr.ProjectId == projectId && upr.IsContinuing == true)
                .Include(upr => upr.User)
                .Include(upr => upr.Projects)
                .Include(upr => upr.ProjectRole)
                .ToListAsync();

                var simplifiedData = userProjectRoles.Select(upr => new {
                    UserId = upr.User.UserId,
                    FirstName = upr.User.FirstName,
                    LastName = upr.User.LastName,
                    ProjectId = upr.Projects.ProjectId,
                    ProjectName = upr.Projects.ProjectName,
                    RoleId = upr.ProjectRole.ProjectRoleId,
                    RoleName = upr.ProjectRole.ProjectRoleName
                }).ToList();

                serviceResponse.Data = simplifiedData.Cast<object>().ToList();
                return serviceResponse;
            }
            catch (Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.StatusCode = 500;
                serviceResponse.Success = false;
                return serviceResponse;
            }
        }
        public async Task<ServiceResponse<object>> AddProject(AddProjectDto data) {

            var serviceResponse = new ServiceResponse<object>();
            try {
                data.projectName = data.projectName.Trim();
                if (data.clientId < 0) {
                    serviceResponse.Message = "Client cannot be empty";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
                if (data.projectName.IsNullOrEmpty()) {
                    serviceResponse.Message = "Project name cannot be empty";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
                if (data.projectName.Length < 2) {
                    serviceResponse.Message = "Project name must be at least 2 characters long";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }

                if (ConsecutiveSpecialCharacters(data.projectName)) {
                    serviceResponse.Message = "Project name can not contain consecutive special characters";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
                var projects = await _dbcontext.Projects.FirstOrDefaultAsync(p => p.ProjectName.ToLower() == data.projectName.ToLower());
                if (projects != null && projects.ProjectName == data.projectName) {

                    projects.IsDeleted = false;
                    await _dbcontext.SaveChangesAsync();
                    serviceResponse.Message = "Project added successfully";
                    return serviceResponse;
                }

            var Projects = await _dbcontext.Projects.FirstOrDefaultAsync(p=>p.ProjectName.ToLower()==data.projectName.ToLower() && p.ClientsId == data.clientId);
                if (Projects != null) {

                    serviceResponse.Message = "Project already exist";
                    serviceResponse.Success = false;
                    serviceResponse.StatusCode = 409;
                    return serviceResponse;
                }
                else {
                    Projects projectData = new Projects();
                    projectData.ProjectName = data.projectName;
                    projectData.ClientsId = data.clientId;
                    await _dbcontext.Projects.AddAsync(projectData);
                    await _dbcontext.SaveChangesAsync();
                    serviceResponse.Message = "Project added successfully";
                    return serviceResponse;
                }

            }
            catch (Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.StatusCode = 500;
                serviceResponse.Success = false;
                return serviceResponse;
            }

        }

        public async Task<ServiceResponse<object>> UpdateProject(int projectId, AddProjectDto data) {

            var response = new ServiceResponse<object>();

            data.projectName = data.projectName.Trim();
            if (data.projectName.IsNullOrEmpty()) {
                response.Message= "Project name is required!";
                response.StatusCode =400;
                response.Success= false;
                return response;
            }
           
            if (data.clientId<=0) {
                response.Message = "ClientId is required!!";
                response.StatusCode = 400;
                response.Success = false;
                return response;
            }

            data.projectName = data.projectName.Trim();
            if (data.projectName.IsNullOrEmpty()) {
                response.Message = "Project name is required!";
                response.StatusCode = 400;
                response.Success = false;
                return response;
            }
            if (data.projectName.Length < 2) {
                response.Message = "Project name must be at least 2 characters long";
                response.StatusCode = 400;
                response.Success = false;
                return response;
            }

            if (ConsecutiveSpecialCharacters(data.projectName)) {
                response.Message = "Project name can not contain consecutive special characters";
                response.StatusCode = 400;
                response.Success = false;
                return response;
            }
            var client  = await _dbcontext.Clients.Where(x=>x.ClientId == data.clientId).FirstOrDefaultAsync();

            if (client == null) {
                response.Message = "client not found";
                response.StatusCode = 404;
                response.Success = false;
                return response;
            }

            var existingProject = await _dbcontext.Projects.FirstOrDefaultAsync(s => s.ProjectId == projectId && s.ClientsId==data.clientId);

            if (existingProject == null) {
                response.Message = "No such project under this client";
                response.StatusCode = 409;
                response.Success = false;
                return response;
            }

            var projects = await _dbcontext.Projects.FirstOrDefaultAsync(p => p.ProjectName.ToLower() == data.projectName.ToLower());


            var team = await _dbcontext.UserProjectRoles.FirstOrDefaultAsync(b => b.ProjectId == projectId);

            if (existingProject != null && data.projectName.ToLower()==existingProject.ProjectName.ToLower()) {
                response.Message = "Project already exists";
                response.StatusCode = 409;
                response.Success = false;
                return response;
            }

            if (existingProject != null && existingProject.IsDeleted == true) {
                response.Message = "Project not found";
                response.StatusCode = 404;
                response.Success = false;
                return response;
            }
            if (existingProject != null && existingProject.ProjectName.ToLower() == data.projectName.ToLower()) {
                response.Message = "New and Current project name cannot be the same";
                response.StatusCode = 409;
                response.Success = false;
                return response;
            }

            if (team != null) {
                response.Message="Can not update, project has members.";
                response.StatusCode = 409;
                response.Success = false;
                return response;
            }

            if (existingProject != null) {
                if (!existingProject.ProjectName.IsNullOrEmpty()) {
                    existingProject.ProjectName = data.projectName;
                }
            }

            await _dbcontext.SaveChangesAsync();
            response.Message = "Project updated successfully!";
            response.StatusCode = 200;
            response.Success = true;
            return response;
        }
        public async Task<bool> ProjectExistWithId(int Id) {
            return await _dbcontext.Projects.AnyAsync(x => x.ProjectId == Id);
        }

        private bool ConsecutiveSpecialCharacters(string input) {
            var specialCharacters = new HashSet<char>("~`!@#$%^&*()-_=+[]{}|;:'\",.<>?");
            for (int i = 0; i < input.Length - 1; i++) {
                if (specialCharacters.Contains(input[i]) && specialCharacters.Contains(input[i + 1])) {
                    return true;
                }
            }
            return false;
        }

        public async Task<ServiceResponse<object>> DeleteProject(int projectId) {
            var serviceResponse = new ServiceResponse<object>();

            try {
                if (projectId <= 0) {
                    serviceResponse.Message = "Invalid projectId";
                    serviceResponse.Success = false;
                    serviceResponse.StatusCode = 400;
                    return serviceResponse;
                }
                var existingProject = await _dbcontext.Projects.FirstOrDefaultAsync(s => s.ProjectId == projectId);

                var team = await _dbcontext.UserProjectRoles.FirstOrDefaultAsync(b => b.ProjectId == projectId);

                if (team != null) {
                    serviceResponse.Message = "Project cannot be deleted has team attached";
                    serviceResponse.Success = false;
                    serviceResponse.StatusCode = 409;
                    return serviceResponse;
                }


                if (existingProject != null) {
                    existingProject.IsDeleted = true;
                    await _dbcontext.SaveChangesAsync();
                    serviceResponse.Success = true;
                    serviceResponse.StatusCode = 200;
                    serviceResponse.Message = "Project deleted successfully";
                    return serviceResponse;
                }
                serviceResponse.Message = "Project doesn't exist";
                serviceResponse.Success = false;
                serviceResponse.StatusCode = 404;
                return serviceResponse;

            }
            catch (Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.StatusCode = 500;
                serviceResponse.Success = false;
                return serviceResponse;
            }
        }

        public async Task<Dictionary<string, object>> getClientsActiveProjects(int clientId) {

            Dictionary<string, object> response = new Dictionary<string, object>();
            try {
                List<Projects> projects = await _dbcontext.Projects.Where(pr => pr.ClientsId == clientId && pr.IsDeleted == false).ToListAsync();
                response.Add("message", "data retrieved successfully");
                response.Add("status", true);
                response.Add("data", projects);
                return response;
            }
            catch {
                response.Add("message", "Oops! Something went wrong getting projects");
                response.Add("status", false);
                return response;
            }
        }
    }

}
