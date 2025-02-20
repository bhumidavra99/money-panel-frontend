import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import DefaultLayout from "../components/layout/DefaultLayout";
import Dashboard from "../pages/Dashboard";
import Report from "../pages/Report";
import AddCustomer from "../pages/Report/addCustomer";
import ChangePasswordPage from "../pages/auth/ChangePassword";
import { useUser } from "../redux/services/authSlice";
import Portals from "../pages/Portal";
import Account from "../pages/Account";
import EditCustomer from "../pages/Report/editCustomer";
import Expense from "../pages/Expense";
import Debit from "../pages/Debit";
import Credit from "../pages/Credit";
import FinancialSummary from "../pages/FinancialSummary";
import EditPin from "../pages/FinancialSummary/editPin";
import RemainingDebit from "../pages/Remaining-debit";
  import DebitCreditPage from "../pages/Debit-Credit";

const Allroutes = () => {
  const { user } = useUser();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {Object.keys(user).length > 0 ? (
          <Route path="" element={<DefaultLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portal" element={<Portals />} />
            <Route path="/report" element={<Report />} />
            <Route path="/add-customer" element={<AddCustomer />} />
            <Route path="/edit-customer" element={<EditCustomer />} />
            <Route path="/account" element={<Account />} />
            <Route path="/expenses" element={<Expense />} />
            <Route path="/debit" element={<Debit />} />
            <Route path="/remaining-debit" element={<RemainingDebit />} />
            <Route path="/debit-credit" element={<DebitCreditPage />} />
            <Route path="/credit" element={<Credit />} />
            <Route path="/edit-pin" element={<EditPin />} />
            <Route path="/financial-summary" element={<FinancialSummary />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          <Route path="/login" element={<Login />} />
        )}

        <Route
          path="*"
          element={
            <Navigate
              to={Object.keys(user).length > 0 ? "/dashboard" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default Allroutes;
