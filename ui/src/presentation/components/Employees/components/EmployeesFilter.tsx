import { useCallback, useEffect, useRef, useState } from "react";
import { useLazyUsersQuery } from "../../../../application/services/authApi";
import SearchIcon from "../../../../assets/SearchIcon";
import CustomInput from "../../AppInputs/CustomInput";
import { useDispatch } from "react-redux";
import { setUserPagination, setUserSearchQuery, setUsers } from "../../../../application/slices/authSlice";
import { toast } from "react-toastify";
import ClientFilterDropDown from "./ClientFilterDropDown";
import RoleFilterDropDown from "./RoleFilterDropDown";
import SkillFilterDropDown from "./SkillFilterDropDown";

interface Props {
  setIsLoadingUsers: (val: boolean) => void;
  setSearchCount: () => void;
}

const EmployeesFilter: React.FC<Props> = ({ setIsLoadingUsers, setSearchCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchClients, { data }] = useLazyUsersQuery({});
  const dispatch = useDispatch();
  const fetchClientsCallback = useCallback(async (query: string) => {
    try {
      if (query.trim().length > 0) {
        setIsLoadingUsers(true);
        await fetchClients({ searchQuery: query }).then((res) => {
          setIsLoadingUsers(false);

          if (res.data?.pagination) {

            dispatch(setUserPagination(res.data?.pagination));
          }
        })
          .catch((err) => {
            setIsLoadingUsers(false);
            toast.warn(err.error);
          });
      } else {

        setIsLoadingUsers(true);
        await fetchClients({}).then((res) => {
          setIsLoadingUsers(false);
          if (res.data?.pagination) {
            dispatch(setUserPagination(res.data?.pagination));
          }
        })
          .catch((err) => {
            setIsLoadingUsers(false);
            toast.warn(err.error);
          });
      }
    } catch (error) {
      // Handle any errors here
      console.error('Error searching users:', error);
    }

    dispatch(setUserSearchQuery(query));
  }, [fetchClients, setIsLoadingUsers, dispatch]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current) {
      const delay = setTimeout(() => {
        fetchClientsCallback(searchQuery)
      }, 300); // 300 milliseconds delay
      return () => clearTimeout(delay); // Clear the timeout on cleanup
    } else {
      isFirstRender.current = false; // Set to false after the first render
    }
  }, [searchQuery, fetchClientsCallback]);

  useEffect(() => {
    if (data?.data) {
      dispatch(setUsers(data.data));

      dispatch(setUserPagination(data.pagination));
    }
  }, [data, dispatch]);

  return (
    <div className="employeesFilter">
      <div className="filterItem">
        <div className="filterTitle">Clients</div>
        <div className="filterField">
          <ClientFilterDropDown setSearchCount={() => {            
            setSearchQuery(searchQuery.concat(' '));
            setSearchCount();
          }} />
        </div>
      </div>
      <div className="filterItem">
        <div className="filterTitle">Role</div>
        <div className="filterField">
          <RoleFilterDropDown setSearchCount={() => {
            setSearchQuery(searchQuery.concat(' '));
            setSearchCount();
          }} />
        </div>
      </div>
      <div className="filterItem">
        <div className="filterTitle">Skill</div>
        <div className="filterField">
          <SkillFilterDropDown setSearchCount={() => {
            setSearchQuery(searchQuery.concat(' '));
            setSearchCount();
          }} />
        </div>
      </div>
      <div className="filterItem searchField">
        <div className="filterTitle">Search</div>
        <div className="filterField">
          <CustomInput
            type="text"
            value={searchQuery.trim()}
            placeholder="Type to search user"
            errorMessage=''
            leadingIcon={<SearchIcon />}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchCount();
            }} />
        </div>
      </div>
    </div>
  );
};

export default EmployeesFilter;
