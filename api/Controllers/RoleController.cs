using Api.Models.Dtos;
using Api.Models.Entities;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase {
        private readonly IRole _role;
        public RoleController(IRole role) {
           
            _role = role;
        }
        [HttpGet]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> GetRoles() {
            var response = await _role.GetRoles();
            return StatusCode(response.StatusCode, response);
        }
        [HttpGet("get-names-by-role")]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> GetNamesByRole(int projectRoleId) {
            var response = await _role.GetNamesByRole(projectRoleId);
            return StatusCode(response.StatusCode, response);
        }
        [HttpPut("update-project-role")]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> UpdateRole(UpdateRoleDto role) {
            var response = await _role.UpdateRole(role);
            return StatusCode(response.StatusCode, response);
        }
        [HttpPost]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> AddRole(AddRoleDto role) {
            var response = await _role.AddRole(role);
            return StatusCode(response.StatusCode, response);
        }
        [HttpDelete]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> DeleteRole(int roleId) {
            var response = await _role.DeleteRole(roleId);
            return StatusCode(response.StatusCode, response);
        }
    }
}
