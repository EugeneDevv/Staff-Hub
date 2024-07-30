using Api.Models.Dtos;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers {
    [Route("api/v1/[controller]")]
    [ApiController]


    public class EducationController : ControllerBase {
        private readonly IEducation _education;

        public EducationController(IEducation education) {
            _education = education;
        }

        [HttpPost("/add-education/{userId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateEducation(Guid userId, List<EducationDTO> education) {
        
            if(!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            return Ok(await _education.CreateEducation(userId, education));
        }

    }
}
