import React from "react";
import { useCss } from "kremling";

export default React.forwardRef<DateInputRef, DateInputProps>(
  function DateInput(props: DateInputProps, ref) {
    const [date, setDate] = React.useState(props.date);
    const scope = useCss(css);

    return (
      <div {...scope}>
        <label>
          <span className="intake-span">{props.labelName}</span>
          <input
            type={props.withTime ? "datetime-local" : "date"}
            value={date}
            onChange={evt => setDate(evt.target.value)}
            ref={ref}
          />
        </label>
      </div>
    );
  }
);

const css = `
  & .intake-span {
    width: 50%;
  }
`;

type DateInputProps = {
  date: string;
  labelName: string;
  withTime: boolean;
};

type DateInputRef = HTMLInputElement;
