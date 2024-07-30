import OutlinedButton from "../../../components/Buttons/OutlinedButton"
import { Skill, SkillPayload, initialSkillListState } from "../../../../domain/models/skill.model";
import SkillsDropdown from "./SkillsDropdown";
import LevelOfProficiencyDropdown from "./LevelOfProficiencyDropdown";
import { useLazyGeSkillsQuery } from "../../../../application/services/authApi";
import { useEffect, useState } from "react";
import SkillDetailsCard from "./cards/SkillDetailsCard";

interface SkillsListProps {
  skills: SkillPayload[];
  setSkills: React.Dispatch<React.SetStateAction<SkillPayload[]>>;
  validateForm: () => boolean;
  errors: { [key: string]: string };
}


const SkillsList: React.FC<SkillsListProps> = ({ skills, setSkills, errors, validateForm }) => {


  const [fetchSkills, { data }] = useLazyGeSkillsQuery(); // Destructure the data from the hook
  const [loadedSkills, setLoadedSkills] = useState<Skill[]>([]);

  useEffect(() => {

    fetchSkills("");

  }, [fetchSkills]); // Include clientId and fetchProjects in the dependency array

  useEffect(() => {
    if (data) {
      const tempSkills = data?.data ?? [];
      setLoadedSkills(tempSkills);
    }
  }, [data, setLoadedSkills]); // 


  const handleSkillNameChange = (index: number, value: string) => {
    setSkills(prevState => {
      const skill = loadedSkills.find(skill => skill.name === value);

      const tempEducationDetails = [...prevState];
      tempEducationDetails[index] = {
        ...tempEducationDetails[index],
        name: value,
        skillId: skill ? skill.id : null,
      };
      return tempEducationDetails;
    });
    if (validateForm !== undefined) {
      validateForm()
    }
  };

  const handleDelete = (index: number) => {
    const tempSkills = skills.filter((_, i) => i !== index);
    setSkills(tempSkills);

  };

  const handleProficiencyLevelChange = (index: number, value: string) => {
    if (validateForm !== undefined) {
      validateForm()
    }
    setSkills(prevState => {
      const tempEducationDetails = [...prevState];
      tempEducationDetails[index] = {
        ...tempEducationDetails[index],
        proficiencyLevel: value
      };
      return tempEducationDetails;
    });
    if (validateForm !== undefined) {
      validateForm()
    }
  };

  return (
    <>
      {skills.map((skill, index) => (

        <>
          {index !== skills.length - 1 && <SkillDetailsCard skill={skill} key={index} onDelete={() => handleDelete(index)} />}
        </>
      ))}

      <div className="profileDetailBody" >
        <div className="profileDetailBodyInput">
          <SkillsDropdown onSelect={(value) => handleSkillNameChange(skills.length - 1, value ?? "")}
            errorMessage={errors[`s${skills.length - 1}name`]}
            skills={loadedSkills.map((skill) => skill.name)}
            initialSelection={skills[skills.length -1].name}
            onRichAction={() => { }}
          />
        </div>

        <div className="profileDetailBodyInput">
          <LevelOfProficiencyDropdown onSelect={(value) => handleProficiencyLevelChange(skills.length - 1, value ?? "")}
            errorMessage={errors[`s${skills.length - 1}proficienyLevel`]} initialSelection={skills[skills.length - 1].proficiencyLevel} />
        </div>
      </div>

      <OutlinedButton text='Add Another Skill' onClick={() => {
        if (validateForm()) {
          setSkills([...skills,
          ...initialSkillListState]);
        }
      }} />
    </>
  )
}

export default SkillsList