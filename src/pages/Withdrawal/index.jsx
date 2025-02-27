import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaTrash, FaRegCalendarAlt } from "react-icons/fa";
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
import { convertIstToUtc } from "../../common/TimeUtils";
import DateFilter from "../../common/DateFilter";
import { getTotalBalance } from "../../redux/services/balanceSlice";
import { IoEye } from "react-icons/io5";
import WithdrawalViewModel from "./WithdrawalViewModel";
import { getAccounts } from "../../redux/services/accountSlice";

const Withdrawal = ({ withdrawalsData }) => {
  const dispatch = useDispatch();
  const [modelOpen, setModelOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [savedStartDate, setSavedStartDate] = useState(null);
  const [savedEndDate, setSavedEndDate] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [viewModel, setViewModel] = useState(false);
  const [debitValue, setDebitValue] = useState();
  const getAllAccountData = useSelector((state) => state.account.accountData);
  const getSingleWithdrawalData = useSelector(
    (state) => state.withdrawal.singleWithdrawalData
  );
  const columns = [
    { Header: "#", accessor: "#", Cell: ({ row }) => row.index + 1 },
    {
      Header: "Date",
      accessor: "updatedAt",
      Cell: ({ value }) => moment(value).format("DD-MM-YYYY"),
    },
    { Header: "Name", accessor: "name" },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: ({ value }) =>
        value?.toString().includes(".") ? Number(value).toFixed(2) : value,
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <div className="flex items-center justify-center gap-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200"
            onClick={() => {
              setModelOpen(true);
              setEditId(row?.original?._id);
              setDebitValue("debit");
            }}
          >
            Debit
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-200"
            onClick={() => {
              setModelOpen(true);
              setEditId(row?.original?._id);
              setDebitValue("credit");
            }}
          >
            Credit
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
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => {
              setItemToView(row.original);
              setViewModel(true);
            }}
          >
            <IoEye size={20} />
          </button>
        </div>
      ),
    },
  ];
  const data = useMemo(() => {
    return withdrawalsData?.data || [];
  }, [withdrawalsData]);
  useEffect(() => {
    if (modelOpen === true) {
      dispatch(getAccounts());
    }
  }, [dispatch, modelOpen]);
  const getAllWithdrawals = useCallback(
    async (selectedStartDate, selectedEndDate) => {
      try {
        await dispatch(
          getWithdrawals({
            startDate:
              selectedStartDate ||
              (savedStartDate && convertIstToUtc(savedStartDate)),
            endDate:
              selectedEndDate ||
              (savedEndDate && convertIstToUtc(savedEndDate)),
          })
        );
      } catch (error) {}
    },
    [dispatch, savedEndDate, savedStartDate]
  );

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
  const initialValues = {
    amount: "",
    name: "",
    transactionType: "",
    accountName: "",
  };
  const validationSchema = Yup.object({
    amount: Yup.number().required("Amount is required"),
    name: Yup.string().required("Name is required"),
    transactionType: Yup.string().required("TransactionType is required"),
    accountName: Yup.string().required("AccountName is required"),
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
        dispatch(getTotalBalance());
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
    setFieldValue,
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
          await dispatch(getSingleWithdrawal(editId));
        } catch (error) {}
      };
      fetchSingleWithdrawal();
    }
  }, [dispatch, editId, setValues]);
  const handleDateSubmit = () => {
    if (startDate) {
      startDate.setHours(0, 0, 0, 0);
    }
    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }
    const SDate = startDate ? convertIstToUtc(startDate) : null;
    const EDate = endDate ? convertIstToUtc(endDate) : null;
    if (SDate && EDate) {
      setToggle(false);
      getAllWithdrawals(SDate, EDate);
      setStartDate(null);
      setEndDate(null);
    } else {
      getAllWithdrawals();
    }

    return { SDate, EDate };
  };
  useEffect(() => {
    if (getSingleWithdrawalData) {
      setValues({
        name: getSingleWithdrawalData?.name,
        transactionType: debitValue,
        accountName: getSingleWithdrawalData?.accountName,
      });
    }
  }, [getSingleWithdrawalData, setValues, debitValue]);

  const handleSaveDate = () => {
    setToggle(false);
    setSavedStartDate(startDate);
    setSavedEndDate(endDate);
    if (handleDateSubmit) {
      handleDateSubmit();
    }
  };

  const handleClearDates = () => {
    setToggle(false);
    getAllWithdrawals();
    setStartDate("");
    setEndDate("");
    setSavedStartDate("");
    setSavedEndDate("");
  };
  const accountOptions = getAllAccountData?.map((item) => ({
    value: item.accountName,
    label: item.accountName,
  }));
  const typeOption = [
    { value: "debit", label: "Debit" },
    { value: "credit", label: "Credit" },
  ];
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
          {savedStartDate && savedEndDate && (
            <button
              onClick={handleClearDates}
              className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-[#EB8844] hover:bg-opacity-90"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setToggle(true)}
            className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-[#EB8844] hover:bg-opacity-90"
          >
            {savedStartDate && savedEndDate ? (
              <p>
                (
                {`${moment(savedStartDate).format("Do MMMM")} - ${moment(
                  savedEndDate
                ).format("Do MMMM")}`}
                )
              </p>
            ) : (
              <>
                <FaRegCalendarAlt className="font-bold text-white w-4 h-4" />
                <p className="font-semibold">Select Date</p>
              </>
            )}
          </button>
          <button
            onClick={() => {
              setEditId(null);
              setModelOpen(true);
            }}
            className="bg-[#EB8844] text-white flex items-center space-x-2 rounded-lg px-4 py-2"
          >
            <FaPlus className="font-bold text-white w-4 h-4" />
            <p className="font-semibold">Add New Withdrawal</p>
          </button>
        </div>
      </div>
      <Table data={data} columns={columns} />
      {viewModel && (
        <WithdrawalViewModel
          itemToView={itemToView}
          onClose={() => {
            setViewModel(false);
          }}
        />
      )}
      {toggle && (
        <DateFilter
          setToggle={setToggle}
          toggle={toggle}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleDateSubmit={handleSaveDate}
          startDate={startDate}
          endDate={endDate}
          onClose={() => {
            setToggle(false);
            handleClearDates();
          }}
        />
      )}
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
          typeOption={typeOption}
          setFieldValue={setFieldValue}
          values={values}
          accountOptions={accountOptions}
          handleChange={handleChange}
          editId={editId}
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
