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

const GeneralSettingsService = {
    getGeneralSettings: async (data) => {
        return API.post("/getGeneralSettings", JSON.stringify(data))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
    updateGeneralSettings: async (data) => {
        return API.put("/editGeneralSettings", JSON.stringify(data))
            .then((response) => response.data)
            .catch((error) => Promise.reject(error));
    },
}

export default GeneralSettingsService
