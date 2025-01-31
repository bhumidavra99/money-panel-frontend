import React, { useState } from "react";
import { TfiClose } from "react-icons/tfi";

const SwipeModel = ({ onClose }) => {
  const [swipeAmount, setSwipeAmount] = useState();
  const [rate, setRate] = useState();

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div
          className="absolute inset-0 bg-transparent z-40"
          onClick={onClose}
        />
        <div className="modal-content bg-white rounded-lg p-6 w-full mx-4 max-w-2xl md:max-h-[90vh] max-h-[80vh] overflow-y-auto custom-scrollbar relative z-50">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-0">Swipe Rate</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              <TfiClose />
            </button>
          </div>

          <div className="flex justify-center mt-4">
            <table className="border-collapse border-2 border-black text-center w-full">
              <thead>
                <tr>
                  <th colSpan="2" className="border-2 border-black p-2 text-lg">
                    Swipe
                  </th>
                  <th className="border-2 border-black p-2 text-lg">Rate</th>
                  <th className="border-2 border-black whitespace-nowrap p-2 text-lg">
                    Rate (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="2" className="border-2 border-black p-2">
                    <input
                      type="number"
                      className="w-full text-center text-2xl font-bold focus:outline-none"
                      placeholder="Swipe Amount"
                      value={swipeAmount}
                      onChange={(e) => setSwipeAmount(e.target.value)}
                    />
                  </td>
                  <td className="border-2 border-black p-2">
                    <input
                      type="number"
                      className="w-full text-center text-2xl font-bold text-red-500 focus:outline-none"
                      placeholder="Rate"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                  </td>

                  <td className="border-2 border-black p-2 text-lg">
                    {swipeAmount && rate
                      ? ((swipeAmount * rate) / 100).toFixed(2)
                      : 0}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="border-2 border-black p-2 text-lg">
                    {swipeAmount && rate
                      ? swipeAmount - (swipeAmount * rate) / 100
                      : 0}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="border-2 border-black p-2 text-lg">
                    {swipeAmount && rate
                      ? (swipeAmount / (1 - rate / 100)).toFixed(2)
                      : 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeModel;
