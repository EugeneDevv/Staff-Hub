import { Filters } from "./filters.model";
import { Pagination } from "./pagination.model";
import { User } from "./user.model";
import { UserState } from "./userState.model";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  userState: UserState;
  userPagination: Pagination;
  filters: Filters,
}
