import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  CustomQuestionInputProps,
  CustomQuestionInputRef,
} from "../service-interaction-inputs.component";

const CustomBoolean = forwardRef<
  CustomQuestionInputRef,
  CustomQuestionInputProps
>((props, ref) => {
  const [value, setValue] = useState<boolean>(
    props.initialAnswer ? Boolean(props.initialAnswer) : false
  );

  useImperativeHandle(ref, () => ({
    getAnswer() {
      return {
        questionId: props.question.id,
        answer: value,
      };
    },
  }));

  return <input type="checkbox" checked={value} onChange={handleChange} />;

  function handleChange(evt) {
    setValue(evt.target.checked);
  }
});

export default CustomBoolean;
