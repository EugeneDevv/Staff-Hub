import React, { useCallback, useEffect, useState } from "react";
import OutlinedButton from "../../Buttons/OutlinedButton";
import { useLazyUsersQuery } from "../../../../application/services/authApi";
import { setUserPagination, setUsers } from "../../../../application/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../infrastructure/app/store";

interface Props {
  setIsLoadingUsers: (val: boolean) => void;
  searchCount: number;
}
const PaginationFooter: React.FC<Props> = ({ setIsLoadingUsers, searchCount }) => {

  const authState = useSelector((state: RootState) => state.auth);

  const paginationData = authState?.userPagination ?? {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 1,
    previousPage: 0,
    nextPage: 2,
    size: 0,
  };

  const searchQuery = authState.userState.searchQuery.trim()

  const parsedSearchQuery = searchQuery.length > 0 ? searchQuery : undefined

  const [fetchClients, { data, isSuccess }] = useLazyUsersQuery();

  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(paginationData.currentPage);
  const [pageChanged, setPageChanged] = useState(false);
  const [localSearchCount, setLocalSearchCount] = useState(0);

  if (searchCount > localSearchCount) {
    setCurrentPage(1);
    setPageChanged(false);
    setLocalSearchCount(searchCount);
  }

  const fetchClientsCallback = useCallback(async (page: number) => {
    try {
      setIsLoadingUsers(true);

      await fetchClients({
        page: page, searchQuery: parsedSearchQuery
      }).then((res) => {

        const pagination = res?.data?.pagination;


        if (pagination) {

          dispatch(setUserPagination(pagination));
        }

        setIsLoadingUsers(false);
      })
        .catch((error) => {
          console.log(error.error);

          setIsLoadingUsers(false);
        });
    } catch (error) {
      console.error('Error searching users:', error);
    }

  }, [fetchClients, setIsLoadingUsers, dispatch, parsedSearchQuery]);

  useEffect(() => {
    if (pageChanged) { fetchClientsCallback(currentPage) }
  }, [currentPage, fetchClients, fetchClientsCallback, pageChanged]);


  useEffect(() => {
    if (data?.data) {
      dispatch(setUsers(data.data));
    }
  }, [data, dispatch, isSuccess])

  const totalPages = paginationData?.totalPages;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPageChanged(true)
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setPageChanged(true)
    }
  };

  return (
    <div className="employeesFooter">
      <OutlinedButton text='Previous' onClick={handlePrevPage} className={`paginationButton ${currentPage < 2 ? 'disabledButton' : ''}`} />
      {pages.map((page) => (
        <p key={page} onClick={() => {
          setCurrentPage(page)
          setPageChanged(true)
        }
        } className={`${page === currentPage ? "selected" : ""}`}>{page}</p>
      ))}
      <OutlinedButton text='Next' onClick={handleNextPage} className={`paginationButton ${currentPage > (totalPages - 1) ? 'disabledButton' : ''}`} />
    </div>
  )
}

export default PaginationFooter;
