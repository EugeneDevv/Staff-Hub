import {
  Certification,
  CertificationPayload,
} from "../models/certification.model";
import { Education, EducationPayload } from "../models/education.model";
import { Experience, ExperiencePayload } from "../models/experience.model";
import { ProjectData, ProjectPayload } from "../models/project.model";
import { SkillPayload } from "../models/skill.model";
import { User, UserProfile } from "../models/user.model";

export const checkPasswordStrength = (password: string): string | null => {
  if (password.length == 0) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password should be at least 8 characters";
  }

  /* eslint-disable no-useless-escape */

  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
    password
  );

  const hasNumber = /\d/.test(password);
  const hasLowercase = /[a-z]+/.test(password);
  const hasUppercase = /[A-Z]+/.test(password);
  /* eslint-enable no-useless-escape */

  if (!hasSpecialChar || !hasNumber || !hasLowercase || !hasUppercase) {
    return "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character";
  }

  return null;
};

export const getUser = (): User | null => {
  let user: User | UserProfile | null = null;

  try {
    user = JSON.parse(localStorage.getItem("user") ?? localStorage.getItem("userProfile") ?? "{}");
  } catch (e) {
    console.log(e);
  }

  return user;
};

export const getSelectedTabTitle = (
  route: string,
  isAdmin: boolean
): string => {
  switch (route) {
    case "/projects":
      return "Projects";
    case "/skills":
      return "Skills";
    case "/roles":
      return "Roles";
    default:
      return isAdmin ? "Employees" : "Team";
  }
};
export const getSelectedTabRoute = (tab: string): string => {
  switch (tab) {
    case "Projects":
      return "/projects";
    case "Skills":
      return "/skills";
    case "Roles":
      return "/roles";
    default:
      return "/home";
  }
};

export const getMonthFromNumber = (month: number): string => {
  switch (month) {
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
    default:
      return "";
  }
};

export const getMonthNumFromString = (month: string): string => {
  switch (month) {
    case "January":
      return "01";
    case "February":
      return "02";
    case "March":
      return "03";
    case "April":
      return "04";
    case "May":
      return "05";
    case "June":
      return "06";
    case "July":
      return "07";
    case "August":
      return "08";
    case "September":
      return "09";
    case "October":
      return "10";
    case "November":
      return "11";
    case "December":
      return "12";
    default:
      return "01"; // Default to January if month string is invalid
  }
};


export const educationToDTO = (
  educationList: Education[]
): EducationPayload[] => {
  const educationPayloadList: EducationPayload[] = [];

  for (let i = 0; i < educationList.length; i++) {
    const isContinuing = educationList[i].isContinuing;
    const endDate = educationList[i].endDate;
    const tempEducationPayload: EducationPayload = {
      id: educationList[i]?.id ?? null,
      areaOfStudy: educationList[i].areaOfStudy,
      institution: educationList[i].institution,
      levelOfEducation: educationList[i].levelOfEducation,
      endMonth: isContinuing
        ? null
        : getMonthFromNumber(parseInt(endDate?.split("-")[1] ?? "0")),
      endYear: isContinuing ? null : parseInt(endDate?.split("-")[0] ?? "0"),
      isContinuing: isContinuing,
    };
    educationPayloadList.push(tempEducationPayload);
  }

  return educationPayloadList;
};

export const experienceToDTO = (
  experienceDetails: Experience[]
): ExperiencePayload[] => {
  const experiencePayloadList: ExperiencePayload[] = [];
  for (let i = 0; i < experienceDetails.length; i++) {
    const isContinuing = experienceDetails[i].isContinuing;
    const startDate = experienceDetails[i].startDate;
    const endDate = experienceDetails[i].endDate;
    const tempExperiencePayload: ExperiencePayload = {
      id: experienceDetails[i]?.id ?? null,
      jobTitle: experienceDetails[i].jobTitle,
      companyName: experienceDetails[i].companyName,
      startMonth: getMonthFromNumber(parseInt(startDate.split("-")[1])),
      startYear: parseInt(startDate.split("-")[0]),
      endMonth: isContinuing
        ? null
        : getMonthFromNumber(parseInt(endDate?.split("-")[1] ?? "0")),
      endYear: isContinuing ? null : parseInt(endDate?.split("-")[0] ?? "0"),
      isContinuing: isContinuing,
    };
    experiencePayloadList.push(tempExperiencePayload);
  }

  return experiencePayloadList;
};

export const certifiCationToDTO = (
  certificationDetails: Certification[]
): CertificationPayload[] => {
  const certificationPayloadList: CertificationPayload[] = [];
  for (let i = 0; i < certificationDetails.length; i++) {
    if (certificationHasData(certificationDetails[i])) {
      const isContinuing = certificationDetails[i].isContinuing;
      const startDate = certificationDetails[i].issueDate;
      const endDate = certificationDetails[i].expiryDate;
      const tempCertificationPayload: CertificationPayload = {
        id: certificationPayloadList[i]?.id ?? null,
        name: certificationDetails[i].certificateName,
        issuer: certificationDetails[i].issuer,
        code: certificationDetails[i].code,
        certificateLink: certificationDetails[i].certificateLink,
        issueMonth: getMonthFromNumber(parseInt(startDate.split("-")[1])),
        issueYear: parseInt(startDate.split("-")[0]),
        expiryMonth: isContinuing
          ? null
          : getMonthFromNumber(parseInt(endDate?.split("-")[1] ?? "0")),
        expiryYear: isContinuing
          ? null
          : parseInt(endDate?.split("-")[0] ?? "0"),
        isOngoing: isContinuing,
      };
      certificationPayloadList.push(tempCertificationPayload);
    }
  }

  return certificationPayloadList;
};
export const projectDataToDTO = (
  projectData: ProjectData[]
): ProjectPayload[] => {
  const projectPayloadList: ProjectPayload[] = [];
  for (let i = 0; i < projectData.length; i++) {
    if (projectHasData(projectData[i])) {
      const isContinuing = projectData[i].isContinuing;
      const startDate = projectData[i].startDate;
      const endDate = projectData[i].endDate;
      const tempProjectPayload: ProjectPayload = {
        id: projectData[i].project.projectId,
        name: projectData[i].project.projectName,
        projectId: projectData[i].project.projectId,
        clientId: projectData[i].client.clientId,
        roleId: projectData[i].role.projectRoleId,
        roleName: projectData[i].role.projectRoleName,
        userId: getUser()?.userId ?? "",
        clientName: projectData[i].client.clientName,
        startMonth: getMonthFromNumber(parseInt(startDate.split("-")[1])),
        startYear: parseInt(startDate.split("-")[0]),
        endMonth: isContinuing
          ? null
          : getMonthFromNumber(parseInt(endDate?.split("-")[1] ?? "0")),
        endYear: isContinuing ? null : parseInt(endDate?.split("-")[0] ?? "0"),
        isContinuing: isContinuing,
      };
      projectPayloadList.push(tempProjectPayload);
    }
  }

  return projectPayloadList;
};

export const certificationHasData = (cert: Certification): boolean => {
  return (
    cert.certificateName.trim().length > 1 ||
    cert.issuer.trim().length > 1 ||
    cert.issueDate.trim().length > 1 ||
    cert.expiryDate.trim().length > 1 ||
    cert.certificateLink.trim().length > 1 ||
    cert.isContinuing ||
    cert.code.trim().length > 1
  );
};
export const projectHasData = (project: ProjectData): boolean => {
  return (
    project.client.clientId !== 0 ||
    project.startDate.trim().length > 1 ||
    project.endDate.trim().length > 1 ||
    project.project.projectId !== 0 ||
    project.isContinuing ||
    project.role.projectRoleId !== 0
  );
};

export const summarizeSkills = (skills: SkillPayload[]): string[] => {
  const tempSkills: string[] = [];

  for (let i = 0; i < skills.length; i++) {
    if (skills[i].name.trim().length > 0) {
      tempSkills.push(skills[i].name);
    }
  }

  if (tempSkills.length > 3) {
    const trimmedSkills: string[] = tempSkills.slice(0, 3);

    const extraSkills = tempSkills.length - 3;

    trimmedSkills.push(`+${extraSkills}`);
    return trimmedSkills;
  }
  return tempSkills;
};

export const summarizeProjects = (skills: ProjectPayload[]): string[] => {
  const tempSkills: string[] = [];

  for (let i = 0; i < skills.length; i++) {
    if (skills[i].name.trim().length > 0) {
      tempSkills.push(skills[i].name);
    }
  }

  if (tempSkills.length > 1) {
    const trimmedSkills: string[] = tempSkills.slice(0, 1);

    const extraSkills = tempSkills.length - 1;

    trimmedSkills.push(`+${extraSkills}`);
    return trimmedSkills;
  }
  return tempSkills;
};

export const summarizeClients = (skills: ProjectPayload[]): string[] => {
  const tempSkills: string[] = [];

  for (let i = 0; i < skills.length; i++) {
    if (skills[i].clientName.trim().length > 0) {
      tempSkills.push(skills[i].clientName);
    }
  }

  if (tempSkills.length > 1) {
    const trimmedSkills: string[] = tempSkills.slice(0, 1);

    const extraSkills = tempSkills.length - 1;

    trimmedSkills.push(`+${extraSkills}`);
    return trimmedSkills;
  }
  return tempSkills;
};

export const mapEducationPayloadListToEducationList = (
  educationPayLoads: EducationPayload[]
): Education[] => {
  const educations: Education[] = [];

  for (let i = 0; i < educationPayLoads.length; i++) {
    educations.push(mapEducationPayLoadTOEducation(educationPayLoads[i]));
  }

  return educations;
};

export const mapEducationPayLoadTOEducation = (
  educationPayLoad: EducationPayload
): Education => {
  return {
    id: educationPayLoad.id,
    areaOfStudy: educationPayLoad.areaOfStudy,
    institution: educationPayLoad.institution,
    levelOfEducation: educationPayLoad.levelOfEducation,
    endDate: `${educationPayLoad.endYear}-${getMonthNumFromString(
      educationPayLoad.endMonth ?? ""
    )}`,
    isContinuing: educationPayLoad.isContinuing,
  };
};

export const mapExperiencePayloadListToExperienceList = (
  experiencePayLoads: ExperiencePayload[]
): Experience[] => {
  const educations: Experience[] = [];

  for (let i = 0; i < experiencePayLoads.length; i++) {
    educations.push(mapExperiencePayLoadTExperience(experiencePayLoads[i]));
  }

  return educations;
};

export const mapExperiencePayLoadTExperience = (
  experiencePayLoad: ExperiencePayload
): Experience => {
  return {
    id: experiencePayLoad.id,
    jobTitle: experiencePayLoad.jobTitle,
    companyName: experiencePayLoad.companyName,
    endDate: `${experiencePayLoad.endYear}-${getMonthNumFromString(
      experiencePayLoad.endMonth ?? ""
    )}`,
    startDate: `${experiencePayLoad.startYear}-${getMonthNumFromString(
      experiencePayLoad.startMonth ?? ""
    )}`,
    isContinuing: experiencePayLoad.isContinuing,
  };
};

export const mapCertificationPayloadListToCertificationList = (
  certificationPayLoads: CertificationPayload[]
): Certification[] => {
  const certifications: Certification[] = [];

  for (let i = 0; i < certificationPayLoads.length; i++) {
    certifications.push(
      mapCertificationPayLoadToCertification(certificationPayLoads[i])
    );
  }

  return certifications;
};

export const mapCertificationPayLoadToCertification = (
  certificationPayLoad: CertificationPayload
): Certification => {
  return {
    id: certificationPayLoad.id,
    certificateName: certificationPayLoad.name,
    issuer: certificationPayLoad.issuer,
    code: certificationPayLoad.code,
    certificateLink: certificationPayLoad.certificateLink,
    isContinuing: certificationPayLoad.isOngoing,
    expiryDate: `${certificationPayLoad.expiryYear}-${getMonthNumFromString(
      certificationPayLoad.expiryMonth ?? ""
    )}`,
    issueDate: `${certificationPayLoad.issueYear}-${getMonthNumFromString(
      certificationPayLoad.issueMonth ?? ""
    )}`,
  };
};

export const mapProjectPayloadListToProjectDataList = (
  projectPayLoads: ProjectPayload[]
): ProjectData[] => {
  const projects: ProjectData[] = [];

  for (let i = 0; i < projectPayLoads.length; i++) {
    projects.push(mapProjectPayLoadToProjectData(projectPayLoads[i]));
  }

  return projects;
};

export const mapProjectPayLoadToProjectData = (
  projectPayLoad: ProjectPayload
): ProjectData => {
  return {
    id: projectPayLoad.id,
    client: {
      clientName: projectPayLoad.clientName,
      clientId: projectPayLoad.clientId,
    },
    role: {
      projectRoleId: projectPayLoad.roleId,
      projectRoleName: projectPayLoad.roleName,
    },
    project: {
      projectId: projectPayLoad.projectId,
      projectName: projectPayLoad.name,
    },
    endDate: projectPayLoad.isContinuing? '' :`${
      projectPayLoad.endYear
    }-${getMonthNumFromString(projectPayLoad.endMonth ?? "")}`,
    startDate: `${projectPayLoad.startYear}-${getMonthNumFromString(
      projectPayLoad.startMonth ?? ""
    )}`,
    isContinuing: projectPayLoad.isContinuing,
  };
};
