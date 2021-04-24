import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  CustomQuestionInputProps,
  CustomQuestionInputRef,
} from "../service-interaction-inputs.component";

const CustomNumber = forwardRef<
  CustomQuestionInputRef,
  CustomQuestionInputProps
>((props, ref) => {
  const [value, setValue] = useState<number>(
    props.initialAnswer ? Number(props.initialAnswer) : 1
  );

  useImperativeHandle(ref, () => ({
    getAnswer() {
      return {
        questionId: props.question.id,
        answer: value,
      };
    },
  }));

  return <input type="number" value={value} onChange={handleChange} />;

  function handleChange(evt) {
    setValue(Number(evt.target.value));
  }
});

export default CustomNumber;
