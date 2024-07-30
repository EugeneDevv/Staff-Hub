using System.Threading.Tasks;

using Api.Models.Dtos;

namespace Api.Services.IServices {
    public interface IProjects {
        Task<ServiceResponse<List<object>>> FetchClients();
        Task<ServiceResponse<List<object>>> FetchProjects(int id);
        Task<ServiceResponse<List<object>>> FetchProjectRoles();
        Task<ServiceResponse<List<object>>> FetchUserProjectAndRole(int projectId);
        Task<ServiceResponse<object>> AddProject(AddProjectDto data);
        Task<Dictionary<string, object>> getClientsProjects(int projectId);
        Task<Dictionary<string, object>> getClientsActiveProjects(int projectId);
        Task<ServiceResponse<object>> UpdateProject(int projectId, AddProjectDto data);
        Task<bool> ProjectExistWithId(int Id);
        public Task<ServiceResponse<object>> DeleteProject(int projectId);
    }
}
