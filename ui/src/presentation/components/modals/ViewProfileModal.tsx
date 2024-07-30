import Modal from "./Modal"
import EditProfileButton from "../../components/Buttons/EditProfileButton";
import './Modal.scss'
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedUser, setUpdateMyProfile } from "../../../application/slices/authSlice";
import { RootState } from "../../../infrastructure/app/store";
import { UserProfile } from "../../../domain/models/user.model";
type Props = {
  isModalOpen: boolean,
  isAdmin?: boolean,
  myProfile?: boolean,
  onClose: () => void;
}

const ViewProfileModal: React.FC<Props> = ({ isModalOpen, onClose, isAdmin = true, myProfile = false }) => {

  const authState = useSelector((state: RootState) => state.auth);

  let user = authState.userState.selectedUser;
  const loggedInUser = authState.userState.userProfile;
  if (myProfile) {
    user = loggedInUser;
    if ((user?.firstName?.length ?? 0) < 1) {
      const localUserJSON = localStorage.getItem("userProfile");

      if (localUserJSON) {
        const localUser: UserProfile = JSON.parse(localUserJSON);
        user = localUser;
      }
    }
  }
   else {
    if ((user?.firstName?.length ?? 0) < 1) {
      const localUserJSON = localStorage.getItem("selectedUser");

      if (localUserJSON) {
        const localUser: UserProfile = JSON.parse(localUserJSON);
        user = localUser;
      }
    }
  }

  const dispatch = useDispatch();
  const handleClose = () => {
    onClose();
    dispatch(clearSelectedUser());
  };

  return (

    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      Heading={"User Skills Profile"}

    >
      <div className="viewProfileModalWrapper">
        <div className="profileItem contactDetails">
          <h6>Contact Details</h6>
          <hr />
          <p className="nameheading">{user?.firstName} {user?.lastName}</p>
          <p>{(user?.userProjects?.length ?? 0) > 0 ? user?.userProjects[0]?.roleName : ""}</p>
          <p>{user?.phoneNumber}</p>
          <p>{user?.email}</p>
        </div>
        <div className="profileItem projects">
          <h6>Projects</h6>
          <hr />
          {(user?.userProjects?.length ?? 0) > 0 ? (user?.userProjects.map((project) => (
            <div>
              <p className="nameheading">{project.clientName}</p>
              <p>{project.name}</p>
              <p className="greenprofiletext">{project.roleName}</p>
              <p>{project.startMonth} {project.startYear} to {project.isContinuing ? 'date' : `${((project?.endMonth?.length ?? 0) > 1 && (project?.endYear ?? 0) > 0) ? `${project.endMonth} ${project.endYear}` : 'date'}`}</p>
            </div>
          ))) : (
            <p className="nameheading">No projects yet</p>
          )}
        </div>
        <div className="profileItem skills">
          <h6>Skills</h6>
          <hr />
          {(user?.userSkills?.length ?? 0) > 0 ? (user?.userSkills.map((skill) => (<div className="oneskill">
            <p className="nameheading">{skill.name}</p>
            <p className="proficiency">{skill.proficiencyLevel}</p>
          </div>))) : (<p className="nameheading">No skills</p>)}
        </div>
        <div className="profileItem educationDetails">
          <h6>Education Details</h6>
          <hr />
          {(user?.educations?.length ?? 0) > 0 ? (user?.educations.map((education) => (
            <div>
              <div className="levelArea">
                <p>{education.levelOfEducation},</p>
                <p>{education.areaOfStudy}</p>
              </div>
              <p className="greenprofiletext">{education.institution}</p>
              <p>{education.isContinuing ? 'Ongoing' : `${((education?.endMonth?.length ?? 0) > 1 && (education?.endYear ?? 0) > 0) ? `${education.endMonth} ${education.endYear}` : 'date'}`}</p>
            </div>
          ))) : (<p>No Education</p>)}


        </div>
        <div className="profileItem jobExperience">

          <h6>Job experience</h6>
          <hr />
          {(user?.experiences?.length ?? 0) > 0 ? (
            user?.experiences.map((experience, index) => (
              <div key={index}>
                <p className="nameheading">{experience.companyName}</p>
                <p className="greenprofiletext">{experience.jobTitle}</p>
                <p>
                  {experience.startMonth} {experience.startYear} to{' '}
                  {experience.isContinuing
                    ? 'date'
                    : `${(experience?.endMonth?.length ?? 0) > 1 &&
                      (experience?.endYear ?? 0) > 0
                      ? `${experience.endMonth} ${experience.endYear}`
                      : 'date'
                    }`}
                </p>
              </div>
            ))
          ) : (
            <p className="nameheading">No experience yet</p>
          )}
        </div>
            <div>
              {user?.certifications ?(
                     <div className="profileItem certifications">
                     <h6>Certifications</h6>
                     <hr />
                     {user.certifications.map(c=>{
                      return(
                        <div>
                        <p className="nameheading">{c.name}</p>
                        <p className="greenprofiletext">{c.issuer}</p>
                        <p>{c.issueYear}</p>
                      </div>
                      )
                     })}
                   </div>
              ):(
                <p className="nameheading">No Certifications</p>
              )}
            </div>
        {isAdmin && <div className="profileItem editContainer">
          <EditProfileButton value="Edit Profile" onTap={() => {
            dispatch(setUpdateMyProfile(myProfile));
          }}/>
        </div>}
      </div>
    </Modal>
  )
}

export default ViewProfileModal