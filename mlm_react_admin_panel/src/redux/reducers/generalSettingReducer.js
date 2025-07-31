import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    generalSettingsData: {
        // systemEmail: "test@gmail.com",
        // phoneNumber: "1234567890",
        // twitter: "https://twitter.com/test",
        // youtube: "https://youtube.com/test",
        // android: "https://play.google.com/store/apps/details?id=com.example",
        // ios: "https://apps.apple.com/us/app/example/id1234567890",
        // androidVersion: "[1.0]",
        // iosVersion: "[1.0]",
    }
};

const generalSettingsSlice = createSlice({
    name: 'generalSettings',
    initialState,
    reducers: {
        setGeneralSettingsData: (state, action) => {
            state.generalSettingsData = {
                ...state.generalSettingsData,
                ...action.payload, 
            };
        },
    },
});

export const { setGeneralSettingsData } = generalSettingsSlice.actions;

export default generalSettingsSlice.reducer;
