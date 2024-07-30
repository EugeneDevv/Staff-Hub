import "./RolesComponent.scss";
import CustomInput from "../AppInputs/CustomInput";
import { useEffect, useState, useCallback } from "react";
import {
  useLazyGetProjectRolesQuery,
  useLazyGetProjectRolesUsersQuery,
  useLazySingleUserQuery,
} from "../../../application/services/authApi";
import "../Projects/ProjectsComponent.scss";
import UpdateRole from "../modals/UpdateRole";
import AddRole from "../modals/AddRole";
import DeleteRole from "../modals/DeleteRole";
import Spinner from "../Spinner/Spinner";
import { toast } from "react-toastify";
import ViewProfileModal from "../modals/ViewProfileModal";
import { useDispatch } from "react-redux";
import { setSelectedUser } from "../../../application/slices/authSlice";
import { UserProfile } from "../../../domain/models/user.model";
import { ApiResponse } from "../../../application/apiTypes";
import { getUser } from "../../../domain/valueObjects/utils";

interface ProjectRoles {
  projectRoleId: number;
  projectRoleName: string;
}
interface IUserProjectRole {
  userId: string;
  firstName: string;
  lastName: string;
  roleId: number;
  roleName: string;
}
const RolesComponent = () => {
  const [searchRole, setSearchRole] = useState<string>("");
  const [projectRoles, setProjectRoles] = useState<ProjectRoles[]>([]);
  const [fetchProjectRoles] = useLazyGetProjectRolesQuery({});
  const [projectRoleId, setProjectRoleId] = useState<number>(0);
  const [projectRoleName, setProjectRoleName] = useState<string>("");
  const [getProjectRolesUsers] = useLazyGetProjectRolesUsersQuery({});
  const [roleUsers, setRoleUsers] = useState<IUserProjectRole[]>([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [showUpdateRoleModal, setShowUpdateRoleModal] =
    useState<boolean>(false);
  const [showAddNewRoleModal, setShowAddNewRoleModal] =
    useState<boolean>(false);
  const [showDeleteRoleModal, setShowDeleteRoleModal] =
    useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModalViewProfile, setOpenModalViewProfile] = useState(false);

  const [userById, { isLoading }] = useLazySingleUserQuery();
  const user = getUser();

  const isAdmin = user?.role === "SuperAdmin" || user?.role === "Admin";

  const dispatch = useDispatch();

  const togglePopup = (id: number, roleName: string) => {
    setPopupVisible(!popupVisible);
    setProjectRoleId(id);

    setProjectRoleName(roleName);
    getProjectRolesUsers(id)
      .then((res) => {
        console.log(res);
        setRoleUsers(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const startRoleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim().toLowerCase();
    setSearchRole(inputValue);
    console.log(inputValue);

    const Count = inputValue.length;
    if (Count > count) {
      setCount(Count);
    }
    if (Count < count) {
      fetchProjectRoles({})
        .then((res) => {
          const filteredRoles: ProjectRoles[] = res.data.data.filter(
            (role: ProjectRoles) =>
              role.projectRoleName.toLowerCase().includes(inputValue)
          );

          setProjectRoles(filteredRoles);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const filteredRoles: ProjectRoles[] = projectRoles.filter((role) =>
      role.projectRoleName.toLowerCase().includes(inputValue)
    );

    setProjectRoles(filteredRoles);
    console.log(filteredRoles);

    if (inputValue.length === 0) {
      FetchProjectRoles();
    }
  };

  const FetchProjectRoles = useCallback(() => {
    setLoading(true);
    fetchProjectRoles({})
      .then((res) => {
        setLoading(false);
        if (res.data.data && res.data.data.length > 0) {
          const sortedRoles = [...res.data.data].sort((a, b) =>
            a.projectRoleName.localeCompare(b.projectRoleName)
          );
          setProjectRoles(sortedRoles);
          setProjectRoleName(sortedRoles[0].projectRoleName);
          setProjectRoleId(sortedRoles[0].projectRoleId);
          getProjectRolesUsers(sortedRoles[0].projectRoleId)
            .then((res) => {
              console.log(res);
              setRoleUsers(res.data.data);
            })
            .catch((err) => {
              console.log(err);
              toast.warn("An error occurred");
              setLoading(false);
            });
        } else {
          console.error("Data is empty or undefined.");
        }
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [fetchProjectRoles, getProjectRolesUsers]);
  const showUsers = (roleId: number, roleName: string) => {
    setLoading(true)
    setProjectRoleId(roleId);
    setProjectRoleName(roleName);
    getProjectRolesUsers(roleId)
      .then((res) => {
        console.log(res);
        setLoading(false)
        setRoleUsers(res.data.data);
      })
      .catch((err) => {
        setLoading(false)
        console.log(err);
      });
  };
  const updateRole = () => {
    setShowUpdateRoleModal(true);
  };
  const deleteRole = () => {
    setShowDeleteRoleModal(true);
  };
  const closeUpdateRole = () => {
    setShowUpdateRoleModal(false);
    setShowAddNewRoleModal(false);
    setShowDeleteRoleModal(false);
    setPopupVisible(false);
    FetchProjectRoles();
    setSearchRole("");
  };
  const openAddNewRole = () => {
    setShowAddNewRoleModal(true);
  };

  const openProfile = async (userId: string) => {
    await userById({ userId: userId })
      .then((res: ApiResponse) => {
        if (res?.error) {
          console.log(res);
        } else {
          const userProfile: UserProfile = res?.data.data;

          console.log("userProfile", userProfile);

          dispatch(setSelectedUser(userProfile));

          setOpenModalViewProfile(true);
        }
      })
      .catch((e: Error) => {
        toast.error(e?.message);
      });
  };
  const closeProfile = () => {
    setOpenModalViewProfile(false);
  };
  useEffect(() => {
    FetchProjectRoles();
  }, [FetchProjectRoles]);

  return (
    <div className="RolePg">
      {loading && (
        <div className="loaderSpinner">
          <Spinner />
        </div>
      )}
      <div className="AddRole">
        <div className="searchRole">
          <CustomInput
            type="text"
            value={searchRole}
            name={""}
            placeholder="E.g Developer"
            errorMessage=""
            onChange={startRoleSearch}
            label="Search Role"
          />
        </div>
        <div className="AddRoleBtn">
          <button onClick={openAddNewRole}>Add New Role</button>
        </div>
      </div>
      <div className="sec2">
        <div className="addScroll">
          <div className="displayRolesEmployee">
            <p className="rolesAvailable">
              {projectRoles.length} Roles Available
            </p>
            <div className="roles">
              {projectRoles.map((roles: ProjectRoles) => (
                <div
                  className={
                    roles.projectRoleId === projectRoleId
                      ? "roleClicked"
                      : "roleNotClicked"
                  }
                >
                  <p
                    className="roleName"
                    onClick={() =>
                      showUsers(roles.projectRoleId, roles.projectRoleName)
                    }
                  >
                    {roles.projectRoleName}
                  </p>

                  <div className="iconContainer">
                    <p
                      className="moreIcon"
                      onClick={() =>
                        togglePopup(roles.projectRoleId, roles.projectRoleName)
                      }
                      id="moreIcon"
                    >
                      Hello
                    </p>
                    {roles.projectRoleId === projectRoleId && popupVisible && (
                      <div className="menuProjects">
                        <ul>
                          <li onClick={updateRole}>Update Role</li>
                          <li onClick={deleteRole} className="delClient">
                            Delete Role
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="disEmployee">
          <p className="employeeHeading">
            Employees who are <p className="RoleName">'{projectRoleName}'</p>
          </p>
          {roleUsers.map((roleUsers: IUserProjectRole) => (
            <div className="disEmployeeViewProfile">
              <p>
                {roleUsers.firstName} {roleUsers.lastName}
              </p>
              {isLoading && <Spinner />}
              {!isLoading && (
                <button
                  className="viewProfile"
                  onClick={() => openProfile(roleUsers.userId)}
                >
                  View Profile
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <UpdateRole
        ModalOpen={showUpdateRoleModal}
        onClose={closeUpdateRole}
        roleId={projectRoleId}
        roleName={projectRoleName}
      />
      <AddRole ModalOpen={showAddNewRoleModal} onClose={closeUpdateRole} />
      <DeleteRole
        ModalOpen={showDeleteRoleModal}
        onClose={closeUpdateRole}
        RoleId={projectRoleId}
        RoleName={projectRoleName}
      />
      <ViewProfileModal
        isModalOpen={openModalViewProfile}
        onClose={closeProfile}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default RolesComponent;
