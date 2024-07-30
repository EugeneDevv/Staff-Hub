using System.ComponentModel;
using System.Text.RegularExpressions;

using Api.Database;
using Api.Models.Dtos;
using Api.Models.Entities;
using Api.Services.IServices;
using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using SendGrid;
using Serilog;

namespace Api.Services {
    public class ProfileService : IprofileService {
        private readonly AppDbContext _context;

        public ProfileService(AppDbContext context) {
            _context = context;
        }

        public async Task<Dictionary<string, object>> CreateProfile(Guid userId, ProfileDTO profile) {
            Dictionary<string, object> response = new Dictionary<string, object>();


            var existingUser = await _context.Users.FirstOrDefaultAsync(user => user.UserId == userId);

            if (existingUser != null) {
                if (profile.Education != null) {
                    List<Education> educationData = new List<Education>();

                    foreach (var item in profile.Education) {
                        string? endMonth = "";
                        int? endYear = 0;

                        if (item.IsContinuing) {
                            endMonth = "";
                            endYear = 0;
                        }
                        else {
                            endMonth = item.EndMonth;
                            endYear = item.EndYear;

                            if (endYear < item.StartYear) {
                                response.Add("message", "End date cannot be less than start date");
                                response.Add("status", false);
                                return response;
                            }
                        }

                        if ((item.IsContinuing && item.EndYear != 0 && !string.IsNullOrEmpty(item.EndMonth)) ||
                            (!item.IsContinuing && item.EndYear == 0 && string.IsNullOrEmpty(item.EndMonth))) {

                            response.Add("message", "You must select one between end date and isOngoing.");

                            response.Add("status", false);
                            return response;

                        }

                        var newEducation = new Education {
                            AreaOfStudy = item.AreaOfStudy.Trim(),
                            Institution = item.Institution.Trim(),
                            StartMonth = item.StartMonth,
                            StartYear = item.StartYear,
                            EndMonth = endMonth,
                            EndYear = endYear,
                            LevelOfEducation = item.LevelOfEducation,
                            User = existingUser,
                            IsContinuing = item.IsContinuing

                        };
                        educationData.Add(newEducation);
                    }

                    _context.Educations.AddRange(educationData);
                    await _context.SaveChangesAsync();
                }

                if (profile.Contacts != null) {
                    string? phoneNumber = profile.Contacts.PhoneNumber;

                    existingUser.FirstName = profile.Contacts.FirstName.Trim();
                    existingUser.LastName = profile.Contacts.LastName.Trim();
                    if (phoneNumber != null) {
                        existingUser.PhoneNumber = phoneNumber;
                    }

                    await _context.SaveChangesAsync();

                }
                if (profile.Experience != null) {
                    List<Experience> experienceData = new List<Experience>();
                    foreach (var experience in profile.Experience) {

                        string? endMonth = "";
                        int? endYear = 0;

                        if (experience.IsContinuing) {
                            endMonth = "";
                            endYear = 0;
                        }
                        else {
                            endMonth = experience.EndMonth;
                            endYear = experience.EndYear;

                            if (endYear < experience.StartYear) {
                                response.Add("message", "End date cannot be less than start date");
                                response.Add("status", false);
                                return response;
                            }
                        }

                        if (experience.JobTitle.IsNullOrEmpty()) {
                            response.Add("message", "Job title cannot be empty!");
                            response.Add("status", false);
                            return response;
                        }
                        if (experience.CompanyName.IsNullOrEmpty()) {
                            response.Add("message", "Company name cannot be empty!");
                            response.Add("status", false);
                            return response;
                        }

                        if ((experience.IsContinuing && experience.EndYear != 0 && !string.IsNullOrEmpty(experience.EndMonth)) ||
                            (!experience.IsContinuing && experience.EndYear == 0 && string.IsNullOrEmpty(experience.EndMonth))) {

                            response.Add("message", "You must select one between end date and isOngoing.");

                            response.Add("status", false);
                            return response;

                        }


                        var newExperience = new Experience {
                            JobTitle = experience.JobTitle,
                            CompanyName = experience.CompanyName,
                            startMonth = experience.StartMonth,
                            startYear = experience.StartYear,
                            endMonth = experience.EndMonth,
                            endYear = experience.EndYear,
                            User = existingUser,
                            IsOngoing = experience.IsContinuing,

                        };

                        experienceData.Add(newExperience);

                    }
                    await _context.Experiences.AddRangeAsync(experienceData);
                    await _context.SaveChangesAsync();
                }
                if (profile.Project != null) {
                    List<UserProjectRole> userProjects = new List<UserProjectRole>();
                    foreach (var project in profile.Project) {

                        string? endMonth = "";
                        int? endYear = 0;

                        if (project.IsContinuing) {
                            endMonth = "";
                            endYear = 0;
                        }
                        else {
                            endMonth = project.EndMonth;
                            endYear = project.EndYear;

                            if (endYear < project.StartYear) {
                                response.Add("message", "End date cannot be less than start date");
                                response.Add("status", false);
                                return response;
                            }
                        }
                        if ((project.IsContinuing && project.EndYear != 0 && !string.IsNullOrEmpty(project.EndMonth)) ||
                        (!project.IsContinuing && project.EndYear == 0 && string.IsNullOrEmpty(project.EndMonth))) {

                            response.Add("message", "You must select one between end date and isOngoing.");

                            response.Add("status", false);
                            return response;

                        }

                        if (project.StartMonth.IsNullOrEmpty() || project.StartYear == null || project.StartYear <= 0) {
                            response.Add("message", "Start date is required");
                            response.Add("status", false);
                            return response;
                        }
                        var userProjectRole = new UserProjectRole {
                            UserId = project.UserId,
                            ProjectRoleId = project.RoleId,
                            ProjectId = project.ProjectId,
                            StartMonth = project.StartMonth,
                            StartYear = project.StartYear,
                            EndMonth = endMonth,
                            EndYear = endYear

                        };
                        userProjects.Add(userProjectRole);

                    }
                    await _context.AddRangeAsync(userProjects);
                    await _context.SaveChangesAsync();
                }

                if (profile.Skills != null) {
                    List<UserSkill> skills = new List<UserSkill>();

                    foreach (var skill in profile.Skills) {
                        var existingSkill = await _context.Skills.FirstOrDefaultAsync(sk => sk.Id == skill.SkillId);
                        var user = await _context.Users.FirstOrDefaultAsync(user => user.UserId == userId);
                        string skillName;
                        if (skill.SkillId == Guid.Empty || !skill.SkillId.HasValue) {

                            if (skill.Name.IsNullOrEmpty()) {

                                response.Add("message", "Skill name cannot be empty");
                                response.Add("status", false);
                                return response;
                            }
                            var existingSkillName = await _context.Skills.FirstOrDefaultAsync(sk => sk.Name.ToLower().Equals(skill.Name!.ToLower()));
                            if (existingSkillName != null) {
                                response.Add("message", "Skill already exist");
                                response.Add("status", false);
                                return response;
                            }
                            var newSkill = new Skills {
                                Name = skill.Name!
                            };

                            await _context.AddAsync(newSkill);
                            await _context.SaveChangesAsync();

                            skillName = skill.Name!;

                            var addedSkill = await _context.Skills.FirstOrDefaultAsync(sk => sk.Name.ToLower().Equals(skill.Name!.ToLower()));
                            var userSkill = new UserSkill {
                                UserId = user.UserId,
                                SkillId = addedSkill.Id,
                                ProficiencyLevel = skill.ProficiencyLevel
                            };
                            skills.Add(userSkill);
                        }
                        else {

                            if (existingSkill != null && user != null) {

                                //check if the skill for this user has been already exist
                                var existingUserSkill = await _context.UserSkills.AnyAsync(us => us.UserId == skill.UserId && us.SkillId == skill.SkillId);
                                if (existingUserSkill) {
                                    response.Add("message", "Skill already exist!");
                                    response.Add("status", false);
                                    return response;
                                }
                                var userSkill = new UserSkill {
                                    UserId = user.UserId,
                                    SkillId = existingSkill.Id,
                                    ProficiencyLevel = skill.ProficiencyLevel
                                };
                                skills.Add(userSkill);
                            }
                            else {
                                response.Add("message", "User or skills with the given id does not exist!");
                                response.Add("status", false);
                                return response;
                            }
                        }
                    }
                    await _context.AddRangeAsync(skills);
                    await _context.SaveChangesAsync();
                }
                if (profile.Certification != null) {
                    List<Certification> certificationData = new List<Certification>();
                    foreach (var certification in profile.Certification) {

                        string? endMonth = "";
                        int? endYear = 0;

                        if (certification.IsOngoing) {
                            endMonth = "";
                            endYear = 0;
                        }
                        else {
                            endMonth = certification.ExpiryMonth;
                            endYear = certification.IssueYear;
                            if (endYear < certification.IssueYear) {
                                response.Add("message", "End date cannot be less than start date");
                                response.Add("status", false);
                            }

                            if ((!certification.IsOngoing && (certification.ExpiryYear == 0 || certification.ExpiryMonth.IsNullOrEmpty())) ||
                                (certification.IsOngoing && (certification.ExpiryYear != 0 || !certification.ExpiryMonth.IsNullOrEmpty()))) {

                                response.Add("message", "You must select one between expiry date and isOngoing for certification.");
                                response.Add("status", false);
                                return response;

                            }
                            if (certification.Name.IsNullOrEmpty()) {
                                response.Add("message", "Name cannot be empty!");
                                response.Add("status", false);
                                return response;
                            }

                            if (certification.Issuer.IsNullOrEmpty()) {
                                response.Add("message", "Issuer cannot be empty!");
                                response.Add("status", false);
                                return response;
                            }
                            if (certification.Name!.Length < 2) {
                                response.Add("message", "Name should have a minimum of 2 characters");
                                response.Add("status", false);
                                return response;
                            }
                            var newCertification = new Certification {
                                Name = certification.Name,
                                Issuer = certification.Issuer,
                                Code = certification.Code,
                                IssueMonth = certification.IssueMonth,
                                IssueYear = certification.IssueYear,
                                ExpiryMonth = certification.ExpiryMonth,
                                ExpiryYear = certification.ExpiryYear,
                                CertificateLink = certification.CertificateLink,
                                User = existingUser
  
                            };

                            certificationData.Add(newCertification);

                        }
                        await _context.Certifications.AddRangeAsync(certificationData);
                        await _context.SaveChangesAsync();
                    }

                }
                existingUser.ProfileStatus = "completed";
                await _context.SaveChangesAsync();

                response.Add("message", "Profile details saved successfully");
                response.Add("status", true);
                return response;

            }
            else {
                response.Add("message", "User with the given id does not exist");
                response.Add("status", false);
                return response;
            }



        }

        public async Task<MessageResponse> UpdateProfile(Guid userId, ProfileDTO profile) {
            Dictionary<string, object> response = new Dictionary<string, object>();

            var existingUser = await _context.Users.FirstOrDefaultAsync(user => user.UserId == userId);

            if (existingUser != null) {
                if (profile.Education != null) {
                    List<Education> educationData = new List<Education>();

                    foreach (var item in profile.Education) {
                        if (item.Id != null) {
                            var existingEducation = await _context.Educations.FirstOrDefaultAsync(edu => edu.Id == item.Id);
                            if (existingEducation == null) {
                                return new MessageResponse { Code = 404, Message = "Education with the given id does not exist", Status = false };

                            }
                            string? updateEndMonth = "";
                            int? updateEndYear = 0;

                            if (item.IsContinuing) {
                                updateEndMonth = "";
                                updateEndYear = 0;
                            }
                            else {
                                updateEndMonth = item.EndMonth;
                                updateEndYear = item.EndYear;

                                if (updateEndYear < item.StartYear) {
                                    return new MessageResponse { Code = 400, Message = "End date cannot be less than start date", Status = false };
                                }
                            }

                            if ((item.IsContinuing && item.EndYear != 0 && !string.IsNullOrEmpty(item.EndMonth)) ||
                                (!item.IsContinuing && item.EndYear == 0 && string.IsNullOrEmpty(item.EndMonth))) {
                                return new MessageResponse { Code = 400, Message = "You must select one between end date and isOngoing", Status = false };


                            }


                            existingEducation.AreaOfStudy = item.AreaOfStudy.Trim();
                            existingEducation.Institution = item.Institution.Trim();
                            existingEducation.StartMonth = item.StartMonth;
                            existingEducation.StartYear = item.StartYear;
                            existingEducation.EndMonth = updateEndMonth;
                            existingEducation.EndYear = updateEndYear;
                            existingEducation.LevelOfEducation = item.LevelOfEducation;
                            existingEducation.User = existingUser;
                            existingEducation.IsContinuing = item.IsContinuing;

                        }
                        else {
                            string? endMonth = "";
                            int? endYear = 0;

                            if (item.IsContinuing) {
                                endMonth = "";
                                endYear = 0;
                            }
                            else {
                                endMonth = item.EndMonth;
                                endYear = item.EndYear;

                                if (endYear < item.StartYear) {
                                    return new MessageResponse { Code = 400, Message = "End date cannot be less than start date", Status = false };
                                }
                            }

                            if ((item.IsContinuing && item.EndYear != 0 && !string.IsNullOrEmpty(item.EndMonth)) ||
                                (!item.IsContinuing && item.EndYear == 0 && string.IsNullOrEmpty(item.EndMonth))) {
                                return new MessageResponse { Code = 400, Message = "You must select one between end date and isOngoing", Status = false };


                            }

                            var newEducation = new Education {
                                AreaOfStudy = item.AreaOfStudy.Trim(),
                                Institution = item.Institution.Trim(),
                                StartMonth = item.StartMonth,
                                StartYear = item.StartYear,
                                EndMonth = endMonth,
                                EndYear = endYear,
                                LevelOfEducation = item.LevelOfEducation,
                                User = existingUser,
                                IsContinuing = item.IsContinuing

                            };
                            educationData.Add(newEducation);
                        }
                    }


                    _context.Educations.AddRange(educationData);
                    await _context.SaveChangesAsync();
                }

                if (profile.Contacts != null) {
                    string? phoneNumber = profile.Contacts.PhoneNumber;

                    existingUser.FirstName = profile.Contacts.FirstName.Trim();
                    existingUser.LastName = profile.Contacts.LastName.Trim();
                    if (phoneNumber != null) {
                        existingUser.PhoneNumber = phoneNumber;
                    }

                    await _context.SaveChangesAsync();

                }
                if (profile.Experience != null) {
                    List<Experience> experienceData = new List<Experience>();
                    foreach (var experience in profile.Experience) {
                        if (experience.Id != null) {
                            var existingExperience = await _context.Experiences.FirstOrDefaultAsync(ex => ex.Id == experience.Id);
                            if (existingExperience == null) {
                                return new MessageResponse { Code = 404, Message = "Experience with the given id does not exist", Status = false };
                            }

                            string? updateEndMonth = "";
                            int? updateEndYear = 0;

                            if (experience.IsContinuing) {
                                updateEndMonth = "";
                                updateEndYear = 0;
                            }
                            else {
                                updateEndMonth = experience.EndMonth;
                                updateEndYear = experience.EndYear;

                                if (updateEndYear < experience.StartYear) {
                                    return new MessageResponse { Code = 400, Message = "End date cannot be less than start date", Status = false };

                                }
                            }

                            if (experience.JobTitle.IsNullOrEmpty()) {
                                return new MessageResponse { Code = 400, Message = "Job Title cannot be null", Status = false };
                            }
                            if (experience.CompanyName.IsNullOrEmpty()) {
                                return new MessageResponse { Code = 400, Message = "Company cannot be null", Status = false };

                            }

                            if ((experience.IsContinuing && experience.EndYear != 0 && !string.IsNullOrEmpty(experience.EndMonth)) ||
                                (!experience.IsContinuing && experience.EndYear == 0 && string.IsNullOrEmpty(experience.EndMonth))) {
                                return new MessageResponse { Code = 400, Message = "End date cannot be less than start date", Status = false };


                            }

                            existingExperience.JobTitle = experience.JobTitle;
                            existingExperience.CompanyName = experience.CompanyName;
                            existingExperience.startMonth = experience.StartMonth;
                            existingExperience.startYear = experience.StartYear;
                            existingExperience.endMonth = experience.EndMonth;
                            existingExperience.endYear = experience.EndYear;
                            existingExperience.User = existingUser;
                            existingExperience.IsOngoing = experience.IsContinuing;

                        }
                        else {
                            string? endMonth = "";
                            int? endYear = 0;

                            if (experience.IsContinuing) {
                                endMonth = "";
                                endYear = 0;
                            }
                            else {
                                endMonth = experience.EndMonth;
                                endYear = experience.EndYear;


                                if (endYear < experience.StartYear) {
                                    return new MessageResponse { Code = 400, Message = "End date cannot be less than start date", Status = false };

                                }
                            }

                            if (experience.JobTitle.IsNullOrEmpty()) {
                                return new MessageResponse { Code = 400, Message = "Job Title cannot be null", Status = false };
                            }
                            if (experience.CompanyName.IsNullOrEmpty()) {
                                return new MessageResponse { Code = 400, Message = "Company cannot be null", Status = false };

                            }

                            if ((experience.IsContinuing && experience.EndYear != 0 && !string.IsNullOrEmpty(experience.EndMonth)) ||
                                (!experience.IsContinuing && experience.EndYear == 0 && string.IsNullOrEmpty(experience.EndMonth))) {
                                return new MessageResponse { Code = 400, Message = "You must select one between end date and isOngoing", Status = false };


                            }


                            var newExperience = new Experience {
                                JobTitle = experience.JobTitle,
                                CompanyName = experience.CompanyName,
                                startMonth = experience.StartMonth,
                                startYear = experience.StartYear,
                                endMonth = experience.EndMonth,
                                endYear = experience.EndYear,
                                User = existingUser,
                                IsOngoing = experience.IsContinuing,

                            };

                            experienceData.Add(newExperience);
                            await _context.Experiences.AddAsync(newExperience);
                        }    
                }
                    await _context.SaveChangesAsync();
            }
            if (profile.Project != null) {
                List<UserProjectRole> userProjects = new List<UserProjectRole>();
                    List<UserProjectRole> userprojects = new List<UserProjectRole>();

                    foreach (var project in profile.Project) {
                            var existingProject =  _context.UserProjectRoles.Where(pr => pr.UserId == project.UserId).ToList();

                                using (var transaction = _context.Database.BeginTransaction()) {

                                     _context.RemoveRange(existingProject);

                                    string? endMonth = "";
                                    int? endYear = 0;

                                    if (project.IsContinuing) {
                                        endMonth = "";
                                        endYear = 0;
                                    }
                                    else {
                                        endMonth = project.EndMonth;
                                        endYear = project.EndYear;

                                        if (endYear < project.StartYear) {
                                            return new MessageResponse { Code = 400, Message = "End date cannot be less than start date", Status = false };

                                        }
                                    }
                                    if ((project.IsContinuing && project.EndYear != 0 && !string.IsNullOrEmpty(project.EndMonth)) ||
                                    (!project.IsContinuing && project.EndYear == 0 && string.IsNullOrEmpty(project.EndMonth))) {
                                        return new MessageResponse { Code = 400, Message = "You must select one between end date and isOngoing", Status = false };

                                    }

                                    if (project.StartMonth.IsNullOrEmpty() || project.StartYear == null || project.StartYear <= 0) {
                                        return new MessageResponse { Code = 400, Message = "Start date is required", Status = false };

                                    }
                                var userProjectRole = new UserProjectRole {
                                    UserId = project.UserId,
                                    ProjectRoleId = project.RoleId,
                                    ProjectId = project.ProjectId,
                                    StartMonth = project.StartMonth,
                                    StartYear = project.StartYear,
                                    EndMonth = endMonth,
                                    EndYear = endYear
                                };

                                userProjects.Add(userProjectRole);

                                transaction.Commit();
                                }
                            

                }
                await _context.UserProjectRoles.AddRangeAsync(userProjects);
                await _context.SaveChangesAsync();
            }

            if (profile.Skills != null) {
                List<UserSkill> skills = new List<UserSkill>();

                foreach (var skill in profile.Skills) {
                    var existingSkill = await _context.Skills.FirstOrDefaultAsync(sk => sk.Id == skill.SkillId);

                    var user = await _context.Users.FirstOrDefaultAsync(user => user.UserId == userId);
                    string skillName;

                    var userSkills = await _context.UserSkills.Where(us => us.UserId == skill.UserId).ToListAsync();

                    if (skill.SkillId == Guid.Empty || !skill.SkillId.HasValue) {

                        if (skill.Name.IsNullOrEmpty()) {
                            return new MessageResponse { Code = 400, Message = "Skill Name cannot be empty", Status = false };

                        }
                        var existingSkillName = await _context.Skills.FirstOrDefaultAsync(sk => sk.Name.ToLower().Equals(skill.Name!.ToLower()));
                        if (existingSkillName != null) {
                            return new MessageResponse { Code = 409, Message = "skill already exists", Status = false };


                        }
                        var newSkill = new Skills {
                            Name = skill.Name!
                        };

                        await _context.AddAsync(newSkill);
                        await _context.SaveChangesAsync();

                        skillName = skill.Name!;

                        var addedSkill = await _context.Skills.FirstOrDefaultAsync(sk => sk.Name.ToLower().Equals(skill.Name!.ToLower()));
                        var userSkill = new UserSkill {
                            UserId = user.UserId,
                            SkillId = addedSkill.Id,
                            ProficiencyLevel = skill.ProficiencyLevel
                        };
                        skills.Add(userSkill);
                    }
                    else {

                        if (existingSkill != null && user != null) {
                                using (var transaction = _context.Database.BeginTransaction()) {

                                    _context.RemoveRange(userSkills);
                                    var userSkill = new UserSkill {
                                        UserId = user.UserId,
                                        SkillId = existingSkill.Id,
                                        ProficiencyLevel = skill.ProficiencyLevel
                                    };
                                    skills.Add(userSkill);

                                    transaction.Commit();
                                }

                        }
                        else {
                            return new MessageResponse { Code = 404, Message = "User or skills with the given id does not exist", Status = false };


                        }
                    }
                }
                await _context.AddRangeAsync(skills);
                await _context.SaveChangesAsync();
            }
            if (profile.Certification != null) {
                List<Certification> certificationData = new List<Certification>();
                foreach (var certification in profile.Certification) {
                        if (certification.Id != null) {
                            var existingCertification = await _context.Certifications.FirstOrDefaultAsync(cert => cert.Id == certification.Id);
                            if (existingCertification == null) {
                                return new MessageResponse { Code = 404, Message = "Certification with the given id does not exist", Status = false };

                            }
                            string? updateEndMonth = "";
                            int? updateEndYear = 0;

                            if (certification.IsOngoing) {
                                updateEndMonth = "";
                                updateEndYear = 0;
                            }
                            else {
                                updateEndMonth = certification.ExpiryMonth;
                                updateEndYear = certification.IssueYear;
                                if (updateEndYear < certification.IssueYear) {
                                    return new MessageResponse { Code = 400, Message = "End date cannot be less than start date", Status = false };

                                }
                            }

                                if ((!certification.IsOngoing && (certification.ExpiryYear == 0 || certification.ExpiryMonth.IsNullOrEmpty())) ||
                                    (certification.IsOngoing && (certification.ExpiryYear != 0 || !certification.ExpiryMonth.IsNullOrEmpty()))) {
                                    return new MessageResponse { Code = 400, Message = "You must select one between end date and isOngoing for certification", Status = false };


                                }
                                if (certification.Name.IsNullOrEmpty()) {
                                    return new MessageResponse { Code = 400, Message = "Name cannot be empty", Status = false };

                                }

                                if (certification.Issuer.IsNullOrEmpty()) {
                                    return new MessageResponse { Code = 400, Message = "Issuer cannot be empty", Status = false };

                                }
                                if (certification.Name!.Length < 2) {
                                    return new MessageResponse { Code = 400, Message = "Name should have a minimum of 2 characters", Status = false };

                                }

                                existingCertification.Name = certification.Name;
                                existingCertification.Issuer = certification.Issuer;
                                existingCertification.Code = certification.Code;
                                existingCertification.IssueMonth = certification.IssueMonth;
                                existingCertification.IssueYear = certification.IssueYear;
                                existingCertification.ExpiryMonth = certification.ExpiryMonth;
                                existingCertification.ExpiryYear = certification.ExpiryYear;
                                existingCertification.CertificateLink = certification.CertificateLink;
                                existingCertification.User = existingUser;

                            
                            Log.Information("=========================Saving existing information======================");
                            await _context.SaveChangesAsync();
                        }
                        else {
                            string? endMonth = "";
                            int? endYear = 0;

                            if (certification.IsOngoing) {
                                endMonth = "";
                                endYear = 0;
                            }
                            else {
                                endMonth = certification.ExpiryMonth;
                                endYear = certification.ExpiryYear;
                                if (endYear < certification.IssueYear) {
                                    return new MessageResponse { Code = 400, Message = "End date cannot be less than start date", Status = false };

                                }
                            }

                                if ((!certification.IsOngoing && certification.ExpiryYear == 0 && certification.ExpiryMonth.IsNullOrEmpty()) ||
                                    (certification.IsOngoing && certification.ExpiryYear != 0 && !certification.ExpiryMonth.IsNullOrEmpty())) {
                                    return new MessageResponse { Code = 400, Message = "You must select one between end date and isOngoing for certification", Status = false };


                                }

                                if (certification.Name.IsNullOrEmpty()) {
                                    return new MessageResponse { Code = 400, Message = "Name cannot be empty", Status = false };

                                }

                                if (certification.Issuer.IsNullOrEmpty()) {
                                    return new MessageResponse { Code = 400, Message = "Issuer cannot be empty", Status = false };

                                }
                                if (certification.Name!.Length < 2) {
                                    return new MessageResponse { Code = 400, Message = "Name should have a minimum of 2 characters", Status = false };
                                }
                                var newCertification = new Certification {
                                    Name = certification.Name,
                                    Issuer = certification.Issuer,
                                    Code = certification.Code,
                                    IssueMonth = certification.IssueMonth,
                                    IssueYear = certification.IssueYear,
                                    ExpiryMonth = certification.ExpiryMonth,
                                    ExpiryYear = certification.ExpiryYear,
                                    CertificateLink = certification.CertificateLink,
                                    User = existingUser,
                                    IsOngoing = certification.IsOngoing
                                    

                                };

                                certificationData.Add(newCertification);

                            

                        }


                    }

                    await _context.Certifications.AddRangeAsync(certificationData);
                    await _context.SaveChangesAsync();


                }
            existingUser.ProfileStatus = "completed";
            await _context.SaveChangesAsync();

            return new MessageResponse { Code = 200, Message = "Profile data updated successfully", Status = true };


        }
    
            else {
                return new MessageResponse { Code = 404, Message = "User with the given id does not exist", Status = false };

            }

        }

        public DateOnly parseDate(DateTime date) {
            return new DateOnly(date.Year, date.Month, date.Day);
        }

        public async Task<bool> UserExist(Guid userId) {
            try {
               return await _context.Users.AnyAsync(user => user.UserId == userId);
            }
            catch {
                return false;
            }

        }

        public async Task<bool> validateExistingPhone(string? phone) {
            return  await _context.Users.AnyAsync(u => u.PhoneNumber == phone);
         
        }

        public  bool validatePhoneLength(string? phone) {
            if (phone.Length < 10 || phone.Length > 15) {
                return false;
            }
            return true;

        }

    }
}
