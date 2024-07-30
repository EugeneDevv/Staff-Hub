import './Cards.scss'
import React from 'react'
import { SkillPayload } from '../../../../../domain/models/skill.model';

type Props = {
  skill: SkillPayload,
  onDelete: () => void;
}

const SkillDetailsCard: React.FC<Props> = ({ skill, onDelete }) => {
  return (
    <div className='cardWrapper' >
      <div className="header">
        <h3>{skill.name}</h3>
        <h6 className="delete" onClick={onDelete}>Delete</h6>
      </div>
      <div className="body">
        <div className="listItem">
          <div className="item">
            <h6 className="title">Level of Proficiency: </h6>
            <p className="value">{skill.proficiencyLevel}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillDetailsCard