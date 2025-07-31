import AdminServices from "../../services/admin/admin";
import LoginService from "../../services/auth/Login";

export const loginUser = async (data) => {
  try {
    const response = await LoginService.authAccess(data);
    if (response.success === 1) {
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data));
      return { status: true, data: response };
    }
    else {
      return { status: false, data: response?.message }
    }
  } catch (error) {
    return error;
  }
};



export const CompanyLogo = async () => {
  try {
    const response = await LoginService.companyLogo();
    // const response = await LoginStubService.companyLogo();
    return response;
  } catch (error) {
    return error.message;
  }
}

export const logout = async () => {
  try {
    const response = await LoginService.logout();
    // const response = await LoginStubService.logout();
    return response;
  } catch (error) {
    return error.message;
  }
}

export const getAdminProfileAction = async () => {
  try {
    const response = await AdminServices.getAdminProfile();
    return response;
  } catch (error) {
    return error.message;
  }
}

export const AdminProfileDetailsUpdateAction = async (data) => {
  try {
    // const response = await ProfileService.setPersonalData(data);
    const response = await AdminServices.setAdminProfileData(data);
    return response;
  } catch (error) {
    return error.message;
  }
};

export const adminListAction = async (page, limit, search1, search2, search3, search4, search5, search6, isSearch) => {
  try {
    const response = await AdminServices.getAdminList(page, limit, search1, search2, search3, search4, search5, search6, isSearch);
    return response
  } catch (error) {
    return error.message
  }
}

export const changeStaffStatusAction = async (data) => {
  try {
    const response = await AdminServices.changeStaffStatus(data);
    return response;
  } catch (error) {
    return error.message;
  }
}

export const addStaffAction = async (data) => {
  try {
    const response = await AdminServices.addStaff(data);
    return response;
  } catch (error) {
    return error.message;
  }
}

export const editStaffAction = async (data) => {
  try {
    const response = await AdminServices.editStaff(data);
    return response;
  } catch (error) {
    return error.message;
  }
}

export const updatePasswordAction = async (data) => {
  try {
    const response = await AdminServices.updatePassword(data);
    return response;
  } catch (error) {
    return error.message;
  }
}

export const resetPasswordAction = async (data) => {
  try {
    const response = await AdminServices.resetPassword(data);
    return response;
  } catch (error) {
    return error.message;
  }
}