import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  CustomQuestionInputProps,
  CustomQuestionInputRef,
} from "../service-interaction-inputs.component";

const CustomSelect = forwardRef<
  CustomQuestionInputRef,
  CustomQuestionInputProps
>((props, ref) => {
  const [value, setValue] = useState<string>(
    props.initialAnswer ? (props.initialAnswer as string) : defaultAnswer()
  );

  useImperativeHandle(ref, () => ({
    getAnswer() {
      return {
        questionId: props.question.id,
        answer: value,
      };
    },
  }));

  return (
    <select value={value} onChange={handleChange}>
      {(props.question.options || []).map((option) => (
        <option value={option.value} key={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );

  function handleChange(evt) {
    setValue(evt.target.value);
  }

  function defaultAnswer() {
    return props.question.options.length > 0
      ? props.question.options[0].value
      : "";
  }
});

export default CustomSelect;
