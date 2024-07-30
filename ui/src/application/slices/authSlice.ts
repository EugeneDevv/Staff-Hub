import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../infrastructure/app/store";
import { AuthState } from "../../domain/models/authState.model";
import { User, UserProfile } from "../../domain/models/user.model";
import { Pagination } from "../../domain/models/pagination.model";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoggedIn: false,
  userState: {
    userProfile: null,
    selectedUser: null,
    users: [],
    usersCount: 0,
    searchQuery: "",
    updateMyProfile: true,
  },
  filters: {
    client: null,
    role: null,
    skill: null,
  },
  userPagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 1,
    previousPage: 0,
    nextPage: 2,
    size: 0,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("isLoggedIn", "true");
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      localStorage.setItem("user", "");
      localStorage.setItem("isLoggedIn", "false");
      state.user = null;
      state.isLoggedIn = false;
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      localStorage.setItem("accessToken", JSON.stringify(action.payload));
      state.accessToken = action.payload;
    },
    clearAccessToken: (state) => {
      localStorage.setItem("accessToken", "");
      state.accessToken = null;
    },

    // Users
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      localStorage.setItem("userProfile", JSON.stringify(action.payload));
      state.userState.userProfile = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<UserProfile>) => {
      localStorage.setItem("selectedUser", JSON.stringify(action.payload));
      state.userState.selectedUser = action.payload;
    },
    setUsers: (state, action: PayloadAction<UserProfile[]>) => {
      localStorage.setItem("users", JSON.stringify(action.payload));
      localStorage.setItem("usersCount", JSON.stringify(action.payload.length));
      state.userState.usersCount = action.payload.length;
      state.userState.users = action.payload;
    },
    setUserPagination: (state, action: PayloadAction<Pagination>) => {
      localStorage.setItem("userPagination", JSON.stringify(action.payload));
      state.userPagination = action.payload;
    },
    setUserSearchQuery: (state, action: PayloadAction<string>) => {
      localStorage.setItem("searchQuery", JSON.stringify(action.payload));
      state.userState.searchQuery = action.payload;
    },
    setClientFilter: (state, action: PayloadAction<number>) => {
      localStorage.setItem("clientFilter", JSON.stringify(action.payload));
      state.filters.client = action.payload;
    },
    setRoleFilter: (state, action: PayloadAction<number>) => {
      localStorage.setItem("roleFilter", JSON.stringify(action.payload));
      state.filters.role = action.payload;
    },
    setSkillFilter: (state, action: PayloadAction<string>) => {
      localStorage.setItem("skillFilter", JSON.stringify(action.payload));
      state.filters.skill = action.payload;
    },
    setUpdateMyProfile: (state, action: PayloadAction<boolean>) => {
      localStorage.setItem("updateMyProfile", JSON.stringify(action.payload));
      state.userState.updateMyProfile = action.payload;
    },
    clearUserProfile: (state) => {
      localStorage.setItem("userProfile", "");
      state.userState.userProfile = null;
    },
    clearSelectedUser: (state) => {
      localStorage.setItem("selectedUser", "");
      state.userState.selectedUser = null;
    },
    clearUsers: (state) => {
      localStorage.setItem("users", "");
      localStorage.setItem("usersCount", "");
      state.userState.users = [];
      state.userState.usersCount = 0;
    },
    clearClientFilter: (state) => {
      localStorage.setItem("clientFilter", "");
      state.filters.client = null;
    },
    clearRoleFilter: (state) => {
      localStorage.setItem("roleFilter", "");
      state.filters.role = null;
    },
    clearSkillFilter: (state) => {
      localStorage.setItem("skillFilter", "");
      state.filters.skill = null;
    },
    clearFilters: (state) => {
      localStorage.setItem("filters", "");
      state.filters = {
        client: null,
        role: null,
        skill: null,
      };
    },
    clearUpdateMyProfile: (state) => {
      localStorage.setItem("updateMyProfile", 'true');
      state.userState.updateMyProfile = true;
    },
  },
});
export const selectAuth = (state: RootState) => state.auth;
export const {
  setUser,
  clearUser,
  setAccessToken,
  clearAccessToken,

  // Users
  setUserProfile,
  setSelectedUser,
  setUsers,
  setUserPagination,
  setUserSearchQuery,
  setClientFilter,
  setRoleFilter,
  setSkillFilter,
  setUpdateMyProfile,
  clearClientFilter,
  clearUserProfile,
  clearSelectedUser,
  clearUsers,
  clearFilters,
  clearRoleFilter,
  clearSkillFilter,
  clearUpdateMyProfile,
} = authSlice.actions;
export default authSlice.reducer;
