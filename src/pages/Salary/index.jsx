import React, { useState, useMemo, useCallback, useEffect } from "react";
import { FaPlus, FaRegCalendarAlt, FaTrash } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmationPage from "../../common/ConfirmationPage";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  addSalary,
  deleteSalary,
  editSalary,
  getSalaries,
  getSingleSalary,
} from "../../redux/services/salarySlice";
import { toast } from "react-toastify";
import Table from "../../common/Table";
import SalaryForm from "./salaryForm";
import { getOffices } from "../../redux/services/officeSlice";
import moment from "moment-timezone";
import { convertIstToUtc } from "../../common/TimeUtils";
import DateFilter from "../../common/DateFilter";
import { getTotalBalance } from "../../redux/services/balanceSlice";
import { IoEye } from "react-icons/io5";
import SalaryViewModel from "./salaryViewModel";

const Salaries = ({ getAllSalariesData }) => {
  const dispatch = useDispatch();
  const getSingleSalaryData = useSelector(
    (state) => state.salary.singleSalaryData
  );
  const getAllOfficesData = useSelector((state) => state.office.officeData);
  const [modelOpen, setModelOpen] = useState(false);
  const [editId, setEditId] = useState();
  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [savedStartDate, setSavedStartDate] = useState(null);
  const [savedEndDate, setSavedEndDate] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [toggle, setToggle] = useState(false);
  const [itemToView, setItemToView] = useState(null);
  const [viewModel, setViewModel] = useState(false);
  useEffect(() => {
    dispatch(getOffices());
  }, [dispatch]);
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "#",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Date",
        accessor: "updatedAt",
        Cell: ({ value }) => moment(value).format("DD-MM-YYYY"),
      },
      {
        Header: "Office Name",
        accessor: "officeName",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value }) => (value ? value : "-"),
      },
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
              className="inline-flex items-center space-x-2 rounded-lg px-4 py-1 text-md text-center text-white bg-[#EB8844] hover:bg-opacity-90"
              onClick={() => {
                setModelOpen(true);
                setEditId(row?.original?._id);
              }}
            >
              Pay
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
  const data = useMemo(
    () => getAllSalariesData.data || [],
    [getAllSalariesData]
  );
  const initialValues = { officeName: "", name: "", amount: "" };
  const validationSchema = Yup.object({
    officeName: Yup.string().required("Office Name is required"),
    name: Yup.string().required("Name is required"),
    amount: Yup.number().required("Amount is required"),
  });
  const getAllSalaries = useCallback(
    async (selectedStartDate, selectedEndDate) => {
      try {
        await dispatch(
          getSalaries({
            startDate:
              selectedStartDate ||
              (savedStartDate && convertIstToUtc(savedStartDate)),
            endDate:
              selectedEndDate ||
              (savedEndDate && convertIstToUtc(savedEndDate))
          })
        );
      } catch (error) {}
    },
    [dispatch, savedEndDate, savedStartDate]
  );

  useEffect(() => {
    getAllSalaries();
  }, [getAllSalaries]);
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
          getAllSalaries(SDate, EDate);
          setStartDate(null);
          setEndDate(null);
    } else {
      getAllSalaries();
    }
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
    getAllSalaries();
    setStartDate("");
    setEndDate("");
    setSavedStartDate("");
    setSavedEndDate("");
  };
  const onSubmit = async () => {
    setLoading(true);
    const payload = { ...values };
    if (editId) payload.salaryId = editId;
    try {
      let response;
      if (editId) {
        response = await dispatch(editSalary(payload));
      } else {
        response = await dispatch(addSalary(payload));
      }
      if (response?.payload?.status === 200) {
        dispatch(getTotalBalance());
        toast.success(response?.payload?.message, {
          autoClose: 2000,
          pauseOnHover: false,
        });
        setLoading(false);
        setModelOpen(false);
        setEditId("");
        resetForm();
        getAllSalaries();
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
    handleBlur,
    handleSubmit,
    setValues,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  useEffect(() => {
    if (getSingleSalaryData) {
      setValues({
        officeName: getSingleSalaryData?.officeName,
        name: getSingleSalaryData?.name,
      });
    }
  }, [getSingleSalaryData, setValues]);
  const deleteSalaryData = async () => {
    try {
      const response = await dispatch(deleteSalary(itemToDelete));
      toast.success(response?.payload?.message, {
        autoClose: 2000,
        pauseOnHover: false,
      });
      setConfirm(false);
      getAllSalaries();
    } catch (error) {}
  };

  useEffect(() => {
    if (editId) {
      const fetchSingleSalary = async () => {
        try {
          await dispatch(getSingleSalary(editId));
        } catch (error) {}
      };
      fetchSingleSalary();
    }
  }, [dispatch, editId]);
  const officeNameOptions = getAllOfficesData?.map((item) => ({
    value: item.officeName,
    label: item.officeName,
  }));
  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold text-center">Salary</h1>
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center space-x-2 rounded-lg text-center">
            <p className="font-semibold text-lg">
              Total Salary :
              <span className="ms-2">
                {getAllSalariesData?.totalSalary?.toString().includes(".")
                  ? Number(getAllSalariesData?.totalSalary).toFixed(2)
                  : getAllSalariesData?.totalSalary}
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
            <FaRegCalendarAlt className="font-bold text-white w-4 h-4" />
            <p className="font-semibold">Select Date</p>
            {savedStartDate && savedEndDate && (
              <p>
                (
                {`${moment(savedStartDate).format("Do MMMM")} - ${moment(
                  savedEndDate
                ).format("Do MMMM")}`}
                )
              </p>
            )}
          </button>
          <button
            className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-[#EB8844] hover:bg-opacity-90"
            onClick={() => {
              setEditId(null);
              setModelOpen(true);
            }}
          >
            <FaPlus className="font-bold text-white w-4 h-4" />
            <p className="font-semibold">Add New Salary</p>
          </button>
        </div>
      </div>
      <Table data={data} columns={columns} />
      {viewModel && (
        <SalaryViewModel
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
          topicName="Salary"
          confirm={confirm}
          onDelete={deleteSalaryData}
          onCancel={() => setConfirm(false)}
        />
      )}
      {modelOpen && (
        <SalaryForm
          modelOpen={modelOpen}
          setModelOpen={setModelOpen}
          onClose={() => {
            setModelOpen(false);
            resetForm();
            setEditId();
          }}
          values={values}
          handleChange={handleChange}
          officeNameOptions={officeNameOptions}
          editId={editId}
          handleBlur={handleBlur}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </>
  );
};

export default Salaries;
