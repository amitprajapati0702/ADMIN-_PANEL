import RoleServices from "../../services/role/role";

export const roleListAction = async (page, limit, search1, search2, isSearch) => {
  try {
    const response = await RoleServices.getRoleList(page, limit, search1, search2, isSearch);
    return response
  } catch (error) {
    return error.message
  }
}

export const changeRoleStatusAction = async (data) => {
  try {
    const response = await RoleServices.changeRoleStatus(data);
    return response;
  } catch (error) {
    return error.message;
  }
}

export const getAllPermissionsAction = async (data) => {
  try {
    const response = await RoleServices.getAllPermissions(data);
    return response;
  } catch (error) {
    return error.message;
  }
}

export const addRoleAction = async (data) => {
  try {
    const response = await RoleServices.addRole(data);
    return response;
  } catch (error) {
    return error.message;
  }
}

export const editRoleAction = async (data) => {
  try {
    const response = await RoleServices.editRole(data);
    return response;
  } catch (error) {
    return error.message;
  }
}