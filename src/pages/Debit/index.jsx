import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import Table from "../../common/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  addDebit,
  editDebit,
  getDebits,
  getSingleDebit,
} from "../../redux/services/debitSlice";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import DebitForm from "../Debit-Credit/DebitCreditForm";
import Loader from "../../common/Loader";
import moment from "moment-timezone";
import { getBetweenAmount } from "../../redux/services/betweenAmountSlice";
import { convertIstToUtc } from "../../common/TimeUtils";
import DateFilter from "../../common/DateFilter";
import { BiSearch } from "react-icons/bi";

const Debit = () => {
  const dispatch = useDispatch();
  const getAllDebitData = useSelector((state) => state.debit.debitData);
  const getSingleDebitData = useSelector(
    (state) => state.debit.singleDebitData
  );
  const [modelOpen, setModelOpen] = useState(false);
  const [editId, setEditId] = useState();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [savedStartDate, setSavedStartDate] = useState(null);
  const [savedEndDate, setSavedEndDate] = useState(null);
  const initialValues = {
    cusName: "",
    totalAmount: "",
  };
  const validationSchema = Yup.object({
    cusName: Yup.string().required("Customer Name  is required"),
    totalAmount: Yup.string().required("Total Amount is required"),
  });
  const getAllDebits = useCallback(
    async (selectedStartDate, selectedEndDate) => {
      setPageLoading(true);
      try {
        const response = await dispatch(
          getDebits({
            startDate:
              selectedStartDate ||
              (savedStartDate && convertIstToUtc(savedStartDate)),
            endDate:
              selectedEndDate ||
              (savedEndDate && convertIstToUtc(savedEndDate)),
            search: searchData,
          })
        );
        if (response?.payload?.status === 200) {
          setPageLoading(false);
        }
      } catch (error) {
        setPageLoading(false);
      } finally {
        setPageLoading(false);
      }
    },
    [dispatch, savedStartDate, savedEndDate, searchData]
  );
  useEffect(() => {
    getAllDebits();
  }, [getAllDebits]);
  const onSubmit = async () => {
    setLoading(true);
    const payload = { ...values };
    if (editId) {
      payload.debitId = editId;
    }
    try {
      let response;
      if (editId) {
        response = await dispatch(editDebit(payload));
      } else {
        response = await dispatch(addDebit(payload));
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
  const data = useMemo(() => {
    return getAllDebitData.data || [];
  }, [getAllDebitData]);
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
        Header: "Date",
        accessor: "createdAt",
        Cell: ({ value }) => moment(value).format("DD-MM-YYYY"),
      },
      {
        Header: "Total Amount",
        accessor: "amount",
        Cell: ({ value }) => (value ? value : "-"),
      },
    ],
    []
  );
  useEffect(() => {
    if (getSingleDebitData) {
      setValues({
        cusName: getSingleDebitData?.cusName,
        totalAmount: getSingleDebitData?.totalAmount,
      });
    }
  }, [getSingleDebitData, setValues]);
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
      getAllDebits(SDate, EDate);
      setStartDate(null);
      setEndDate(null);
    } else {
      getAllDebits();
    }

    return { SDate, EDate };
  };
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
    getAllDebits();
    setStartDate("");
    setEndDate("");
    setSavedStartDate("");
    setSavedEndDate("");
  };
  useEffect(() => {
    if (editId) {
      const fetchSingleDebit = async () => {
        try {
          await dispatch(getSingleDebit(editId));
        } catch (error) {}
      };

      fetchSingleDebit();
    }
  }, [dispatch, editId]);
  if (pageLoading) {
    return <Loader />;
  }
  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-120px)] h-full">
      <div className="flex flex-wrap justify-between mb-4 gap-5">
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
        </div>{" "}
        <div className="flex flex-wrap justify-end items-center gap-2 rounded-lg text-center mt-3 md:mt-0">
          <div className="inline-flex items-center space-x-2 rounded-lg  text-center">
            <p className="font-semibold text-lg">
              Total Remaining Amount :
              <span className="ms-2">{getAllDebitData?.totalAmount}</span>
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
        </div>
      </div>
      <Table data={data} columns={columns} />
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
      {modelOpen && (
        <DebitForm
          modelOpen={modelOpen}
          setModelOpen={setModelOpen}
          onClose={() => {
            setModelOpen(false);
            resetForm();
            setEditId();
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

export default Debit;
