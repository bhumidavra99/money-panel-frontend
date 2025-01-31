import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useTable, useSortBy } from "react-table";
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
    setLoading(true);
    try {
      const response = await dispatch(getExpenses());
      if (response?.payload?.status === 200) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
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
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);
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
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table
          {...getTableProps()}
          className="min-w-full bg-white border-collapse"
        >
          <thead className="bg-gray-200">
            {headerGroups?.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers?.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-700 uppercase tracking-wider"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
            {rows?.length > 0 ? (
              rows?.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-100">
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-700"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={headerGroups[0].headers?.length}
                  className="p-4 text-center"
                >
                  <div className="flex items-center justify-center p-4 w-ful">
                    <div className="text-center animate__animated animate__fadeIn animate__delay-1s">
                      <h2 className="text-3xl font-bold text-gray-900  mb-4">
                        No Data Found
                      </h2>
                      <p className="text-md text-gray-600 mb-6">
                        Unfortunately, we couldn't find any results matching
                        your search.
                      </p>
                      <div className="mt-6">
                        <button
                          className="px-6 py-3 bg-[#EB8844] text-white text-lg font-semibold rounded-md shadow-lg hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB8844] transition-all duration-300 ease-in-out transform hover:scale-105"
                          onClick={() => window.location.reload()}
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
