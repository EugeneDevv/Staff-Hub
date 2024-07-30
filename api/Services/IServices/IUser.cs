using api.Models.Dtos.User;

using Api.Models.Dtos;
using Api.Models.Dtos.AuthDtos;

namespace Api.Services.IServices {
    public interface IUser {
        Task<ServiceResponse<object>> AddUser(RegisterDto data);
        Task<bool> UserExists(Guid userId);
        Task<MessageResponse> SuspendUser(Guid userId, string suspensionReason);
        Task<MessageResponse> UnsuspendUser(Guid userId);
        Task<MessageResponse> DeleteUser(Guid userId);
        Task<ServiceResponse<List<GetUserDto>>> AllUsers(string? searchQuery, int? client, int? role, string? skill, int? page, int? pageSize);
        Task<ServiceResponse<GetUserDto>> GetUser(Guid userId);
        Task<ServiceResponse<object>> SearchUsers(string name);

    }
}
