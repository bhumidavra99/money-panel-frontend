import React, { useEffect, useState } from "react";
import Withdrawal from "../Withdrawal";
import Salaries from "../Salary";
import { useDispatch, useSelector } from "react-redux";
import { getTotalBalance } from "../../redux/services/balanceSlice";
import PinModal from "./pinModel";
import { verifyPin } from "../../redux/services/pinCheckSlice";
import { toast } from "react-toastify";
import Offices from "../offices";

const FinancialSummary = () => {
  const getBalanceData = useSelector((state) => state.balance.balanceData);
  const getAllSalariesData = useSelector((state) => state.salary.salaryData);
  const getAllOfficesData = useSelector((state) => state.office.officeData);
  const withdrawalsData = useSelector(
    (state) => state.withdrawal.withdrawalData
  );
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState("");

  const handleSubmit = async () => {
    let payload = {
      pin: pin,
    };
    setLoading(true);
    try {
      const response = await dispatch(verifyPin(payload));
      if (response?.payload?.status === 200) {
        toast.success(response?.payload?.message, {
          autoClose: 2000,
          pauseOnHover: false,
        });
        setLoading(false);
        setCanAccess(true);
        setIsModalOpen(false);
      }
    } catch (error) {
      setLoading(false);
    }finally{
      setLoading(false);
    }
  };
 
  useEffect(() => {
    const fetchBalance = async () => {
      if (canAccess) {
        await dispatch(getTotalBalance());
      }
    };
  
    fetchBalance();
  }, [dispatch, canAccess]);
  

  return (
    <>
      {isModalOpen && (
        <PinModal
          onClose={() => setIsModalOpen(false)}
          handleSubmit={handleSubmit}
          setPin={setPin}
          pin={pin}
          loading={loading}
        />
      )}
      {canAccess && (
        <div>
          <div className="flex justify-between">
            <div className="bg-white rounded-lg shadow-md p-4 max-w-sm w-full">
              <div className="space-y-3 text-[18px] font-medium">
                <li className="flex justify-between items-center">
                  <h2 className="ml-2 font-bold text-[22px]">Profit</h2>
                  <span>{getBalanceData?.totalBalance}</span>
                </li>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Offices getAllOfficesData={getAllOfficesData} />
          </div>
          <div className="my-8">
            <Salaries getAllSalariesData={getAllSalariesData} />
          </div>
          <Withdrawal withdrawalsData={withdrawalsData} />
        </div>
      )}
    </>
  );
};

export default FinancialSummary;
