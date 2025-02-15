import React, { useCallback, useEffect, useMemo, useState } from "react";
import Table from "../../common/Table";
import { useDispatch, useSelector } from "react-redux";
import { getDebits } from "../../redux/services/debitSlice";
import Loader from "../../common/Loader";
import { BiSearch } from "react-icons/bi";

const RemainingDebit = () => {
  const dispatch = useDispatch();
  const getAllDebitData = useSelector((state) => state.debit.debitData);
  const [pageLoading, setPageLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState("");
  const getAllDebits = useCallback(async () => {
    setPageLoading(true);
    try {
      const response = await dispatch(getDebits({ search: searchData }));
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
    if (!getAllDebitData?.data) return [];
    const uniqueData = [];
    const seenCusNames = new Set();

    getAllDebitData.data.forEach((record) => {
      if (!seenCusNames.has(record.cusName)) {
        uniqueData.push(record);
        seenCusNames.add(record.cusName);
      }
    });

    return uniqueData;
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
        Header: "Remaining Amount",
        accessor: "remainingAmount",
        Cell: ({ value }) => (value ? value : "-"),
      },
    ],
    []
  );
  if (pageLoading) {
    return <Loader />;
  }
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-5">
        <h1 className="text-2xl font-semibold text-center">Remaining Debit</h1>
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
        <div></div>
      </div>

      <Table data={data} columns={columns} />
    </div>
  );
};

export default RemainingDebit;
