import React, { useEffect, useState } from "react";
import { TfiClose } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { getDebits } from "../../redux/services/debitSlice";

const CreditForm = ({
  onClose,
  values,
  setFieldValue,
  handleChange,
  accountOptions,
  handleBlur,
  editId,
  errors,
  touched,
  handleSubmit,
  loading,
}) => {
const dispatch = useDispatch()
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const getAllDebitData = useSelector((state) => state.debit.debitData);
  const uniqueCusNames = [
    ...new Set(getAllDebitData?.data?.map((item) => item.cusName.toLowerCase())),
  ];

  const handleCusNameChange = (e) => {
    const userInput = e.target.value;
    setFieldValue("cusName", userInput);

    if (userInput.trim().length > 0) {
      const matches = uniqueCusNames.filter((name) =>
        name.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };


  const handleSuggestionClick = (name) => {
    setFieldValue("cusName", name);
    setShowSuggestions(false);
  };
  useEffect(() => {
    dispatch(getDebits());
  }, [dispatch]);
  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div
          className="absolute inset-0 bg-transparent z-40"
          onClick={onClose}
        />
        <div className="modal-content bg-white rounded-lg p-6 w-full mx-4 max-w-2xl md:max-h-[90vh] max-h-[80vh] overflow-y-auto custom-scrollbar relative z-50">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-0">{`${
              editId ? "Edit" : "Add"
            } Credit`}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              <TfiClose />
            </button>
          </div>
          <hr className="my-3" />
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="capitalize text-base font-medium text-gray-700">
                Account Name
              </label>
              <Select
                name="accountName"
                className="w-full text-base mt-1 h-[40px] rounded-md focus:border-[#EB8844]"
                value={accountOptions?.find(
                  (option) => option.value === values.accountName
                )}
                onChange={(e) => setFieldValue("accountName", e ? e.value : "")}
                options={accountOptions}
                classNamePrefix="custom-select"
              />
              {touched.accountName && errors.accountName && (
                <div className="text-red-500 text-sm">{errors.accountName}</div>
              )}
            </div>
            <div className="relative">
              <label className="capitalize text-base font-medium text-gray-700">
                Customer Name
              </label>
              <input
                className="w-full text-base p-2 rounded-md border border-gray-400 focus:outline-none focus:border-indigo-500"
                type="text"
                placeholder="Enter Customer Name"
                name="cusName"
                value={values.cusName}
                onChange={handleCusNameChange}
                onBlur={handleBlur}
              />
              {touched.cusName && errors.cusName && (
                <div className="text-red-500 text-sm">{errors.cusName}</div>
              )}

              {showSuggestions && (
                <ul className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 max-h-36 overflow-y-auto shadow-lg z-50">
                  {filteredSuggestions.map((name, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSuggestionClick(name)}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="capitalize text-base font-medium text-gray-700">
                Amount
              </label>
              <input
                className="w-full text-base p-2 rounded-md border border-gray-400 focus:outline-none focus:border-indigo-500"
                type="number"
                placeholder="Enter Amount"
                name="amount"
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) =>
                  ["ArrowUp", "ArrowDown"].includes(e.key) && e.preventDefault()
                }
              />
              {touched.amount && errors.amount && (
                <div className="text-red-500 text-sm">{errors.amount}</div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center mt-5 gap-5">
              <button
                type="button"
                className="w-[150px] h-[50px] flex justify-center items-center border border-[#EB8844] rounded-md text-[#EB8844]"
                onClick={onClose}
              >
                <p className="font-semibold">Cancel</p>
              </button>
              <button
                type="submit"
                className="w-[150px] h-[50px] font-bold flex justify-center items-center text-white bg-[#EB8844] rounded-md hover:bg-[#EB8844]"
              >
                {loading ? <div className="loader"></div> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreditForm;
