import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

const DateFilter = ({
  setToggle,
  onClose,
  setStartDate,
  setEndDate,
  handleDateSubmit,
  startDate,
  endDate,
}) => {
  const [error, setError] = useState("");

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  useEffect(() => {
    if (!startDate || !endDate) {
      setError("Please Select Start Date & End Date");
    } else {
      setError("");
    }
  }, [startDate, endDate]);
  return (
    <section className="fixed z-50 inset-0 overflow-hidden duration-300 ease-in-out">
      <div className="flex items-center justify-center min-h-screen text-center sm:block">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block mx-[10px] w-full bg-white rounded-lg space-y-4  text-left overflow-hidden shadow-xl transform transition-all sm:align-middle max-w-lg md:max-w-2xl">
          <div className="relative w-full flex flex-col items-center rounded-xl py-2 overflow-hidden text-slate-700 bg-white bg-clip-border">
            <span className="text-gray-900 font-medium capitalize text-xl py-4">
              Select Date Range
            </span>
            <div className="flex items-center justify-center md:flex-row flex-col  gap-4 border-t border-gray-400 w-full py-4 px-4">
              <div className="flex flex-col w-[16rem] items-center">
                <label className="mb-2">Start Date</label>
                <DatePicker
                  id="startDate"
                  selected={startDate}
                  onChange={handleStartDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select a Start Date"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  portalId="root"
                  maxDate={new Date()}
                />
              </div>
              <div className="flex flex-col w-[16rem] items-center">
                <label className="mb-2">End Date</label>
                <DatePicker
                  id="endDate"
                  selected={endDate}
                  onChange={handleEndDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select an End Date"
                  minDate={startDate}
                  maxDate={new Date()}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  portalId="root"
                />
              </div>
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div className="flex items-center justify-center md:flex-row flex-col gap-4 w-full py-4">
              <button
                onClick={onClose}
                type="button"
                className="max-w-[200px] w-full h-[45px] text-md font-medium text-[#eb8844] border border-[#eb8844] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDateSubmit}
                type="button"
                className="max-w-[200px] w-full h-[45px] text-md font-medium text-white bg-[#eb8844] border border-[#eb8844]  rounded-lg"
                disabled={error || !startDate || !endDate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DateFilter;
