import { createSlice } from "@reduxjs/toolkit";

const getRoleBasedKey = (role) => {
  return `${role}Info`;
};

const initializeUserState = () => {
  const roles = ['admin', 'candidate', 'employee', 'recruiter'];
  const state = {};
  
  roles.forEach(role => {
    const key = getRoleBasedKey(role);
    const storedInfo = localStorage.getItem(key);
    state[key] = storedInfo ? JSON.parse(storedInfo) : null;
  });
  
  return state;
};

const initialState = {
  superAdminInfo: localStorage.getItem("superAdminInfo")
    ? JSON.parse(localStorage.getItem("superAdminInfo"))
    : null,
};

const superAdminSlice = createSlice({
  name: "superAdminAuth",
  initialState,
  reducers: {
    setSuperAdminCredentials: (state, action) => {
     
      const { token, ...userInfo } = action.payload;
      state.superAdminInfo = userInfo;
      localStorage.setItem("superAdminInfo", JSON.stringify(userInfo));
      
    },
    SuperAdminlogout: (state) => {
      state.superAdminInfo = null;
      localStorage.removeItem("superAdminInfo");
     
    },
    
  },
});

export const { 
  setSuperAdminCredentials, 
  SuperAdminlogout, 
 
} = superAdminSlice.actions;

export default superAdminSlice.reducer;