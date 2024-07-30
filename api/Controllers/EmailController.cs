using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

using YourNamespace;

namespace Api.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService) {
            _emailService = emailService;
        }
        [HttpPost("send")]
        public async Task<ActionResult> SendEmailAsync(string email, string subject, string htmlMessage) {
            try {
                await _emailService.SendEmailAsync(email, subject, htmlMessage);
                return Ok("Email sent successfully!");
            }
            catch (Exception ex) {
                return StatusCode(500, $"Failed to send email: {ex}");
            }
        }
    }
}
