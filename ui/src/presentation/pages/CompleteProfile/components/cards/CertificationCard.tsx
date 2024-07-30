import './Cards.scss'
import React from 'react'
import { getMonthFromNumber } from '../../../../../domain/valueObjects/utils';
import { Certification } from '../../../../../domain/models/certification.model';

type Props = {
  certification: Certification,
  onDelete: () => void;
}

const CertificationCard: React.FC<Props> = ({ certification, onDelete }) => {
  return (
    <div className='cardWrapper' >
      <div className="header">
        <h3>{certification.certificateName}</h3>
        <h6 className="delete" onClick={onDelete}>Delete</h6>
      </div>
      <div className="body">
        <div className="listItem">
          <div className="item">
            <h6 className="title">Issue Date: </h6>
            <p className="value">{`${getMonthFromNumber(parseInt(certification.issueDate?.split("-")[1] ?? "0"))} ${parseInt(certification.issueDate?.split("-")[0] ?? "0")}`}</p>
          </div>
          <div className="item">
            <h6 className="title">Expiry Date: </h6>
            <p className="value">{certification.isContinuing ? 'No Expiry' : `${getMonthFromNumber(parseInt(certification.expiryDate?.split("-")[1] ?? "0"))} ${parseInt(certification.expiryDate?.split("-")[0] ?? "0")}`}</p>
          </div>
        </div>
        <div className="listItem">
          <div className="item">
            <h6 className="title">Certificate Issuer: </h6>
            <p className="value">{certification.issuer}</p>
          </div>
          <div className="item">
            <h6 className="title">Certificate Code: </h6>
            <p className="value">{certification.code}</p>
          </div>
        </div>
        <div className="listItem">
          <div className="item">
            <h6 className="title">Certificate Issuer: </h6>
            <a className="value">{certification.certificateLink}</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CertificationCard