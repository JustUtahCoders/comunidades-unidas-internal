import React from "react";
import { useCss } from "kremling";

export default function TimeDurationInput(props: TimeDurationInputProps) {
  const scope = useCss(css);

  return (
    <span {...scope}>
      <input
        type="number"
        required={props.required}
        value={props.duration.hours}
        onChange={changeHours}
        aria-labelledby={props.labelId}
        min={0}
        max={100}
      />
      <span className="descr">hour{props.duration.hours !== 1 ? "s" : ""}</span>
      <input
        type="number"
        required={props.required}
        value={props.duration.minutes}
        onChange={changeMinutes}
        aria-labelledby={props.labelId}
        min={0}
        max={59}
      />
      <span className="descr">
        minute{props.duration.minutes !== 1 ? "s" : ""}
      </span>
    </span>
  );

  function changeHours(evt) {
    props.setDuration(createDuration(evt.target.value, props.duration.minutes));
  }

  function changeMinutes(evt) {
    props.setDuration(createDuration(props.duration.hours, evt.target.value));
  }
}

function createDuration(hours, minutes): TimeDuration {
  return {
    hours,
    minutes,
    stringValue: withTrailingZeros(hours) + ":" + withTrailingZeros(minutes)
  };
}

function withTrailingZeros(num) {
  let result = String(num);
  while (result.length < 2) {
    result = "0" + result;
  }
  return result;
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
  duration: TimeDuration;
  setDuration(duration: TimeDuration): any;
  labelId: string;
  required?: boolean;
};

export type TimeDuration = {
  hours: number;
  minutes: number;
  stringValue: string;
};
