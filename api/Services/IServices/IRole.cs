using Api.Models.Dtos;

namespace Api.Services.IServices {
    public interface IRole {
        public Task<ServiceResponse<List<object>>> GetRoles();
        public Task<ServiceResponse<List<object>>> GetNamesByRole(int projectRoleId);
        public Task<ServiceResponse<object>> UpdateRole(UpdateRoleDto role);
        public Task<ServiceResponse<object>> AddRole(AddRoleDto role);
        public Task<ServiceResponse<object>> DeleteRole(int roleId);
    }
}
