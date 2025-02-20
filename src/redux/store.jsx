import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "../redux/services/authSlice";
import dashboardSlice from "../redux/services/dashboardSlice";
import portalSlice from "../redux/services/portalSlice";
import officeSlice from "../redux/services/officeSlice";
import reportSlice from "../redux/services/reportSlice";
import accountSlice from "../redux/services/accountSlice";
import expenseSlice from "../redux/services/expenseSlice";
import debitSlice from "../redux/services/debitSlice";
import creditSlice from "../redux/services/creditSlice";
import salarySlice from "../redux/services/salarySlice";
import withdrawalSlice from "../redux/services/withdrawalSlice";
import balanceSlice from "../redux/services/balanceSlice";
import betweenAmountSlice from "./services/betweenAmountSlice";
import debitCreditSlice from "./services/debitCreditSlice";

const combineReducer = combineReducers({
  auth: authSlice,
  dashboard: dashboardSlice,
  portal: portalSlice,
  office: officeSlice,
  report: reportSlice,
  account: accountSlice,
  expense: expenseSlice,
  debit: debitSlice,
  credit: creditSlice,
  debitCredit: debitCreditSlice,
  salary: salarySlice,
  withdrawal: withdrawalSlice,
  balance: balanceSlice,
  betweenAmount: betweenAmountSlice,
});

const store = configureStore({
  reducer: combineReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export default store;
