import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { privateRoutes, publicRoutes, webRoutes } from "./routes/router";
import MainLayout from "./Layouts/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsAuthenticated,
  setLoginResponse,
} from "./redux/reducers/adminReducer";
import { useEffect } from "react";
import { setLoginResponseCheck } from "./utils/checkStorage";
import PageTitle from "./components/common/PageTitle";
import ResponsiveDashboard from "./components/Dashboard/ResponsiveDashboard";
import UserTable from "./components/UserManagement/UserTable";
import AnalyticsDashboard from "./components/Analytics/AnalyticsDashboard";
import 'remixicon/fonts/remixicon.css'

function App() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.admin?.isAuthenticated);
  const token = !!localStorage.getItem("accessToken");
  const isAuthenticated = isLogin || token;

  useEffect(() => {
    if (token) {
      const data = setLoginResponseCheck();
      dispatch(setLoginResponse(data));
      dispatch(setIsAuthenticated(true));
    }
  }, [dispatch, token]);

  const renderPrivateRoutes = () => {
    return privateRoutes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ));
  };

  const renderWebRoutes = () => {
    return webRoutes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ));
  };

  const renderPublicRoutes = () => {
    return publicRoutes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ));
  };
  return (
    <BrowserRouter>
      
        <PageTitle />
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/login"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route path="/dashboard" element={<ResponsiveDashboard />} />
              <Route path="/users" element={<UserTable />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/" element={<MainLayout />}>
                {renderPrivateRoutes()}
              </Route>
              {renderWebRoutes()}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            <>
              {renderPublicRoutes()}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
