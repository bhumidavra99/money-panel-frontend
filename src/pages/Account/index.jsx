import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import ConfirmationPage from "../../common/ConfirmationPage";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addAccount,
  deleteAccount,
  editAccount,
  getAccounts,
  getSingleAccount,
} from "../../redux/services/accountSlice";
import AccountForm from "./accountForm";
import Loader from "../../common/Loader";
import Table from "../../common/Table";

const Account = () => {
  const dispatch = useDispatch();
  const getAllAccountData = useSelector((state) => state.account.accountData);
  const getSingleAccountData = useSelector(
    (state) => state.account.singleAccountData
  );
  const [modelOpen, setModelOpen] = useState(false);
  const [editId, setEditId] = useState();
  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const initialValues = {
    accountName: undefined,
    balance: undefined,
  };
  const validationSchema = Yup.object({
    accountName: Yup.string().required("Account Name is required"),
    balance: Yup.number().required("Balance is required"),
  });
  const getAllAccount = useCallback(async () => {
    setLoading(true);
    try {
      const response = await dispatch(getAccounts());
      if (response?.payload?.status === 200) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  }, [dispatch]);
  useEffect(() => {
    getAllAccount();
  }, [getAllAccount]);
  const onSubmit = async () => {
    setLoading(true);
    const payload = { ...values };
    if (editId) {
      payload.accountId = editId;
    }
    try {
      let response;
      if (editId) {
        response = await dispatch(editAccount(payload));
      } else {
        response = await dispatch(addAccount(payload));
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
        getAllAccount();
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
        Header: "Balance",
        accessor: "balance",
        Cell: ({ value }) =>
          value?.toString().includes(".") ? Number(value).toFixed(2) : value,
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

  const deleteAccountData = async () => {
    try {
      const response = await dispatch(deleteAccount(itemToDelete));
      toast.success(response?.payload?.message, {
        autoClose: 2000,
        pauseOnHover: false,
      });
      setConfirm(false);
      getAllAccount();
    } catch (error) {}
  };

  const data = useMemo(() => {
    return getAllAccountData || [];
  }, [getAllAccountData]);
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  useEffect(() => {
    if (getSingleAccountData) {
      setValues({
        accountName: getSingleAccountData?.accountName,
        balance: getSingleAccountData?.balance,
      });
    }
  }, [getSingleAccountData, setValues]);
  useEffect(() => {
    if (editId) {
      const fetchSingleAccount = async () => {
        try {
          await dispatch(getSingleAccount(editId));
        } catch (error) {}
      };
      fetchSingleAccount();
    }
  }, [dispatch, editId]);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-120px)] h-full">
      <div className="flex justify-end mb-4 gap-5">
        <button
          className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-[#EB8844] hover:bg-opacity-90"
          onClick={() => {
            setEditId(null);
            setModelOpen(true);
          }}
        >
          <FaPlus className="font-bold text-white w-4 h-4" />
          <p className="font-semibold">Add New Account</p>
        </button>
      </div>
      <Table data={data} columns={columns} />
      {confirm && (
        <ConfirmationPage
          topicName="Account"
          confirm={confirm}
          onDelete={deleteAccountData}
          onCancel={() => setConfirm(false)}
        />
      )}
      {modelOpen && (
        <AccountForm
          modelOpen={modelOpen}
          setModelOpen={setModelOpen}
          onClose={() => {
            setModelOpen(false);
            resetForm();
            setEditId(null);
          }}
          values={values}
          handleChange={handleChange}
          editId={editId}
          handleBlur={handleBlur}
          errors={errors}
          touched={touched}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Account;
