import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "./axiosApi";
import authHeader from "./authHeader";

export const getPortals = createAsyncThunk(
  "portal/portals",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await apiInstance.get("/portals/all", {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getSinglePortal = createAsyncThunk(
    "portal/singlePortal",
    async (portalId, { rejectWithValue }) => {
      try {
        const response = await apiInstance.get(`/portal/${portalId}`, {
          headers: authHeader(),
        });
        return response;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
export const addPortal = createAsyncThunk(
    "portal/addPortal",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await apiInstance.post(`/portal/add`, payload, {
          headers: authHeader(),
        });
        return response;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  export const editPortal = createAsyncThunk(
    "portal/editPortal",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await apiInstance.post(`/portal/edit`, payload, {
          headers: authHeader(),
        });
        return response;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const deletePortal = createAsyncThunk(
    "portal/deletePortal",
    async (selectedId, { rejectWithValue }) => {
      try {
        const response = await apiInstance.delete(
          `/portal/delete/${selectedId}`,
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
  portalData: [],
  singlePortalData:[]
  };
  
  const portalSlice = createSlice({
    name: "portalSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getPortals.fulfilled, (state, action) => {
        state.portalData = action.payload.data;
      });
      builder.addCase(getSinglePortal.fulfilled, (state, action) => {
        state.singlePortalData = action.payload.data;
      });
    },
  });
  export default portalSlice.reducer;