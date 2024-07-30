import './Cards.scss'
import React from 'react'
import { Education } from '../../../../../domain/models/education.model'
import { getMonthFromNumber } from '../../../../../domain/valueObjects/utils';

type Props = {
  education: Education,
  onDelete: () => void;
}

const EducationDetailsCard: React.FC<Props> = ({ education, onDelete }) => {
  return (
    <div className='cardWrapper' >
      <div className="header">
        <h3>{education.areaOfStudy}</h3>
        <h6 className="delete" onClick={onDelete}>Delete</h6>
      </div>
      <div className="body">
        <div className="listItem">
          <div className="item">
            <h6 className="title">Institution: </h6>
            <p className="value">{education.institution}</p>
          </div>
          <div className="item">
            <h6 className="title">Level of Study: </h6>
            <p className="value">{education.levelOfEducation}</p>
          </div>
        </div>
        <div className="listItem">
          <div className="item">
            <h6 className="title">Date Completed: </h6>
            <p className="value">{education.isContinuing ? 'Ongoing' : `${getMonthFromNumber(parseInt(education.endDate?.split("-")[1] ?? "0"))} ${parseInt(education.endDate?.split("-")[0] ?? "0")}`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EducationDetailsCard