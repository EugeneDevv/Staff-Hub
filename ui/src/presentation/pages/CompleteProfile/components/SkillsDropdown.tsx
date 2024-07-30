import React from 'react';
import CustomDropdown from '../../../components/AppInputs/CustomDropdown';

interface SkillsDropdownProps {
  onSelect: (selectedOption: string | null) => void;
  onRichAction: (option: string) => void;
  skills: string[]
  errorMessage: string;
  initialSelection: string;
}

const SkillsDropdown: React.FC<SkillsDropdownProps> = ({ onSelect, errorMessage, skills, onRichAction, initialSelection },) => {


  return (
    <div className="input-wrapper">
      <label >Skill Name<span>*</span></label>
      <CustomDropdown options={skills} onSelect={onSelect} errorMessage={errorMessage} hint="Tap to select skill" richActionDesc='Add Another Skill' onRichAction={onRichAction} initialSelection={initialSelection} />
    </div>
  );
};

export default SkillsDropdown;