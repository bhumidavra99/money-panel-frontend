import React from "react";
import Select from "react-select";

const PortalFields = ({
  values,
  handlePortalChange,
  handlePortalInputChange,
  paymentPortalOptions,
  swipePortalOptions,
}) => {
  return (
    <>
      <div>
        <label className="capitalize text-base font-medium text-gray-700">
          Payment Portal
        </label>
        <Select
          isMulti
          name="paymentPortal"
          className="w-full text-base mt-1 h-[40px] rounded-md focus:border-[#EB8844]"
          value={paymentPortalOptions?.filter((option) =>
            values?.paymentPortal
              ?.map((item) => item.portalName)
              .includes(option.value)
          )}
          onChange={(e) => handlePortalChange(e, "paymentPortal")}
          options={paymentPortalOptions}
          classNamePrefix="custom-select"
        />
        {values.paymentPortal.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {values.paymentPortal.map((portal, index) => (
              <input
                key={index}
                type="number"
                placeholder={`Enter ${portal.portalName} Amount`}
                value={portal.amount}
                onChange={(e) =>
                  handlePortalInputChange(
                    portal.portalName,
                    e.target.value,
                    "paymentPortal",
                    "amount"
                  )
                }
                className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400"
              />
            ))}
          </div>
        )}
      </div>
      <div>
        <label className="capitalize text-base font-medium text-gray-700">
          Swipe Portal
        </label>
        <Select
          isMulti
          name="swipePortal"
          className="w-full text-base mt-1 h-[40px] rounded-md focus:border-[#EB8844]"
          value={swipePortalOptions?.filter((option) =>
            values?.swipePortal
              ?.map((item) => item.portalName)
              .includes(option.value)
          )}
          onChange={(e) => handlePortalChange(e, "swipePortal")}
          options={swipePortalOptions}
          classNamePrefix="custom-select"
        />
        {values.swipePortal.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {values.swipePortal.map((portal, index) => (
              <input
                key={index}
                type="number"
                placeholder={`Enter ${portal.portalName} Amount`}
                value={portal.amount}
                onChange={(e) =>
                  handlePortalInputChange(
                    portal.portalName,
                    e.target.value,
                    "swipePortal",
                    "amount"
                  )
                }
                className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PortalFields;