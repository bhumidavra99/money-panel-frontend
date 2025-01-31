import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authHeader from "./authHeader";
import { apiInstance } from "./axiosApi";

export const getBetweenAmount = createAsyncThunk(
    "amount/amountValue",
    async (_, { rejectWithValue }) => {
      try {
        const response = await apiInstance.get("/amount", {
          headers: authHeader(),
        });
        return response;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const editBetweenAmount = createAsyncThunk(
    "amount/editBetweenAmount",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await apiInstance.post(`/amount/edit`, payload, {
          headers: authHeader(),
        });
        return response;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  const initialState = {
    amountData: [],
  };
  
  const betweenAmountSlice = createSlice({
    name: "betweenAmountSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getBetweenAmount.fulfilled, (state, action) => {
        state.amountData = action.payload;
      });
    },
  });
  export default betweenAmountSlice.reducer;