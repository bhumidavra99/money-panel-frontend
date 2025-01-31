import React, { useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const ChangePasswordPage = () => {
  const [toggle0, setToggle0] = useState(false);
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { user } = useUser();
  // const initialValues = {
  //   userId: user._id,
  //   oldPassword: "",
  //   newPassword: "",
  //   confirmPassword: "",
  // };

  // const passwordRegex =
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  // const validationSchema = Yup.object({
  //   oldPassword: Yup.string().required("Old password is required"),
  //   newPassword: Yup.string()
  //     .matches(
  //       passwordRegex,
  //       "Password must include uppercase, lowercase, number, and special character."
  //     )
  //     .min(8, "Password must be at least 8 characters long")
  //     .required("New password is required"),
  //   confirmPassword: Yup.string()
  //     .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
  //     .required("Confirm password is required"),
  // });

  // const onSubmit = async (values) => {
  //   let payload = {
  //     userId: values.userId,
  //     oldPassword: values?.oldPassword,
  //     newPassword: values?.newPassword,
  //   };
  //   setResetLoading(true);
  //   try {
  //     let response = await dispatch(changePassword(payload));
  //     if (response?.status === 200) {
  //       resetForm();
  //       navigate("/");
  //       toast.success(response.message, {
  //         autoClose: 2000,
  //         pauseOnHover: false,
  //       });
  //     } else {
  //     }
  //   } catch (error) {
  //   } finally {
  //     setResetLoading(false);
  //   }
  // };

  // const {
  //   handleChange,
  //   handleBlur,
  //   values,
  //   errors,
  //   touched,
  //   handleSubmit,
  //   resetForm,
  // } = useFormik({
  //   initialValues,
  //   validationSchema,
  //   onSubmit,
  // });
const handleSubmit=()=>{

}
  return (
    <div className="flex justify-center items-center h-full">
      <section className="space-y-6 max-w-[600px]">
        <div className="md:p-6 p-3 w-full h-fit border border-slate-300 bg-white rounded-xl">
          <div className="w-full px-4 py-2 overflow-hidden text-slate-700 bg-white bg-clip-border">
            <p className="md:text-3xl text-2xl text-center w-full font-semibold text-slate-800">
              Change Password
            </p>
            <p className="md:text-lg text-md text-center font-normal text-slate-600 mt-2">
              Change your password to secure your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-3">
            <div className="px-4">
              <label className="flex text-md font-medium text-gray-700">
                Old Password
              </label>
              <div className="relative w-full mt-1">
                <input
                  className="text-black text-md px-4 py-3 border-2 border-gray-200 w-full h-12 rounded-lg"
                  type={toggle0 ? "text" : "password"}
                  name="oldPassword"
                  // value={values.oldPassword}
                  // onChange={handleChange}
                  // onBlur={handleBlur}
                  placeholder="Enter old password"
                />
                <button
                  type="button"
                  onClick={() => setToggle0(!toggle0)}
                  className="absolute inset-y-0 top-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400"
                >
                  {toggle0 ? (
                    <VscEyeClosed title="Show Password" />
                  ) : (
                    <VscEye title="Hide Password" />
                  )}
                </button>
              </div>
              {/* {errors.oldPassword && touched.oldPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.oldPassword}
                </p>
              )} */}
            </div>

            <div className="px-4 mt-4">
              <label className="flex text-md font-medium text-gray-700">
                New Password
              </label>
              <div className="relative w-full mt-1">
                <input
                  className="text-black text-md px-4 py-3 border-2 border-gray-200 w-full h-12 rounded-lg"
                  type={toggle1 ? "text" : "password"}
                  name="newPassword"
                  // value={values.newPassword}
                  // onChange={handleChange}
                  // onBlur={handleBlur}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setToggle1(!toggle1)}
                  className="absolute inset-y-0 top-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400"
                >
                  {toggle1 ? (
                    <VscEyeClosed title="Show Password" />
                  ) : (
                    <VscEye title="Hide Password" />
                  )}
                </button>
              </div>
              {/* {errors.newPassword && touched.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.newPassword}
                </p>
              )} */}
            </div>

            <div className="px-4 mt-4">
              <label className="flex text-md font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative w-full mt-2">
                <input
                  className="text-black text-md px-4 py-3 border-2 border-gray-200 w-full h-12 rounded-lg"
                  type={toggle2 ? "text" : "password"}
                  name="confirmPassword"
                  // value={values.confirmPassword}
                  // onChange={handleChange}
                  // onBlur={handleBlur}
                  placeholder="Confirm new password"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setToggle2(!toggle2)}
                  className="absolute inset-y-0 top-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400"
                >
                  {toggle2 ? (
                    <VscEyeClosed title="Show Password" />
                  ) : (
                    <VscEye title="Hide Password" />
                  )}
                </button>
              </div>
              {/* {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )} */}
            </div>
            <div className="w-full flex items-end justify-center my-4">
              <button
                type="submit"
                className="flex items-center justify-center text-lg rounded-full w-[250px] h-[50px] text-md text-center text-white bg-[#eb8844] hover:bg-opacity-90"
              >
                {resetLoading ? (
                  <div className="loader"></div>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ChangePasswordPage;
