import React, { useEffect, useState } from "react";
import Withdrawal from "../Withdrawal";
import Salaries from "../Salary";
import { useDispatch, useSelector } from "react-redux";
import { getTotalBalance } from "../../redux/services/balanceSlice";
import PinModal from "./pinModel";
import { verifyPin } from "../../redux/services/pinCheckSlice";
import { toast } from "react-toastify";

const FinancialSummary = () => {
  const getBalanceData = useSelector((state) => state.balance.balanceData);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const [pin, setPin] = useState("");
  const handleSubmit = async () => {
    let payload = {
      pin: pin,
    };
    try {
      const response = await dispatch(verifyPin(payload));
      if(response?.payload?.status === 200){
        toast.success(response?.payload?.message, {
                 autoClose: 2000,
                 pauseOnHover: false,
               });
        setCanAccess(true);
        setIsModalOpen(false);
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (canAccess) {
      dispatch(getTotalBalance());
    }
  }, [dispatch, canAccess]);
  return (
    <>
      {isModalOpen && (
        <PinModal
          onClose={() => setIsModalOpen(false)}
        //   error={error}
          handleSubmit={handleSubmit}
          setPin={setPin}
          pin={pin}
        />
      )}
      {canAccess && (
        <div>
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-md p-4 max-w-sm w-full">
              <div className="space-y-3 text-[18px] font-medium">
                <li className="flex justify-between items-center">
                  <h2 className="ml-2 font-bold text-[22px]">Profit</h2>
                  <span>{getBalanceData?.totalBalance}</span>
                </li>
              </div>
            </div>
          </div>
          <div className="my-6">
            <Salaries />
          </div>
          <Withdrawal />
        </div>
      )}
    </>
  );
};

export default FinancialSummary;
