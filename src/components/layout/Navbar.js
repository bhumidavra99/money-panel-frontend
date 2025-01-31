import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBars } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import LogoutConfimation from "../../common/LogoutConfimation";
import ChangeAmount from "../../common/ChangeAmount";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/services/authSlice";
import {
  editBetweenAmount,
  getBetweenAmount,
} from "../../redux/services/betweenAmountSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

const Navbar = ({ toggleSidebar }) => {
  const getAmountData = useSelector((state) => state.betweenAmount.amountData);
  const getUser = JSON.parse(localStorage.getItem("user")); 
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [modelopen, setModelOpen] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const handleToggle = () => setConfirm((prevState) => !prevState);
  const menuRef = useRef();
  const handleLogout = () => {
    setTimeout(() => {
      navigate("/");
      setConfirm(!confirm);
      dispatch(logOut());
    }, 1000);
  };

  const confirmLogout = () => {
    handleLogout();
    toast.success("Logout successfully", {
      autoClose: 2000,
      pauseOnHover: false,
    });
  };
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        dropdownOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", checkIfClickedOutside);
    return () => {
      document.removeEventListener("click", checkIfClickedOutside);
    };
  }, [dropdownOpen]);
  const onSubmit = async () => {
    try {
      const response = await dispatch(editBetweenAmount(values));
      if (response.payload.status === 200) {
        setModelOpen(false);
        dispatch(getBetweenAmount());
        resetForm()
      }
    } catch (error) {}
  };
  useEffect(() => {
    dispatch(getBetweenAmount());
  }, [dispatch]);
  const initialValues = {
    amount: undefined,
  };
  const validationSchema = Yup.object({
    amount: Yup.number().required("Amount is required"),
  });
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  useEffect(() => {
    if (getAmountData) {
      setValues({
        amount: getAmountData?.amount,
      });
    }
  }, [getAmountData, setValues]);

  return (
    <>
      <header className="sticky top-0 z-50 h-[80px] flex items-center justify-between bg-white border-b px-4">
        <div className="flex gap-3">
          <button
            className="lg:hidden text-gray-600 text-2xl"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>
        </div>
        <div className="flex justify-end">
          <div className="w-[200px] text-white bg-[#eb8844] flex justify-center items-center text-lg font-bold">
            ₹ {getAmountData?.amount}
          </div>
          <div className="items-center gap-x-3 flex px-4">
            <div className="relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen((prevState) => !prevState);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="h-12 w-12 rounded-full flex justify-center items-center">
                  <img
                    src="https://s3-alpha-sig.figma.com/img/bf65/1592/ebc94499279c5c921aece1dff7654551?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=XA6vRM-76onImFd-mJumJbheNv1O0Gr~sNOC4tQMYPNxcW5kTb9n9rnEqKU3k3aZWlsmH8wJmszmjUhKOSMJt~ltBhgXZ-JJsiXZQBlJPGC~~azARNqSS6kek3IQfCpZ9IYF9JpnubMSPcGIHnVwPbN5gQ40uLmr2r~jXuQzd~N1ScYl166nl1aJQwKAgA2~7HaDcthEBaonYup2-kYQ0ys2kk1eLhxAKYe5vKp2eEwxcFEIkSK9Vmc8t7MPjRI-zOvtVfABrtAz7fermmemFBf1JQGIRZ9GiLASsQbEamcDJD0qSMznDVBH6tzWxUKbS-VDQtTvqxRJBSfhyskcgA__"
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                </span>
                <div className="hidden sm:block text-left cursor-pointer ">
                  <span className="block text-sm font-medium text-black">
                    {getUser?.firstName + " " + getUser?.lastName || "Welcome user"}
                    {/* Om Dhameliya */}
                  </span>
                  <span className="block text-xs">
                    {/* {user.name} */}
                    Super Admin
                  </span>
                </div>
                <IoIosArrowDown />
              </div>
              {dropdownOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 sm:right-0 top-14 w-56 rounded-md bg-white p-2 shadow-lg"
                >
                  <ul className="font-semibold space-y-2 mb-0">
                    <li onClick={toggleDropdown}>
                      <p onClick={() => setModelOpen(true)}>
                        <button
                          type="button"
                          className={`py-2 px-4 w-full hover:text-black hover:bg-[#fde5c1] rounded-md`}
                          onClick={() => setModelOpen(true)}
                        >
                          Change Amount
                        </button>
                      </p>
                    </li>
                    <li onClick={toggleDropdown}>
                      <NavLink to="/change-password">
                        <button
                          type="button"
                          className={`${
                            pathname === "/change-password"
                              ? "text-white bg-[#eb8844]"
                              : "text-black"
                          } py-2 px-4 w-full hover:text-black hover:bg-[#fde5c1] rounded-md`}
                        >
                          Change Password
                        </button>
                      </NavLink>
                    </li>
                    <li onClick={handleToggle}>
                      <button
                        type="button"
                        className="py-2 px-4 w-full hover:bg-[#fde5c1] rounded-md"
                      >
                        Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {modelopen && (
        <ChangeAmount
          onClose={() => setModelOpen(false)}
          values={values}
          handleChange={handleChange}
          handleBlur={handleBlur}
          errors={errors}
          touched={touched}
          handleSubmit={handleSubmit}
        />
      )}
      {confirm && (
        <LogoutConfimation
          confirm={confirm}
          onLogout={confirmLogout}
          onCancel={() => setConfirm(!confirm)}
        />
      )}
    </>
  );
};

export default Navbar;
