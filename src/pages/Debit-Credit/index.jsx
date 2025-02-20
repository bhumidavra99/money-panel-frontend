import React, { useCallback, useEffect, useMemo, useState } from "react";
import Table from "../../common/Table";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../common/Loader";
import { BiSearch } from "react-icons/bi";
import { FaPlus, FaTrash } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { useFormik } from "formik";
import * as Yup from "yup";
import DebitCreditForm from "./DebitCreditForm";
import {
  addDebitCredit,
  deleteDebitCredit,
  editDebitCredit,
  getDebitCredits,
  getSingleDebitCredit,
} from "../../redux/services/debitCreditSlice";
import { getBetweenAmount } from "../../redux/services/betweenAmountSlice";
import { toast } from "react-toastify";
import { getAccounts } from "../../redux/services/accountSlice";
import ConfirmationPage from "../../common/ConfirmationPage";
import ViewModel from "./ViewModel";

const DebitCreditPage = () => {
  const dispatch = useDispatch();
  const getAllDebitCreditData = useSelector(
    (state) => state.debitCredit.debitCreditData
  );
  const getSingleDebitCreditData = useSelector(
    (state) => state.debitCredit.singleDebitCreditData
  );
  const getAllAccountData = useSelector((state) => state.account.accountData);
  const [pageLoading, setPageLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [itemToView, setItemToView] = useState(null);
  const [viewModel, setViewModel] = useState(false);
  const [debitValue, setDebitValue] = useState();
  const [editId, setEditId] = useState();
  const initialValues = {
    cusName: "",
    amount: "",
    transactionType: "",
    accountName: "",
  };
  const validationSchema = Yup.object({
    cusName: Yup.string().required("Customer Name  is required"),
    amount: Yup.string().required("Total Amount is required"),
    transactionType: Yup.string().required("Transaction Type  is required"),
    accountName: Yup.string().when("$transactionType", {
      is: "credit",
      then: Yup.string().required(
        "Account Name is required for credit transactions"
      ),
      otherwise: Yup.string().notRequired(),
    }),
  });

  const getAllDebits = useCallback(async () => {
    setPageLoading(true);
    try {
      const response = await dispatch(getDebitCredits({ search: searchData }));
      if (response?.payload?.status === 200) {
        setPageLoading(false);
      }
    } catch (error) {
      setPageLoading(false);
    } finally {
      setPageLoading(false);
    }
  }, [dispatch, searchData]);

  useEffect(() => {
    getAllDebits();
  }, [getAllDebits]);

  const data = useMemo(() => {
    return getAllDebitCreditData.data || [];
  }, [getAllDebitCreditData]);

  const onSubmit = async () => {
    setLoading(true);
    const payload = { ...values };
    if (editId) {
      payload.debitCreditId = editId;
    }
    try {
      let response;
      if (editId) {
        response = await dispatch(editDebitCredit(payload));
      } else {
        response = await dispatch(addDebitCredit(payload));
      }
      if (response?.payload?.status === 200) {
        toast.success(response?.payload?.message, {
          autoClose: 2000,
          pauseOnHover: false,
        });
        setLoading(false);
        dispatch(getBetweenAmount());
        setModelOpen(false);
        resetForm();
        getAllDebits();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const {
    values,
    errors,
    touched,
    setValues,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  useEffect(() => {
    if (values.transactionType === "credit") {
      dispatch(getAccounts());
    }
  }, [dispatch, values.transactionType]);
  const deleteDebitCreditData = async (row) => {
    try {
      const response = await dispatch(deleteDebitCredit(itemToDelete));
      toast.success(response?.payload?.message, {
        autoClose: 2000,
        pauseOnHover: false,
      });
      dispatch(getBetweenAmount());
      setConfirm(false);
      getAllDebits();
    } catch (error) {}
  };

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "#",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Name",
        accessor: "cusName",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Remaining Amount",
        accessor: "amount",
        Cell: ({ row }) =>
          row?.original?.remainingAmount !== undefined &&
          row?.original?.remainingAmount !== null
            ? row?.original?.remainingAmount
            : row.original?.amount ?? "-",
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
    ],
    []
  );
  useEffect(() => {
    if (getSingleDebitCreditData) {
      setValues({
        cusName: getSingleDebitCreditData?.cusName,
        transactionType: debitValue,
      });
    }
  }, [getSingleDebitCreditData, setValues, debitValue]);
  const accountOptions = getAllAccountData?.map((item) => ({
    value: item.accountName,
    label: item.accountName,
  }));
  useEffect(() => {
    if (editId) {
      const fetchSingleDebitCredit = async () => {
        try {
          await dispatch(getSingleDebitCredit(editId));
        } catch (error) {}
      };
      fetchSingleDebitCredit();
    }
  }, [dispatch, editId]);
  if (pageLoading) {
    return <Loader />;
  }
  const typeOption = [
    { value: "debit", label: "Debit" },
    { value: "credit", label: "Credit" },
  ];
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-5">
        <h1 className="text-2xl font-semibold text-center">Remaining Amount</h1>
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            className="max-w-md w-full px-4 py-2 border rounded-lg focus:outline-none"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchData(searchTerm);
              }
            }}
          />
          <button
            type="button"
            className="absolute top-0 right-0 px-4 h-full bg-[#EB8844] text-white rounded-r-lg"
            onClick={() => setSearchData(searchTerm)}
          >
            <BiSearch />
          </button>
        </div>
        <div className="inline-flex items-center space-x-2 rounded-lg  text-center">
          <p className="font-semibold text-lg">
            Total Remaining Amount :
            <span className="ms-2">
              {getAllDebitCreditData?.remainingAmount}
            </span>
          </p>
        </div>
        <button
          className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-[#EB8844] hover:bg-opacity-90"
          onClick={() => setModelOpen(true)}
        >
          <FaPlus className="font-bold text-white w-4 h-4" />
          <p className="font-semibold">Add New Record</p>
        </button>
      </div>

      <Table data={data} columns={columns} />
      {viewModel && (
        <ViewModel
          itemToView={itemToView}
          onClose={() => {
            setViewModel(false);
          }}
        />
      )}
      {confirm && (
        <ConfirmationPage
          topicName="Debit/Credit"
          confirm={confirm}
          onDelete={deleteDebitCreditData}
          onCancel={() => setConfirm(false)}
        />
      )}
      {modelOpen && (
        <DebitCreditForm
          modelOpen={modelOpen}
          setModelOpen={setModelOpen}
          onClose={() => {
            setModelOpen(false);
            resetForm();
            setEditId();
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
    </div>
  );
};

export default DebitCreditPage;
