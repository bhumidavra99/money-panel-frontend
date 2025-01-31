import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import ConfirmationPage from "../../common/ConfirmationPage";
import { useDispatch, useSelector } from "react-redux";
import {
  addPortal,
  deletePortal,
  editPortal,
  getPortals,
  getSinglePortal,
} from "../../redux/services/portalSlice";
import { toast } from "react-toastify";
import PortalForm from "./portalForm";

const Portals = () => {
  const dispatch = useDispatch();
  const getAllPortalData = useSelector((state) => state.portal.portalData);
  const getSinglePortalData = useSelector(
    (state) => state.portal.singlePortalData
  );
  const [modelOpen, setModelOpen] = useState(false);
  const [editId, setEditId] = useState();
  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const initialValues = {
    portalName: "",
    normalCard: "",
    businessCard: "",
    masterCard: "",
    balance: "",
  };
  const validationSchema = Yup.object({
    portalName: Yup.string().required("Portal Name  is required"),
    normalCard: Yup.string().required("Normal Card  is required"),
    businessCard: Yup.string().required("Business Card  is required"),
    masterCard: Yup.string().required("Master Card  is required"),
    balance: Yup.string().required("Balance  is required"),
  });
  const getAllPortal = useCallback(async () => {
    setLoading(true);
    try {
      const response = await dispatch(getPortals());
      if (response?.payload?.status === 200) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  }, [dispatch]);
  useEffect(() => {
    getAllPortal();
  }, [getAllPortal]);
  const onSubmit = async () => {
    setLoading(true);
    const payload = { ...values };
    if (editId) {
      payload.portalId = editId;
    }
    try {
      let response;
      if (editId) {
        response = await dispatch(editPortal(payload));
      } else {
        response = await dispatch(addPortal(payload));
      }
      if (response?.payload?.status === 200) {
        toast.success(response?.payload?.message, {
          autoClose: 2000,
          pauseOnHover: false,
        });
        setLoading(false);
        setModelOpen(false);
        resetForm();
        getAllPortal();
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
    if (getSinglePortalData) {
      setValues({
        portalName: getSinglePortalData?.portalName,
        normalCard: getSinglePortalData?.normalCard,
        businessCard: getSinglePortalData?.businessCard,
        masterCard: getSinglePortalData?.masterCard,
        balance: getSinglePortalData?.balance,
      });
    }
  }, [getSinglePortalData, setValues]);
  const data = useMemo(() => {
    return getAllPortalData?.data || [];
  }, [getAllPortalData]);
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "#",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Portal Name",
        accessor: "portalName",
      },
      {
        Header: "Balance",
        accessor: "balance",
      },
      {
        Header: "Normal",
        accessor: "normalCard",
      },
      {
        Header: "Business",
        accessor: "businessCard",
      },
      {
        Header: "Master",
        accessor: "masterCard",
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

  const deletePortalData = async (row) => {
    try {
      const response = await dispatch(deletePortal(itemToDelete));
      toast.success(response?.payload?.message, {
        autoClose: 2000,
        pauseOnHover: false,
      });
      setConfirm(false);
      getAllPortal();
    } catch (error) {}
  };
  useEffect(() => {
    if (editId) {
      const fetchSingleAccount = async () => {
        try {
          await dispatch(getSinglePortal(editId));
        } catch (error) {}
      };

      fetchSingleAccount();
    }
  }, [dispatch, editId]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-end mb-4 gap-5">
        <div className="inline-flex items-center space-x-2 rounded-lg  text-center">
          <p className="font-semibold text-lg">
            Total Balance :
            <span className="ms-2"> {getAllPortalData?.totalBalance}</span>
          </p>
        </div>
        <button
          className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-[#eb8844] hover:bg-opacity-90"
          onClick={() => setModelOpen(true)}
        >
          <FaPlus className="font-bold text-white w-4 h-4" />
          <p className="font-semibold">Add New Portal</p>
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
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
              rows.map((row) => {
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
          topicName="Marchant"
          confirm={confirm}
          onDelete={deletePortalData}
          onCancel={() => setConfirm(false)}
        />
      )}
      {modelOpen && (
        <PortalForm
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

export default Portals;
