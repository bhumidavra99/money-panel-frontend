import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "./axiosApi";
import authHeader from "./authHeader";

export const getOffices = createAsyncThunk(
  "office/offices",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await apiInstance.get("/offices/all", {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getSingleOffice = createAsyncThunk(
    "office/singleOffice",
    async (officeId, { rejectWithValue }) => {
      try {
        const response = await apiInstance.get(`/office/${officeId}`, {
          headers: authHeader(),
        });
        return response;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
export const addOffice = createAsyncThunk(
    "office/addOffice",
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
  
  export const editOffice = createAsyncThunk(
    "office/editOffice",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await apiInstance.post(`/office/edit`, payload, {
          headers: authHeader(),
        });
        return response;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const deleteOffice = createAsyncThunk(
    "office/deleteOffice",
    async (selectedId, { rejectWithValue }) => {
      try {
        const response = await apiInstance.delete(
          `/office/delete/${selectedId}`,
          {
            headers: authHeader(),
          }
        );
        return response;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
const initialState = {
    officeData: [],
    singleOfficeData:[]
  };
  
  const officeSlice = createSlice({
    name: "officeSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getOffices.fulfilled, (state, action) => {
        state.officeData = action.payload.data;
      });
      builder.addCase(getSingleOffice.fulfilled, (state, action) => {
        state.singleOfficeData = action.payload.data;
      });
    },
  });
  export default officeSlice.reducer;