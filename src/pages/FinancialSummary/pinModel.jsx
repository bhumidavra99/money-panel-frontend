import React from "react";
import { TfiClose } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";

const PinModal = ({ pin, setPin, handleSubmit,loading }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div
          className="absolute inset-0 bg-transparent z-40"
          onClick={() => navigate("/dashboard")}
        />
        <div className="modal-content bg-white rounded-lg p-6 w-full mx-4 max-w-md md:max-h-[90vh] max-h-[80vh] overflow-y-auto custom-scrollbar relative z-50">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-0">Enter PIN</h2>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-500 hover:text-gray-800"
            >
              <TfiClose />
            </button>
          </div>

          <div className="mt-4">
            <div className="mb-4">
              <input
                type="password"
                className="w-full p-3 text-center text-2xl font-bold focus:outline-none border-2 border-gray-300 rounded"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              />
            </div>
            <div>
            {loading ?
            <button
            className="w-full flex justify-center py-3 bg-[#EB8844] text-white rounded-lg"
          >
            <div className="loader"></div> 
          </button>
           : 
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-[#EB8844] text-white rounded-lg"
              >
                Verify PIN
              </button>
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
