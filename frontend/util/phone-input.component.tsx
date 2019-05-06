import React, { useState } from "react";

export default function PhoneInput(props: PhoneInputProps) {
  const [unmaskedPhone, setUnmaskedPhone] = useState(props.phone);

  return (
    <input
      placeholder="801-111-1111"
      type="tel"
      value={unmaskedPhone}
      onChange={handleChange}
      pattern="\(?[0-9]{3}\)?[ ]?-?[0-9]{3}-?[0-9]{4}"
      required
      autoFocus={props.autoFocus}
      autoComplete="off"
    />
  );

  function handleChange(evt) {
    setUnmaskedPhone(evt.target.value);
    if (evt.target.validity.valid) {
      props.setPhone(evt.target.value.replace(/[\-\(\) ]/g, ""));
    }
  }
}

type PhoneInputProps = {
  phone: string;
  setPhone(phone: string): void;
  autoFocus?: boolean;
};
