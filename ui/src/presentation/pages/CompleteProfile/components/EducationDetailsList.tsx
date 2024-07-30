import { ChangeEvent } from "react";
import CustomInput from "../../../components/AppInputs/CustomInput"
import OutlinedButton from "../../../components/Buttons/OutlinedButton"
import LevelOfStudyDropdown from "./LevelOfStudyDropdown"
import { Education, initialEducationListState } from "../../../../domain/models/education.model";
import EducationDetailsCard from "./cards/EducationDetailsCard";

interface EducationDetailsListProps {
  educationDetails: Education[];
  setEducationDetails: React.Dispatch<React.SetStateAction<Education[]>>;
  validateForm: () => boolean;
  errors: { [key: string]: string };
}


const EducationDetailsList: React.FC<EducationDetailsListProps> = ({ educationDetails, setEducationDetails, errors, validateForm }) => {


  const handleCheckboxChange = (index: number) => {
    setEducationDetails(prevState => {
      const tempEducationDetails = [...prevState];
      tempEducationDetails[index] = {
        ...tempEducationDetails[index],
        isContinuing: !tempEducationDetails[index].isContinuing
      };
      return tempEducationDetails;
    });
  };

  const handleLevelOfStudyChange = (index: number, value: string) => {
    setEducationDetails(prevState => {
      const tempEducationDetails = [...prevState];
      tempEducationDetails[index] = {
        ...tempEducationDetails[index],
        levelOfEducation: value
      };
      return tempEducationDetails;

    });
    if (validateForm !== undefined) {
      validateForm()
    }

  };
  const handleDelete = (index: number) => {
    const tempEducationDetails = educationDetails.filter((_, i) => i !== index);
    setEducationDetails(tempEducationDetails);

  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    setEducationDetails(prevState => {
      const tempEducationDetails = [...prevState];
      tempEducationDetails[index] = {
        ...tempEducationDetails[index],
        [name]: value
      };
      return tempEducationDetails;
    });
    if (validateForm !== undefined) {
      validateForm()
    }
  };

  return (
    <>
      {educationDetails.map((education, index) => (
       
        <>
          {index !== educationDetails.length - 1 && <EducationDetailsCard education={education} key={index} onDelete={() => handleDelete(index)} />}
         
        </>

      ))}
      { <div className="profileDetailBody" >
        <div className="profileDetailBodyInput">
          <CustomInput
            type="text"
            label="Area of Study"
            value={educationDetails[educationDetails.length - 1].areaOfStudy}
            name="areaOfStudy"
            placeholder="E.g. Computer Science"
            errorMessage={errors[`e${educationDetails[educationDetails.length - 1]}areaOfStudy`]}
            required={true}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, educationDetails.length - 1)} />
        </div>
        <div className="profileDetailBodyInput">
          <CustomInput
            type="text"
            label="Institution"
            value={educationDetails[educationDetails.length - 1].institution}
            name="institution"
            placeholder="E.g. Dedan Kimathi University"
            errorMessage={errors[`e${educationDetails[educationDetails.length - 1]}institution`]}
            required={true}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, educationDetails.length - 1)} />
        </div>
        <div className="profileDetailBodyInput">
          <CustomInput
            type="month"
            label="Date Completed"
            value={`${educationDetails[educationDetails.length - 1].isContinuing ? "" : educationDetails[educationDetails.length - 1].endDate}`}
            name="endDate"
            placeholder="Tap to select year completed"
            errorMessage={errors[`e${educationDetails.length - 1}endDate`]}
            disabled={educationDetails[educationDetails.length - 1].isContinuing}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, educationDetails.length - 1)} />
          <div className='checkBox'>
            <input
              type="checkbox"
              name="isContinuing"
              checked={educationDetails[educationDetails.length - 1].isContinuing}
              onChange={() => handleCheckboxChange(educationDetails.length - 1)}
            /><h6>Ongoing</h6></div>

        </div>

        <div className="profileDetailBodyInput">  <LevelOfStudyDropdown onSelect={(value) => handleLevelOfStudyChange(educationDetails.length - 1, value ?? "")}
          errorMessage={errors[`e${educationDetails.length - 1}levelOfEducation`]} initialSelection={educationDetails[educationDetails.length -1].levelOfEducation} />
        </div>

      </div>}

      <OutlinedButton text='Add More Education Details' onClick={() => {
        if (validateForm()) {
          setEducationDetails([...educationDetails,
          ...initialEducationListState]);
        }
      }} />
    </>
  )
}

export default EducationDetailsList