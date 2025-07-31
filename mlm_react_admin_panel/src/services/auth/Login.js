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

const LoginService = {
    authAccess: async (data) => {
        return API.post("/loginStaff", JSON.stringify(data))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
    logout: async () => {
        return API.post("/auth/logout")
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
    forgotPassword: async () => {
        return API.post("/auth/forgot-password")
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
    companyLogo: async () => {
        return callApi('/auth/get-company-logo')
    }
}

export default LoginService
