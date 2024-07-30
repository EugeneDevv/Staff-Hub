using Api.Database;
using Api.Models.Dtos;
using Api.Models.Entities;

using Microsoft.EntityFrameworkCore;

using YourNamespace;

using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Api.Services {
    public class RolesService : IRole {
        private readonly AppDbContext _context;

        public RolesService(AppDbContext context) {
            _context = context;
        }
      public async Task<ServiceResponse<List<object>>> GetRoles() {
            var serviceResponse = new ServiceResponse<List<object>>();
            try {
                var activeRoles = await _context.ProjectRole.Where(r=>r.deleted !=true).ToListAsync();
                var rolseObj = activeRoles.Cast<object>().ToList();
                serviceResponse.Data = rolseObj;
                return serviceResponse;


            }
            catch (Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.StatusCode = 500;
                serviceResponse.Success = false;
                return serviceResponse;
            }
        }
        public async Task<ServiceResponse<List<object>>> GetNamesByRole(int projectRoleId) {
            var serviceResponse = new ServiceResponse<List<object>>();
            try {
                var userProjectRoles = await _context.UserProjectRoles
            .Where(upr => upr.ProjectRoleId == projectRoleId)
            .Include(upr => upr.ProjectRole)
            .Include(upr => upr.User)
            .ToListAsync();

                var simplifiedData = userProjectRoles
                    .Where(upr => upr.User != null && upr.ProjectRole != null)
                    .Select(upr => new {
                        UserId = upr.User.UserId,
                        FirstName = upr.User.FirstName,
                        LastName = upr.User.LastName,
                        RoleId = upr.ProjectRole.ProjectRoleId,
                        RoleName = upr.ProjectRole.ProjectRoleName
                    })
                    .GroupBy(upr => upr.UserId) // Group by UserId
                    .Select(group => group.First()) // Select the first item from each group
                    .ToList();


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
        public async Task<ServiceResponse<object>> UpdateRole(UpdateRoleDto role) {
            var serviceResponse = new ServiceResponse<object>();
            try {
                var Role  = await _context.ProjectRole.FirstOrDefaultAsync(r=>r.ProjectRoleId == role.RoleId);
                var roleHasUser = await _context.UserProjectRoles.FirstOrDefaultAsync(r => r.ProjectRoleId == role.RoleId);
                if (roleHasUser != null) {
                    serviceResponse.Message = "The role cannot be edited due to attached users. Please detach users before editing.";
                    serviceResponse.StatusCode = 404;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
                  var exsitingName = await _context.ProjectRole.FirstOrDefaultAsync(r=>r.ProjectRoleName.ToLower() == role.RoleName.ToLower());  
                if(exsitingName != null) {
                    bool deleted = exsitingName.deleted;
                    if (deleted) {
                        serviceResponse.Message = "Kindly note that the role has previously been soft-deleted and currently exists in our records. To proceed, please re-add the role accordingly";
                        serviceResponse.StatusCode = 404;
                        serviceResponse.Success = false;
                        return serviceResponse;
                    }
                    serviceResponse.Message = "Role with same name already exists";
                    serviceResponse.StatusCode = 404;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
                if(Role != null) {
                  
                    Role.ProjectRoleName = role.RoleName;
                    await _context.SaveChangesAsync();
                    serviceResponse.Message = "Role updated successfully";
                    return serviceResponse;
                }

                serviceResponse.Message = "No role found";
                serviceResponse.StatusCode = 404;
                serviceResponse.Success = false;
                return serviceResponse;
            }
            catch (Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.StatusCode = 500;
                serviceResponse.Success = false;
                return serviceResponse;
            }
        }
        public async Task<ServiceResponse<object>> AddRole(AddRoleDto role) {
            var serviceResponse = new ServiceResponse<object>();
            try {
            
               

               
                if (string.IsNullOrEmpty(role.RoleName)) {
                    serviceResponse.Message = "Role name cannot be empty";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
                if(role.RoleName == "string") {
                    serviceResponse.Message = "Role name cannot be empty";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
            
                role.RoleName = role.RoleName.Trim();

                
                var existingRole = await _context.ProjectRole.FirstOrDefaultAsync(r => r.ProjectRoleName.ToLower() == role.RoleName.ToLower());
                if (existingRole != null) {
                    if(existingRole.deleted) {
                        existingRole.deleted = false;
                        await _context.SaveChangesAsync();
                        serviceResponse.Message = "Role has been restored";
                        return serviceResponse;
                    }
                    serviceResponse.Message = "Role already exists";
                    serviceResponse.StatusCode = 409;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }

               
                ProjectRole newRole = new ProjectRole {

                    ProjectRoleName = role.RoleName
                };

                _context.ProjectRole.Add(newRole);
                await _context.SaveChangesAsync();
 
                serviceResponse.Message = "Role added successfully";
                serviceResponse.Success = true;
            }
            catch (Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.StatusCode = 500;
                serviceResponse.Success = false;
            }

            return serviceResponse;
        }
        public async Task<ServiceResponse<object>> DeleteRole(int roleId) {
            var serviceResponse = new ServiceResponse<object>();

            try {
                if (roleId <= 0) {
                    serviceResponse.Message = "Invalid roleId";
                    serviceResponse.Success = false;
                    serviceResponse.StatusCode = 400; 
                    return serviceResponse;
                }
                var role = await _context.ProjectRole.FirstOrDefaultAsync(r => r.ProjectRoleId == roleId);
                var roleHasUsers = await _context.UserProjectRoles.FirstOrDefaultAsync(r=>r.ProjectRoleId==roleId);
                if (roleHasUsers != null) {
                    serviceResponse.Message = "The role cannot be deleted due to attached users. Please detach users before deleting.";
                    serviceResponse.StatusCode = 400;
                    return serviceResponse;
                }
                if (role != null) {
                    role.deleted = true;
                   await _context.SaveChangesAsync();
                    serviceResponse.Message = "Role deleted successfully";
                    return serviceResponse;
                }
                serviceResponse.Message = "Roles doesn't exist";
                serviceResponse.Success = false;
                serviceResponse.StatusCode = 409;
                return serviceResponse;

            }catch(Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.StatusCode = 500;
                serviceResponse.Success = false;
                return serviceResponse;
            }
        }

    }


}
