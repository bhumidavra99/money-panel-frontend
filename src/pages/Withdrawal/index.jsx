import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Table from "../../common/Table";
import ConfirmationPage from "../../common/ConfirmationPage";
import WithdrawalForm from "./withdrawalForm";
import {
  addWithdrawal,
  deleteWithdrawal,
  editWithdrawal,
  getSingleWithdrawal,
  getWithdrawals,
} from "../../redux/services/withdrawalSlice";
import moment from "moment-timezone";

const Withdrawal = () => {
  const dispatch = useDispatch();
  const withdrawalsData = useSelector(
    (state) => state.withdrawal.withdrawalData
  );
  const [modelOpen, setModelOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirm, setConfirm] = useState(false);

  const columns = [
    { Header: "#", accessor: "#", Cell: ({ row }) => row.index + 1 },
    {
      Header: "Date",
      accessor: "updatedAt",
      Cell: ({ value }) => moment(value).format("DD-MM-YYYY"),
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: ({ value }) =>
        value?.toString().includes(".") ? Number(value).toFixed(2) : value,
    },
    { Header: "Name", accessor: "name" },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <div className="flex items-center justify-center gap-4">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => {
              setModelOpen(true);
              setEditId(row.original._id);
            }}
          >
            <FaEdit size={16} />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => {
              setItemToDelete(row.original._id);
              setConfirm(true);
            }}
          >
            <FaTrash size={16} />
          </button>
        </div>
      ),
    },
  ];
  const data = useMemo(() => {
    return withdrawalsData?.data || [];
  }, [withdrawalsData]);
  const getAllWithdrawals = useCallback(async () => {
    try {
      await dispatch(getWithdrawals());
    } catch (error) {}
  }, [dispatch]);

  useEffect(() => {
    getAllWithdrawals();
  }, [getAllWithdrawals]);

  const handleDelete = async () => {
    try {
      const response = await dispatch(deleteWithdrawal(itemToDelete));
      if (response.payload.status === 200) {
        toast.success(response?.payload.message, { autoClose: 2000 });
        setConfirm(false);
        getAllWithdrawals();
      }
    } catch (error) {}
  };
  const initialValues = { amount: "", name: "" };
  const validationSchema = Yup.object({
    amount: Yup.number().required("Amount is required"),
    name: Yup.string().required("Name is required"),
  });
  const onSubmit = async (values) => {
    setLoading(true);
    const payload = { ...values };
    if (editId) payload.withdrawalId = editId;
    try {
      let response;
      if (editId) {
        response = await dispatch(editWithdrawal(payload));
      } else {
        response = await dispatch(addWithdrawal(payload));
      }
      if (response?.payload?.status === 200) {
        toast.success(response?.payload?.message, { autoClose: 2000 });
        setLoading(false);
        setModelOpen(false);
        setEditId(null);
        getAllWithdrawals();
      }
    } finally {
      setLoading(false);
    }
  };
  const {
    values,
    errors,
    touched,
    handleChange,
    setValues,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  useEffect(() => {
    if (editId) {
      const fetchSingleWithdrawal = async () => {
        try {
          const response = await dispatch(getSingleWithdrawal(editId));
          setValues(response.payload);
        } catch (error) {}
      };
      fetchSingleWithdrawal();
    }
  }, [dispatch, editId, setValues]);

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold text-center">Withdrawal</h1>
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center space-x-2 rounded-lg  text-center">
            <p className="font-semibold text-lg">
              Total Withdrawal :
              <span className="ms-2">
                {withdrawalsData?.totalWithdrawal?.toString().includes(".")
                  ? Number(withdrawalsData?.totalWithdrawal).toFixed(2)
                  : withdrawalsData?.totalWithdrawal}
              </span>
            </p>
          </div>
          <button
            onClick={() => setModelOpen(true)}
            className="bg-[#EB8844] text-white flex items-center space-x-2 rounded-lg px-4 py-2"
          >
            <FaPlus className="font-bold text-white w-4 h-4" />
            <p className="font-semibold">Add New Withdrawal</p>
          </button>
        </div>
      </div>
      <Table data={data} columns={columns} />
      {confirm && (
        <ConfirmationPage
          topicName="Withdrawal"
          confirm={confirm}
          onDelete={handleDelete}
          onCancel={() => setConfirm(false)}
        />
      )}
      {modelOpen && (
        <WithdrawalForm
          modelOpen={modelOpen}
          setModelOpen={setModelOpen}
          onClose={() => {
            setModelOpen(false);
            resetForm();
            setEditId(null);
          }}
          values={values}
          handleChange={handleChange}
          handleBlur={handleBlur}
          errors={errors}
          touched={touched}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </>
  );
};

export default Withdrawal;
