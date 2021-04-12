import { useCss } from "kremling";
import { keys } from "lodash-es";
import React, { useState } from "react";
import {
  CUCustomQuestion,
  CUCustomQuestionType,
} from "../add-client/services.component";
import { capitalize } from "../reports/shared/report.helpers";
import css from "./custom-question-inputs.css";

export default function CustomQuestionInputs(props: CustomQuestionInputsProps) {
  return (
    <div className="form-group" {...useCss(css)}>
      <h3>Custom Interaction Questions</h3>
      {props.questions.map((question, i) => {
        function setQuestion(newQuestion) {
          props.setQuestions(
            props.questions.map((q, j) => (j === i ? newQuestion : q))
          );
        }

        return (
          <Question
            question={question}
            key={question.id}
            setQuestion={setQuestion}
          />
        );
      })}
      <button className="secondary">Add Question</button>
    </div>
  );
}

type CustomQuestionInputsProps = {
  questions: CUCustomQuestion[];
  setQuestions(questions: CUCustomQuestion[]): any;
};

type QuestionProps = {
  question: CUCustomQuestion;
  setQuestion(question: CUCustomQuestion): any;
};

function Question(props: QuestionProps) {
  return (
    <div className="form-group">
      <label htmlFor={`custom-question-${props.question.id}`}>
        {props.question.label}
      </label>
      <select
        value={props.question.type || ""}
        onChange={(evt) =>
          props.setQuestion({
            ...props.question,
            type: evt.target.value as CUCustomQuestionType,
          })
        }
      >
        {keys(CUCustomQuestionType).map((questionType) => (
          <option value={questionType} key={questionType}>
            {capitalize(questionType)}
          </option>
        ))}
      </select>
      <button className="secondary remove">Remove</button>
    </div>
  );
}
