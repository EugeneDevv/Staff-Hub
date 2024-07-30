
using System.Globalization;

using Api.Database;
using Api.Models.Dtos;

using SendGrid;

using Serilog;

namespace Api.Services {
    public class ExperienceService : IExperience {
        private readonly AppDbContext _context;

        public ExperienceService(AppDbContext context) {
            _context = context;
            
        }

        public async Task<Dictionary<string, object>> DeleteExperience(Guid Id) {
            Dictionary<string, object> response = new Dictionary<string, object>();
            try {
                var existingExperience = await _context.Experiences.FirstOrDefaultAsync(ex => ex.Id == Id);

                if (existingExperience == null || existingExperience.IsDeleted==true) {
                    response.Add("message", "Experience with the given id does not exist");
                    response.Add("status", true);
                }
                else {
                    existingExperience.IsDeleted = true;
                    await _context.SaveChangesAsync();
                }
            }
            catch(Exception ex) {
                Log.Error("An Exception Occurred while deleting experience---->" + ex.Message); 

                response.Add("message", "Oops! Something went wrong while saving ");
                response.Add("status", false);
            }
            return response;
        }


        public DateOnly parseDate(DateTime date) {
            return new DateOnly(date.Year, date.Month, date.Day);
        }

        public async Task<bool> ExperienceExist(Guid experienceId) {

            try {
                return await _context.Experiences.AnyAsync(ex=>ex.Id == experienceId && ex.IsDeleted==false);
            }
            catch(Exception ex) {
                Log.Error("An Exception occurred while parsing date  .-------->" + ex.Message);
                return false;
            }
        }
    }
}
