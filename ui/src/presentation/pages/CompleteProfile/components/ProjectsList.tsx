import { ChangeEvent, useEffect, useState } from "react";
import CustomInput from "../../../components/AppInputs/CustomInput"
import OutlinedButton from "../../../components/Buttons/OutlinedButton"
import { Client, Project, ProjectData, Role, initialProjectsState } from "../../../../domain/models/project.model";
import ClientsDropdown from "./ClientsDropdown";
import ProjectsDropdown from "./ProjectsDropdown";
import { useLazyGetClientsQuery, useLazyGetProjectRolesQuery, useLazyGetProjectsQuery } from "../../../../application/services/authApi";
import RolesDropdown from "./RolesDropdown";
import ProjectCard from "./cards/ProjectCard";

interface ProjectsListProps {
  projects: ProjectData[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectData[]>>;
  validateForm: () => boolean;
  errors: { [key: string]: string };
}


const ProjectsList: React.FC<ProjectsListProps> = ({ projects, setProjects, errors, validateForm }) => {
  const [fetchClients, { data: clientsData }] = useLazyGetClientsQuery();
  const [fetchRoles, { data: rolesData }] = useLazyGetProjectRolesQuery();
  const [fetchProjects] = useLazyGetProjectsQuery({});

  const [loadedClients, setLoadedClients] = useState<Client[]>([]);
  const [loadedRoles, setLoadedRoles] = useState<Role[]>([]);
  const [loadedProjects, setLoadedProjects] = useState<Project[]>([]);
  const [clearProjectsDropdown, setClearProjectsDropdown] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      await fetchClients("");
    };

    fetchClientData();
  }, [fetchClients]);

  useEffect(() => {
    if (clientsData) {
      const clients = clientsData?.data ?? [];
      setLoadedClients(clients);
    }
  }, [clientsData]);


  useEffect(() => {
    const fetchRolesData = async () => {
      await fetchRoles("");
    };

    fetchRolesData();
  }, [fetchRoles]);

  useEffect(() => {
    if (rolesData) {
      const roles = rolesData?.data ?? [];
      setLoadedRoles(roles);
    }
  }, [rolesData]);

  const handleCheckboxChange = (index: number) => {
    setProjects(prevState => {
      const tempProjects = [...prevState];
      tempProjects[index] = {
        ...tempProjects[index],
        isContinuing: !tempProjects[index].isContinuing
      };
      return tempProjects;
    });

  };

  const handClientDropDownChange = async (index: number, value: string) => {
    const client = loadedClients.find(client => client.clientName === value);
    setClearProjectsDropdown(true);
    setProjects(prevState => {
      const tempProjects = [...prevState];
      tempProjects[index] = {
        ...tempProjects[index],
        client: client ?? { clientName: "", clientId: 0 },
      };
      return tempProjects;
    });

    if (validateForm !== undefined) {
      validateForm()
    }

    if (client) {

      const projects = await fetchProjects({ id: client.clientId });
      setLoadedProjects(projects.data.data)
    }

  };

  const handRoleDropDownChange = async (index: number, value: string) => {
    const role = loadedRoles.find(thisRole => thisRole.projectRoleName === value);
    setProjects(prevState => {
      const tempProjects = [...prevState];
      tempProjects[index] = {
        ...tempProjects[index],
        role: role ?? {
          projectRoleId: 0,
          projectRoleName: ""
        },
      };
      return tempProjects;
    });

    if (validateForm !== undefined) {
      validateForm()
    }
  };
  const handProjectDownChange = (index: number, value: string) => {
    setProjects(prevState => {
      const project = loadedProjects.find(project => project.projectName === value);
      const tempProjects = [...prevState];
      tempProjects[index] = {
        ...tempProjects[index],
        project: project ?? {
          projectId: 0,
          projectName: "",
        },
      };
      return tempProjects;
    });
    if (validateForm !== undefined) {
      validateForm()
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    setProjects(prevState => {
      const tempProjects = [...prevState];
      tempProjects[index] = {
        ...tempProjects[index],
        [name]: value
      };
      return tempProjects;
    });
    if (validateForm !== undefined) {
      validateForm()
    }
  };

  const handleDelete = (index: number) => {
    const tempEducationDetails = projects.filter((_, i) => i !== index);
    setProjects(tempEducationDetails);

  };

  return (
    <>
      {projects.map((project, index) => (

        <>
          {index !== projects.length - 1 && <ProjectCard project={project} key={index} onDelete={() => handleDelete(index)} />}

        </>

      ))}

      <div className="profileDetailBody" >
        <div className="profileDetailBodyInput">
          <ClientsDropdown onSelect={(value) => handClientDropDownChange(projects.length - 1, value ?? "")}
            clients={loadedClients.map((client) => client.clientName)}
            errorMessage={errors[`p${projects.length - 1}client`]} initialSelection={projects[projects.length - 1].client.clientName} />
        </div>
        <div className="profileDetailBodyInput">
          <RolesDropdown onSelect={(value) => handRoleDropDownChange(projects.length - 1, value ?? "")}
            roles={loadedRoles.map((role) => role.projectRoleName)}
            errorMessage={errors[`p${projects.length - 1}role`]} initialSelection={projects[projects.length - 1].role.projectRoleName} />
        </div>

        <div className="profileDetailBodyInput">
          <CustomInput
            type="month"
            label="Date Started"
            value={projects[projects.length - 1].startDate}
            name="startDate"
            placeholder="Tap to select start date"
            errorMessage={errors[`p${projects.length - 1}startDate`]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, projects.length - 1)} />
        </div>

        <div className="profileDetailBodyInput">
          {<CustomInput
            type="month"
            label="Date Completed"
            value={`${projects[projects.length - 1].isContinuing ? "" : projects[projects.length - 1].endDate}`}
            name="endDate"
            placeholder="Tap to select end date"
            errorMessage={errors[`p${projects.length - 1}endDate`]}
            disabled={projects[projects.length - 1].isContinuing}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, projects.length - 1)} />}
          <div className='checkBox'>
            <input
              type="checkbox"
              name="isContinuing"
              checked={projects[projects.length - 1].isContinuing}
              onChange={() => handleCheckboxChange(projects.length - 1)}
            /><h6>Ongoing</h6></div>

        </div>
        <div className="profileDetailBodyInput">
          <ProjectsDropdown onSelect={(value) => handProjectDownChange(projects.length - 1, value ?? "")}
            errorMessage={errors[`p${projects.length - 1}project`]}
            projects={loadedProjects.map((project) => project.projectName)}
            clearDropdown={clearProjectsDropdown} initialSelection={projects[projects.length - 1].project.projectName}
          />
        </div>
      </div>
      <OutlinedButton text='Add Another Project' onClick={() => {
        if (validateForm()) {
          setProjects([...projects,
          ...initialProjectsState]);
        }
      }} />
    </>
  )
}

export default ProjectsList