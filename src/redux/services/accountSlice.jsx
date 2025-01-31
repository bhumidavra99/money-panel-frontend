import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "./axiosApi";
import authHeader from "./authHeader";

export const getAccounts = createAsyncThunk(
  "account/getAccounts",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await apiInstance.get("/accounts/all", {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getSingleAccount = createAsyncThunk(
    "account/getSingleAccount",
    async (officeId, { rejectWithValue }) => {
      try {
        const response = await apiInstance.get(`/account/${officeId}`, {
          headers: authHeader(),
        });
        return response;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
export const addAccount = createAsyncThunk(
    "account/addAccount",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await apiInstance.post(`/account/add`, payload, {
          headers: authHeader(),
        });
        return response;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  export const editAccount = createAsyncThunk(
    "account/editAccount",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await apiInstance.post(`/account/edit`, payload, {
          headers: authHeader(),
        });
        return response;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const deleteAccount = createAsyncThunk(
    "account/deleteAccount",
    async (selectedId, { rejectWithValue }) => {
      try {
        const response = await apiInstance.delete(
          `/account/delete/${selectedId}`,
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
    accountData: [],
    singleAccountData:[]
  };
  
  const spendSlice = createSlice({
    name: "spendSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getAccounts.fulfilled, (state, action) => {
        state.accountData = action.payload.data;
      });
      builder.addCase(getSingleAccount.fulfilled, (state, action) => {
        state.singleAccountData = action.payload.data;
      });
    },
  });
  export default spendSlice.reducer;