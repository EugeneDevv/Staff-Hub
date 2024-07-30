using Api.Models.Dtos;

namespace Api.Services.IServices {
    public interface IprofileService {
        Task<Dictionary<string, object>> CreateProfile(Guid userId, ProfileDTO profile);
        Task<bool> UserExist(Guid userId);

        Task<bool> validateExistingPhone(string? phone);

        bool validatePhoneLength(string? phone);

        Task<MessageResponse> UpdateProfile(Guid userId, ProfileDTO profile);

    }
}