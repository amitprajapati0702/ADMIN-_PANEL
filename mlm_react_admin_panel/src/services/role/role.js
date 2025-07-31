import API from "../../api/api";


const callApi = async (endpoint) => {
    try {
        const response = await API.get(endpoint);
        if (response.status === 200) {
            return response?.data?.data;
        } else {
            return response?.data?.data;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const RoleServices = {
    getRoleList: async (page, limit, search1, search2, isSearch) => {
        return API.post("/getAllRoles", JSON.stringify({ page, limit, search1, search2, isSearch }))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
    getAllPermissions: async (data) => {
        return API.get("/getAllPermissions", JSON.stringify(data))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
    changeRoleStatus: async (data) => {
        return API.put("/changeRoleStatus", JSON.stringify(data))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
    addRole: async (data) => {
        return API.post("/addRole", JSON.stringify(data))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
    editRole: async (data) => {
        return API.put("/editRole", JSON.stringify(data))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
}

export default RoleServices
