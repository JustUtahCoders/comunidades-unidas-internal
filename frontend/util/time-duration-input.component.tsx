import React from "react";

export default function TimeDurationInput(props: TimeDurationInputProps) {
  const [internalValue, setInternalValue] = React.useState(null);
  const inputRef = React.useRef(null);

  const labelId = `time-duration-${props.index || 0}`;

  return (
    <>
      <label id={labelId}>{props.label || "Duration: "}</label>
      <input
        type="text"
        required={props.required}
        value={internalValue}
        onChange={handleChange}
        placeholder="1h 30m"
        aria-labelledby={labelId}
        ref={inputRef}
      />
    </>
  );

  function handleChange() {}
}

type TimeDurationInputProps = {
  initialValue: string;
  setValue(duration): any;
  index?: number;
  label?: string;
  required?: boolean;
};
