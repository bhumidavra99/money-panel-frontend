import React from "react";
import { TfiClose } from "react-icons/tfi";

const OfficeForm = ({
  onClose,
  values,
  handleChange,
  handleBlur,
  editId,
  errors,
  touched,
  handleSubmit,
  loading,
}) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div
          className="absolute inset-0 bg-transparent z-40"
          onClick={onClose}
        />
        <div className="modal-content bg-white rounded-lg p-6 w-full mx-4 max-w-2xl md:max-h-[90vh] max-h-[80vh] overflow-y-auto custom-scrollbar relative z-50">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-0">{`${
              editId ? "Edit" : "Add"
            } Office`}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              <TfiClose />
            </button>
          </div>
          <hr className="my-3" />

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-4">
              <div>
                <label className="capitalize text-base font-medium text-gray-700">
                  Office Name
                </label>
                <input
                  className="w-full text-base p-2 rounded-md border border-gray-400 focus:outline-none focus:border-indigo-500"
                  type="text"
                  placeholder="Enter Office Name"
                  name="officeName"
                  value={values.officeName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.officeName && errors.officeName && (
                  <div className="text-red-500 text-sm">
                    {errors.officeName}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center mt-5 gap-5">
              <button
                type="button"
                className="w-[150px] h-[50px] flex justify-center items-center border border-[#EB8844] rounded-md text-[#EB8844]"
                onClick={onClose}
              >
                <p className="font-semibold">Cancel</p>
              </button>
              <button
                type="submit"
                className="w-[150px] h-[50px] font-bold flex justify-center items-center text-white bg-[#EB8844] rounded-md hover:bg-[#EB8844]"
              >
                {loading ? <div className="loader"></div> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfficeForm;
