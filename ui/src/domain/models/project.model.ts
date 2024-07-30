export interface ProjectPayload {
  id: number | null;
  name: string;
  clientId: number;
  clientName: string;
  roleId: number;
  roleName: string;
  projectRoleId?: number;
  projectId: number;
  userId: string;
  startMonth: string;
  startYear: number;
  endMonth: string | null;
  endYear: number | null;
  isContinuing: boolean;
}
export interface Project {
  projectId: number;
  projectName: string;
}

export interface Client {
  clientId: number;
  clientName: string;
}

export interface Role {
  projectRoleName: string;
  projectRoleId: number;
}

export interface ProjectData {
  id: number | null,
  client: Client;
  role: Role;
  project: Project;
  startDate: string;
  endDate: string;
  isContinuing: boolean;
}

export const initialProjectsState: ProjectData[] = [
  {
    id: null,
    client: {
      clientId: 0,
      clientName: "",
    },
    role: {
      projectRoleName: "",
      projectRoleId: 0,
    },
    project: {
      projectId: 0,
      projectName: "",
    },
    startDate: "",
    endDate: "",
    isContinuing: false,
  },
];
