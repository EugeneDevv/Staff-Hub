import { useEffect, useState } from "react";
import {  Role } from "../../../../domain/models/project.model";
import CustomDropdown from "../../AppInputs/CustomDropdown"
import {  useLazyGetProjectRolesQuery } from "../../../../application/services/authApi";
import { clearRoleFilter, setRoleFilter } from "../../../../application/slices/authSlice";
import { useDispatch } from "react-redux";


interface Props {
  setSearchCount: () => void;
}

const RoleFilterDropDown: React.FC<Props> = ({ setSearchCount }) => {
  
  const roleId = localStorage.getItem("roleFilter");
  let loadedRole: number | undefined = undefined;
  if (roleId != null && (roleId?.length ?? 0) > 0) {
    loadedRole = +roleId;
  }

  const [fetchRoles, data] = useLazyGetProjectRolesQuery();

  const [loadedRoles, setLoadedRoles] = useState<Role[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRolesData = async () => {
      await fetchRoles({});
    };

    fetchRolesData();
  }, [fetchRoles]);

  useEffect(() => {
    if (data) {
      console.log('data?.data', data?.data);
      
      const projects = data?.data?.data ?? [];
      setLoadedRoles(projects);
    }
  }, [data]);

  const selectedRole = loadedRoles.find(c => c.projectRoleId === loadedRole);

  const handClientDropDownChange = async (value: string | null) => {

    if (value === 'All') {
      dispatch(clearRoleFilter())
    } else {
      const role = loadedRoles.find(role => role.projectRoleName === value);

      if (role?.projectRoleId) {
        dispatch(setRoleFilter(role.projectRoleId))
      }
    }
    setSearchCount()

  };

  return (
    <div>
      <CustomDropdown options={['All'].concat(loadedRoles.map((role) => role.projectRoleName))} onSelect={handClientDropDownChange} errorMessage='' hint={loadedRole != 0 ? loadedRoles.find(role => role.projectRoleId === loadedRole)?.projectRoleName : 'All'} initialSelection={selectedRole != undefined ? selectedRole.projectRoleName : null} />
    </div>
  )
}

export default RoleFilterDropDown
