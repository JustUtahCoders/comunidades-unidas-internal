import React from "react";
import { useCss } from "kremling";

export default function TimeDurationInput(props: TimeDurationInputProps) {
  const scope = useCss(css);

  React.useEffect(() => {
    if (
      props.duration.stringValue &&
      !props.duration.hours &&
      !props.duration.minutes
    ) {
      const stringTimeParser = /^([0-9][0-9]?):([0-9]{2}):([0-9]{2})$/g;
      const match = stringTimeParser.exec(props.duration.stringValue);
      if (!match) {
        throw Error(
          `TimeDurationInput was given an invalid stringValue prop '${props.duration.stringValue}'`
        );
      }
      props.setDuration({
        hours: Number(match[1]),
        minutes: Number(match[2]),
        stringValue: props.duration.stringValue
      });
    }
  }, [props.duration, props.setDuration]);

  return (
    <span {...scope}>
      <input
        type="number"
        required={props.required}
        value={
          props.duration.hours === null || isNaN(props.duration.hours)
            ? ""
            : props.duration.hours
        }
        onChange={changeHours}
        aria-labelledby={props.labelId}
        min={0}
        max={100}
      />
      <span className="descr">hour{props.duration.hours !== 1 ? "s" : ""}</span>
      <input
        type="number"
        required={props.required}
        value={
          props.duration.minutes === null || isNaN(props.duration.minutes)
            ? ""
            : props.duration.minutes
        }
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
    stringValue:
      withLeadingZeros(hours) + ":" + withLeadingZeros(minutes) + ":00"
  };
}

function withLeadingZeros(num) {
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
