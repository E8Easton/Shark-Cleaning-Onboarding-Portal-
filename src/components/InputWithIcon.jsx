import React from "react";

/** Icon + text field with spacing so placeholder never overlaps the icon */
export default function InputWithIcon({
  icon: Icon,
  id,
  className = "",
  inputClassName = "",
  large = false,
  ...inputProps
}) {
  return (
    <div className={`input-icon-field ${large ? "input-icon-field--lg" : ""} ${className}`}>
      {Icon && <Icon className="input-icon-field__icon" aria-hidden />}
      <input id={id} className={`form-input input-icon-field__input ${inputClassName}`} {...inputProps} />
    </div>
  );
}
