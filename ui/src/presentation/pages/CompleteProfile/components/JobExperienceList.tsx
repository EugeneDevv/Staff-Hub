import { ChangeEvent } from "react";
import CustomInput from "../../../components/AppInputs/CustomInput"
import OutlinedButton from "../../../components/Buttons/OutlinedButton"
import { Experience, initialExperienceState } from "../../../../domain/models/experience.model";
import JobExperienceCard from "./cards/JobExperienceDetailsCard";

interface JobExperienceListProps {
  experienceDetails: Experience[];
  setExperienceDetails: React.Dispatch<React.SetStateAction<Experience[]>>;
  validateForm: () => boolean;
  errors: { [key: string]: string };
}


const JobExperienceList: React.FC<JobExperienceListProps> = ({ experienceDetails, setExperienceDetails, errors, validateForm }) => {


  const handleCheckboxChange = (index: number) => {
    setExperienceDetails(prevState => {
      const tempExperienceDetails = [...prevState];
      tempExperienceDetails[index] = {
        ...tempExperienceDetails[index],
        isContinuing: !tempExperienceDetails[index].isContinuing
      };
      return tempExperienceDetails;
    });
    if (validateForm !== undefined) {
      validateForm()
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    setExperienceDetails(prevState => {
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

  const handleDelete = (index: number) => {
    const tempEducationDetails = experienceDetails.filter((_, i) => i !== index);
    setExperienceDetails(tempEducationDetails);

  };


  return (
    <>
      {experienceDetails.map((experience, index) => (

        <>
          {index !== experienceDetails.length - 1 && <JobExperienceCard experience={experience} key={index} onDelete={() => handleDelete(index)} />}

        </>

      ))}

      <div className="profileDetailBody" >
        <div className="profileDetailBodyInput">
          <CustomInput
            type="text"
            label="Job Title"
            value={experienceDetails[experienceDetails.length - 1].jobTitle}
            name="jobTitle"
            placeholder="E.g. Quality Analyst"
            errorMessage={errors[`j${experienceDetails.length - 1}jobTitle`]}
            required={true}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, experienceDetails.length - 1)} />
        </div>
        <div className="profileDetailBodyInput">
          <CustomInput
            type="text"
            label="Company Name"
            value={experienceDetails[experienceDetails.length - 1].companyName}
            name="companyName"
            placeholder="E.g. Griffin Global Tech"
            errorMessage={errors[`j${experienceDetails.length - 1}companyName`]}
            required={true}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, experienceDetails.length - 1)} />
        </div>
        <div className="profileDetailBodyInput">
          <CustomInput
            type="month"
            label="Date Started"
            value={experienceDetails[experienceDetails.length - 1].startDate}
            name="startDate"
            placeholder="Tap to select year completed"
            required={true}
            errorMessage={errors[`j${experienceDetails.length - 1}startDate`]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, experienceDetails.length - 1)} />
        </div>

        <div className="profileDetailBodyInput">
          {<CustomInput
            type="month"
            label="Date Completed"
            value={`${experienceDetails[experienceDetails.length - 1].isContinuing ? "" : experienceDetails[experienceDetails.length - 1].endDate}`}
            name="endDate"
            placeholder="Tap to select year completed"
            errorMessage={errors[`j${experienceDetails.length - 1}endDate`]}
            disabled={experienceDetails[experienceDetails.length - 1].isContinuing}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, experienceDetails.length - 1)} />}
          <div className='checkBox'>
            <input
              type="checkbox"
              name="isContinuing"
              checked={experienceDetails[experienceDetails.length - 1].isContinuing}
              onChange={() => handleCheckboxChange(experienceDetails.length - 1)}
            /><h6>Ongoing</h6></div>

        </div>
      </div>
      

      <OutlinedButton text='Add Another Job Experience' onClick={() => {
        if (validateForm()) {
          setExperienceDetails([...experienceDetails,
          ...initialExperienceState]);
        }
      }} />
    </>
  )
}

export default JobExperienceList