using Microsoft.EntityFrameworkCore;
using Api.Models;
using Api.Models.Entities;

namespace Api.Database;
public interface IAppDbContext {
  DbSet<User> Users { get; set; }
    DbSet<SecurityQuestion> SecurityQuestions { get; set; }
    public DbSet<SecurityAnswer> SecurityAnswers { get; set; }
    public DbSet<Education> Educations { get; set; }
    public DbSet<Experience> Experiences { get; set; }
    public DbSet<Clients> Clients { get; set; }
    public DbSet<Projects> Projects { get; set; }
    public DbSet<ProjectRole> ProjectRole { get; set; }
    public DbSet<Certification> Certifications { get; set; }
    public DbSet<Skills> Skills { get; set; }
    public DbSet<UserSkill> UserSkills { get; set; }

}
