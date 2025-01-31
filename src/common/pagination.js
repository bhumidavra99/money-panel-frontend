import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({ pageCount, onPageChange }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const updateScreenSize = () => setIsSmallScreen(window.innerWidth < 640);
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return (
    <div className="bg-white">
      <ReactPaginate
       previousLabel={"<"}
       nextLabel={">"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={isSmallScreen ? 1 : 2}
        pageRangeDisplayed={isSmallScreen ? 1 : 3}
        onPageChange={onPageChange}
        containerClassName={"flex justify-center items-center space-x-2 py-4 text-[#000]"}
        pageClassName={
          "w-9 h-9 flex justify-center bg-white items-center border border-gray-300 hover:bg-gray-100 rounded-md text-gray-700  cursor-pointer pagination-link"
        }
        activeClassName="!bg-[#EB8844] !text-white hover:!bg-[#EB8844] hover:!text-white active-pagination-link"
        breakClassName={
          "w-9 h-9 flex justify-center items-center bg-white border border-gray-300 rounded-md text-gray-700 cursor-pointer pagination-link"
        }
        previousClassName={
          "w-9 h-9 flex justify-center items-center bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer pagination-link"
        }
        nextClassName={
          "w-9 h-9 flex justify-center items-center bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer pagination-link"
        }
        disabledClassName={"opacity-50 cursor-not-allowed"}
      />
    </div>
  );
};

export default Pagination;
