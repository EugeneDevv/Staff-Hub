import { ChangeEvent, useEffect, useState } from 'react';
import './AppInputs.scss'
import DropDownIcon from '../../../assets/DropDownIcon.svg'
import CustomInput from './CustomInput';

interface DropdownProps {
  options: string[];
  onSelect: (selectedOption: string | null) => void;
  onRichAction?: (option: string) => void;
  richActionDesc?: string;
  errorMessage: string;
  hint?: string;
  className?: string
  clearDropdown?: boolean;
  initialSelection?: string | null;
}


const CustomDropdown: React.FC<DropdownProps> = ({ options, onSelect, errorMessage, hint, className, onRichAction, richActionDesc, clearDropdown, initialSelection }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>((initialSelection?.length ?? 0) > 0 ? initialSelection ?? null : null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newOption, setNewOption] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option);
  };

  const validateNewOption = (): boolean => {
    if (newOption.trim().length < 1) {
      setError("Field cannot be empty")
      return false;
    } else {
      setError(null)
      return true;
    }
  }




  const hasErrors: boolean = errorMessage != null && errorMessage.trim().length > 1;

  useEffect(() => {
    if (clearDropdown) {
      setSelectedOption(null);
    }
  }, [clearDropdown]);

  return (
    <>
      <div className={`customDropdownWrapper ${className ? className : ''}`}>
        <div className={`selectedOption ${((selectedOption && selectedOption !== 'All') || (initialSelection != null && initialSelection.length > 0)) ? 'optionSelected' : ''} ${hasErrors ? "error-input" : ""}`} onClick={() => setIsOpen(!isOpen)}>
          {selectedOption ?? hint ?? 'All'}
        </div>
        <img src={DropDownIcon} onClick={() => setIsOpen(!isOpen)} />
        {isOpen && (
          <ul className="options">
            {options.map((option, index) => (
              <li key={index} onClick={() => handleOptionClick(option)}>
                {option}
              </li>
            ))}
            {richActionDesc && onRichAction && <CustomInput
              type="text"
              value={newOption}
              errorMessage={error}
              placeholder="E.g. NET"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setNewOption(e.target.value)
                validateNewOption()
              }} />}
            {richActionDesc && onRichAction && <p className='richAction' onClick={() => {
              if (validateNewOption()) {
                onRichAction(newOption)
                handleOptionClick(newOption)
              }
            }}>
              {richActionDesc}
            </p>}
          </ul>
        )}

      </div>  {hasErrors && <p className="error">{errorMessage}</p>}</>
  );
};

export default CustomDropdown