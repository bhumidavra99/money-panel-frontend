import React from "react";

const AmountFields = ({ 
  values, 
  errors, 
  touched, 
  handleChange, 
  handleBlur 
}) => {
  return (
    <>
      <div>
        <label className="capitalize text-base font-medium text-gray-700">
          Bill Amount
        </label>
        <input
          className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400 focus:outline-none focus:border-[#EB8844]"
          type="number"
          placeholder="Enter Bill Amount"
          name="billAmount"
          value={values.billAmount}
          onChange={handleChange}
          onBlur={handleBlur}
          onWheel={(e) => e.target.blur()}
          onKeyDown={(e) =>
            ["ArrowUp", "ArrowDown"].includes(e.key) &&
            e.preventDefault()
          }
          readOnly
        />
        {touched.billAmount && errors.billAmount && (
          <div className="text-red-500 text-sm">
            {errors.billAmount}
          </div>
        )}
      </div>
      <div>
        <label className="capitalize text-base font-medium text-gray-700">
          Swipe Amount
        </label>
        <input
          className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400 focus:outline-none focus:border-[#EB8844]"
          type="number"
          placeholder="Enter Swipe Amount"
          name="swipeAmount"
          value={values.swipeAmount}
          onChange={handleChange}
          onBlur={handleBlur}
          onWheel={(e) => e.target.blur()}
          onKeyDown={(e) =>
            ["ArrowUp", "ArrowDown"].includes(e.key) &&
            e.preventDefault()
          }
          readOnly
        />
        {touched.swipeAmount && errors.swipeAmount && (
          <div className="text-red-500 text-sm">
            {errors.swipeAmount}
          </div>
        )}
      </div>
    </>
  );
};

export default AmountFields;