import React from "react";
import Select from "react-select";

const CustomerInfoFields = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  formatCardNumber,
  officeNameOptions,
}) => {
  return (
    <>
      <div>
        <label className="capitalize text-base font-medium text-gray-700">
          Customer Name
        </label>
        <input
          className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400 focus:outline-none focus:border-[#EB8844]"
          type="text"
          placeholder="Enter Customer Name"
          name="customerName"
          value={values.customerName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.customerName && errors.customerName && (
          <div className="text-red-500 text-sm">
            {errors.customerName}
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
          value={officeNameOptions?.find(
            (option) => option.value === values.officeName
          )}
          onChange={(e) =>
            setFieldValue("officeName", e ? e.value : "")
          }
          options={officeNameOptions}
          classNamePrefix="custom-select"
        />
        {touched.officeName && errors.officeName && (
          <div className="text-red-500 text-sm">
            {errors.officeName}
          </div>
        )}
      </div>
      <div>
        <label className="capitalize text-base font-medium text-gray-700">
          Card Number
        </label>
        <input
          className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400 focus:outline-none focus:border-[#EB8844]"
          type="text"
          placeholder="Enter Card Number"
          name="cardNumber"
          value={values.cardNumber}
          maxLength="19"
          onChange={(e) => {
            const { value } = e.target;
            const formattedValue = formatCardNumber(value);
            handleChange({
              target: {
                name: "cardNumber",
                value: formattedValue,
              },
            });
          }}
          onBlur={handleBlur}
        />
        {touched.cardNumber && errors.cardNumber && (
          <div className="text-red-500 text-sm">
            {errors.cardNumber}
          </div>
        )}
      </div>
      <div>
        <label className="capitalize text-base font-medium text-gray-700">
          Bank Name
        </label>
        <input
          className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400 focus:outline-none focus:border-[#EB8844]"
          type="text"
          placeholder="Enter Bank Name"
          name="bankName"
          value={values.bankName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.bankName && errors.bankName && (
          <div className="text-red-500 text-sm">{errors.bankName}</div>
        )}
      </div>
    </>
  );
};

export default CustomerInfoFields;