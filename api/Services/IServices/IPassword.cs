namespace Api.Services.IServices {
    public interface IPassword {
        Task<ServiceResponse<object>>InitiateResetPassword(string email);
        Task<ServiceResponse<object>> VerifyOtp(int otp, string email);
        Task<ServiceResponse<object>> SetNewPassword(string email,  string password);
        Task<ServiceResponse<object>> ResetPassword(Guid userId,  string password, string currentPassword);
    }
}
