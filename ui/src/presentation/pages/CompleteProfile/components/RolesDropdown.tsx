import CustomDropdown from '../../../components/AppInputs/CustomDropdown';

interface RolesDropdownProps {
  onSelect: (selectedOption: string | null) => void;
  roles: string[]
  errorMessage: string;
  initialSelection: string;
}

const RolesDropdown: React.FC<RolesDropdownProps> = ({ onSelect, errorMessage, roles, initialSelection },) => {

  
  return (
    <div className="input-wrapper">
      <label>Role</label>
      <CustomDropdown options={roles} onSelect={onSelect} errorMessage={errorMessage} hint='Tap to select the client' initialSelection={initialSelection} />
    </div>
  );
};

export default RolesDropdown;
