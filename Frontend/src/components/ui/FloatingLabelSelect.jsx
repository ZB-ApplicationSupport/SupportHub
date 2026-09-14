import React from "react";
import DropdownSelect from "./DropdownSelect";

const FloatingLabelSelect = ({
  label,
  value,
  onChange,
  options = [],
  w,
  ...props
}) => {
  return (
    <DropdownSelect
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      w={w}
      {...props}
    />
  );
};

export default FloatingLabelSelect;
