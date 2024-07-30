export interface Education {
  id: string | null,
  areaOfStudy: string;
  institution: string;
  levelOfEducation: string;
  endDate: string | null;
  isContinuing: boolean;
}
export interface EducationPayload {
  id: string | null,
  areaOfStudy: string;
  institution: string;
  levelOfEducation: string;
  endMonth: string | null;
  endYear: number | null;
  isContinuing: boolean;
}

export const initialEducationListState: Education[] = [
  {
    id: null,
    areaOfStudy: "",
    institution: "",
    levelOfEducation: "",
    endDate: null,
    isContinuing: false,
  },
];
