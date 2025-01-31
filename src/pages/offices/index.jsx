import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
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

const Offices = () => {
  const dispatch = useDispatch();
  const getAllOfficesData = useSelector((state) => state.office.officeData);
  const getSingleOfficeData = useSelector(
    (state) => state.office.singleOfficeData
  );
  const [modelOpen, setModelOpen] = useState(false);
  const [editId, setEditId] = useState();
  const [loading, setLoading] = useState(false);
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
      },
      {
        Header: "Transaction",
        accessor: "transactions",
      },
      {
        Header: "Profit",
        accessor: "profit",
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

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
    setLoading(true);
    try {
      const response = await dispatch(getOffices());
      if (response?.payload?.status === 200) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
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
  return (
    <>
      <div className="flex flex-wrap justify-end gap-4">
        <button
          className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-[#eb8844] hover:bg-opacity-90"
          onClick={() => setModelOpen(true)}
        >
          <FaPlus className="font-bold text-white w-4 h-4" />
          <p className="font-semibold">Add New Office</p>
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-4">
        <table
          {...getTableProps()}
          className="min-w-full bg-white border-collapse"
        >
          <thead className="bg-gray-200">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-4  text-sm whitespace-nowrap text-center font-bold text-gray-700 uppercase tracking-wider"
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
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-100">
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700"
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
                          className="px-6 py-3 bg-[#eb8844] text-white text-lg font-semibold rounded-md shadow-lg hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#eb8844] transition-all duration-300 ease-in-out transform hover:scale-105"
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
