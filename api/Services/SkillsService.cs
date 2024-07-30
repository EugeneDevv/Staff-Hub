using Api.Database;
using Api.Models.Dtos;
using Api.Models.Entities;

using Microsoft.IdentityModel.Tokens;

using Microsoft.IdentityModel.Tokens;

using Serilog;

namespace Api.Services {
    public class SkillsService: ISkill {
        private readonly AppDbContext _context;

        public SkillsService(AppDbContext context) {
            _context = context;
        }

        public async Task<Dictionary<string, object>> AddSkill(AddSkillDTO skills) {
            Dictionary<string, object> response = new Dictionary<string, object>();
            var existingSkill = await this.SkillExists(skills.Name);
            if (existingSkill != null && existingSkill.deleted==true) {
                existingSkill.deleted = false;
            }
            else {
                var newSkill = new Skills {
                    Name = skills.Name.Trim(),
                };
                await _context.Skills.AddAsync(newSkill);
            }

           await  _context.SaveChangesAsync();
           response.Add("message", "Skill added successfully!");
           response.Add("status", true);
            return response;
        }

        public async Task<Dictionary<string, object>> GetAllSkills() {

            Dictionary<string, object> response = new Dictionary<string, object>();
            try {
                List<Skills> allSkills = await _context.Skills.Where(sk=>sk.deleted==false).ToListAsync();
                response.Add("message", "Data retrieved successfully");
                response.Add("status", true);
                response.Add("data", allSkills);
                return response;
            }
            catch(Exception exception) {
                response.Add("message", "Oops! Someting went wrong");
                Log.Error(exception.Message);
                response.Add("status", false);
                return response;
            }
        }
        public async Task<Dictionary<string, object>> UpdateSkill(AddSkillDTO skills, Guid skillId) {
            Dictionary<string, object> response = new Dictionary<string, object>();
            var existingSkill = await _context.Skills.FirstOrDefaultAsync(s => s.Id == skillId);

            var nameExist = await _context.Skills.AnyAsync(skill=> skill.Name.ToLower() == skills.Name.ToLower());

            if(nameExist) {
                response.Add("message", "Skill with the same name already exist!");
                response.Add("status", true);
                return response;
            }
           
            if (existingSkill != null) {
                if (!skills.Name.IsNullOrEmpty()) {
                    existingSkill.Name = skills.Name;
                }
            }
            await _context.SaveChangesAsync();
            response.Add("message", "Skill updated successfully!");
            response.Add("status", true);
            return response;
        }

        public async Task<Skills> SkillExists(string skillName) {
           return await _context.Skills.FirstOrDefaultAsync(skill => skill.Name.ToLower() == skillName.Trim().ToLower());
        }
        public async Task<bool> SkillExistWithId(Guid id) {

            return await _context.Skills.AnyAsync(x => x.Id == id);
        }

        public async Task<Dictionary<string, object>> DeleteSkill(Guid skillId) {
            Dictionary<string, object> response = new Dictionary<string, object>();
            try {

                var existingSkill = await _context.Skills.FindAsync(skillId);
                if(existingSkill != null) {
                    if( await checkIfSkillIsAssigned(skillId)) {
                        response.Add("message", "Cannot delete. Skill is assigned to a user");
                        response.Add("status", false);
                        response.Add("statusCode", 400);
                        return response;
                    }
                    else {
                        existingSkill.deleted = true;
                        await _context.SaveChangesAsync();
                        response.Add("message", "Skill successfully deleted");
                        response.Add("status", true);
                        response.Add("statusCode", 200);
                        return response;
                    }
                }
                
                else {
                    response.Add("message", "Skill does not exist");
                    response.Add("status", false);
                    response.Add("statusCode", 404);
                    return response;
                }


            }
            catch {
                response.Add("message", "Skill does not exist");
                response.Add("status", false);
                response.Add("statusCode", 500);
                return response;
            }
        }

        public async Task<bool> checkIfSkillIsAssigned(Guid skillId) {
            bool isSkillAssigned = await _context.UserSkills.AnyAsync(us => us.SkillId == skillId);

            if (isSkillAssigned) {
                return true;
            }
            return false;

        }
        public async Task<ServiceResponse<List<object>>> GetUserSkills(Guid skillId) {
            var serviceResponse = new ServiceResponse<List<object>>();
            try {

                            var usersWithSkill = await _context.Users
                .Include(u => u.UserSkills)
                .ThenInclude(us => us.Skill)
                .Where(u => !u.Deleted && u.UserSkills.Any(us => us.SkillId == skillId))
                .Select(u => new {
                    u.UserId,
                    u.FirstName,
                    u.LastName,
                    Skills = u.UserSkills
                    .Where(us => us.SkillId == skillId) // Filter skills by skillId
                    .Select(us => new {
                        us.SkillId,
                        us.Skill.Name,
                        us.ProficiencyLevel
                    })
                    .ToList()
                })
                .ToListAsync();

                if (usersWithSkill.Count > 0) {
                    serviceResponse.Data = usersWithSkill.Cast<object>().ToList();
                }
                else {
                    serviceResponse.Message = "No users found with the specified skill.";
                }
            }
            catch (Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.StatusCode = 500;
                serviceResponse.Success = false;
            }

            return serviceResponse;
        }

    }
}