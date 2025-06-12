import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./Slices/Users/UserSlice.jsx";
import superAdminAuthReducer from "./Slices/SuperAdmin/SuperAdminSlice.jsx";
import { userApi } from "./Slices/Users/UserApis.jsx";
import { superAdminApi } from "./Slices/SuperAdmin/SuperAdminAPIs.jsx";
import { adminApi } from "./Slices/Admin/AdminApis.jsx";

const store = configureStore({
  reducer: {
    superAdminAuth: superAdminAuthReducer,
    userAuth: userAuthReducer,
    [userApi.reducerPath]: userApi.reducer,
    [superAdminApi.reducerPath]: superAdminApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(superAdminApi.middleware)
      .concat(adminApi.middleware),
  devTools: true,
});

export default store;
