using Api.Models.Dtos;

namespace Api.Services.IServices {
    public interface IExperience {

        public Task <Dictionary<string, object>> DeleteExperience( Guid Id);

        public Task<bool> ExperienceExist( Guid experienceId );

    }
}
