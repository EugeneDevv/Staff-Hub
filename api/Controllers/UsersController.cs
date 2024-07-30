using Api.Models.Dtos.AuthDtos;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace Api.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase {
        private readonly IUser _user;
        public UsersController(IUser user) {
            _user = user;
        }
        [HttpPost]
      
        public async Task<IActionResult> AddUser(RegisterDto data) {
            var response = await _user.AddUser(data);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet ]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> GetAll(string? searchQuery, int? client, int? role, string? skill, int? page, int? pageSize) {
            var response = await _user.AllUsers(searchQuery, client, role, skill, page, pageSize);
            return StatusCode(response.StatusCode, response);
        }
        
        [HttpGet("{userId}")]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> GetById(Guid userId) {
            var response = await _user.GetUser(userId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("suspend/{userId}")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> SuspendUser(Guid userId, string reason) {

            var results = await _user.SuspendUser(userId, reason);

            return StatusCode(results.Code, results);

        }
        [HttpPost("unsuspend/{userId}")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> UnsuspendUser(Guid userId) {

            var results = await _user.UnsuspendUser(userId);

            return StatusCode(results.Code, results);

        }

        [HttpDelete("{userId}")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> DeleteUser(Guid userId) {

            var results = await _user.DeleteUser(userId);

            return StatusCode(results.Code, results);

        }
        [HttpGet("searchUser")]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> GetUsers(string name) {
            var response = await _user.SearchUsers(name);
            return StatusCode(response.StatusCode, response);
        }
    }

}
