import ReactDOM from 'react-dom/client'
import './index.css'
import './App.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './presentation/pages/Login/LoginPage';
import NotFoundPage from './presentation/pages/NotFound/NotFoundPage';
import ResetPassword from './presentation/pages/ResetPassword/ResetPassword'
import { Provider } from "react-redux"
import { store } from './infrastructure/app/store'
import 'react-toastify/dist/ReactToastify.css'
import VerifyOtpPage from './presentation/pages/VerifyOtp/VerifyOtpPage';
import { ToastContainer } from 'react-toastify';
import SetNewPasswordPage from './presentation/pages/SetNewPassword/SetNewPasswordPage';
import ProtectedRoute from './presentation/appRouter/ProtectedRoute';
import SecurityQuestion from './presentation/pages/SecurityQuestion/SecurityQuestion';
import CompleteProfilePage from './presentation/pages/CompleteProfile/CompleteProfilePage';
import HomePage from './presentation/pages/Home/HomePage';
import ProjectsPage from './presentation/pages/Projects/ProjectsPage';
import SkillsPage from './presentation/pages/Skills/SkillsPage';
import RolesPage from './presentation/pages/Roles/RolesPage';
import UpdateProfilePage from './presentation/pages/CompleteProfile/UpdateProfilePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>,
    errorElement: <NotFoundPage />
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/verify-otp',
    element: <VerifyOtpPage />
  },
  {
    path: '/new-password',
    element: <SetNewPasswordPage />
  },
  {
    path: '/complete-profile',
    element: <CompleteProfilePage />
  },
  {
    path: '/update-profile',
    element: <ProtectedRoute>
      <UpdateProfilePage />
    </ProtectedRoute>
  },
  {
    path: '/home',
    element: <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>,
  },
  {
    path: '/projects',
    element: <ProtectedRoute>
      <ProjectsPage />
    </ProtectedRoute>,
  },
  {
    path: '/skills',
    element: <ProtectedRoute>
      <SkillsPage />
    </ProtectedRoute>,
  },

  {
    path: '/roles',
    element: <ProtectedRoute adminOnly={true}>
      <RolesPage />
    </ProtectedRoute>,
  },
  {
    path: '/security-question',
    element: <ProtectedRoute>
      <SecurityQuestion />
    </ProtectedRoute>
  }

]);

ReactDOM.createRoot(document.getElementById('root')!).render(

  <Provider store={store}>
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>

  </Provider>
)
