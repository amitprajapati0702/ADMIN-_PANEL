import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  isAuthenticated: false,
  loginResponse: { data: {} },
  profile: { data: {} },
  // selectedCurrency: {},
  selectedLanguage: {},
  twoFaAuth:{
    isEnabled:false,
    twoFadata:{}
  },
  conversionFactor: {
    currencies: [],
    selectedCurrency: null,
    defaultCurrency: null,
  },
  isTourOpen:{
    status:false,
  },
  isDemoVisitor: false
};

const userSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setLoginResponse: (state, action) => {
      state.loginResponse = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action) => {
      const { profileDetails } = action.payload;
      const updatedProfileDetails = {
        ...state.profile.personalDetails,
        name: profileDetails.name,
        secondName: profileDetails.secondName,
        gender: profileDetails.gender
      }
      state.profile.personalDetails = updatedProfileDetails
    },
  },
});

export const { setLoginResponse, setIsAuthenticated, setProfile, updateProfile, updateContact, updateBank, setSelectedCurrency, setSelectedLanguage, setConversionFactors, updateConversionFactors, demoVisitorAdded, updateTourOpen, setTwofaResponse } = userSlice.actions;

export default userSlice.reducer;
