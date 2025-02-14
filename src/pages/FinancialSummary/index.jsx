import React, { useCallback, useEffect, useState } from "react";
import Withdrawal from "../Withdrawal";
import Salaries from "../Salary";
import { useDispatch, useSelector } from "react-redux";
import { getTotalBalance } from "../../redux/services/balanceSlice";
import PinModal from "./pinModel";
import { verifyPin } from "../../redux/services/pinCheckSlice";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { FaRegCalendarAlt } from "react-icons/fa";
import { convertIstToUtc } from "../../common/TimeUtils";
import DateFilter from "../../common/DateFilter";
import Offices from "../offices";

const FinancialSummary = () => {
  const getBalanceData = useSelector((state) => state.balance.balanceData);
    const getAllSalariesData = useSelector((state) => state.salary.salaryData);
      const getAllOfficesData = useSelector((state) => state.office.officeData);
    const withdrawalsData = useSelector(
      (state) => state.withdrawal.withdrawalData
    );
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState("");
  const [toggle, setToggle] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [savedStartDate, setSavedStartDate] = useState(null);
  const [savedEndDate, setSavedEndDate] = useState(null);
  const handleSubmit = async () => {
    let payload = {
      pin: pin,
    };
    setLoading(true);
    try {
      const response = await dispatch(verifyPin(payload));
      if (response?.payload?.status === 200) {
        toast.success(response?.payload?.message, {
          autoClose: 2000,
          pauseOnHover: false,
        });
        setLoading(false);
        setCanAccess(true);
        setIsModalOpen(false);
      }
    } catch (error) {}
  };
  const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
  const getBalances = useCallback(
    async (selectedStartDate, selectedEndDate) => {
      try {
        await dispatch(
          getTotalBalance({
            startDate:
              selectedStartDate ||
              (savedStartDate && convertIstToUtc(savedStartDate)) ||
              convertIstToUtc(
                moment(today).startOf("day").tz("Asia/Kolkata").format()
              ),
            endDate:
              selectedEndDate ||
              (savedEndDate && convertIstToUtc(savedEndDate)) ||
              convertIstToUtc(
                moment(today).endOf("day").tz("Asia/Kolkata").format()
              ),
          })
        );
      } catch (error) {}
    },[dispatch,savedStartDate,savedEndDate,today]
  );
  useEffect(() => {
    if (canAccess) {
      getBalances();
    }
  }, [getBalances, canAccess]);
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
      getBalances(SDate, EDate);
      setStartDate(null);
      setEndDate(null);
    } else {
      getBalances();
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
    getBalances();
    setStartDate("");
    setEndDate("");
    setSavedStartDate("");
    setSavedEndDate("");
  };
  
  return (
    <>
      {isModalOpen && (
        <PinModal
          onClose={() => setIsModalOpen(false)}
          handleSubmit={handleSubmit}
          setPin={setPin}
          pin={pin}
          loading={loading}
        />
      )}
      {canAccess && (
        <div>
          <div className="flex justify-between">
            <div className="bg-white rounded-lg shadow-md p-4 max-w-sm w-full">
              <div className="space-y-3 text-[18px] font-medium">
                <li className="flex justify-between items-center">
                  <h2 className="ml-2 font-bold text-[22px]">Profit</h2>
                  <span>{getBalanceData?.totalBalance}</span>
                </li>
              </div>
            </div>
            <div>
              <div className="flex flex-wrap justify-end items-center gap-2 rounded-lg text-center mt-3 md:mt-0">
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
          </div>
          <div className="mt-8">
          <Offices getAllOfficesData={getAllOfficesData}/>
          </div>
          <div className="my-8">
            <Salaries getAllSalariesData={getAllSalariesData} />
          </div>
          <Withdrawal withdrawalsData={withdrawalsData} />
        </div>
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
    </>
  );
};

export default FinancialSummary;
