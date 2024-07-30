import { CertificationPayload } from "./certification.model";
import { EducationPayload } from "./education.model";
import { ExperiencePayload } from "./experience.model";
import { Pagination } from "./pagination.model";
import { ProjectPayload } from "./project.model";
import { SkillPayload } from "./skill.model";

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;

  securityQuestion: boolean;
  role: string;
  accountStatus: string;
  profileStatus: string;
}
export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  suspended: boolean;
  deleted: boolean;
  securityQuestion: boolean;
  role: string;
  accountStatus: string;
  profileStatus: string;
  educations: EducationPayload[];
  experiences: ExperiencePayload[];
  userProjects: ProjectPayload[];
  userSkills: SkillPayload[];
  certifications: CertificationPayload[];
}


export interface UserResponse{
  data: UserProfile[],
  pagination: Pagination,
}
export interface SingleUserResponse{
  data: UserProfile,
}