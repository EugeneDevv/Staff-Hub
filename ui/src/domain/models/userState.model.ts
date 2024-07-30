import { UserProfile } from "./user.model";

export interface UserState {
  userProfile: UserProfile | null;
  selectedUser: UserProfile | null;
  users: UserProfile[];
  usersCount: number;
  searchQuery: string;
  updateMyProfile: boolean;
}
