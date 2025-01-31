import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { VscEyeClosed } from "react-icons/vsc";
import { RxEyeOpen } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/services/authSlice";

const Login = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [getLoading, setGetLoading] = useState(false);
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email().required("Please Enter Your Email"),
    password: Yup.string().required("Please Enter Your Password"),
  });
  const onSubmit = async (values) => {
    setGetLoading(true);
    try {
      let response = await dispatch(login(values));
      if (response?.payload?.status === 200) {
        navigate("/dashboard");
        resetForm();
      }
    } catch (err) {
    } finally {
      setGetLoading(false);
    }
  };
  const { handleChange, errors, touched,resetForm, handleSubmit, handleBlur, values } =
    useFormik({
      enableReinitialize: true,
      initialValues,
      validationSchema,
      onSubmit,
    });

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-[#EB8844]">
        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-lg mx-3">
          <h2 className="text-xl font-bold text-[#405189] text-center mb-1">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-500 mb-4">Sign In</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="text"
                name="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                errors={errors}
                touched={touched}
                placeholder="Enter Your Email Address"
                autoComplete="off"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.email && touched.email && (
                <p className="mt-1 px-2 text-red-600 text-sm">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="mb-1">
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  name="password"
                  onBlur={handleBlur}
                  value={values.password}
                  onChange={handleChange}
                  errors={errors}
                  touched={touched}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-blue-600 rounded-e-md focus:outline-none"
                >
                  {show ? (
                    <VscEyeClosed title="Show Password" color="#878a99" />
                  ) : (
                    <RxEyeOpen title="Hide Password" color="#878a99" />
                  )}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="mt-1 px-2 text-red-600  text-sm">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#0ab39c] mt-7 text-white py-2 rounded-md hover:bg-[#099885] transition flex justify-center"
            >
            {getLoading ? <div className="loader"></div> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
