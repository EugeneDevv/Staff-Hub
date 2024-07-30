using api.Models.Dtos.User;

using Api.Models.Dtos;
using Api.Models.Dtos.User;

namespace api.Mappers {
  public static class UserProfileMappers {
        public static GetUserDto ToGetUserDto(this User userModel) => new GetUserDto {
            UserId = userModel.UserId,
            FirstName = userModel.FirstName,
            LastName = userModel.LastName,
            Email = userModel.Email,
            PhoneNumber = userModel.PhoneNumber,
            Role = userModel.Role,
            Suspended = userModel.Suspended,
            Deleted = userModel.Deleted,
            AccountStatus = userModel.AccountStatus,
            Educations = userModel.Educations.Select(s => s.ToEducationProfileDto()).ToList(),
            UserSkills = userModel.UserSkills.Select(s => s.ToSkillProfileDto()).ToList(),
            UserProjects = userModel.UserProjectRoles.Select(s => s.ToProjectProfileDto()).ToList(),
            Experiences = userModel.Experiences.Select(s => s.ToExperienceProfileDto()).ToList(),
            Certifications = userModel.Certifications.Select(c => c.ToCertificationProfiletDto()).ToList(),

        };

        public static EducationProfileDto ToEducationProfileDto(this Education educationModel)
        {
            return new EducationProfileDto 
            {
                Id =educationModel.Id,
                AreaOfStudy = educationModel.AreaOfStudy,
                Institution = educationModel.Institution,
                LevelOfEducation = educationModel.LevelOfEducation,
                StartMonth = educationModel.StartMonth,
                StartYear = educationModel.StartYear,
                EndMonth = educationModel.EndMonth,
                EndYear = educationModel.EndYear,
                IsContinuing = educationModel.IsContinuing,
                UserId = educationModel.UserId,
            };
        }

        public static SkillProfileDto ToSkillProfileDto(this UserSkill skillModel)
        {
            return new SkillProfileDto 
            {
                SkillId = skillModel.SkillId,
                ProficiencyLevel = skillModel.ProficiencyLevel,
                UserId = skillModel.UserId,
                Name = skillModel.Skill.Name,

            };
        }

        public static ProjectProfileDto ToProjectProfileDto(this UserProjectRole projectModel)
        {
            return new ProjectProfileDto {
                ProjectId = projectModel.ProjectId,
                UserId = projectModel.UserId.ToString(),
                Name = projectModel.Projects?.ProjectName,
                ClientId = projectModel.Projects.ClientsId,
                ClientName = projectModel.Projects.Clients.ClientName,
                RoleId = projectModel.ProjectRoleId,
                RoleName = projectModel.ProjectRole.ProjectRoleName,
                StartMonth = projectModel.StartMonth,
                EndMonth = projectModel.EndMonth,
                StartYear = projectModel.StartYear,
                EndYear = projectModel.EndYear,
                IsContinuing = projectModel.IsContinuing,

            };
        }
        public static ExperienceProfileDto ToExperienceProfileDto(this Experience experienceModel) {
            return new ExperienceProfileDto {
                Id = experienceModel.Id,
                JobTitle = experienceModel.JobTitle,
                CompanyName = experienceModel.CompanyName,
                startMonth = experienceModel.startMonth,
                startYear = experienceModel.startYear,
                endMonth = experienceModel.endMonth,
                endYear = experienceModel.endYear,
                IsContinuing = experienceModel.IsOngoing,
                IsDeleted = experienceModel.IsDeleted,
                UserId = experienceModel.UserId,



            };
        }
        public static CertificationProfileDto ToCertificationProfiletDto(this Certification certificationModel) {

              Dictionary<string, List<string>> store = new Dictionary<string, List<string>>();

              store.

            return new CertificationProfileDto {
                Id = certificationModel.Id,
                Name = certificationModel.Name,
                Issuer = certificationModel.Issuer,
                Code = certificationModel.Code,
                IssueMonth = certificationModel.IssueMonth,
                IssueYear = certificationModel.IssueYear,
                ExpiryMonth = certificationModel.ExpiryMonth,
                ExpiryYear = certificationModel.ExpiryYear,
                CertificateLink = certificationModel.CertificateLink,
                IsDeleted = certificationModel.IsDeleted,
                IsOngoing = certificationModel.IsOngoing,
            };
        }
    }
}
