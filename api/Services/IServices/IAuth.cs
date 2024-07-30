using Api.Models.Dtos.AuthDtos;
using Api.Models.Entities;
using Api.Models.Dtos;
using Api.Models;

namespace Api.Services.IServices {
    public interface IAuth {
        Task<ServiceResponse<UserDto>> GetUserData(LoginDto data);
        public Task<List<User>>AllUsers();
        
    }
}
