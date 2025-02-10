export const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "0.375rem",
      borderColor: "#D1D5DB",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#319795",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#319795" : "white",
      color: state.isSelected ? "white" : "#4B5563",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: state.isSelected ? "#319795" : "#c7efed",
        color: state.isSelected ? "white" : "#4B5563",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#4B5563",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#4B5563",
      "&:hover": {
        color: "#319795",
      },
    }),
  };