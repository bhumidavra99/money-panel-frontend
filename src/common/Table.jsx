import React from "react";
import { useTable, useSortBy } from "react-table";
import Pagination from "./pagination";
import Select from "react-select";
import { customStyles } from "./select-custom-style";

const Table = ({
  data,
  columns,
  pageCount,
  limitOptions,
  pageLimit,
  setPage,
  setPageLimit,
  isPagination =false,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-4">
      <table
        {...getTableProps()}
        className="min-w-full bg-white border-collapse"
      >
        <thead className="bg-gray-200">
          {headerGroups?.map((headerGroup) => (
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
                <div className="flex items-center justify-center p-4 w-full">
                  <div className="text-center animate__animated animate__fadeIn animate__delay-1s">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      No Data Found
                    </h2>
                    <p className="text-md text-gray-600 mb-6">
                      Unfortunately, we couldn't find any results matching your
                      search.
                    </p>
                    <div className="mt-6">
                      <button
                        className="px-6 py-3 bg-[#EB8844] text-white text-lg font-semibold rounded-md shadow-lg hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB8844] transition-all duration-300 ease-in-out transform hover:scale-105"
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
      {isPagination && rows?.length > 0
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
    </div>
  );
};

export default Table;
