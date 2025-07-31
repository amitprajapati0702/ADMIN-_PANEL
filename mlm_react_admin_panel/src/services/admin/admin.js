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

const AdminServices = {
    getAdminProfile: async (data) => {
        return API.post("/getAdminProfile", JSON.stringify(data))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
    setAdminProfileData: async (data) => {
        return API.put("/updateAdminProfile", JSON.stringify(data))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
    getAdminList: async (page, limit, search1, search2, search3, search4, search5, search6, isSearch) => {
        return API.post("/getAllStaff", JSON.stringify({ page, limit, search1, search2, search3, search4, search5, search6, isSearch }))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
    changeStaffStatus: async (data) => {
        return API.put("/changeStaffStatus", JSON.stringify(data))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
    addStaff: async (data) => {
        return API.post("/addStaff", JSON.stringify(data))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
    editStaff: async (data) => {
        return API.put("/editStaff", JSON.stringify(data))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
    updatePassword: async (data) => {
        return API.put("/updatePassword", JSON.stringify(data))
            .then((response) => {
                return response.data;})
            .catch((error) => Promise.reject(error));
    },
    resetPassword: async (data) => {
        return API.put("/resetPassword", JSON.stringify(data))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    }
}

export default AdminServices
