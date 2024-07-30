import React from 'react';
import CustomDropdown from '../../../components/AppInputs/CustomDropdown';

const LevelOfProficiencyDropdown: React.FC<{ onSelect: (selectedOption: string | null) => void, errorMessage: string, initialSelection: string; }> = ({ onSelect, errorMessage, initialSelection }, ) => {
  const levels = ['Beginner', 'Intermediate', 'Proficient', 'Expert'];

  return (
    <div className="input-wrapper">
      <label >Level of Proficiency<span>*</span></label>
      <CustomDropdown options={levels} onSelect={onSelect} errorMessage={errorMessage} hint="Tap to select proficiency level" initialSelection={initialSelection} />
    </div>
  );
};

export default LevelOfProficiencyDropdown;