using Api.Database;
using Api.Models.Dtos;
using AutoMapper;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase {
        private readonly IClient _client;
        private readonly IAppDbContext _context;

        public ClientsController(IClient client, IAppDbContext context) {
            _client = client;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetClients() {

            return Ok(await _client.getAllClients());
        }
        [HttpGet("Active")]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> GetActiveClients() {

            return Ok(await _client.getAllActiveClients());
        }
        [HttpPost]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> AddClient(AddClientDto client) {
         
            var response = await _client.AddClient(client);
            return StatusCode(response.StatusCode, response);
        }
        [HttpPut("{clientId}")]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> UpdateClient(AddClientDto client, int clientId) {
            try {
                if(await _context.Projects.FirstOrDefaultAsync(b => b.ClientsId == clientId) != null) {
                    return Conflict(new Dictionary<string, object> {

                        {"message", "Cannot update client. It has projects attached to it"},
                        {"success", false },
                    });
                }
                if (!await _client.ClientExistWithId(clientId)) {

                    return NotFound(new Dictionary<string, object> {
                        {"message", "Client does not exist"},
                        {"success", false }
                    });

                }
                var response = await _client.UpdateClient(client, clientId);
                return StatusCode(response.StatusCode, response);
            }
            catch {
                return StatusCode(500,
                  new Dictionary<string, object> {
                    { "message", "Oops! Something went wrong while updating a client" },
                    {  "status", false }
                });
            }
        }
        [HttpDelete("{clientId}")]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> DeleteClient(int clientId) {
            var response = await _client.DeleteClient(clientId);
            return StatusCode(response.StatusCode, response);
        }
    }
}
