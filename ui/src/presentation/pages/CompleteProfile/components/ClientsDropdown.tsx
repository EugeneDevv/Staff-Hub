import CustomDropdown from '../../../components/AppInputs/CustomDropdown';

interface ClientsDropdownProps {
  onSelect: (selectedOption: string | null) => void;
  clients: string[]
  errorMessage: string;
  initialSelection: string;
}

const ClientsDropdown: React.FC<ClientsDropdownProps> = ({ onSelect, errorMessage, clients, initialSelection },) => {

  
  return (
    <div className="input-wrapper">
      <label>Client Name</label>
      <CustomDropdown options={clients} onSelect={onSelect} errorMessage={errorMessage} hint='Tap to select the client' initialSelection={initialSelection} />
    </div>
  );
};

export default ClientsDropdown;
