import React, { useCallback, useEffect, useMemo, useState } from "react";
import Table from "../../common/Table";
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import { getDebits } from "../../redux/services/debitSlice";
import Loader from "../../common/Loader";

const RemainingDebit = () => {
  const dispatch = useDispatch();
  const getAllDebitData = useSelector((state) => state.debit.debitData);
  const [pageLoading, setPageLoading] = useState(false);
  const getAllDebits = useCallback(
    async () => {
      setPageLoading(true);
      try {
        const response = await dispatch(getDebits());
        if (response?.payload?.status === 200) {
          setPageLoading(false);
        }
      } catch (error) {
        setPageLoading(false);
      } finally {
        setPageLoading(false);
      }
    },
    [dispatch]
  );
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
      <h1 className="text-2xl font-semibold text-center">Remaining Debit</h1>
      <Table data={data} columns={columns} />
    </div>
  );
};

export default RemainingDebit;
