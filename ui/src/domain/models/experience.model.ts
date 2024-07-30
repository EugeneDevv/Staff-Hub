export interface Experience {
  id: string | null,
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string | null;
  isContinuing: boolean;
}

export const initialExperienceState: Experience[] = [
  {
    id:  null,
    jobTitle: "",
    companyName: "",
    startDate: "",
    endDate: "",
    isContinuing: false,
  },
];

export interface ExperiencePayload {
  id: string | null;
  jobTitle: string;
  companyName: string;
  startMonth: string;
  startYear: number;
  endMonth: string | null;
  endYear: number | null;
  isContinuing: boolean;
}
