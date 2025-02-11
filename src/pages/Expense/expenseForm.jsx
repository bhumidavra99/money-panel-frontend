import React from "react";
import { TfiClose } from "react-icons/tfi";
import Select from "react-select";
import { customStyles } from "../../common/select-custom-style";

const ExpenseForm = ({
  onClose,
  values,
  handleChange,
  officeOptions,
  handleBlur,
  editId,
  errors,
  touched,
  handleSubmit,
  loading,
  accountOptions,
  setFieldValue,
}) => {
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
            } Expense`}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              <TfiClose />
            </button>
          </div>
          <hr className="my-3" />
          <form onSubmit={handleSubmit}>
            <div className="w-full space-y-5">
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
                  onChange={(e) =>
                    setFieldValue("accountName", e ? e.value : "")
                  }
                  options={accountOptions}
                  styles={customStyles}
                  maxMenuHeight={200}
                />
                {touched.accountName && errors.accountName && (
                  <div className="text-red-500 text-sm">
                    {errors.accountName}
                  </div>
                )}
              </div>
              <div>
                <label className="capitalize text-base font-medium text-gray-700">
                  Office Name
                </label>
                <Select
                  name="officeName"
                  className="w-full text-base mt-1 h-[40px] rounded-md focus:border-[#EB8844]"
                  value={officeOptions?.find(
                    (option) => option.value === values.officeName
                  )}
                  onChange={(e) =>
                    setFieldValue("officeName", e ? e.value : "")
                  }
                  options={officeOptions}
                  styles={customStyles}
                  maxMenuHeight={200}
                />
                {touched.officeName && errors.officeName && (
                  <div className="text-red-500 text-sm">
                    {errors.officeName}
                  </div>
                )}
              </div>
              <div>
                <label className="capitalize text-base font-medium text-gray-700">
                  Expense Title
                </label>
                <input
                  className="w-full text-base p-2 rounded-md border border-gray-400 focus:outline-none focus:border-indigo-500"
                  type="text"
                  placeholder="Enter Expense Title"
                  name="expenseTitle"
                  value={values.expenseTitle}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.expenseTitle && errors.expenseTitle && (
                  <div className="text-red-500 text-sm">
                    {errors.expenseTitle}
                  </div>
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
                    ["ArrowUp", "ArrowDown"].includes(e.key) &&
                    e.preventDefault()
                  }
                />
                {touched.amount && errors.amount && (
                  <div className="text-red-500 text-sm">{errors.amount}</div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center mt-8 gap-5">
              <button
                type="button"
                className="w-[150px] h-[50px] flex justify-center items-center border border-[#EB8844] rounded-md text-[#EB8844]"
                onClick={onClose}
              >
                <p className="font-semibold">Cancel</p>
              </button>
              <button
                type="submit"
                className="w-[150px] h-[50px] flex justify-center items-center text-white bg-[#EB8844] rounded-md hover:bg-[#EB8844]"
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

export default ExpenseForm;
