import React, { useState, useMemo, useCallback, useEffect } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmationPage from "../../common/ConfirmationPage";
import OfficeForm from "./officeForm";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  addOffice,
  deleteOffice,
  editOffice,
  getOffices,
  getSingleOffice,
} from "../../redux/services/officeSlice";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";
import Table from "../../common/Table";

const Offices = () => {
  const dispatch = useDispatch();
  const getAllOfficesData = useSelector((state) => state.office.officeData);
  const getSingleOfficeData = useSelector(
    (state) => state.office.singleOfficeData
  );
  const [modelOpen, setModelOpen] = useState(false);
  const [editId, setEditId] = useState();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "#",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Office Name",
        accessor: "officeName",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Transaction",
        accessor: "transactions",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Profit",
        accessor: "profit",
        Cell: ({ value }) =>  value?.toString().includes(".") ? Number(value).toFixed(2) : value,
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
    return getAllOfficesData || [];
  }, [getAllOfficesData]);
  const initialValues = {
    marchantName: "",
    normalCard: "",
    businessCard: "",
    masterCard: "",
    balance: "",
  };
  const validationSchema = Yup.object({
    officeName: Yup.string().required("Office Name  is required"),
  });
  const getAllOffice = useCallback(async () => {
    setPageLoading(true);
    try {
      const response = await dispatch(getOffices());
      if (response?.payload?.status === 200) {
        setPageLoading(false);
      }
    } catch (error) {
      setPageLoading(false);
    } finally {
      setPageLoading(false);
    }
  }, [dispatch]);
  useEffect(() => {
    getAllOffice();
  }, [getAllOffice]);
  const onSubmit = async () => {
    setLoading(true);
    const payload = { ...values };
    if (editId) {
      payload.officeId = editId;
    }
    try {
      let response;
      if (editId) {
        response = await dispatch(editOffice(payload));
      } else {
        response = await dispatch(addOffice(payload));
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
        getAllOffice();
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
  useEffect(() => {
    if (getSingleOfficeData) {
      setValues({
        officeName: getSingleOfficeData?.officeName,
      });
    }
  }, [getSingleOfficeData, setValues]);
  const deleteOfficeData = async () => {
    try {
      const response = await dispatch(deleteOffice(itemToDelete));
      toast.success(response?.payload?.message, {
        autoClose: 2000,
        pauseOnHover: false,
      });
      setConfirm(false);
      getAllOffice();
    } catch (error) {}
  };
  useEffect(() => {
    if (editId) {
      const fetchSingleOffice = async () => {
        try {
          await dispatch(getSingleOffice(editId));
        } catch (error) {}
      };

      fetchSingleOffice();
    }
  }, [dispatch, editId]);
  if (pageLoading) {
    return <Loader />;
  }
  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-4">
      <h1 className="text-2xl font-semibold text-center">Offices</h1>
        <button
          className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-[#EB8844] hover:bg-opacity-90"
          onClick={() => setModelOpen(true)}
        >
          <FaPlus className="font-bold text-white w-4 h-4" />
          <p className="font-semibold">Add New Office</p>
        </button>
      </div>
      <Table
        data={data}
        columns={columns}
      />
      {confirm && (
        <ConfirmationPage
          topicName="Office"
          confirm={confirm}
          onDelete={deleteOfficeData}
          onCancel={() => setConfirm(false)}
        />
      )}
      {modelOpen && (
        <OfficeForm
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
    </>
  );
};

export default Offices;
