import React from "react";
import { TfiClose } from "react-icons/tfi";
import moment from "moment";

const ViewModel = ({ itemToView, onClose }) => {
  if (!itemToView) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-transparent z-40" onClick={onClose} />
      <div className="modal-content bg-white rounded-lg p-6 w-full mx-4 max-w-2xl md:max-h-[90vh] max-h-[80vh] overflow-y-auto custom-scrollbar relative z-50">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-0">{`${itemToView.cusName}'s Debit/Credit Record`}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <TfiClose />
          </button>
        </div>
        <hr className="my-3" />

        <div className="mb-4">
          {/* <p className="text-lg font-semibold">
            Transaction Type: 
            <span className={`ml-2 ${itemToView.transactionType === "debit" ? "text-red-500" : "text-green-500"}`}>
              {itemToView.transactionType.toUpperCase()}
            </span>
          </p> */}
          <p className="text-lg font-semibold">
            Remaining Amount: <span className="text-gray-700">₹{itemToView.amount}</span>
          </p>
        </div>

        {itemToView.debitRecords && itemToView.debitRecords.length > 0 && (
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-red-600">Debit Records</h3>
            <ul className="list-disc pl-5 mt-2">
              {itemToView.debitRecords.map((debit) => (
                <li key={debit._id} className="text-gray-700 mt-1">
                  <span className="font-medium">Date:</span> {moment(debit.createdAt).format("DD/MM/YYYY")} | 
                  <span className="font-medium"> Amount:</span> ₹{debit.amount}
                </li>
              ))}
            </ul>
          </div>
        )}
<hr/>
        {itemToView.creditRecords && itemToView.creditRecords.length > 0 && (
          <div className="my-3">
            <h3 className="text-lg font-semibold text-green-600">Credit Records</h3>
            <ul className="list-disc pl-5 mt-2">
              {itemToView.creditRecords.map((credit) => (
                <li key={credit._id} className="text-gray-700 mt-1">
                  <span className="font-medium">Date:</span> {moment(credit.createdAt).format("DD/MM/YYYY")} | 
                  <span className="font-medium"> Amount:</span> ₹{credit.amount}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewModel;
