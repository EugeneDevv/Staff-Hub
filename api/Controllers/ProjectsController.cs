using Api.Models.Dtos;
using Api.Models.Dtos.AuthDtos;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Newtonsoft.Json;

using SendGrid;

namespace Api.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase {
        private readonly IProjects _projects;


        public ProjectsController(IProjects projects) {
            _projects = projects;
        }

        [HttpGet("clients")]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> GetClient() {
            var response = await _projects.FetchClients();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("roles")]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> GetProjectRoles() {
            var response = await _projects.FetchProjectRoles();
            return StatusCode(response.StatusCode, response);

        }

        [HttpGet("ActiveProjects/{clientId}")]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> GetClientsActiveProjects(int clientId) {
            return Ok(await _projects.getClientsActiveProjects(clientId));
        }

        [HttpGet("AllProjects/{clientId}")]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> GetClients(int clientId) {

            return Ok(await _projects.getClientsProjects(clientId));
        }
        [HttpGet("project-team/{projectId}")]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> FetchUserProjectRoles(int projectId) {
            var response = await _projects.FetchUserProjectAndRole(projectId);
            return StatusCode(response.StatusCode, response);
        }
        [HttpPost("project")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> AddProject(AddProjectDto data) {
            var response = await _projects.AddProject(data);
            return StatusCode(response.StatusCode, response);
        }
        [HttpPut("{projectId}")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> UpdateProject(int projectId, AddProjectDto data) {
            try {
                if (data == null || data.clientId <= 0) {
                   return BadRequest(new Dictionary<string, object> {
                       { "message", "ClientId is required" },
                       { "success", false }
                    });
                }
                if (!await _projects.ProjectExistWithId(projectId)) {
                    return NotFound(new Dictionary<string, object> {
                        { "message", "Project does not exist" },
                        { "success", false }
                    });
                }
                var projects = await _projects.UpdateProject(projectId, data);
                return StatusCode(projects.StatusCode, projects);
            }
            catch {
                return StatusCode(500,
                    new Dictionary<string, object> {
                        { "message", "Oops! Something went wrong while updating a project" },
                        { "status", false }
                    });
            }
        }

        [HttpDelete("{projectId}")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> DeleteProject(int projectId) {
            var response = await _projects.DeleteProject(projectId);
            return StatusCode(response.StatusCode, response);
        }
    }
}
