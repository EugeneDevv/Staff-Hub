import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  SingleUserResponse,
  User,
  UserResponse,
} from "../../domain/models/user.model";
import { EducationPayload } from "../../domain/models/education.model";
import { ExperiencePayload } from "../../domain/models/experience.model";
import { CertificationPayload } from "../../domain/models/certification.model";
import { SkillPayload } from "../../domain/models/skill.model";
import { ProjectPayload } from "../../domain/models/project.model";
import { getUser } from "../../domain/valueObjects/utils";
import { baseUrlString } from "../../domain/valueObjects/appStrings";

const user = getUser();

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: baseUrlString,
    prepareHeaders: (headers) => {

const token = localStorage.getItem("accessToken");

const parsedToken = token ? JSON.parse(token) : {};

      if (token) {
        headers.set('Authorization', `Bearer ${parsedToken}`);
      }
      return headers;
    },

   }),
  
  tagTypes: ["User", "Clients", "Projects", "ProjectTeam"],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body: { email: string; password: string }) => {
        return {
          url: "/login",
          method: "POST",
          body: body,
        };
      },
    }),
    requestPasswordReset: builder.mutation({
      query: ({ email }: { email: string }) => {
        return {
          url: "/verifyEmail",
          method: "POST",
          params: { email },
        };
      },
    }),
    verifyOtp: builder.mutation({
      query: ({ otp }: { otp: string }) => {
        const email: string = localStorage.getItem("email") ?? "";
        return {
          url: "/verifyOtp",
          method: "POST",
          params: { email, otp },
        };
      },
    }),
    setNewPassword: builder.mutation({
      query: ({ password }: { password: string }) => {
        let email: string = (
          localStorage.getItem("email") ?? ""
        ).toLocaleLowerCase();

        if (email.trim().length === 0) {
          const user: User = JSON.parse(localStorage.getItem("user") ?? "");
          email = user.email.toLocaleLowerCase();
        }
        return {
          url: "/setNewPassword",
          method: "PUT",
          params: { email, password },
        };
      },
    }),
    getSecurityQuestion: builder.query({
      query: () => ({
        url: "/api/SecurityQuestions",
        method: "GET",
      }),
    }),
    setSecurityQuestions: builder.mutation({
      query: (data) => ({
        url: "/api/SecurityQuestions",
        method: "POST",
        body: data,
      }),
    }),
    createProfile: builder.mutation({
      query: (body: {
        contacts: {
          firstName: string;
          lastName: string;
          phoneNumber: string | null;
        };
        education: EducationPayload[];
        experience: ExperiencePayload[];
        certification: CertificationPayload[];
        skills: SkillPayload[];
        project: ProjectPayload[];
      }) => {
        const user: User = JSON.parse(localStorage.getItem("user") ?? "");

        console.log(body);

        return {
          url: `/api/Profiles/${user.userId}`,
          method: "POST",
          body,
        };
      },
    }),
    updateProfile: builder.mutation({
      query: ({
        userId,
        body,
      }: {
        userId: string;
        body: {
          contacts: {
            firstName: string;
            lastName: string;
            phoneNumber: string | null;
          };
          education: EducationPayload[];
          experience: ExperiencePayload[];
          certification: CertificationPayload[];
          skills: SkillPayload[];
          project: ProjectPayload[];
        };
      }) => {

        return {
          url: `/api/Profiles/${userId}`,
          method: "PUT",
          body,
        };
      },
    }),
    geSkills: builder.query({
      query: () => ({
        url: "api/skills",
        method: "GET",
      }),
    }),
    getProjectRoles: builder.query({
      query: () => ({
        url: "api/Projects/roles",
        method: "GET",
      }),
    }),
    getProjects: builder.query({
      query: ({ id }: { id: number }) => ({
        url: `api/Projects/ActiveProjects/${id}`,
        method: "GET",
      }),
      providesTags: ["Projects"],
    }),
    getClients: builder.query({
      query: () => ({
        url: "api/Projects/clients",
        method: "GET",
      }),
      providesTags: ["Clients"],
    }),

    addUser: builder.mutation({
      query: (data) => ({
        url: "/api/Users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/api/Password/reset-password",
        method: "PUT",
        params: data,
      }),
    }),
    getProjectTeam: builder.query({
      query: (projectId) => ({
        url: `api/Projects/project-team/${projectId}`,
        method: "GET",
      }),
      providesTags: ["ProjectTeam"],
    }),
    addProject: builder.mutation({
      query: (data) => ({
        url: "api/Projects/project",
        method: "POST",
        body: data,
      }),
    }),
    getSecurityQuestionAndAnswers: builder.query({
      query: () => ({
        url: `api/SecurityQuestions/${user?.userId}`,
        method: "GET",

      }),
    }),
    fetchSecurityQuestions: builder.query({
      query: (userId) => ({
        url: `api/SecurityQuestions/${userId}`,
        method: "GET",
      }),
    }),
    updateSecurityQuestion: builder.mutation({
      query: (data) => ({
        url: `api/SecurityQuestions/${user?.userId}`,
        method: "PUT",
        body: data,
      }),
    }),

    addSkill: builder.mutation({
      query: (data) => ({
        url: "api/Skills",
        method: "POST",
        body: data,
      }),
    }),

    // Users
    users: builder.query<UserResponse, { searchQuery?: string; page?: number }>(
      {
        query: ({ searchQuery, page }) => {
          // Client Filter
          const clientId = localStorage.getItem("clientFilter");
          let client: number | undefined = undefined;
          if (clientId != null && (clientId?.length ?? 0) > 0) {
            client = +clientId;
          }

          // Role Filter
          const roleId = localStorage.getItem("roleFilter");
          let role: number | undefined = undefined;
          if (roleId != null && (roleId?.length ?? 0) > 0) {
            role = +roleId;
          }
          // Skill Filter
          const skillId = localStorage.getItem("skillFilter");
          let skill: string | undefined = undefined;
          if (skillId != null && (skillId?.length ?? 0) > 0) {
            skill = skillId;
          }

          return {
            url: "/api/Users",
            params: { searchQuery, page, client, role, skill },
          };
        },
        providesTags: ["User"],
      }
    ),
    singleUser: builder.query<SingleUserResponse, { userId: string }>({
      query: ({ userId }: { userId: string }) => ({
        url: `/api/Users/${userId}`,
      }),
    }),
    suspendUser: builder.mutation({
      query: ({ userId, reason }: { userId: string; reason: string }) => ({
        url: `/api/Users/suspend/${userId}`,
        method: "POST",
        params: { reason },
      }),
      invalidatesTags: ["User"],
    }),
    unSuspendUser: builder.mutation<void, string>({
      query: (userId) => {
        return {
          url: `/api/Users/unsuspend/${userId}`,
          method: "POST",
          params: { userId },
        };
      },
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (userId) => {
        return {
          url: `/api/Users/${userId}`,
          method: "DELETE",
          params: { userId },
        };
      },
      invalidatesTags: ["User"],
    }),
    getProjectRolesUsers: builder.query({
      query: (roleId) => ({
        url: `/api/Role/get-names-by-role`,
        method: "GET",
        params: { projectRoleId: roleId },
      }),
    }),
    updateProjectRole: builder.mutation({
      query: (data) => ({
        url: "/api/Role/update-project-role",
        method: "PUT",
        body: data,
      }),
    }),
    getSkills: builder.query({
      query: () => ({
        url: "/api/Skills",
        method: "GET",
      }),
    }),
    getUsersBySkills: builder.query({
      query: (skillId) => ({
        url: `/api/Skills/get-users-by-skill`,
        method: "GET",
        params: { skillId: skillId },
      }),
    }),
    updateSkill: builder.mutation({
      query: (skillId) => ({
        url: `/api/Skills`,
        method: "PUT",
        params: { skillId: skillId.skillId },
        body: { name: skillId.name },
      }),
    }),
    addRole: builder.mutation({
      query: (data) => ({
        url: "/api/Role",
        method: "POST",
        body: { roleName: data },
      }),
    }),
    deleteSkill: builder.mutation({
      query: (skillId) => ({
        url: `/api/Skills/${skillId}`,
        method: "DELETE",
      }),
    }),
    deleteRole: builder.mutation({
      query: (roleId) => ({
        url: "/api/Role",
        method: "DELETE",
        params: { roleId: roleId },
      }),
    }),

    addClient: builder.mutation({
      query: ({ clientName }) => ({
        url: "/api/Clients",
        method: "POST",
        body: { clientName: clientName },
      }),
      invalidatesTags: ["Clients"],
    }),
    updateClient: builder.mutation({
      query: ({ clientId, clientName }) => ({
        url: `/api/Clients/${clientId}`,
        method: "PUT",
        body: { clientName: clientName },
      }),
      invalidatesTags: ["Clients"],
    }),
    deleteClient: builder.mutation({
      query: (clientId) => ({
        url: `/api/Clients/${clientId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients"],
    }),
    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `/api/Projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients", "Projects", "ProjectTeam"],
    }),
    removeTeamMember: builder.mutation({
      query: ({
        projectId,
        userId,
        roleId,
      }: {
        projectId: number;
        userId: string;
        roleId: number;
      }) => ({
        url: `/api/Team/${userId}`,
        method: "DELETE",
        params: { projectId: projectId, roleId: roleId },
      }),
      invalidatesTags: ["Projects", "ProjectTeam"],
    }),

    answerSecurityQuestion: builder.mutation({
      query: (data) => ({
        url: `/api/SecurityQuestions/${data.userId}`,
        method: "POST",
        params: { email: data.email, otp: data.otp },
        body: data,
      }),
    }),

    updateProject: builder.mutation({
      query: (data) => ({
        url: `/api/Projects/${data.projectId}`,
        method: "PUT",
        body: data,
      }),
    }),
    searchUserTeam: builder.query({
      query: (data) => ({
        url: "/api/Users/searchUser",
        method: "GET",
        params: {name:data}
      })
    }),
    addEmployeeToTeam:builder.mutation({
      query:(data)=>({
        url:"/api/Team",
        method:"POST",
        body:data

      })
    })
    
  }),
});

export const {
  useLoginUserMutation,
  useRequestPasswordResetMutation,
  useVerifyOtpMutation,
  useSetNewPasswordMutation,
  useGetSecurityQuestionQuery,
  useSetSecurityQuestionsMutation,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useAddUserMutation,
  useLazyGetClientsQuery,
  useLazyGetProjectRolesQuery,
  useLazyGetProjectsQuery,
  useLazyGeSkillsQuery,
  useGetClientsQuery,
  useLazyGetProjectTeamQuery,
  useAddProjectMutation,
  useResetPasswordMutation,
  useLazyGetSecurityQuestionAndAnswersQuery,
  useUpdateSecurityQuestionMutation,
  useAddSkillMutation,
  useDeleteRoleMutation,
  useLazyFetchSecurityQuestionsQuery,
  useAnswerSecurityQuestionMutation,
  useUpdateProjectMutation,
  useLazySearchUserTeamQuery,
  useAddEmployeeToTeamMutation,
  // Users
  useUsersQuery,
  useLazySingleUserQuery,
  useSuspendUserMutation,
  useLazyGetProjectRolesUsersQuery,
  useUpdateProjectRoleMutation,
  useLazyGetSkillsQuery,
  useLazyGetUsersBySkillsQuery,
  useUpdateSkillMutation,
  useAddRoleMutation,
  useUnSuspendUserMutation,
  useLazyUsersQuery,
  useDeleteUserMutation,
  useDeleteSkillMutation,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useDeleteProjectMutation,
  useRemoveTeamMemberMutation,
} = authApi;
