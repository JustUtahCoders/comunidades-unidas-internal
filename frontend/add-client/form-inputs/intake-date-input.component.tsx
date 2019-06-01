import React from "react";

export default React.forwardRef<IntakeDateInputRef, IntakeDateInputProps>(
  function IntakeDateInput(props: IntakeDateInputProps, ref) {
    const [date, setDate] = React.useState(props.date);

    return (
      <div>
        <label>
          <span>Intake Date</span>
          <input
            type="date"
            value={date}
            onChange={evt => setDate(evt.target.value)}
            ref={ref}
          />
        </label>
      </div>
    );
  }
);

type IntakeDateInputProps = {
  date: string;
};

type IntakeDateInputRef = HTMLInputElement;
