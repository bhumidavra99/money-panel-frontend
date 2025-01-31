import React, { useCallback, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import money from "../../assests/fiat-money.png";
import { getDashboardData } from "../../redux/services/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import DateFilter from "../../common/DateFilter";
import { FaRegCalendarAlt } from "react-icons/fa";
import moment from "moment-timezone";
import { convertUtcToIst } from "../../common/TimeUtils";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const Dashboard = () => {
  const dashboardData = useSelector((state) => state?.dashboard?.dashboardData);
  const dispatch = useDispatch();
  const [chartsData, setChartsData] = useState(null);
  const [profitChartsData, setProfitChartsData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [savedStartDate, setSavedStartDate] = useState("");
  const [savedEndDate, setSavedEndDate] = useState("");
  const handleSaveDate = () => {
    setToggle(false);
    setSavedStartDate(startDate);
    setSavedEndDate(endDate);
    if (handleDateSubmit) {
      handleDateSubmit();
    }
  };
  const handleDateSubmit = () => {
    let adjustedStartDate = null;
    if (startDate) {
      adjustedStartDate = new Date(startDate);
      adjustedStartDate.setHours(0, 0, 0, 0);
    }
    let adjustedEndDate = null;
    if (endDate) {
      adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
    }
    const SDate = adjustedStartDate ? convertUtcToIst(adjustedStartDate) : null;
    const EDate = adjustedEndDate ? convertUtcToIst(adjustedEndDate) : null;
    if (SDate && EDate) {
      setToggle(false);
      getAllDashboardData(SDate, EDate);
      setStartDate(null);
      setEndDate(null);
    } else {
      getAllDashboardData();
    }
    return { SDate, EDate };
  };

  const handleClearDates = () => {
    setToggle(false);
    setStartDate("");
    setEndDate("");
    setSavedStartDate("");
    setSavedEndDate("");
    if (handleDateSubmit) {
      handleDateSubmit();
    }
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    if (dashboardData?.transactions?.offices) {
      const labels = dashboardData?.transactions?.offices?.map(
        (office) => office?.officeName
      );
      const data = dashboardData.transactions.offices.map(
        (office) => office?.transaction
      );
      setChartsData({
        labels: labels && labels,
        datasets: [
          {
            label: "Transactions",
            data: data,
            backgroundColor: "#4ade80",
            borderWidth: 0,
            barThickness: 50,
            maxBarThickness: window.innerWidth <= 768 ? 20 : 50,
          },
        ],
      });
    }
  }, [dashboardData]);
  useEffect(() => {
    if (dashboardData?.profit?.offices) {
      const labels = dashboardData?.profit?.offices?.map(
        (office) => office?.officeName
      );
      const data = dashboardData?.profit?.offices?.map(
        (office) => office?.profit
      );
      setProfitChartsData({
        labels: labels,
        datasets: [
          {
            label: "Profit",
            data: data,
            backgroundColor: "#4ade80",
            borderWidth: 0,
            barThickness: 50,
            maxBarThickness: window.innerWidth <= 768 ? 20 : 50,
          },
        ],
      });
    }
  }, [dashboardData]);
  const getAllDashboardData = useCallback(
    async (SDate, EDate) => {
      try {
        const payload = { startDate: SDate, endDate: EDate };
        await dispatch(getDashboardData(payload));
      } catch (error) {}
    },
    [dispatch]
  );

  useEffect(() => {
    getAllDashboardData();
  }, [getAllDashboardData]);
  return (
    <div className="md:p-6 p-3 bg-gray-50 min-h-[calc(100vh-120px)] h-full">
      { (dashboardData?.transactions?.offices.length > 0 || dashboardData?.profit?.offices.length > 0) ?
        <>
          <h2 className="text-2xl font-bold">Transactions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-7 gap-x-4 gap-y-4 mb-8 mt-2">
            <div className="flex items-center gap-6 bg-white border border-[#DBE0E6] rounded-lg py-4 px-8">
              <div className="bg-[#FFF7F0] p-3 rounded-full">
                <img src={money} alt="" className="h-10 w-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  ₹ {dashboardData?.transactions?.total}
                </h2>
                <p className="text-sm text-gray-500">Total Transaction</p>
              </div>
            </div>

            {dashboardData?.transactions?.offices?.map((office, i) => (
              <div
                className="flex items-center gap-6 bg-white border border-[#DBE0E6] rounded-lg py-4 px-8"
                key={i}
              >
                <div className="bg-[#FFF7F0] p-3 rounded-full">
                  <img src={money} alt="" className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    ₹ {office?.transaction}
                  </h2>
                  <p className="text-sm text-gray-500">{office?.officeName}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col md:flex-row items-end justify-end mb-4 gap-1 md:gap-3">
              {savedStartDate && savedEndDate && (
                <button
                  onClick={handleClearDates}
                  className="flex items-center justify-end space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-[#EB8844] hover:bg-opacity-90"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setToggle(true)}
                className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-[#EB8844] hover:bg-opacity-90"
              >
                <FaRegCalendarAlt className="font-bold text-white w-4 h-4" />
                {savedStartDate && savedEndDate ? (
                  <p>
                    (
                    {`${moment(savedStartDate).format("Do MMMM")} - ${moment(
                      savedEndDate
                    ).format("Do MMMM")}`}
                    )
                  </p>
                ) : (
                  <p className="font-semibold">Select Date</p>
                )}
              </button>
            </div>
            <div className="lg:max-h-[500px] w-full flex justify-center">
              {chartsData && <Bar data={chartsData} options={chartOptions} />}
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-6">Profit</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-7 gap-x-4 gap-y-4 mb-8 mt-2">
            <div className="flex items-center gap-6 bg-white border border-[#DBE0E6] rounded-lg py-4 px-8">
              <div className="bg-[#FFF7F0] p-3 rounded-full">
                <img src={money} alt="" className="h-10 w-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  ₹ {dashboardData?.profit?.total}
                </h2>
                <p className="text-sm text-gray-500">Total Profit</p>
              </div>
            </div>

            {dashboardData?.profit?.offices?.map((office, i) => (
              <div
                className="flex items-center gap-6 bg-white border border-[#DBE0E6] rounded-lg py-4 px-8"
                key={i}
              >
                <div className="bg-[#FFF7F0] p-3 rounded-full">
                  <img src={money} alt="" className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    ₹ {office?.profit}
                  </h2>
                  <p className="text-sm text-gray-500">{office?.officeName}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-end mb-4">
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
            </div>
            <div className="lg:max-h-[500px] w-full flex justify-center">
              {profitChartsData && (
                <Bar data={profitChartsData} options={chartOptions} />
              )}
            </div>
          </div>
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
        </>:
         <div className="flex items-center justify-center p-4 w-full h-full">
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
               className="px-6 py-3 bg-[#EB8844] text-white text-lg font-semibold rounded-md shadow-lg hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB8844] transition-all duration-300 ease-in-out transform hover:scale-105"
               onClick={() => window.location.reload()}
             >
               Try Again
             </button>
           </div>
         </div>
       </div>
      }
    </div>
  );
};

export default Dashboard;
