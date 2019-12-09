import React from "react";
import { useCss } from "kremling";
import { SingleLead } from "../../view-edit-lead/view-lead.component";

export default React.forwardRef<IntakeDateInputRef, IntakeDateInputProps>(
  function IntakeDateInput(props: IntakeDateInputProps, ref) {
    const [date, setDate] = React.useState(props.date);
    const scope = useCss(css);

    return (
      <div {...scope}>
        <label>
          <span className="intake-span">Intake Date</span>
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

const css = `
  & .intake-span {
    width: 50%;
  }
`;

type IntakeDateInputProps = {
  date: string;
  lead?: SingleLead;
};

type IntakeDateInputRef = HTMLInputElement;
