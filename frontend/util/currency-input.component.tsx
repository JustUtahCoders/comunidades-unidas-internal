import React, { useState } from "react";

export default function CurrencyInput(props: CurrencyInputProps) {
  const [unmaskedValue, setUnmaskedValue] = useState("");
  return (
    <input
      type="text"
      value={unmaskedValue}
      pattern="^\d+"
      onChange={handleChange}
      required={props.required}
      placeholder={props.placeholder}
    />
  );

  function handleChange(evt) {
    setUnmaskedValue(evt.target.value);
    if (evt.target.validity.valid) {
      props.setDollars(Number(evt.target.value.replace(/[\$\w\,]/g, "")));
    }
  }
}

CurrencyInput.defaultProps = {
  required: true,
  placeholder: "40000"
};

type CurrencyInputProps = {
  setDollars(dollars: number): void;
  required?: boolean;
  placeholder?: string;
};
