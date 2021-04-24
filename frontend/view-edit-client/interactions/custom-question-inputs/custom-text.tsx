import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  CustomQuestionInputProps,
  CustomQuestionInputRef,
} from "../service-interaction-inputs.component";

const CustomText = forwardRef<CustomQuestionInputRef, CustomQuestionInputProps>(
  (props, ref) => {
    const [value, setValue] = useState<string>(
      props.initialAnswer ? (props.initialAnswer as string) : ""
    );

    useImperativeHandle(ref, () => ({
      getAnswer() {
        return {
          questionId: props.question.id,
          answer: value,
        };
      },
    }));

    return <input type="text" value={value} onChange={handleChange} />;

    function handleChange(evt) {
      setValue(evt.target.value);
    }
  }
);

export default CustomText;
