import { useEffect, useState } from "react";
import CustomDropdown from "../../AppInputs/CustomDropdown"
import {  useLazyGeSkillsQuery } from "../../../../application/services/authApi";
import { Skill } from "../../../../domain/models/skill.model";
import { useDispatch } from "react-redux";
import { clearSkillFilter, setSkillFilter } from "../../../../application/slices/authSlice";

interface Props {
  setSearchCount: () => void;
}

const SkillFilterDropDown: React.FC<Props> = ({ setSearchCount }) => {
  const skillId = localStorage.getItem("skillFilter");
  let loadedSkill: string | undefined = undefined;
  if (skillId != null && (skillId?.length ?? 0) > 0) {
    loadedSkill = skillId;
  }


  const [fetchSkills, data] = useLazyGeSkillsQuery();

  const [loadedSkills, setLoadedSkills] = useState<Skill[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSkillsData = async () => {
      await fetchSkills({});
    };

    fetchSkillsData();
  }, [fetchSkills]);

  useEffect(() => {
    if (data) {
      console.log('data?.data', data?.data);
      
      const projects = data?.data?.data ?? [];
      setLoadedSkills(projects);
    }
  }, [data]);

  const selectedSkill = loadedSkills.find(c => c.id === loadedSkill);

  const handClientDropDownChange = async (value: string | null) => {

    if (value === 'All') {
      dispatch(clearSkillFilter())
    } else {
      const client = loadedSkills.find(client => client.name === value);

      if (client?.id) {
        dispatch(setSkillFilter(client?.id))
      }
    }
    setSearchCount()

  };

  return (
    <div>
      <CustomDropdown options={['All'].concat(loadedSkills.map((skill) => skill.name))} onSelect={handClientDropDownChange} errorMessage='' hint={(loadedSkill?.length ?? 0) > 0 ? loadedSkills.find(s => s.id === loadedSkill)?.name : 'All'} initialSelection={selectedSkill != undefined ? selectedSkill.name : null} />
    </div>
  )
}

export default SkillFilterDropDown
