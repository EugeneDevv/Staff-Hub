import { getUser } from "../valueObjects/utils";

export interface Skill {
  id: string  | null;
  name: string;
}
export interface SkillPayload {
  userId: string;
  skillId: string  | null;
  name: string;
  proficiencyLevel: string;
}


export const initialSkillListState: SkillPayload[] = [
  {
    userId: getUser()?.userId ?? "",
    skillId: null,
    name: "",
    proficiencyLevel: "",
  },
];
