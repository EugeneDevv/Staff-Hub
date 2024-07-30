import CustomDropdown from '../../../components/AppInputs/CustomDropdown';

interface ProjectsDropdownProps {
  onSelect: (selectedOption: string | null) => void;
  projects: string[]
  errorMessage: string;
  clearDropdown: boolean;
  initialSelection: string;
}


const ProjectsDropdown: React.FC<ProjectsDropdownProps> = ({ onSelect, errorMessage, projects, clearDropdown, initialSelection }) => {


  return (
    <div className="input-wrapper">
      <label >Project Name</label>
      <CustomDropdown options={projects} onSelect={onSelect} errorMessage={errorMessage} hint="Tap to select a project"
        clearDropdown={clearDropdown} initialSelection={initialSelection} />
    </div>
  );
};

export default ProjectsDropdown;
