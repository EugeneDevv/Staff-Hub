import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { User } from '../../../domain/models/user.model';
import CustomInput from '../../components/AppInputs/CustomInput'
import './CompleteProfilePage.scss'
import { useNavigate } from 'react-router-dom';
import { useCreateProfileMutation, useLazySingleUserQuery } from '../../../application/services/authApi';
import { toast } from 'react-toastify';
import { ApiResponse } from '../../../application/apiTypes';
import { friendlyErrorMessage } from '../../../domain/valueObjects/appStrings';
import Spinner from '../../components/Spinner/Spinner';
import SubmitButton from '../../components/Buttons/SubmitButton';
import EducationDetailsList from './components/EducationDetailsList';
import { Education, initialEducationListState } from '../../../domain/models/education.model';
import { setUser, setUserProfile } from '../../../application/slices/authSlice';
import { useDispatch } from 'react-redux';
import JobExperienceList from './components/JobExperienceList';
import { Experience, initialExperienceState } from '../../../domain/models/experience.model';
import { certifiCationToDTO, certificationHasData, educationToDTO, experienceToDTO, projectDataToDTO, projectHasData, } from '../../../domain/valueObjects/utils';
import ProjectsList from './components/ProjectsList';
import { ProjectData, initialProjectsState } from '../../../domain/models/project.model';
import SkillsList from './components/SkillsList';
import { SkillPayload, initialSkillListState } from '../../../domain/models/skill.model';
import CertificationsList from './components/CertificationsList';
import { Certification, initialCertificationListState } from '../../../domain/models/certification.model';


const CompleteProfilePage = () => {
  let user: User | null = null

  try {
    user = JSON.parse(localStorage.getItem("user") ?? "{}");

  } catch (e) {
    console.log(e)
  }
  const [submitted, setSubmitted] = useState(false)
  const [formValue, setFormValue] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phoneNumber: user?.phoneNumber ?? ''
  })
  const [educationDetails, setEducationDetails] = useState<Education[]>(initialEducationListState);
  const [experienceDetails, setExperienceDetails] = useState<Experience[]>(initialExperienceState);
  const [certifications, setCertifications] = useState<Certification[]>(initialCertificationListState);
  const [skills, setSKills] = useState<SkillPayload[]>(initialSkillListState);
  
  const [projects, setProjects] = useState<ProjectData[]>(initialProjectsState);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [userById] = useLazySingleUserQuery();

  const navigate = useNavigate()

  const dispatch = useDispatch();

  const { firstName, lastName, phoneNumber } = formValue

  const [createProfile, { isSuccess, isLoading }] = useCreateProfileMutation()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;


    setFormValue({
      ...formValue, [name]: name === "phoneNumber" && value.trim().length < 1
        ? null
        : value
    });

    if (submitted) {
      validateForm()
    }
  }

  let isValid: boolean = true;
  const newErrors: { [key: string]: string } = {};

  const validateContactDetails = (): boolean => {

    if (!formValue.firstName) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formValue.lastName) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }
    setErrors(newErrors);

    return isValid;
  }
  const validateEducationDetails = (): boolean => {
    // Validate education details
    for (let i = 0; i < educationDetails.length; i++) {
      const tempEducation = educationDetails[i]
      if (tempEducation.areaOfStudy.length === 0) {
        const areaOfStudyKey = `e${i}areaOfStudy`
        newErrors[areaOfStudyKey] = "Area of Study is required";
        isValid = false;
      }
      if (tempEducation.institution.length === 0) {
        const institutionKey = `e${i}institution`
        newErrors[institutionKey] = "Institution is required";
        isValid = false;
      }
      if (tempEducation.levelOfEducation.length === 0) {
        const levelOfEducationKey = `e${i}levelOfEducation`
        newErrors[levelOfEducationKey] = "Level of Study is required";
        isValid = false;
      }
      if ((!tempEducation.endDate || tempEducation.endDate?.length === 0) && !tempEducation.isContinuing) {
        const endDateKey = `e${i}endDate`
        newErrors[endDateKey] = "Date Completed is required";
        isValid = false;
      }
    }
    setErrors(newErrors);

    return isValid;
  }

  const validateExperienceDetails = (): boolean => {
    // Validate experience details
    for (let i = 0; i < experienceDetails.length; i++) {
      const tempExperience = experienceDetails[i]
      if (tempExperience.jobTitle.length === 0) {
        const jobTitleKey = `j${i}jobTitle`
        newErrors[jobTitleKey] = "Job Title is required";
        isValid = false;
      }
      if (tempExperience.companyName.length === 0) {
        const tempExperienceKey = `j${i}companyName`
        newErrors[tempExperienceKey] = "Company Name is required";
        isValid = false;
      }

      if (tempExperience.startDate.length === 0) {
        const startDateKey = `j${i}startDate`
        newErrors[startDateKey] = "Date Started is required";
        isValid = false;
      }
      if ((!tempExperience.endDate || tempExperience?.endDate.length === 0) && !tempExperience.isContinuing) {
        const endDateKey = `j${i}endDate`
        newErrors[endDateKey] = "Date Completed is required";
        isValid = false;
      }
    }
    setErrors(newErrors);

    return isValid;
  }

  const validateSkills = (): boolean => {
    // Validate experience details
    for (let i = 0; i < skills.length; i++) {
      const tempSkill = skills[i]
      if (tempSkill.name.length === 0) {
        const nameKey = `s${i}name`
        newErrors[nameKey] = "Skill Name is required";
        isValid = false;
      }
      if (tempSkill.proficiencyLevel.length === 0) {
        const proficienyLevelKey = `s${i}proficienyLevel`
        newErrors[proficienyLevelKey] = "Level of Proficiency is required";
        isValid = false;
      }


    }
    setErrors(newErrors);

    return isValid;
  }

  const validateCertifications = (skipCheck?: boolean): boolean => {
    // Validate experience details
    for (let i = 0; i < certifications.length; i++) {
      const tempCertification = certifications[i]
      if (skipCheck || certificationHasData(tempCertification)) {
        if (tempCertification.certificateName.length === 0) {
          const certificateNameKey = `c${i}certificateName`
          newErrors[certificateNameKey] = "Certificate Name is required";
          isValid = false;
        }

        if (tempCertification.issuer.length === 0) {
          const certificateIssuerKey = `c${i}issuer`
          newErrors[certificateIssuerKey] = "Certificate Issuer is required";
          isValid = false;
        }

        if (tempCertification.issueDate.length === 0) {
          const certificateIssueDateKey = `c${i}issueDate`
          newErrors[certificateIssueDateKey] = "Issue Date is required";
          isValid = false;
        }


        if ((!tempCertification.expiryDate || tempCertification?.expiryDate.length === 0) && !tempCertification.isContinuing) {
          const endDateKey = `c${i}expiryDate`
          newErrors[endDateKey] = "Expiry Date is required";
          isValid = false;
        }
      }
    }
    setErrors(newErrors);

    return isValid;
  }
  const validateProjects = (skipCheck?: boolean): boolean => {
    // Validate experience details
    for (let i = 0; i < projects.length; i++) {
      const tempProject = projects[i]
      if (skipCheck || projectHasData(tempProject)) {
        if (tempProject.client.clientId === 0) {
          const clientKey = `p${i}client`
          newErrors[clientKey] = "Client Name is required";
          isValid = false;
        }

        if (tempProject.role.projectRoleId === 0) {
          const roleKey = `p${i}role`
          newErrors[roleKey] = "Role is required";
          isValid = false;
        }
        if (tempProject.project.projectId === 0) {
          const projectKey = `p${i}project`
          newErrors[projectKey] = "Project Name is required";
          isValid = false;
        }
        if (tempProject.startDate.length === 0) {
          const startDateKey = `p${i}startDate`
          newErrors[startDateKey] = "Date Started is required";
          isValid = false;
        }

        if ((!tempProject.endDate || tempProject?.endDate.length === 0) && !tempProject.isContinuing) {
          const endDateKey = `p${i}endDate`
          newErrors[endDateKey] = "Date Completed is required";
          isValid = false;
        }
      }
    }
    setErrors(newErrors);

    return isValid;
  }

  const validateForm = () => {
    validateContactDetails();
    validateEducationDetails();
    validateExperienceDetails();
    validateSkills();
    validateCertifications();
    validateProjects();
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true)
    if (validateForm()) {

      await createProfile({
        contacts: { firstName, lastName, phoneNumber },
        education: educationToDTO(educationDetails),
        experience: experienceToDTO(experienceDetails,
        ),
        certification: certifiCationToDTO(certifications),
        project: projectDataToDTO(projects),
        skills: skills,
      }).then((res: ApiResponse) => {
        if (res?.error) {
          console.log(res)
          toast.error(res?.error?.data?.message ?? friendlyErrorMessage)
        }

      }).catch((e: Error) => {
        toast.error(e?.message)
      })
    } else {
      const errorInput = document.querySelector<HTMLInputElement>('.error-input');
      if (errorInput) {
        errorInput.focus();
        errorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }


  const fetchUserProfile = useCallback(async (
  ) => {

    await userById({ userId: user?.userId ?? '' }).then((res: ApiResponse) => {
      if (res?.error) {
        console.log(res)
      } else {
        console.log("res?.data", res?.data.data)
        dispatch(setUserProfile(res?.data.data));
      }
    }).catch((e: Error) => {
      toast.error(e?.message)
    });

    if (user) {
      const tempUser = { ...user, firstName, lastName, phoneNumber };
      dispatch(setUser(tempUser));
    }


  }, [userById, dispatch, user, firstName, lastName, phoneNumber]);

  useEffect(() => {
    if (isSuccess && submitted) {
      toast.success("Profile updated Successfully")
      navigate('/home', { replace: true })
      fetchUserProfile();
      setSubmitted(false)
    }

  }, [isSuccess, submitted, fetchUserProfile, navigate])

  return (
    <div className="completeProfileWrapper">
      <header className="navbar"><h2>G.E.R</h2>
        <h6>Please complete your profile below</h6></header>
      <form className="content" onSubmit={handleSubmit}>
        <div className="profileDetail">
          <h3 >
            1. Contact Details
          </h3>
          <div className="profileDetailBody">
            <div className="profileDetailBodyInput">
              <CustomInput
                type="text"
                label="First Name"
                value={firstName}
                name="firstName"
                placeholder="E.g. Jane"
                errorMessage={errors.firstName}
                required={true}
                onChange={handleChange} />
            </div>
            <div className="profileDetailBodyInput">
              <CustomInput
                type="text"
                label="Last Name"
                value={lastName}
                name="lastName"
                placeholder="E.g. Doe"
                required={true}
                errorMessage={errors.lastName}
                onChange={handleChange} />
            </div>
            <div className="profileDetailBodyInput">
              <CustomInput
                type="email"
                label="Email"
                value={user?.email ?? ""}
                name="email"
                disabled={true}
                placeholder="E.g. test@griffinglobaltech.com"
                errorMessage={null}
                required={true}
                onChange={() => { }} />
            </div>
            <div className="profileDetailBodyInput">
              <CustomInput
                type="tel"
                label="Phone Number"
                value={phoneNumber ?? ""}
                name="phoneNumber"
                placeholder="E.g. +254703298507"
                errorMessage={errors.phoneNumber}
                onChange={handleChange} />
            </div>

          </div>
        </div>
        <div className="profileDetail">
          <h3 >
            2. Education Details
          </h3>
          <EducationDetailsList

            educationDetails={educationDetails}
            setEducationDetails={setEducationDetails} errors={errors} validateForm={validateEducationDetails} />
        </div>
        <div className="profileDetail">
          <h3 >
            3. Job Experience
          </h3>
          <JobExperienceList
            experienceDetails={experienceDetails}
            setExperienceDetails={setExperienceDetails} errors={errors} validateForm={validateExperienceDetails} />

        </div>
        <div className="profileDetail">
          <h3 >
            4. Skills
          </h3>
          <SkillsList

            skills={skills}
            setSkills={setSKills} errors={errors} validateForm={validateSkills}
          />

        </div>
        <div className="profileDetail">
          <h3 >
            5. Certifications
          </h3>
          <CertificationsList

            certifications={certifications}
            setCertifications={setCertifications} errors={errors} validateForm={() => validateCertifications(true)} />
        </div>
        <div className="profileDetail">
          <h3 >
            6. Projects
          </h3>
          <ProjectsList projects={projects}
            setProjects={setProjects} errors={errors} validateForm={() => validateProjects(true)}
          />

          {isLoading && <Spinner />}
          {!isLoading && <SubmitButton value='Submit Profile' disabled={false} />}
        </div>

      </form>
    </div>
  )
}

export default CompleteProfilePage
