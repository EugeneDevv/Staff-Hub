using Api.Models.Entities;

using Microsoft.EntityFrameworkCore;

namespace Api.Database;

public class AppDbContext : DbContext, IAppDbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options) {}
    
  public DbSet<User> Users {get; set; }
    public DbSet<SecurityQuestion> SecurityQuestions { get; set; }
    public DbSet<SecurityAnswer> SecurityAnswers { get; set; }
    public DbSet<Education> Educations { get; set; }
    public DbSet<Experience> Experiences { get; set; }
    public DbSet<Clients> Clients { get; set; }
    public DbSet<Projects> Projects { get; set; }
    public DbSet<ProjectRole> ProjectRole { get; set; }
    public DbSet<UserProjectRole>UserProjectRoles { get; set; }
    public DbSet<Certification>Certifications { get; set; }
    public DbSet<Skills> Skills { get; set; }
    public DbSet<UserSkill> UserSkills { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder) {

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        modelBuilder.Entity<Clients>(entity => {
            entity.HasKey(c => c.ClientId);

            entity.Property(c => c.ClientId)
                  .UseIdentityAlwaysColumn();
            entity.HasData(
                new Clients { ClientId = 1, ClientName = "ACL" },
                new Clients { ClientId = 2, ClientName = "Howard" },
                new Clients { ClientId = 3, ClientName = "Chick-Fil-A" },
                new Clients { ClientId = 4, ClientName = "RAM" },
                new Clients { ClientId = 5, ClientName = "Internal Project" },
                new Clients { ClientId = 6, ClientName = "PRISIM" },
                new Clients { ClientId = 7, ClientName = "CelebriAI" }


            );
        });
        modelBuilder.Entity<SecurityQuestion>(entity => {

            entity.HasKey(c => c.QuestionId);

            entity.Property(c => c.QuestionId)
                  .UseIdentityAlwaysColumn();
            entity.HasData(
                new SecurityQuestion { QuestionId = 1, QuestionName = "What's your mother's Maiden name?" },
                 new SecurityQuestion { QuestionId = 2, QuestionName = "What's the name of your pet?" },
                  new SecurityQuestion { QuestionId = 3, QuestionName = "In which city were you born" },
                   new SecurityQuestion { QuestionId = 4, QuestionName = "Which high school did you attend" },
                    new SecurityQuestion { QuestionId = 5, QuestionName = "What was the name of your elementary school?" },
                     new SecurityQuestion { QuestionId = 6, QuestionName = "What was the make of your first car" },
                      new SecurityQuestion { QuestionId = 7, QuestionName = "What was your favorite food as a child?" }


            );
        });
            modelBuilder.Entity<Projects>(entity => {
            entity.HasKey(p => p.ProjectId);
            entity.Property(p => p.ProjectId).UseIdentityAlwaysColumn();
            entity.HasData(
                new Projects { ProjectId = 1, ProjectName = "DRB", ClientsId = 3 },
                new Projects { ProjectId = 2, ProjectName = "SC-MVP", ClientsId = 3 },
                new Projects { ProjectId = 3, ProjectName = "Data Exchange QA Automation", ClientsId = 3 },
                new Projects { ProjectId = 4, ProjectName = "PRISM HR", ClientsId = 6 },
                new Projects { ProjectId = 5, ProjectName = "Advisor Portal", ClientsId = 2 },
                new Projects { ProjectId = 6, ProjectName = "401K Optimizer", ClientsId = 2 },
                new Projects { ProjectId = 7, ProjectName = "TSP Optimizer", ClientsId = 2 },
                new Projects { ProjectId = 8, ProjectName = "HCM Fund Site", ClientsId = 2 },
                new Projects { ProjectId = 9, ProjectName = "ETFs Site", ClientsId = 2 },
                new Projects { ProjectId = 10, ProjectName = "Marketing Site", ClientsId = 2 },
                new Projects { ProjectId = 11, ProjectName = "Legacy", ClientsId = 1 },
                new Projects { ProjectId = 12, ProjectName = "Bot", ClientsId = 1 },
                new Projects { ProjectId = 13, ProjectName = "CAP", ClientsId = 1 },
                new Projects { ProjectId = 14, ProjectName = "File Tracker", ClientsId = 7 },
                new Projects { ProjectId = 15, ProjectName = "ATQ V2", ClientsId = 7 },
                new Projects { ProjectId = 16, ProjectName = "GER ", ClientsId = 5 }
               

                );
        });
        modelBuilder.Entity<ProjectRole>(entity => {
            entity.HasKey(p => p.ProjectRoleId);
            entity.Property(p=>p.ProjectRoleId).UseIdentityAlwaysColumn();
            entity.HasData(
                new ProjectRole { ProjectRoleId = 1, ProjectRoleName = "Developer" },
                new ProjectRole { ProjectRoleId = 2, ProjectRoleName = "Business Analyst" },
                new ProjectRole { ProjectRoleId = 3, ProjectRoleName = "QA/QE" },
                new ProjectRole { ProjectRoleId = 4, ProjectRoleName = "Scrum Master" },
                new ProjectRole { ProjectRoleId = 5, ProjectRoleName = "RPA Developer" },
                new ProjectRole { ProjectRoleId = 6, ProjectRoleName = "Solution Delivery Leader" },
                new ProjectRole { ProjectRoleId = 7, ProjectRoleName = "Solution Architect" }
                );
        });
        modelBuilder.Entity<Skills>(entity => {
            entity.HasKey(s => s.Id);
            entity.HasData(
                new Skills { Id = Guid.NewGuid(), Name = "Java" },
                new Skills { Id = Guid.NewGuid(), Name = "React" },
                new Skills { Id = Guid.NewGuid(), Name = "Python" },
                new Skills { Id = Guid.NewGuid(), Name = "Cypress" },
                new Skills { Id = Guid.NewGuid(), Name = "AWS-CCP" }

                );
        });
        modelBuilder.Entity<User>(entity => {
            entity.HasKey(s => s.UserId);
            entity.HasData(GetDummyUsers());
        });

        modelBuilder.Entity<Education>(entity => {
            entity.HasOne(e => e.User)
            .WithMany(u => u.Educations)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.NoAction);
            
            
        });

        modelBuilder.Entity<Experience>(entity => {
            entity.HasOne(e => e.User)
            .WithMany(u => u.Experiences)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.NoAction)
            .HasForeignKey(e => e.UserId);
        });
        modelBuilder.Entity<Certification>(entity => {
            entity.HasOne(c => c.User)
            .WithMany(u => u.Certifications)
            .HasForeignKey(e => e.userId)
            .OnDelete(DeleteBehavior.NoAction)
            .HasForeignKey(e => e.userId);
        });

        modelBuilder.Entity<UserProjectRole>()
       .HasKey(upr => new { upr.UserId, upr.ProjectId, upr. ProjectRoleId });

        modelBuilder.Entity<UserProjectRole>()
            .HasOne(upr => upr.User)
            .WithMany(u => u.UserProjectRoles)
            .HasForeignKey(upr => upr.UserId);

        modelBuilder.Entity<UserProjectRole>()
            .HasOne(upr => upr.Projects)
            .WithMany(p => p.UserProjectRoles)
            .HasForeignKey(upr => upr.ProjectId);

        modelBuilder.Entity<UserProjectRole>()
            .HasOne(upr => upr.ProjectRole)
            .WithMany(r=>r.UserProjectRoles)
            .HasForeignKey(upr => upr.ProjectRoleId);

        modelBuilder.Entity<UserSkill>(entity => {
            entity.HasKey(us => new { us.UserId, us.SkillId });

            entity.HasOne(us => us.User)
                .WithMany(u => u.UserSkills)
                .HasForeignKey(us => us.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(us => us.Skill)
              .WithMany(s => s.UserSkills)
              .HasForeignKey(us => us.SkillId)
              .OnDelete(DeleteBehavior.NoAction);
        });


    }
    private List<User> GetDummyUsers() {
        var users = new List<User>();
        var random = new Random();

        for (int i = 1; i <= 25; i++) {
            var firstName = GetRandomName(random);
            var lastName = GetRandomName(random);
            var email = $"user{i}@griffinglobaltech.com";
            var phoneNumber = "123-456-7890";
            var password = GenerateRandomPassword(random); 

            var user = new User {
                UserId = Guid.NewGuid(),
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                PhoneNumber = phoneNumber,
                Password = BCrypt.Net.BCrypt.HashPassword(password),
                SecurityQuestion = false,

                Role = "User",

                AccountStatus = "new",
                ProfileStatus = "pending",
                DateCreated = DateTime.UtcNow,
                DateUpdated = DateTime.UtcNow,
                Otp = 0,
                Suspended = false,
                Deleted = false,
                SuspensionReason = null
            };

            users.Add(user);
        }

        return users;
    }

    private string GenerateRandomPassword(Random random) {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return new string(Enumerable.Repeat(chars, 8)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
    private string GetRandomName(Random random) {
        string[] names = { "Alice", "Bob", "Charlie", "David", "Ella", "Frank", "Grace", "Henry", "Isabel", "Jack", "Kate", "Liam", "Mia", "Nathan", "Olivia", "Patrick", "Quinn", "Rachel", "Samuel", "Taylor", "Uma", "Victor", "Wendy", "Xavier", "Yara", "Zane" };
        return names[random.Next(names.Length)];
    }
}

