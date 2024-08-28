import { configureStore } from "@reduxjs/toolkit";
import useReducer from "./slices/userSlice";
import forgotResetPasswordReducer from "./slices/forgotResetPasswordSlice";


export const store =configureStore({
    reducer:{
        user: useReducer,
        forgotPassword:forgotResetPasswordReducer

    },
});