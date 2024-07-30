using System.Security.Cryptography.X509Certificates;

using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class PasswordController : ControllerBase {
        private readonly IPassword _password;

        public PasswordController(IPassword password) {
            _password = password;
        }

        [HttpPost("/verifyEmail")]
        public async Task<IActionResult>Put(string email) {

            var response = await _password.InitiateResetPassword(email);
       
                return StatusCode(response.StatusCode, response);
            
        }
        [HttpPost("/verifyOtp")]
        public async Task<IActionResult> VerifyOtp(int otp, string email) {
            var response =  await _password.VerifyOtp(otp, email);
       
                return StatusCode(response.StatusCode, response);
            
        }
        [HttpPut("/setNewPassword")]
        public async Task<IActionResult> SetNewPassword(string email, string password) {
            var response = await _password.SetNewPassword(email, password);
          
                return StatusCode(response.StatusCode, response);
            
        }
        [HttpPut("reset-password")]
        public async Task<IActionResult>ResetPassword(Guid userId, string password, string currentPassword) {
            var response = await _password.ResetPassword(userId, password, currentPassword);
            return StatusCode(response.StatusCode, response);

        }
    }
}
