using Api.Models.Dtos;

namespace Api.Services.IServices {
    public interface ITeam {
        Task<Dictionary<string, object>> GetAllUsers();
        Task<ServiceResponse<object>> AddTeam(AddTeamDto team);
        Task<ServiceResponse<object>> RemoveTeam(Guid userId, int projectId, int roleId);
        Task<bool> UserExistWithId(Guid Id);
    }
}
