import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
    AppLayout,
} from "../actions/dashboardAction";
import {
    AdminProfileDetailsUpdateAction,
    CompanyLogo,
    getAdminProfileAction,
    loginUser,
    logout,
    adminListAction,
    changeStaffStatusAction,
    addStaffAction,
    editStaffAction,
    updatePasswordAction,
    resetPasswordAction,
} from "../actions/adminAction";
import {
    getGeneralSettingsAction,
    updateGeneralSettingsAction
} from "../actions/generalSettingsActions";
import {
    setAppLayout,
    setDashboardOne,
} from "../reducers/dashboardReducer";
import {
    setIsAuthenticated,
    setLoginResponse,
    setProfile,
} from "../reducers/adminReducer";
import { useNavigate } from "react-router";
import LoginService from "../../services/auth/Login";
import { setGeneralSettingsData } from "../reducers/generalSettingReducer";
import { roleListAction, changeRoleStatusAction, getAllPermissionsAction, addRoleAction, editRoleAction } from "../actions/roleAction";

export const ApiHook = {
    // ---------------------------------------- Login -----------------------------------------

    CallLoginUser: () => {
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const response = useMutation((credentials) => loginUser(credentials), {
            onSuccess: (response) => {
                if (response.status) {
                    dispatch(setIsAuthenticated(true));
                    dispatch(setLoginResponse(response));
                    navigate("/dashboard", { replace: true });
                }
            },
        });
        return response;
    },

    CallLogout: () => {
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const response = useMutation(() => logout(), {
            onSuccess: (data) => {
                if (data.status) {
                    dispatch(setLoginResponse(null));
                    dispatch(setIsAuthenticated(false));
                    localStorage.clear();
                    navigate("/login");
                }
            }
        })
        return response
    },

    CallForgotPassword: () => {
        const response = useMutation((data) => LoginService.forgotPassword(data));
        return response;
    },
    CallCompanyLogo: () => {
        const response = useQuery({
            queryKey: ['logo'],
            queryFn: () => CompanyLogo(),
            retry: false
        })
        return response
    },
    // ---------------------------------------- Dashboard -----------------------------------------

    CallAppLayout: () => {
        const dispatch = useDispatch();
        const defaultCurrency = useSelector((state) => state.admin?.loginResponse?.defaultCurrency);
        const response = useQuery({
            queryKey: ["app-layout"],
            queryFn: AppLayout,
            onSuccess: (data) => {
                dispatch(setAppLayout(data));
            },
        });
        return response;
    },

    // ---------------------------------------- General Settings -----------------------------------------

    CallGetGeneralSettings: () => {
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const response = useMutation(() => getGeneralSettingsAction(), {
            onSuccess: (data) => {
                if (data.status) {
                    dispatch(setGeneralSettingsData(data.data));
                }
            }
        })
        return response
    },

    CallUpdateGeneralSettings: () => {
        const dispatch = useDispatch();
        const response = useMutation((data) => updateGeneralSettingsAction(data), {
            onSuccess: (data) => {
                if (data.status) {
                    dispatch(setGeneralSettingsData(data.data));
                }
            }
        })
        return response
    },

    // ---------------------------------------- ADMIN PROFILE -----------------------------------------
    CallProfile: () => {
        const dispatch = useDispatch();
        const response = useQuery({
            queryKey: ["profile"],
            queryFn: getAdminProfileAction,
            onSuccess: (data) => {
                dispatch(setProfile(data.data));
            },
        });
        return response;
    },
    CallUpdateAdminProfileDetails: () => {
        const mutation = useMutation((profileDetails) => AdminProfileDetailsUpdateAction(profileDetails))
        return mutation;
    },
    CallResetPassword: () => {
        const response = useMutation((data) => resetPasswordAction(data));
        return response;
    },

    // ---------------------------------------- STAFF -----------------------------------------
    CallAdminList: () => {
        const response = useMutation(({ page, limit, search1, search2, search3, search4, search5, search6, isSearch }) => adminListAction(page, limit, search1, search2, search3, search4, search5, search6, isSearch), {
            onSuccess: (data) => {
                if (data.status) {
                }
            }
        })

        return response;
    },

    CallChangeStaffStatus: () => {
        const response = useMutation((data,) => changeStaffStatusAction(data))
        return response;
    },

    CallAddStaff: () => {
        const response = useMutation((data) => addStaffAction(data));
        return response;
    },
    CallEditStaff: () => {
        const response = useMutation((data) => editStaffAction(data));
        return response;
    },
    CallUpdatePassword: () => {
        const response = useMutation((data) => updatePasswordAction(data));
        return response;
    },

    // ---------------------------------------- Role-----------------------------------------
    CallRoleList: () => {
        const response = useMutation(({ page, limit, search1, search2, isSearch }) => roleListAction(page, limit, search1, search2, isSearch), {
            onSuccess: (data) => {
                if (data.status) {
                }
            }
        })

        return response;
    },
    CallChangeRoleStatus: () => {
        const response = useMutation((data,) => changeRoleStatusAction(data))
        return response;
    },
    // ---------------------------------------- Permissions -----------------------------------------
    CallGetAllPermissions: () => {
        const response = useQuery({
            queryKey: ["permissions"],
            queryFn: getAllPermissionsAction,
            retry: false
        })
        return response
    },
    CallAddRole: () => {
        const response = useMutation((data) => addRoleAction(data));
        return response;
    },
    CallEditRole: () => {
        const response = useMutation((data) => editRoleAction(data));
        return response;
    },
};
