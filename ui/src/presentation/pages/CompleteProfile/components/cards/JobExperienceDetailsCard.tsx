import './Cards.scss'
import React from 'react'
import { getMonthFromNumber } from '../../../../../domain/valueObjects/utils';
import { Experience } from '../../../../../domain/models/experience.model';

type Props = {
  experience: Experience,
  onDelete: () => void;
}

const JobExperienceCard: React.FC<Props> = ({ experience, onDelete }) => {
  return (
    <div className='cardWrapper' >
      <div className="header">
        <h3>{experience.jobTitle}</h3>
        <h6 className="delete" onClick={onDelete}>Delete</h6>
      </div>
      <div className="body">
        <div className="listItem">
          <div className="item">
            <h6 className="title">Company: </h6>
            <p className="value">{experience.companyName}</p>
          </div>
          <div className="item">
            <h6 className="title">Date Started: </h6>
            <p className="value">{`${getMonthFromNumber(parseInt(experience.startDate?.split("-")[1] ?? "0"))} ${parseInt(experience.startDate?.split("-")[0] ?? "0")}`}</p>
          </div>
        </div>
        <div className="listItem">
          <div className="item">
            <h6 className="title">Date Completed: </h6>
            <p className="value">{experience.isContinuing ? 'Ongoing' : `${getMonthFromNumber(parseInt(experience.endDate?.split("-")[1] ?? "0"))} ${parseInt(experience.endDate?.split("-")[0] ?? "0")}`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobExperienceCard