import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "./axiosApi";
import authHeader from "./authHeader";

export const verifyPin = createAsyncThunk(
  "pin/verifyPin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post("/verify-pin",payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const addPin = createAsyncThunk(
  "pin/addPin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/office/add`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editPin = createAsyncThunk(
  "pin/editPin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/edit-pin`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

