using Api.Database;
using Api.Models.Dtos;

using AutoMapper;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using SendGrid;

namespace Api.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase {
        private readonly ISkill _skills;
        private readonly IAppDbContext _context;

        public SkillsController(ISkill skills, IAppDbContext context) {
            _skills = skills;
            _context = context;
        }

        [HttpGet()]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> GetSkills() {
;
            return Ok(await _skills.GetAllSkills());
        }

        [HttpPost()]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> AddSkill(AddSkillDTO skill) {
            try {
                var existingSkill = await _skills.SkillExists(skill.Name);

                if (existingSkill!=null && existingSkill.deleted==false) {

                return Conflict(new Dictionary<string, object> {
                    { "message", "Skill already exist" },
                    {  "success", false }
                    });
                    
                }
                return Ok(await _skills.AddSkill(skill));
            }
            catch {
                return StatusCode(500,
                  new Dictionary<string, object> {
                    { "message", "Oops! Something went wrong while adding a skill" },
                    {  "status", false }
                }); 
            }
        }


        [HttpPut]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> UpdateSkill(AddSkillDTO skill, Guid skillId) {
            try {
                if (!await _skills.SkillExistWithId(skillId)) {

                    return NotFound(new Dictionary<string, object> {
                    { "message", "Skill does not exist" },
                    {  "success", false }
                    });

                }
                if(await _context.UserSkills.FirstOrDefaultAsync(us => us.SkillId == skillId)  !=null) {
                    return BadRequest(new Dictionary<string, object> {
                    { "message", "Cannot update skill. It has users attached to it!" },
                    {  "success", false }
                    });
                }
                return Ok(await _skills.UpdateSkill(skill, skillId));
            }
            catch {
                return StatusCode(500,
                  new Dictionary<string, object> {
                    { "message", "Oops! Something went wrong while adding a skill" },
                    {  "status", false }
                });
            }
        }
        [HttpDelete("{skillId}")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> DeleteSkill (Guid skillId) {
            try {
                if (!await _skills.SkillExistWithId(skillId)) {

                    return NotFound(new Dictionary<string, object> {
                    { "message", "Skill does not exist" },
                    {  "success", false }
                    });

                }
                if (await _skills.checkIfSkillIsAssigned(skillId)) {

                    return BadRequest(new Dictionary<string, object> {
                    { "message", "Skill is assigned to a user" },
                    {  "success", false }
                    }); ;
                }
                return Ok(await _skills.DeleteSkill(skillId));


            }
            catch {
                return StatusCode(500, new Dictionary<string, object> {
                    { "message", "Skill does not exist" },
                    {  "success", false }
                });
            }

          

        }
        [HttpGet("get-users-by-skill")]
        [Authorize(Roles = "Admin, SuperAdmin, User")]
        public async Task<IActionResult> GetUserSkills(Guid skillId) {
            var response = await _skills.GetUserSkills(skillId);
            return StatusCode(response.StatusCode, response);
        }
    }
}
