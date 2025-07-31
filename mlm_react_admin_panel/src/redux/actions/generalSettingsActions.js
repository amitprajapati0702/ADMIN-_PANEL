import GeneralSettingsService from "../../services/general-settings/generalSettings.js";

export const getGeneralSettingsAction = async () => {
    try {
        const response = await GeneralSettingsService.getGeneralSettings();
        return response
    } catch (error) {
        return error.message
    }
}

export const updateGeneralSettingsAction = async (data) => {
    try {
        const response = await GeneralSettingsService.updateGeneralSettings(data);
        return response
    } catch (error) {
        return error.message
    }
}