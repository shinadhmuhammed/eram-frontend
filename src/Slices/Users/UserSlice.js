import { createSlice } from "@reduxjs/toolkit";

const getRoleBasedKey = (role) => {
  return `${role}Info`;
};

const initializeUserState = () => {
  const roles = ["admin", "candidate", "employee", "recruiter"];
  const state = {};

  roles.forEach((role) => {
    const key = getRoleBasedKey(role);
    const storedInfo = localStorage.getItem(key);
    state[key] = storedInfo ? JSON.parse(storedInfo) : null;
  });

  return state;
};

const initialState = initializeUserState();

const userSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUserCredentials: (state, action) => {
      const { userInfo, role } = action.payload;
      const roleKey = getRoleBasedKey(role);

      state[roleKey] = userInfo;
      localStorage.setItem(roleKey, JSON.stringify(userInfo));
    },

    userLogout: (state, action) => {
      const { role } = action.payload;
      console.log(role, "role", action.payload, "Payload");
      const roleKey = getRoleBasedKey(role);

      state[roleKey] = null;

      localStorage.removeItem(roleKey);
    },

    clearAllUserData: (state) => {
      const roles = ["admin", "candidate", "employee", "recruiter"];

      roles.forEach((role) => {
        const roleKey = getRoleBasedKey(role);
        state[roleKey] = null;
        localStorage.removeItem(roleKey);
      });
    },
  },
});

export const { setUserCredentials, userLogout, clearAllUserData } =
  userSlice.actions;
export default userSlice.reducer;
