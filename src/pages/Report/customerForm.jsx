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
    paymentPortal: undefined,
    swipePortal: undefined,
    chargeType: [
      {
        accName: undefined,
        amount: undefined,
      },
    ],
    chargeCardType: undefined,
    chargeInPer: undefined,
    chargeInRupees: undefined,
    extraCharge: undefined,
    cardChargeInPer: undefined,
    cardChargeInRupees: undefined,
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
    chargeInPer: Yup.number()
      .max(100, "Charge cannot exceed 100%")
      .nullable(),
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
    if (values.swipePortal && values.chargeCardType) {
      const selectedAccount = getAllPortalData.data?.find(
        (account) => account.portalName === values.swipePortal
      );
      if (selectedAccount) {
        const chargeForCardType =
          values.chargeCardType === "normalCard"
            ? selectedAccount.normalCard
            : values.chargeCardType === "businessCard"
            ? selectedAccount.businessCard
            : values.chargeCardType === "masterCard"
            ? selectedAccount.masterCard
            : 0;
        setFieldValue("cardChargeInPer", chargeForCardType);
      }
    }
  }, [
    values.swipePortal,
    values.chargeCardType,
    getAllPortalData,
    setFieldValue,
  ]);
  useEffect(() => {
    if (values.swipeAmount === "" || values.chargeInPer === "") {
      setFieldValue("chargeInRupees", "");
    } else if (values.swipeAmount && values.chargeInPer) {
      const calculatedCharge =
        (parseFloat(values.swipeAmount) * parseFloat(values.chargeInPer)) / 100;
      setFieldValue("chargeInRupees", calculatedCharge);
    }
  }, [values.swipeAmount, values.chargeInPer, setFieldValue]);
  useEffect(() => {
    if (values.swipeAmount === "" || values.cardChargeInPer === "") {
      setFieldValue("cardChargeInRupees", "");
    } else if (values.swipeAmount && values.cardChargeInPer) {
      const calculatedCharge =
        (parseFloat(values.swipeAmount) * parseFloat(values.cardChargeInPer)) /
        100;
      setFieldValue("cardChargeInRupees", calculatedCharge);
    }
  }, [values.swipeAmount, values.cardChargeInPer, setFieldValue]);

  useEffect(() => {
    if (values.billAmount === "" || values.extraCharge === "") {
      setFieldValue("netBillAmount", "");
    } else if (values.billAmount && values.extraCharge) {
      const netBillAmount =
        parseFloat(values.billAmount) + parseFloat(values.extraCharge);
      setFieldValue("netBillAmount", netBillAmount);
    }
  }, [values.billAmount, values.extraCharge, setFieldValue]);

  useEffect(() => {
    if (values.swipeAmount === "" || values.cardChargeInRupees === "") {
      setFieldValue("netSwipeAmount", "");
    } else if (values.swipeAmount && values.cardChargeInRupees) {
      const netSwipeAmount =
        parseFloat(values.swipeAmount) - parseFloat(values.cardChargeInRupees);
      setFieldValue("netSwipeAmount", netSwipeAmount);
    }
  }, [values.swipeAmount, values.cardChargeInRupees, setFieldValue]);
  useEffect(() => {
    const chargeInRupees = parseFloat(values.chargeInRupees) || 0;
    const extraCharge = parseFloat(values.extraCharge) || 0;
    const cardChargeInRupees = parseFloat(values.cardChargeInRupees) || 0;

    const profit = chargeInRupees - extraCharge - cardChargeInRupees;
    setFieldValue("profit", profit);
  }, [
    values.chargeInRupees,
    values.extraCharge,
    values.cardChargeInRupees,
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
    { value: "", label: "No Account Selected " },
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
    if (getSingleCustomerData && customerId) {
      setValues({
        customerName: getSingleCustomerData?.customerName
          ? getSingleCustomerData?.customerName
          : "",
        officeName: getSingleCustomerData?.officeName
          ? getSingleCustomerData?.officeName
          : "",
        cardNumber: getSingleCustomerData?.cardNumber
          ? getSingleCustomerData?.cardNumber
          : "",
        bankName: getSingleCustomerData?.bankName
          ? getSingleCustomerData?.bankName
          : "",
        billAmount: getSingleCustomerData?.billAmount
          ? getSingleCustomerData?.billAmount
          : "",
        swipeAmount: getSingleCustomerData?.swipeAmount
          ? getSingleCustomerData?.swipeAmount
          : "",
        paymentPortal: getSingleCustomerData?.paymentPortal
          ? getSingleCustomerData?.paymentPortal
          : "",
        swipePortal: getSingleCustomerData?.swipePortal
          ? getSingleCustomerData?.swipePortal
          : "",
        chargeType:
          getSingleCustomerData?.chargeType &&
          Array.isArray(getSingleCustomerData?.chargeType)
            ? getSingleCustomerData?.chargeType.map((item) => ({
                accName: item.accName || "",
                amount: item.amount || 0,
              }))
            : [],
        chargeCardType: getSingleCustomerData?.chargeCardType
          ? getSingleCustomerData?.chargeCardType
          : "",
        chargeInPer: getSingleCustomerData?.chargeInPer
          ? getSingleCustomerData?.chargeInPer
          : "",
        chargeInRupees: getSingleCustomerData?.chargeInRupees
          ? getSingleCustomerData?.chargeInRupees
          : "",
        extraCharge: getSingleCustomerData?.extraCharge
          ? getSingleCustomerData?.extraCharge
          : "",
        cardChargeInPer: getSingleCustomerData?.cardChargeInPer
          ? getSingleCustomerData?.cardChargeInPer
          : "",
        cardChargeInRupees: getSingleCustomerData?.cardChargeInRupees
          ? getSingleCustomerData?.cardChargeInRupees
          : "",
        profit: getSingleCustomerData?.profit
          ? getSingleCustomerData?.profit
          : "",
        status: getSingleCustomerData?.status
          ? getSingleCustomerData?.status
          : "",
      });
    }
  }, [getSingleCustomerData, customerId, setValues]);
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
      ? selectedOptions.map((option) => ({
          accName: option.value,
          amount: "",
        }))
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
                />
                {touched.swipeAmount && errors.swipeAmount && (
                  <div className="text-red-500 text-sm">
                    {errors.swipeAmount}
                  </div>
                )}
              </div>
              <div>
                <label className="capitalize text-base font-medium text-gray-700">
                  Payment Portal
                </label>
                <Select
                  name="paymentPortal"
                  className="w-full text-base mt-1 h-[40px] rounded-md focus:border-[#EB8844]"
                  value={paymentPortalOptions?.find(
                    (option) => option.value === values.paymentPortal
                  )}
                  onChange={(e) =>
                    setFieldValue("paymentPortal", e ? e.value : "")
                  }
                  options={paymentPortalOptions}
                  classNamePrefix="custom-select"
                />
                {touched.paymentPortal && errors.paymentPortal && (
                  <div className="text-red-500 text-sm">
                    {errors.paymentPortal}
                  </div>
                )}
              </div>
              <div>
                <label className="capitalize text-base font-medium text-gray-700">
                  Swipe Portal
                </label>
                <Select
                  name="swipePortal"
                  className="w-full text-base mt-1 h-[40px] rounded-md focus:border-[#EB8844]"
                  value={swipePortalOptions?.find(
                    (option) => option.value === values.swipePortal
                  )}
                  onChange={(e) =>
                    setFieldValue("swipePortal", e ? e.value : "")
                  }
                  options={swipePortalOptions}
                  classNamePrefix="custom-select"
                />
                {touched.swipePortal && errors.swipePortal && (
                  <div className="text-red-500 text-sm">
                    {errors.swipePortal}
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

                <div className="grid grid-cols-2 gap-4 mt-4">
                  {values.chargeType.map((account, index) => {
                    if (account && account.accName) {
                      return (
                        <div key={index}>
                          <div className="flex flex-col items-center">
                            <span className="mr-2 font-semibold">
                              {account.accName}:
                            </span>
                            <input
                              type="text"
                              value={account.amount || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  account.accName,
                                  e.target.value
                                )
                              }
                              placeholder="Enter G Pay"
                              className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400 focus:outline-none focus:border-[#EB8844]"
                            />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
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
              <div>
                <label className="capitalize text-base font-medium text-gray-700">
                  Card Charge %
                </label>
                <input
                  className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400 focus:outline-none focus:border-[#EB8844]"
                  type="number"
                  placeholder="Enter Card Charge"
                  name="cardChargeInPer"
                  readOnly
                  value={values.cardChargeInPer}
                  onBlur={handleBlur}
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) =>
                    ["ArrowUp", "ArrowDown"].includes(e.key) &&
                    e.preventDefault()
                  }
                />
                {touched.cardChargeInPer && errors.cardChargeInPer && (
                  <div className="text-red-500 text-sm">
                    {errors.cardChargeInPer}
                  </div>
                )}
              </div>
              <div>
                <label className="capitalize text-base font-medium text-gray-700">
                  Card Charge ₹
                </label>
                <input
                  className="w-full text-base p-2 mt-1 h-[40px] rounded-md border border-gray-400 focus:outline-none focus:border-[#EB8844]"
                  type="number"
                  placeholder="Enter Card Charge ₹"
                  name="cardChargeInRupees"
                  value={values.cardChargeInRupees}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) =>
                    ["ArrowUp", "ArrowDown"].includes(e.key) &&
                    e.preventDefault()
                  }
                />
                {touched.cardChargeInRupees && errors.cardChargeInRupees && (
                  <div className="text-red-500 text-sm">
                    {errors.cardChargeInRupees}
                  </div>
                )}
              </div>
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
