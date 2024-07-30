import './Cards.scss'
import React from 'react'
import { getMonthFromNumber } from '../../../../../domain/valueObjects/utils';
import { ProjectData } from '../../../../../domain/models/project.model';

type Props = {
  project: ProjectData,
  onDelete: () => void;
}

const ProjectCard: React.FC<Props> = ({ project, onDelete }) => {
  return (
    <div className='cardWrapper' >
      <div className="header">
        <h3>{project.project.projectName}</h3>
        <h6 className="delete" onClick={onDelete}>Delete</h6>
      </div>
      <div className="body">
        <div className="listItem">
          <div className="item">
            <h6 className="title">Date Started: </h6>
            <p className="value">{`${getMonthFromNumber(parseInt(project.startDate?.split("-")[1] ?? "0"))} ${parseInt(project.endDate?.split("-")[0] ?? "0")}`}</p>
          </div>
          <div className="item">
            <h6 className="title">Date Completed: </h6>
            <p className="value">{project.isContinuing ? 'Ongoing' : `${getMonthFromNumber(parseInt(project.endDate?.split("-")[1] ?? "0"))} ${parseInt(project.endDate?.split("-")[0] ?? "0")}`}</p>
          </div>
        </div>
        <div className="listItem">
          <div className="item">
            <h6 className="title">Client Name: </h6>
            <p className="value">{project.client.clientName}</p>
          </div>
          <div className="item">
            <h6 className="title">Role: </h6>
            <p className="value">{project.role.projectRoleName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard