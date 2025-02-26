import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addReport,
  editReport,
  getSingleReport,
} from "../../redux/services/reportSlice";
import { useDispatch, useSelector } from "react-redux";
import { getOffices } from "../../redux/services/officeSlice";
import { getPortals } from "../../redux/services/portalSlice";
import { getAccounts } from "../../redux/services/accountSlice";
import { getBetweenAmount } from "../../redux/services/betweenAmountSlice";
const CustomerForm = ({ action }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const customerId = queryParams.get("customerId");
  const getAllOfficesData = useSelector((state) => state.office.officeData);
  const getAllPortalData = useSelector((state) => state.portal.portalData);
  const getAllAccountData = useSelector((state) => state.account.accountData);
  const getSingleCustomerData = useSelector(
    (state) => state.report.singleCustomerData
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(getAccounts());
    dispatch(getOffices());
    dispatch(getPortals());
  }, [dispatch]);

  const initialValues = {
    customerName: undefined,
    officeName: undefined,
    cardNumber: undefined,
    bankName: undefined,
    billAmount: undefined,
    swipeAmount: undefined,
    paymentPortal: [],
    swipePortal: [],
    chargeType: [],
    chargeCardType: undefined,
    chargeInPer: undefined,
    chargeInRupees: undefined,
    extraCharge: undefined,
    // cardChargeInPer: undefined,
    // cardChargeInRupees: undefined,
    profit: undefined,
    status: undefined,
  };

  const validationSchema = Yup.object({
    customerName: Yup.string().required("Customer Name is required"),
    officeName: Yup.string().required("Office Name is required"),
    cardNumber: Yup.string()
      .required("Card Number is required")
      .matches(/^(\d{1} ?)+$/, "Please enter a valid Card Number"),
    bankName: Yup.string().required("Bank Name is required"),
    status: Yup.string().required("Status is required"),
    chargeInPer: Yup.number().max(100, "Charge cannot exceed 100%").nullable(),
    cardChargeInPer: Yup.number()
      .max(100, "Card Charge cannot exceed 100%")
      .nullable(),
  });

  const onSubmit = async () => {
    setLoading(true);
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== "")
    );
    const payload = { ...filteredValues };
    if (customerId) {
      payload.customerId = customerId;
    }
    try {
      let response;
      if (customerId) {
        response = await dispatch(editReport(payload));
      } else {
        response = await dispatch(addReport(payload));
      }
      if (response?.payload?.status === 200) {
        toast.success(response?.payload?.message, {
          autoClose: 2000,
          pauseOnHover: false,
        });
        dispatch(getBetweenAmount());
        setLoading(false);
        navigate("/report");
        resetForm();
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  useEffect(() => {
    if (values.swipePortal.length > 0 && values.chargeCardType) {
      const updatedPortals = values.swipePortal.map((portal) => {
        const selectedPortal = getAllPortalData.data?.find(
          (portalData) => portalData.portalName === portal.portalName
        );

        if (selectedPortal) {
          let chargeForCardType = 0;

          switch (values.chargeCardType) {
            case "normalCard":
              chargeForCardType = selectedPortal.normalCard;
              break;
            case "businessCard":
              chargeForCardType = selectedPortal.businessCard;
              break;
            case "masterCard":
              chargeForCardType = selectedPortal.masterCard;
              break;
            default:
              chargeForCardType = 0;
          }

          let calculatedCardCharge = 0;
          if (portal.amount && chargeForCardType) {
            calculatedCardCharge =
              (parseFloat(portal.amount) * parseFloat(chargeForCardType)) / 100;
          }
          return {
            ...portal,
            cardChargeInPer: chargeForCardType,
            cardChargeInRupees: calculatedCardCharge,
          };
        }
        return portal;
      });

      if (
        JSON.stringify(values.swipePortal) !== JSON.stringify(updatedPortals)
      ) {
        setValues((prevValues) => ({
          ...prevValues,
          swipePortal: updatedPortals,
        }));
      }
    }
  }, [values.swipePortal, values.chargeCardType, setValues, getAllPortalData]);

  useEffect(() => {
    if (values.swipeAmount === "" || values.chargeInPer === "") {
      setFieldValue("chargeInRupees", "");
    } else if (values.swipeAmount && values.chargeInPer) {
      const calculatedCharge =
        (parseFloat(values.swipeAmount) * parseFloat(values.chargeInPer)) / 100;
      setFieldValue("chargeInRupees", calculatedCharge);
    }
  }, [values.swipeAmount, values.chargeInPer, setFieldValue]);
  // useEffect(() => {
  //   if (values.swipePortal.length === 0) {
  //     setFieldValue("swipePortal", []);
  //   } else {
  //     const updatedSwipePortal = values.swipePortal.map((portal) => {
  //       const amount = parseFloat(portal.amount) || 0;
  //       const cardChargeInRupees = parseFloat(portal.cardChargeInRupees) || 0;
  //       const netSwipeAmount = amount - cardChargeInRupees;
        
  //       // Update the portal object with the calculated netSwipeAmount
  //       return { ...portal, netSwipeAmount };
  //     });
      
  //     setFieldValue("swipePortal", updatedSwipePortal);
  //   }
  // }, [values.swipePortal, setFieldValue]);
  

  // useEffect(() => {
  //   if (values.swipeAmount === "" || values.cardChargeInRupees === "") {
  //     setFieldValue("netSwipeAmount", "");
  //   } else if (values.swipeAmount || values.cardChargeInRupees) {
  //     const netSwipeAmount =
  //       parseFloat(values.swipeAmount) - parseFloat(values.cardChargeInRupees);
  //     setFieldValue("netSwipeAmount", netSwipeAmount);
  //   }
  // }, [values.swipeAmount, values.cardChargeInRupees, setFieldValue]);
  // useEffect(() => {
  //   if (values.swipePortal.length === 0) {
  //     setFieldValue("swipePortal", []);
  //   } else {
  //     const updatedSwipePortal = values.swipePortal.map((portal) => {
  //       const amount = parseFloat(portal.amount) || 0;
  //       const cardChargeInRupees = parseFloat(portal.cardChargeInRupees) || 0;
  //       const netSwipeAmount = amount - cardChargeInRupees;
        
  //       return { ...portal, netSwipeAmount };
  //     });
      
  //     setFieldValue("swipePortal", updatedSwipePortal);
  //   }
  // }, [values.swipePortal, setFieldValue]);
  
  useEffect(() => {
    const chargeInRupees = parseFloat(values.chargeInRupees) || 0;
    const extraCharge = parseFloat(values.extraCharge) || 0;
    const totalCardChargeInRupees = values.swipePortal.reduce((sum, portal) => {
      return sum + (parseFloat(portal.cardChargeInRupees) || 0);
    }, 0);

    const profit = chargeInRupees - extraCharge - totalCardChargeInRupees;
    setFieldValue("profit", profit);
  }, [
    values.chargeInRupees,
    values.extraCharge,
    values.swipePortal,
    setFieldValue,
  ]);
  const officeNameOptions = getAllOfficesData?.map((item) => ({
    value: item.officeName,
    label: item.officeName,
  }));
  const paymentPortalOptions = getAllPortalData.data?.map((item) => ({
    value: item.portalName,
    label: item.portalName,
  }));
  const swipePortalOptions = getAllPortalData?.data?.map((item) => ({
    value: item.portalName,
    label: item.portalName,
  }));
  const chargeOptions = [
    { value: "charge-swipe", label: "Charge Swipe" },
    ...getAllAccountData?.map((item) => ({
      value: item.accountName,
      label: item.accountName,
    })),
  ];
  const chargeCardTypeOptions = [
    { value: "normalCard", label: "Normal Card" },
    { value: "businessCard", label: "Business Card" },
    { value: "masterCard", label: "Master Card" },
  ];
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "success", label: "Success" },
    { value: "failed", label: "Failed" },
  ];
  useEffect(() => {
    if (customerId) {
      const fetchSingleCustomer = async () => {
        try {
          await dispatch(getSingleReport(customerId));
        } catch (error) {}
      };
      fetchSingleCustomer();
    }
  }, [dispatch, customerId]);
  const formatCardNumber = (value) => {
    const cleanedValue = value?.replace(/\D/g, "");
    const formattedValue = cleanedValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formattedValue;
  };
  const handleAccountChange = (selectedOptions) => {
    const newChargeType = selectedOptions
      ? selectedOptions.map((option) => {
          const existingAccount = values.chargeType.find(
            (item) => item.accName === option.value
          );
          return existingAccount
            ? existingAccount
            : { accName: option.value, amount: "" };
        })
      : [];
    setValues({
      ...values,
      chargeType: newChargeType,
    });
  };
  const handleInputChange = (account, value) => {
    const updatedChargeType = values.chargeType.map((item) =>
      item.accName === account ? { ...item, amount: value } : item
    );
    setValues({
      ...values,
      chargeType: updatedChargeType,
    });
  };
  const handlePortalChange = (selectedOptions, portalType) => {
    const newPortalData = selectedOptions
      ? selectedOptions.map((option) => {
          const existingPortal = values[portalType].find(
            (item) => item.portalName === option.value
          );

          if (existingPortal) return existingPortal;

          // Structure data differently based on portalType
          return portalType === "paymentPortal"
            ? { portalName: option.value, amount: "" }
            : {
                portalName: option.value,
                amount: "",
                cardChargeInRupees: "",
                cardChargeInPer: "",
              };
        })
      : [];
    setValues({
      ...values,
      [portalType]: newPortalData,
    });
  };
  const handlePortalInputChange = (portalName, value, portalType, field) => {
    const updatedPortals = values[portalType].map((item) =>
      item.portalName === portalName ? { ...item, [field]: value } : item
    );
    const totalPaymentAmount =
      portalType === "paymentPortal"
        ? updatedPortals.reduce(
            (sum, portal) => sum + (parseFloat(portal.amount) || 0),
            0
          )
        : values.paymentPortal.reduce(
            (sum, portal) => sum + (parseFloat(portal.amount) || 0),
            0
          );
    const totalSwipeAmount =
      portalType === "swipePortal"
        ? updatedPortals.reduce(
            (sum, portal) => sum + (parseFloat(portal.amount) || 0),
            0
          )
        : values.swipePortal.reduce(
            (sum, portal) => sum + (parseFloat(portal.amount) || 0),
            0
          );
    setValues({
      ...values,
      [portalType]: updatedPortals,
      billAmount: totalPaymentAmount,
      swipeAmount: totalSwipeAmount,
    });
  };

  return (
    <div>
      <section className="bg-white rounded-lg border-2 border-slate-300 font-sans duration-300 ease-in-out md:m-4 m-2">
        <div className="p-4 space-y-4 lg:px-6">
          <p className="md:text-2xl text-2xl tracking-tight font-semibold text-gray-900 capitalize">
            {action} Customer
          </p>
          <hr />
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 overflow-none">
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
              <div className="">
                <label className="capitalize text-base font-medium text-gray-700">
                  Account
                </label>
                <Select
                  name="chargeType"
                  options={chargeOptions}
                  value={chargeOptions?.filter((option) =>
                    values?.chargeType
                      ?.map((item) => item.accName)
                      .includes(option.value)
                  )}
                  onChange={handleAccountChange}
                  isMulti
                  placeholder="Select Charge Type"
                  className="w-full text-base mt-1 rounded-md focus:border-[#EB8844]"
                  classNamePrefix="custom-select"
                />

                {values.chargeType.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {values.chargeType.map((account, index) => {
                      if (
                        account &&
                        account.accName &&
                        account.accName !== "charge-swipe"
                      ) {
                        return (
                          <div key={index}>
                            <div className="flex flex-col items-center">
                              <span className="mr-2 font-semibold">
                                {account.accName}:
                              </span>
                              <input
                                type="number"
                                name={account.accName}
                                value={account.amount || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    account.accName,
                                    e.target.value
                                  )
                                }
                                placeholder={`Enter ${account.accName}`}
                                className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400 focus:outline-none focus:border-[#EB8844]"
                                onWheel={(e) => e.target.blur()}
                                onKeyDown={(e) =>
                                  ["ArrowUp", "ArrowDown"].includes(e.key) &&
                                  e.preventDefault()
                                }
                              />
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
              <div>
                <label className="capitalize text-base font-medium text-gray-700">
                  Card Type
                </label>
                <Select
                  name="chargeCardType"
                  className="w-full text-base mt-1 h-[40px] rounded-md focus:border-[#EB8844]"
                  value={chargeCardTypeOptions?.find(
                    (option) => option.value === values?.chargeCardType
                  )}
                  onChange={(e) =>
                    setFieldValue("chargeCardType", e ? e.value : "")
                  }
                  options={chargeCardTypeOptions}
                  classNamePrefix="custom-select"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 grid-cols-1 gap-5 mt-4">
              <div>
                <label className="capitalize text-base font-medium text-gray-700">
                  Charge %
                </label>
                <input
                  className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400 focus:outline-none focus:border-[#EB8844]"
                  type="number"
                  placeholder="Enter Charge %"
                  name="chargeInPer"
                  value={values.chargeInPer}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) =>
                    ["ArrowUp", "ArrowDown"].includes(e.key) &&
                    e.preventDefault()
                  }
                />
                {touched.chargeInPer && errors.chargeInPer && (
                  <div className="text-red-500 text-sm">
                    {errors.chargeInPer}
                  </div>
                )}
              </div>
              <div>
                <label className="capitalize text-base font-medium text-gray-700">
                  Charge ₹
                </label>
                <input
                  className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400 focus:outline-none focus:border-[#EB8844]"
                  type="number"
                  placeholder="Enter Charge ₹"
                  name="chargeInRupees"
                  value={values.chargeInRupees}
                  readOnly
                  onBlur={handleBlur}
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) =>
                    ["ArrowUp", "ArrowDown"].includes(e.key) &&
                    e.preventDefault()
                  }
                />
              </div>
              <div>
                <label className="capitalize text-base font-medium text-gray-700">
                  Extra Charge
                </label>
                <input
                  className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400 focus:outline-none focus:border-[#EB8844]"
                  type="number"
                  placeholder="Enter Extra Charge"
                  name="extraCharge"
                  value={values.extraCharge}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) =>
                    ["ArrowUp", "ArrowDown"].includes(e.key) &&
                    e.preventDefault()
                  }
                />
                {touched.extraCharge && errors.extraCharge && (
                  <div className="text-red-500 text-sm">
                    {errors.extraCharge}
                  </div>
                )}
              </div>
              {values.swipePortal.length > 0 && (
                <div className="col-span-2">
                  <div className="">
                    {values.swipePortal.map((portal, index) => (
                      <div className="grid grid-cols-2 gap-3">
                        <div key={index} className="flex flex-col">
                          <label className="capitalize text-base font-medium text-gray-700">
                            {portal.portalName} - C.C (%)
                          </label>
                          <input
                            type="number"
                            placeholder={`Enter ${portal.portalName} %`}
                            value={portal.cardChargeInPer}
                            onChange={(e) =>
                              handlePortalInputChange(
                                portal.portalName,
                                e.target.value,
                                "swipePortal",
                                "cardChargeInPer"
                              )
                            }
                            className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400"
                          />
                        </div>
                        <div>
                          <label className="capitalize text-base font-medium text-gray-700 mt-2">
                            {portal.portalName} - C.C (₹)
                          </label>
                          <input
                            type="number"
                            placeholder={`Enter ${portal.portalName} ₹`}
                            value={portal.cardChargeInRupees}
                            onChange={(e) =>
                              handlePortalInputChange(
                                portal.portalName,
                                e.target.value,
                                "swipePortal",
                                "cardChargeInRupees"
                              )
                            }
                            className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="md:flex justify-center mt-2 w-full">
              <div className="md:flex gap-3">
                <div className="md:max-w-[400px] w-full">
                  <label className="capitalize text-base font-medium text-gray-700">
                    Profit
                  </label>
                  <input
                    className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400 focus:outline-none focus:border-[#EB8844]"
                    type="number"
                    placeholder="Enter Profit"
                    name="profit"
                    value={
                      values.profit?.toString().includes(".")
                        ? Number(values.profit).toFixed(2)
                        : values.profit
                    }
                    readOnly
                    onBlur={handleBlur}
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) =>
                      ["ArrowUp", "ArrowDown"].includes(e.key) &&
                      e.preventDefault()
                    }
                  />
                </div>
                <div className="w-full md:max-w-[400px]">
                  <label className="capitalize text-base font-medium text-gray-700">
                    Status
                  </label>
                  <Select
                    name="status"
                    className="w-full text-base mt-1 h-[40px]  rounded-md focus:border-[#EB8844]"
                    value={statusOptions?.find(
                      (option) => option.value === values?.status
                    )}
                    onChange={(e) => setFieldValue("status", e ? e.value : "")}
                    options={statusOptions}
                    classNamePrefix="custom-select"
                  />
                  {touched.status && errors.status && (
                    <div className="text-red-500 text-sm">{errors.status}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center mt-7 gap-5">
              <button
                type="button"
                className="w-[300px] h-[50px] flex justify-center items-center border border-[#EB8844] rounded-md text-[#EB8844]"
                onClick={() => navigate("/report")}
              >
                <p className="font-semibold">Cancel</p>
              </button>
              <button
                type="submit"
                className="w-[300px] h-[50px] flex justify-center font-bold items-center text-white bg-[#EB8844] rounded-md hover:bg-[#EB8844]"
              >
                {loading ? <div className="loader"></div> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CustomerForm;














// import React, { useEffect, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addReport,
//   editReport,
//   getSingleReport,
// } from "../../redux/services/reportSlice";
// import { getOffices } from "../../redux/services/officeSlice";
// import { getPortals } from "../../redux/services/portalSlice";
// import { getAccounts } from "../../redux/services/accountSlice";
// import { getBetweenAmount } from "../../redux/services/betweenAmountSlice";
// import CustomerFormFields from "./CustomerFormFields";
// import useCustomerFormLogic from "./useCustomerFormLogic";

// const CustomerForm = ({ action }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const customerId = queryParams.get("customerId");

//   const { initialValues, validationSchema, onSubmit } = useCustomerFormLogic({
//     customerId,
//     dispatch,
//     navigate,
//   });

//   const {
//     values,
//     errors,
//     touched,
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     setFieldValue,
//     setValues,
//     resetForm,
//   } = useFormik({
//     initialValues,
//     validationSchema,
//     onSubmit,
//   });

//   useEffect(() => {
//     dispatch(getAccounts());
//     dispatch(getOffices());
//     dispatch(getPortals());
//   }, [dispatch]);

//   useEffect(() => {
//     if (customerId) {
//       const fetchSingleCustomer = async () => {
//         try {
//           await dispatch(getSingleReport(customerId));
//         } catch (error) {}
//       };
//       fetchSingleCustomer();
//     }
//   }, [dispatch, customerId]);

//   return (
//     <div>
//       <section className="bg-white rounded-lg border-2 border-slate-300 font-sans duration-300 ease-in-out md:m-4 m-2">
//         <div className="p-4 space-y-4 lg:px-6">
//           <p className="md:text-2xl text-2xl tracking-tight font-semibold text-gray-900 capitalize">
//             {action} Customer
//           </p>
//           <hr />
//           <CustomerFormFields
//             values={values}
//             errors={errors}
//             touched={touched}
//             handleChange={handleChange}
//             handleBlur={handleBlur}
//             handleSubmit={handleSubmit}
//             setFieldValue={setFieldValue}
//             setValues={setValues}
//             resetForm={resetForm}
//           />
//         </div>
//       </section>
//     </div>
//   );
// };

// export default CustomerForm;