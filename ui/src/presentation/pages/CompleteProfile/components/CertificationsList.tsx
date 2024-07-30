import { ChangeEvent } from "react";
import CustomInput from "../../../components/AppInputs/CustomInput"
import OutlinedButton from "../../../components/Buttons/OutlinedButton"
import { Certification, initialCertificationListState } from "../../../../domain/models/certification.model";
import CertificationCard from "./cards/CertificationCard";

interface CertificationsListProps {
  certifications: Certification[];
  setCertifications: React.Dispatch<React.SetStateAction<Certification[]>>;
  validateForm: () => boolean;
  errors: { [key: string]: string };
}

const CertificationsList: React.FC<CertificationsListProps> = ({ certifications, setCertifications, errors, validateForm }) => {

  const handleCheckboxChange = (index: number) => {
    setCertifications(prevState => {
      const tempEducationDetails = [...prevState];
      tempEducationDetails[index] = {
        ...tempEducationDetails[index],
        isContinuing: !tempEducationDetails[index].isContinuing
      };
      return tempEducationDetails;
    });
    if (validateForm !== undefined) {
      validateForm()
    }
  };

  const handleDelete = (index: number) => {
    const tempEducationDetails = certifications.filter((_, i) => i !== index);
    setCertifications(tempEducationDetails);

  };


  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    setCertifications(prevState => {
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
      {certifications.map((certification, index) => (

        <>
          {index !== certifications.length - 1 && <CertificationCard certification={certification} key={index} onDelete={() => handleDelete(index)} />}

        </>

      ))}

      <div className="profileDetailBody" >
        <div className="profileDetailBodyInput">
          <CustomInput
            type="text"
            label="Certificate Name"
            value={certifications[certifications.length - 1].certificateName}
            name="certificateName"
            placeholder="E.g. ISTQB Foundation Level"
            errorMessage={errors[`c${certifications.length - 1}certificateName`]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, certifications.length - 1)} />
        </div>
        <div className="profileDetailBodyInput">
          <CustomInput
            type="month"
            label="Certificate Issue Date"
            value={certifications[certifications.length - 1].issueDate}
            name="issueDate"
            placeholder="Tap to issue date"
            errorMessage={errors[`c${certifications.length - 1}issueDate`]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, certifications.length - 1)} />
        </div>
        <div className="profileDetailBodyInput">
          <CustomInput
            type="text"
            label="Certificate Issuer"
            value={certifications[certifications.length - 1].issuer}
            name="issuer"
            placeholder="E.g. ISTQB International"
            errorMessage={errors[`c${certifications.length - 1}issuer`]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, certifications.length - 1)} />
        </div>
        <div className="profileDetailBodyInput">
          <CustomInput
            type="month"
            label="Certificate Expiry Date"
            value={`${certifications[certifications.length - 1].isContinuing ? "" : certifications[certifications.length - 1].expiryDate}`}
            name="expiryDate"
            placeholder="Tap to select expiry date"
            errorMessage={errors[`c${certifications.length - 1}expiryDate`]}
            disabled={certifications[certifications.length - 1].isContinuing}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, certifications.length - 1)} />
          <div className='checkBox'>
            <input
              type="checkbox"
              name="isContinuing"
              checked={certifications[certifications.length - 1].isContinuing}
              onChange={() => handleCheckboxChange(certifications.length - 1)}
            /><h6>No Expiry</h6></div>
        </div>
        <div className="profileDetailBodyInput">
          <CustomInput
            type="text"
            label="Certificate Code"
            value={certifications[certifications.length - 1].code}
            name="code"
            placeholder="E.g. ISTQB123"
            errorMessage={errors[`c${certifications.length - 1}code`]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, certifications.length - 1)} />
        </div>
        <div className="profileDetailBodyInput">
          <CustomInput
            type="text"
            label="Certificate Link"
            value={certifications[certifications.length - 1].certificateLink}
            name="certificateLink"
            placeholder="E.g. https://ISTQB123test..cert"
            errorMessage={errors[`c${certifications.length - 1}certificateLink`]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, certifications.length - 1)} />
        </div>
      </div>

      <OutlinedButton text='Add Another Certificate' onClick={() => {
        if (validateForm()) {
          setCertifications([...certifications,
          ...initialCertificationListState]);
        }
      }} />
    </>
  )
}

export default CertificationsList