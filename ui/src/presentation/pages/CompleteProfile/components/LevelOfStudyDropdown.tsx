import React from 'react';
import CustomDropdown from '../../../components/AppInputs/CustomDropdown';

const LevelOfStudyDropdown: React.FC<{ onSelect: (selectedOption: string | null) => void, errorMessage: string, initialSelection: string }> = ({ onSelect, errorMessage, initialSelection }, ) => {
  const levelsOfStudy = ['PhD', 'Masters', 'Undergraduate', 'Diploma', 'Certificate'];

  return (
    <div className="input-wrapper">
      <label >Level of Study<span>*</span></label>
      <CustomDropdown options={levelsOfStudy} onSelect={onSelect} errorMessage={errorMessage} hint='Tap to select Level of Study' initialSelection={initialSelection} />
    </div>
  );
};

export default LevelOfStudyDropdown;