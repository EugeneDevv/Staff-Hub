
using Api.Database;
using Api.Models.Dtos;
using Api.Models.Entities;

using Serilog;

namespace Api.Services {

    public class EducationService : IEducation {
        private readonly AppDbContext _context;

        public EducationService(AppDbContext context) {
            _context = context;
        }
        public Task<Dictionary<string, object>> CreateEducation(Guid userId, List<EducationDTO> education) {

            return  null;
        }

        public DateOnly parseDate(DateTime date) {
            return new DateOnly(date.Year, date.Month, date.Day);
        }
    }
}
