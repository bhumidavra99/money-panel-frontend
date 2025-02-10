import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConfirmationPage from "../../common/ConfirmationPage";
import {
  addExpense,
  deleteExpense,
  editExpense,
  getExpenses,
  getSingleExpense,
} from "../../redux/services/expenseSlice";
import { getAccounts } from "../../redux/services/accountSlice";
import ExpenseForm from "./expenseForm";
import Loader from "../../common/Loader";
import Table from "../../common/Table";

const Expense = () => {
  const dispatch = useDispatch();
  const getAllExpensesData = useSelector((state) => state.expense.expenseData);
  const getAllAccountData = useSelector((state) => state.account.accountData);
  const getSingleExpenseData = useSelector(
    (state) => state.expense.singleExpenseData
  );
  const [modelOpen, setModelOpen] = useState(false);
  const [editId, setEditId] = useState();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const initialValues = {
    accountName: undefined,
    expenseTitle: undefined,
    amount: undefined,
  };
  const validationSchema = Yup.object({
    accountName: Yup.string().required("Account Name is required"),
    expenseTitle: Yup.string().required("Expense Title is required"),
    amount: Yup.string().required("Amount is required"),
  });
  useEffect(() => {
    dispatch(getAccounts());
  }, [dispatch]);
  const accountOptions = getAllAccountData?.map((item) => ({
    value: item.accountName,
    label: item.accountName,
  }));
  const getAllExpense = useCallback(async () => {
    setPageLoading(true);
    try {
      const response = await dispatch(getExpenses());
      if (response?.payload?.status === 200) {
        setPageLoading(false);
      }
    } catch (error) {
      setPageLoading(false);
    }finally {
      setPageLoading(false);
    }
  }, [dispatch]);
  useEffect(() => {
    getAllExpense();
  }, [getAllExpense]);
  const onSubmit = async () => {
    setLoading(true);
    const payload = { ...values };
    if (editId) {
      payload.expenseId = editId;
    }
    try {
      let response;
      if (editId) {
        response = await dispatch(editExpense(payload));
      } else {
        response = await dispatch(addExpense(payload));
      }
      if (response?.payload?.status === 200) {
        toast.success(response?.payload?.message, {
          autoClose: 2000,
          pauseOnHover: false,
        });
        setLoading(false);
        setModelOpen(false);
        setEditId("");
        resetForm();
        getAllExpense();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "#",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Account Name",
        accessor: "accountName",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Expense Title",
        accessor: "expenseTitle",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value }) => (value ? value : "-"),
      },

      {
        Header: "Action",
        Cell: ({ row }) => (
          <div className="flex items-center justify-center gap-4">
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => {
                setModelOpen(true);
                setEditId(row?.original?._id);
              }}
            >
              <FaEdit size={16} />
            </button>

            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => {
                setItemToDelete(row.original?._id);
                setConfirm(true);
              }}
            >
              <FaTrash size={16} />
            </button>
          </div>
        ),
      },
    ],
    []
  );
  const data = useMemo(() => {
    return getAllExpensesData || [];
  }, [getAllExpensesData]);
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  useEffect(() => {
    if (getSingleExpenseData) {
      setValues({
        accountName: getSingleExpenseData?.accountName,
        expenseTitle: getSingleExpenseData?.expenseTitle,
        amount: getSingleExpenseData?.amount,
      });
    }
  }, [getSingleExpenseData, setValues]);
  const deleteExpenseData = async () => {
    try {
      const response = await dispatch(deleteExpense(itemToDelete));
      toast.success(response?.payload?.message, {
        autoClose: 2000,
        pauseOnHover: false,
      });
      setConfirm(false);
      getAllExpense();
    } catch (error) {}
  };
  useEffect(() => {
    if (editId) {
      const fetchSingleExpense = async () => {
        try {
          await dispatch(getSingleExpense(editId));
        } catch (error) {}
      };

      fetchSingleExpense();
    }
  }, [dispatch, editId]);
  if (pageLoading) {
    return <Loader />;
  }
  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-120px)] h-full">
      <div className="flex justify-end mb-4 gap-5">
        <button
          className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-[#EB8844] hover:bg-opacity-90"
          onClick={() => setModelOpen(true)}
        >
          <FaPlus className="font-bold text-white w-4 h-4" />
          <p className="font-semibold">Add New Expense</p>
        </button>
      </div>
      <Table
        data={data}
        columns={columns}
      />
      {confirm && (
        <ConfirmationPage
          topicName="Expense"
          confirm={confirm}
          onDelete={deleteExpenseData}
          onCancel={() => setConfirm(false)}
        />
      )}
      {modelOpen && (
        <ExpenseForm
          modelOpen={modelOpen}
          setModelOpen={setModelOpen}
          onClose={() => {
            setModelOpen(false);
            resetForm();
            setEditId();
          }}
          accountOptions={accountOptions}
          values={values}
          handleChange={handleChange}
          editId={editId}
          handleBlur={handleBlur}
          errors={errors}
          touched={touched}
          handleSubmit={handleSubmit}
          loading={loading}
          setFieldValue={setFieldValue}
        />
      )}
    </div>
  );
};

export default Expense;
