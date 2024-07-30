using Api.Models.Dtos;

namespace Api.Services.IServices {
    public interface ISkill {
        Task<Dictionary<string, object>> GetAllSkills();
        Task<Dictionary<string, object>> AddSkill(AddSkillDTO skills);
        Task<Dictionary<string, object>> UpdateSkill(AddSkillDTO skills, Guid skillId);
        Task<Skills> SkillExists(string skillName);
        Task<bool> SkillExistWithId(Guid Id);
        Task<Dictionary<string, object>> DeleteSkill(Guid skillId);
        Task<bool> checkIfSkillIsAssigned(Guid skillId);
        Task<ServiceResponse<List<object>>> GetUserSkills(Guid skillId);

    }
}
