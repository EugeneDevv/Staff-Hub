import ProjectsComponent from "../../components/Projects/ProjectsComponent"
import Dashboard from "../Dashboard/Dashboard"

const ProjectsPage = () => {
  return (
    <Dashboard route="/projects">
      < ProjectsComponent />
    </Dashboard>
  )
}

export default ProjectsPage