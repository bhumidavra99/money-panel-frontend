import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTable, useSortBy } from "react-table";
import { BiSearch } from "react-icons/bi";
import DateFilter from "../../common/DateFilter";
import Select from "react-select";
import moment from "moment-timezone";
import {
  FaEdit,
  FaFileExcel,
  FaFilePdf,
  FaPlus,
  FaRegCalendarAlt,
  FaTrash,
} from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteReport, getReports } from "../../redux/services/reportSlice";
import Pagination from "../../common/pagination";
import { convertUtcToIst } from "../../common/TimeUtils";
import ConfirmationPage from "../../common/ConfirmationPage";
import { toast } from "react-toastify";
import SwipeModel from "./swipeModel";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Report = () => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "0.375rem",
      borderColor: "#D1D5DB",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#eb8844",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#eb8844" : "white",
      color: state.isSelected ? "white" : "#4B5563",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: state.isSelected ? "#eb8844" : "#fde5c1",
        color: state.isSelected ? "white" : "#4B5563",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#4B5563",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#4B5563",
      "&:hover": {
        color: "#eb8844",
      },
    }),
  };
  const dispatch = useDispatch();
  const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
  const limitOptions = [
    { value: 10, label: 10 },
    { value: 50, label: 50 },
    { value: 100, label: 100 },
    { value: 500, label: 500 },
    { value: 1000, label: 1000 },
    { value: 10000, label: 10000 },
  ];
  const statusOptions = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "success", label: "Success" },
    { value: "failed", label: "Failed" },
  ];
  const getAllReportData = useSelector((state) => state.report.customersData);
  const pageCount = getAllReportData?.pagination?.totalPages;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState("");
  const [page, setPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(limitOptions[0]?.value);
  const [toggle, setToggle] = useState(false);
  const [swipeButton, setSwipeButton] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [savedStartDate, setSavedStartDate] = useState(null);
  const [savedEndDate, setSavedEndDate] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [filterValue, setFilterValue] = useState();
  const navigate = useNavigate();
  const getReportsCallback = useCallback(
    (selectedStartDate, selectedEndDate) => {
      dispatch(
        getReports({
          page: page + 1,
          limit: pageLimit,
          startDate:
            selectedStartDate ||
            (savedStartDate && convertUtcToIst(savedStartDate)) ||
            convertUtcToIst(
              moment(today).startOf("day").tz("Asia/Kolkata").format()
            ),
          endDate:
            selectedEndDate ||
            (savedEndDate && convertUtcToIst(savedEndDate)) ||
            convertUtcToIst(
              moment(today).endOf("day").tz("Asia/Kolkata").format()
            ),
          search: searchData,
          statusFilter: filterValue,
        })
      );
    },
    [
      dispatch,
      page,
      pageLimit,
      today,
      searchData,
      savedStartDate,
      savedEndDate,
      filterValue,
    ]
  );

  useEffect(() => {
    getReportsCallback();
  }, [getReportsCallback]);
  const data = useMemo(() => {
    return getAllReportData?.customer || [];
  }, [getAllReportData?.customer]);
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "#",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <div className="flex items-center justify-center gap-4">
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => {
                navigate(`/edit-customer?customerId=${row.original?._id}`);
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
      {
        Header: "Office Name",
        accessor: "officeName",
      },
      {
        Header: "Date",
        accessor: "updatedAt",
        Cell: ({ value }) => moment(value).format("DD-MM-YYYY"),
      },
      {
        Header: "Bank",
        accessor: "bankName",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Card Number",
        accessor: "cardNumber",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Customer Name",
        accessor: "customerName",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Bill Amt",
        accessor: "billAmount",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Swipe Amt",
        accessor: "swipeAmount",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "P Portal",
        accessor: "paymentPortal",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "S Portal",
        accessor: "swipePortal",
        Cell: ({ value }) => (value ? value : "-"),
      },

      {
        Header: "Charge (%)",
        accessor: "chargeInPer",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Charge (₹)",
        accessor: "chargeInRupees",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Account Type",
        accessor: "chargeType",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Card Charge (₹)",
        accessor: "cardChargeInRupees",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "E Charge",
        accessor: "extraCharge",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Profit",
        accessor: "profit",
        Cell: ({ value }) => (value ? value.toFixed(2) : "-"),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => {
          const statusClass =
            value === "failed"
              ? "bg-red-100 text-red-500"
              : value === "success"
              ? "bg-green-100 text-green-500"
              : value === "pending"
              ? "bg-yellow-100 text-yellow-500"
              : "";

          return (
            <li
              className={`py-1 px-2 max-w-[8rem] mx-auto flex justify-center text-sm leading-5 font-semibold rounded-full ${statusClass}`}
            >
              {value?.charAt(0).toUpperCase() + value?.slice(1) || "-"}
            </li>
          );
        },
      },
    ],
    [navigate]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  const handleDateSubmit = () => {
    const adjustedStartDate = moment(startDate)
      .startOf("day")
      .tz("Asia/Kolkata")
      .format();
    const adjustedEndDate = moment(endDate)
      .endOf("day")
      .tz("Asia/Kolkata")
      .format();
    setStartDate(adjustedStartDate);
    setEndDate(adjustedEndDate);
    const SDate = adjustedStartDate ? convertUtcToIst(adjustedStartDate) : null;
    const EDate = adjustedEndDate ? convertUtcToIst(adjustedEndDate) : null;
    setToggle(false);
    if (SDate && EDate) {
      setToggle(false);
      getReportsCallback(SDate, EDate);
    } else {
      getReports();
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
    getReportsCallback();
    setStartDate("");
    setEndDate("");
    setSavedStartDate("");
    setSavedEndDate("");
  };
  const deleteCustomerData = async () => {
    try {
      const response = await dispatch(deleteReport(itemToDelete));
      if (response.payload.status === 200) {
        toast.success(response?.payload?.message, {
          autoClose: 2000,
          pauseOnHover: false,
        });
        setConfirm(false);
        getReportsCallback();
        setSavedStartDate("");
        setSavedEndDate("");
      }
    } catch (error) {}
  };
  const headersConfig = [
    { label: "S/N", key: "index", render: (_, __, index) => index + 1 },
    {
      label: "Date",
      key: "updatedAt",
      render: (_, row) =>
        row?.updatedAt ? moment(row?.updatedAt).format("DD-MM-YYYY") : "-",
    },
    {
      label: "Bank",
      key: "bankName",
      render: (_, row) => row?.bankName || "-",
    },
    {
      label: "Card Number",
      key: "cardNumber",
      render: (_, row) => row?.cardNumber || "-",
    },
    {
      label: "Customer Name",
      key: "customerName",
      render: (_, row) => row?.customerName || "-",
    },
    {
      label: "Bill Amt",
      key: "billAmount",
      render: (_, row) => row?.billAmount || "-",
    },
    {
      label: "Swipe Amt",
      key: "swipeAmount",
      render: (_, row) => row?.swipeAmount || "-",
    },

    {
      label: "Charge (%)",
      key: "chargeInPer",
      render: (_, row) => row?.chargeInPer || "-",
    },
    {
      label: "Charge (₹)",
      key: "chargeInRupees",
      render: (_, row) => row?.chargeInRupees || "-",
    },

    {
      label: "P Portal",
      key: "paymentPortal",
      render: (_, row) => row?.paymentPortal || "-",
    },
    {
      label: "Card Charge (%)",
      key: "cardChargeInPer",
      render: (_, row) => row?.cardChargeInPer || "-",
    },
    {
      label: "S Portal",
      key: "swipePortal",
      render: (_, row) => row?.swipePortal || "-",
    },

    {
      label: "E Charge",
      key: "extraCharge",
      render: (_, row) => row?.extraCharge || "-",
    },
  ];
  const exportToPDF = () => {
    const data = getAllReportData?.customer || [];
    if (data.length === 0) {
      toast.warn("No data available for export!", {
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }
    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.width;
    const topMargin = 7;
    const leftMargin = 15;
    const rightMargin = 15;
    const bottomMargin = 10;
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Data", pageWidth / 2, topMargin, { align: "center" });
    const headers = [headersConfig.map((header) => header.label)];
    const rows = data.map((row, index) =>
      headersConfig.map((header) =>
        header.render ? header.render(null, row, index) : row[header.key] || "-"
      )
    );
    doc.autoTable({
      startY: topMargin + 10,
      head: headers,
      body: rows,
      theme: "grid",
      headStyles: {
        fillColor: "#eb8844",
        textColor: "#fff",
        fontStyle: "bold",
        cellPadding: 5,
        // cellWidth: "wrap",
      },
      bodyStyles: {
        fillColor: "#f5f5f5",
        textColor: "#000",
        fontSize: 10,
        cellPadding: 4,
        // cellWidth: "wrap",
      },
      alternateRowStyles: { fillColor: "#fff" },
      margin: { left: leftMargin, right: rightMargin },
      pageBreak: "auto",
      // styles: {
      //   overflow: "linebreak",
      // },
      didDrawPage: (data) => {
        const footerY = doc.internal.pageSize.height - bottomMargin;
        doc.setFontSize(10);
        const pageCount = doc.internal.getNumberOfPages();
        doc.text(`${pageCount}`, pageWidth / 2, footerY, { align: "center" });
      },
    });

    doc.save("customer_data.pdf");
  };
  const exportToCSV = () => {
    const data = getAllReportData?.customer || [];

    if (data.length === 0) {
      toast.warn("No data available for export!", {
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }
    const headers =
      headersConfig.map((header) => header.label).join(",") + "\n";
    const rows = data
      .map((row, index) =>
        headersConfig
          .map((header) =>
            header.render
              ? header.render(null, row, index)
              : row[header.key] || "-"
          )
          .join(",")
      )
      .join("\n");
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const fileName = "customer_data.csv";
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <>
      <div className="flex flex-wrap justify-between gap-4">
       
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
            className="absolute top-0 right-0 px-4 h-full bg-[#eb8844] text-white rounded-r-lg"
            onClick={() => setSearchData(searchTerm)}
          >
            <BiSearch />
          </button>
        </div>
        <div className="w-full sm:max-w-[200px]">
          <Select
            name="status"
            className="w-full text-base mt-1 h-[40px] rounded-md focus:border-[#eb8844]"
            value={statusOptions?.find(
              (option) => option.value === filterValue
            )}
            onChange={(e) => setFilterValue(e ? e.value : "")}
            options={statusOptions}
            styles={customStyles}
          />
        </div>
        <div className="flex gap-4 flex-wrap ">
          {savedStartDate && savedEndDate && (
            <button
              onClick={handleClearDates}
              className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-[#eb8844] hover:bg-opacity-90"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setToggle(true)}
            className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-[#eb8844] hover:bg-opacity-90"
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
          <div
            className="bg-white p-1 flex items-center border rounded-md"
            onClick={exportToPDF}
          >
            <FaFilePdf color="red" size={28} />
          </div>
          <div
            className="bg-white p-1 flex items-center border rounded-md"
            onClick={exportToCSV}
          >
            <FaFileExcel color="green" size={28} />
          </div>
          <button
            className="inline-flex items-center rounded-lg px-2 py-2 text-md text-center text-white bg-[#eb8844] hover:bg-opacity-90"
            onClick={() => {
              setSwipeButton(true);
            }}
          >
            <p className="font-semibold">Swipe Rate</p>
          </button>
          <button
            className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-[#eb8844] hover:bg-opacity-90"
            onClick={() => navigate("/add-customer")}
          >
            <FaPlus className="font-bold text-white w-4 h-4" />
            <p className="font-semibold">Add New Customer</p>
          </button>
        </div>
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
                    className="px-6 py-4 text-sm whitespace-nowrap text-center font-bold text-gray-700 uppercase tracking-wider"
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

      {rows?.length > 0
        ? pageCount && (
            <>
              <div className="flex justify-between bg-white items-center px-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="pageLimit" className="mr-2">
                    Page Limit:
                  </label>
                  <Select
                    className=""
                    value={limitOptions?.find(
                      (option) => option.value === pageLimit
                    )}
                    onChange={(e) => setPageLimit(e.value)}
                    options={limitOptions.map((option) => ({
                      value: option.value,
                      label: option.label,
                    }))}
                    styles={customStyles}
                    menuPlacement="top"
                  />
                </div>
                <Pagination
                  pageCount={pageCount}
                  onPageChange={(selectedItem) =>
                    setPage(selectedItem.selected)
                  }
                />
              </div>
            </>
          )
        : ""}
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
      {swipeButton && (
        <SwipeModel
          onClose={() => {
            setSwipeButton(false);
          }}
        />
      )}
      {confirm && (
        <ConfirmationPage
          topicName="Customer"
          confirm={confirm}
          onDelete={deleteCustomerData}
          onCancel={() => setConfirm(false)}
        />
      )}
    </>
  );
};

export default Report;
