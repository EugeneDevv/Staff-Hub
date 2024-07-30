using Api.Models.Dtos;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase {

        private readonly ITeam _team;
        public TeamController(ITeam team) {

            _team = team;

        }
        [HttpGet("AllActiveUsers")]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> GetActiveUsers() {
            return Ok(await _team.GetAllUsers());
        }

        [HttpPost]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> AddTeam(AddTeamDto team) {

            try {
                var response = await _team.AddTeam(team);
                return StatusCode(response.StatusCode, response);
            }
            catch {
                return StatusCode(500,
                  new Dictionary<string, object> {
                    { "message", "Oops! Something went wrong while adding a team member" },
                    {  "status", false }
                });
            }
        }
        [HttpDelete("{userId}")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> RemoveTeam(Guid userId, int projectId, int roleId) {

            try {
                var response = await _team.RemoveTeam(userId, projectId, roleId);
                return StatusCode(response.StatusCode, response);
            }
            catch {
                return StatusCode(500,
                  new Dictionary<string, object> {
                    { "message", "Oops! Something went wrong while removing a team member" },
                    {  "status", false }
                });
            }

        }
     }
}
