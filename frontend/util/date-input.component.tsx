import React from "react";
import { useCss } from "kremling";

export default React.forwardRef<DateInputRef, DateInputProps>(
  function DateInput(props: DateInputProps, ref) {
    const [date, setDate] = React.useState(props.date || null);
    const scope = useCss(css);

    return (
      <div {...scope}>
        <label>
          <span className="intake-span">{props.labelName}</span>
          <input
            type={"date"}
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
};

type DateInputRef = HTMLInputElement;
