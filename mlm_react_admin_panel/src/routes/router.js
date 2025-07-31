import React from 'react';
import { Navigate } from 'react-router-dom';
import MainDashboard from '../views/dashboard/MainDashboard';
import AuthLayout from '../Layouts/AuthLayout';
import GeneralSettings from '../views/general-settings/generalSettings';
import ProfileLayout from '../views/profile/MainProfile';
import StaffLayout from '../views/staff/MainStaff';
import RoleLayout from '../views/role/MainRole';
import RoleAddEditPage from '../components/role/roleAddEditPage';

const publicRoutes = [
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login/:adminUsername?/:username?',
    element: <AuthLayout />
  },
];

const privateRoutes = [
  {
    path: '/dashboard',
    element: <MainDashboard />,
  },
  {
    path: '/general-settings',
    element: <GeneralSettings />,
  },
  {
    path: '/profile',
    element: <ProfileLayout />,
  },
  {
    path: '/staff',
    element: <StaffLayout />,
  },
  // {
  //   path: '/staff/add',
  //   element: <StaffLayout />,
  // },
  // {
  //   path: '/staff/edit',
  //   element: <StaffLayout />,
  // },
  // {
  //   path: '/staff/view',
  //   element: <StaffLayout />,
  // },
  {
    path: '/role',
    element: <RoleLayout />,
  },
  {
    path: '/role/add',
    element: <RoleAddEditPage />,
  },
  {
    path: '/role/edit',
    element: <RoleAddEditPage />,
  },
  {
    path: '/role/view',
    element: <RoleAddEditPage />,
  },
]

const webRoutes = []

export { privateRoutes, publicRoutes, webRoutes }
