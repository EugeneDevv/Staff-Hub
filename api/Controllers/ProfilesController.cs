using Api.Models.Dtos;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using Serilog;

namespace Api.Controllers {
    [Route("/api/[controller]")]
    [ApiController]
    public class ProfilesController : ControllerBase {
        private readonly IprofileService _profile;

        public ProfilesController(IprofileService profile) {
            _profile = profile;
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> CreateProfile([FromBody] ProfileDTO profile, Guid userId) {
            try {
                if (!ModelState.IsValid) {
                    return BadRequest(ModelState);
                }
                if (!await _profile.UserExist(userId)) {
                    return NotFound(
                        new Dictionary<string, object> {
                            { "message", "User with the given id does not exist" },
                            {  "success", false }
                        });
                }
                if (profile.Contacts != null) {
                    if (!profile.Contacts.PhoneNumber.IsNullOrEmpty()) {
                        if (!_profile.validatePhoneLength(profile.Contacts.PhoneNumber)) {
                            return BadRequest(
                        new Dictionary<string, object> {
                            { "message", "Phone number must have at least 10 digits and maximum of 15 digits" },
                            {  "success", false }
                        });
                        }
                        if (await _profile.validateExistingPhone(profile.Contacts.PhoneNumber)) {
                            return Conflict(new Dictionary<string, object> {
                            { "message", "Phone number already exist" },
                            {  "success", false }
                            });
                        }
                    }

                }

                return Ok(await _profile.CreateProfile(userId, profile));
            }
            catch {
                return StatusCode(500,
                new ResponseDto {
                    ErrorMessage = "Oops! Something went wrong",
                    IsSuccess = false
                });
            }


        }

        [HttpPut("{userId}")]

        public async Task<IActionResult> UpdateProfile([FromBody] ProfileDTO profile, Guid userId) {
            var results = await _profile.UpdateProfile(userId, profile);
            return StatusCode(results.Code, results);
        }
    }
}
