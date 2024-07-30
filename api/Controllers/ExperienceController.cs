using Api.Models.Dtos;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Serilog;

namespace Api.Controllers {
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ExperienceController : ControllerBase {
        private readonly IExperience _experience;

        public ExperienceController(IExperience experience) {
            _experience = experience; 
        }



        [HttpDelete("{experienceId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> DeleteExperience(Guid experienceId) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            return Ok(await _experience.DeleteExperience(experienceId));
        }

        
    }
}
