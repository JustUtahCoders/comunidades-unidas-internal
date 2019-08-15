import React from "react";
import { useCss } from "kremling";

export default function TimeDurationInput(props: TimeDurationInputProps) {
  const [internalValue, setInternalValue] = React.useState({
    hours: 0,
    minutes: 30
  });
  const scope = useCss(css);

  return (
    <span {...scope}>
      <input
        type="number"
        required={props.required}
        value={internalValue.hours}
        onChange={changeHours}
        aria-labelledby={props.labelId}
        min={0}
        max={100}
      />
      <span className="descr">hour{internalValue.hours !== 1 ? "s" : ""}</span>
      <input
        type="number"
        required={props.required}
        value={internalValue.minutes}
        onChange={changeMinutes}
        aria-labelledby={props.labelId}
        min={0}
        max={59}
      />
      <span className="descr">
        minute{internalValue.minutes !== 1 ? "s" : ""}
      </span>
    </span>
  );

  function changeHours(evt) {
    setInternalValue({ ...internalValue, hours: Number(evt.target.value) });
  }

  function changeMinutes(evt) {
    setInternalValue({ ...internalValue, minutes: Number(evt.target.value) });
  }
}

const css = `
& input[type="number"] {
  width: 5.6rem;
}

& .descr {
  padding: 0 .8rem;
}
`;

type TimeDurationInputProps = {
  initialValue: string;
  setValue(duration: TimeDuration): any;
  labelId: string;
  required?: boolean;
};

export type TimeDuration = {
  hours: number;
  minutes: number;
  stringValue: string;
};
