import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "./axiosApi";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const getDefaultUser = () => {
    let user = localStorage.getItem("user");
    if (user && user !== "undefined") {
      return JSON.parse(user);
    } else {
      return null;
    }
  };
  const initialState = {
    user: localStorage.getItem("user") ? getDefaultUser() : {},
  };
export const login = createAsyncThunk(
    "auth/login",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await apiInstance.post("/auth/login", payload);
        return response;
      } catch (err) {
        return rejectWithValue(err?.response?.data?.message);
      }
    }
  );
  const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
      logOut: (state) => {
        state.user = {};
        localStorage.clear();
      },
    },
    extraReducers: (builder) => {
      builder.addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.data;
        localStorage.setItem("user", JSON.stringify(action.payload.data));
      });
    ;
    },
  });
  
  export default authSlice.reducer;
  export const { logOut, clearUser } = authSlice.actions;
  
  export const selectUser = (state) => {
    return state.auth.user;
  };
  
  export const useUser = () => {
    const user = useSelector(selectUser);
    localStorage.setItem("user", user ? JSON.stringify(user) : undefined);
    return useMemo(() => ({ user }), [user]);
  };