import React, { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { editPin } from "../../redux/services/pinCheckSlice";

const EditPin = () => {
  const [toggle0, setToggle0] = useState(false);
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const dispatch = useDispatch();
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate();

  const initialValues = {
    oldPin: "",
    newPin: "",
    confirmPin: "",
  };

  const validationSchema = Yup.object({
    oldPin: Yup.string().required("Old PIN is required"),
    newPin: Yup.string()
      .required("New PIN is required")
      .length(4, "PIN must be 4 digits"),
    confirmPin: Yup.string()
      .required("Confirm PIN is required")
      .oneOf([Yup.ref("newPin"), null], "New PIN and Confirm PIN must match"),
  });

  const onSubmit = async (values) => {
    if (values.newPin !== values.confirmPin) {
      toast.error("New PIN and Confirm PIN must match", {
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }
    let payload = {
      oldPin: values?.oldPin,
      newPin: values?.newPin,
    };
    setResetLoading(true);
    try {
      let response = await dispatch(editPin(payload));
      if(response?.payload?.status === 200){

          toast.success("PIN successfully changed", {
            autoClose: 2000,
            pauseOnHover: false,
          });
          navigate("/dashboard");
      }
    } catch (error) {

    } finally {
      setResetLoading(false);
    }
  };

  const {
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="flex justify-center items-center h-full">
      <section className="space-y-6 max-w-[600px]">
        <div className="md:p-6 p-3 w-full h-fit border border-slate-300 bg-white rounded-xl">
          <div className="w-full px-4 py-2 overflow-hidden text-slate-700 bg-white bg-clip-border">
            <p className="md:text-3xl text-2xl text-center w-full font-semibold text-slate-800">
              Edit PIN
            </p>
            <p className="md:text-lg text-md text-center font-normal text-slate-600 mt-2">
              Change your PIN to secure your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-3">
            <div className="px-4">
              <label className="flex text-md font-medium text-gray-700">
                Old PIN
              </label>
              <div className="relative w-full mt-1">
                <input
                  className="text-black text-md px-4 py-3 border-2 border-gray-200 w-full h-12 rounded-lg"
                  type={toggle0 ? "text" : "password"}
                  name="oldPin"
                  value={values.oldPin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter old PIN"
                  maxLength={4}
                />
                <button
                  type="button"
                  onClick={() => setToggle0(!toggle0)}
                  className="absolute inset-y-0 top-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400"
                >
                  {toggle0 ? (
                    <VscEyeClosed title="Show PIN" />
                  ) : (
                    <VscEye title="Hide PIN" />
                  )}
                </button>
              </div>
              {errors.oldPin && touched.oldPin && (
                <p className="text-red-500 text-xs mt-1">{errors.oldPin}</p>
              )}
            </div>

            <div className="px-4 mt-3">
              <label className="flex text-md font-medium text-gray-700">
                New PIN
              </label>
              <div className="relative w-full mt-1">
                <input
                  className="text-black text-md px-4 py-3 border-2 border-gray-200 w-full h-12 rounded-lg"
                  type={toggle1 ? "text" : "password"}
                  name="newPin"
                  value={values.newPin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter new PIN"
                  maxLength={4}
                />
                <button
                  type="button"
                  onClick={() => setToggle1(!toggle1)}
                  className="absolute inset-y-0 top-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400"
                >
                  {toggle1 ? (
                    <VscEyeClosed title="Show PIN" />
                  ) : (
                    <VscEye title="Hide PIN" />
                  )}
                </button>
              </div>
              {errors.newPin && touched.newPin && (
                <p className="text-red-500 text-xs mt-1">{errors.newPin}</p>
              )}
            </div>

            <div className="px-4 mt-3">
              <label className="flex text-md font-medium text-gray-700">
                Confirm New PIN
              </label>
              <div className="relative w-full mt-2">
                <input
                  className="text-black text-md px-4 py-3 border-2 border-gray-200 w-full h-12 rounded-lg"
                  type={toggle2 ? "text" : "password"}
                  name="confirmPin"
                  value={values.confirmPin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm new PIN"
                  autoComplete="off"
                  maxLength={4}
                />
                <button
                  type="button"
                  onClick={() => setToggle2(!toggle2)}
                  className="absolute inset-y-0 top-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400"
                >
                  {toggle2 ? (
                    <VscEyeClosed title="Show PIN" />
                  ) : (
                    <VscEye title="Hide PIN" />
                  )}
                </button>
              </div>
              {errors.confirmPin && touched.confirmPin && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPin}</p>
              )}
            </div>

            <div className="w-full flex items-end justify-center my-4">
              <button
                type="submit"
                className="flex items-center justify-center text-lg rounded-full w-[250px] h-[50px] text-md text-center text-white bg-[#EB8844] hover:bg-opacity-90"
              >
                {resetLoading ? <div className="loader"></div> : "Change PIN"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditPin;
