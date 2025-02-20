import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "./axiosApi";
import authHeader from "./authHeader";

export const getDebitCredits = createAsyncThunk(
  "remainingAmt/getDebitCredits",
  async ({ search } = {}, { rejectWithValue }) => {
    try {
      let url = "/debit-credit/all";
      let queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await apiInstance.get(url, {
        headers: authHeader(),
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const addDebitCredit = createAsyncThunk(
  "remainingAmt/addDebitCredit",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/debit-credit/add`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getSingleDebitCredit = createAsyncThunk(
  "remainingAmt/getSingleDebitCredit",
  async (debitCreditId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/debit-credit/${debitCreditId}`, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editDebitCredit = createAsyncThunk(
  "remainingAmt/editDebitCredit",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/debit-credit/edit`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteDebitCredit = createAsyncThunk(
  "debit/deleteDebit",
  async (selectedId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.delete(`/debit-credit/delete/${selectedId}`, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const initialState = {
  debitCreditData: [],
  singleDebitCreditData: null,
};

const remainingAmountSlice = createSlice({
  name: "remainingAmountSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getDebitCredits.fulfilled, (state, action) => {
      state.debitCreditData = action.payload.data;
    })
    .addCase(getSingleDebitCredit.fulfilled, (state, action) => {
            state.singleDebitCreditData = action.payload.data;
          })
  },
});

export default remainingAmountSlice.reducer;
