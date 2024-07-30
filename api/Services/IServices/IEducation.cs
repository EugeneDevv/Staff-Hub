using Api.Models.Dtos;

namespace Api.Services.IServices {
    public interface IEducation {
        Task<Dictionary<string, object>> CreateEducation(Guid userId, List<EducationDTO> education);
    }
}
