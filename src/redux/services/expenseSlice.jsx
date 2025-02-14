import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "./axiosApi";
import authHeader from "./authHeader";

export const getExpenses = createAsyncThunk(
  "expense/getExpenses",
  async ({startDate, endDate,statusFilter}, { rejectWithValue }) => {
    try {
      let url = `/expenses/all`;
      if (startDate || endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      if (statusFilter) {
        url += `?statusFilter=${statusFilter}`;
      }
      const response = await apiInstance.get(url, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getSingleExpense = createAsyncThunk(
  "expense/getSingleExpense",
  async (officeId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/expense/${officeId}`, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const addExpense = createAsyncThunk(
  "expense/addExpense",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/expense/add`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editExpense = createAsyncThunk(
  "expense/editExpense",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/expense/edit`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteExpense = createAsyncThunk(
  "expense/deleteExpense",
  async (selectedId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.delete(
        `/expense/delete/${selectedId}`,
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
  expenseData: [],
  singleExpenseData: [],
};

const expenseSlice = createSlice({
  name: "expenseSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getExpenses.fulfilled, (state, action) => {
      state.expenseData = action.payload.data;
    });
    builder.addCase(getSingleExpense.fulfilled, (state, action) => {
      state.singleExpenseData = action.payload.data;
    });
  },
});
export default expenseSlice.reducer;
