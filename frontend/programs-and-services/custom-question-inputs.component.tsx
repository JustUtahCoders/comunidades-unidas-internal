import { useCss } from "kremling";
import { keys } from "lodash-es";
import React, { useState } from "react";
import {
  CUCustomQuestion,
  CUCustomQuestionType,
} from "../add-client/services.component";
import { capitalize } from "../reports/shared/report.helpers";
import css from "./custom-question-inputs.css";

let newId = 0;

const humanReadableInputTypes = {
  [CUCustomQuestionType.boolean]: "Yes / No",
  [CUCustomQuestionType.select]: "Multiple Choice",
};

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

        function remove() {
          props.setQuestions(props.questions.filter((q, j) => j !== i));
        }

        return (
          <Question
            question={question}
            key={question.id}
            setQuestion={setQuestion}
            remove={remove}
          />
        );
      })}
      <button
        type="button"
        className="secondary addQuestion"
        onClick={addQuestion}
      >
        Add Question
      </button>
    </div>
  );

  function addQuestion() {
    props.setQuestions([
      ...props.questions,
      {
        id: (`new-${newId++}` as unknown) as number,
        label: "",
        options: null,
        type: CUCustomQuestionType.text,
        serviceId: props.serviceId,
      },
    ]);
  }
}

type CustomQuestionInputsProps = {
  questions: CUCustomQuestion[];
  setQuestions(questions: CUCustomQuestion[]): any;
  serviceId: number;
};

type QuestionProps = {
  question: CUCustomQuestion;
  setQuestion(question: CUCustomQuestion): any;
  remove(): any;
};

function Question(props: QuestionProps) {
  return (
    <>
      <div className="form-group">
        <input
          placeholder="Put Question Label Here"
          className="questionLabel"
          type="text"
          value={props.question.label}
          onChange={(evt) =>
            props.setQuestion({ ...props.question, label: evt.target.value })
          }
        />
        <select
          value={props.question.type || ""}
          onChange={(evt) => {
            const type = evt.target.value as CUCustomQuestionType;
            const options =
              type === CUCustomQuestionType.select
                ? [{ name: "", value: "" }]
                : null;

            props.setQuestion({
              ...props.question,
              type,
              options,
            });
          }}
        >
          {keys(CUCustomQuestionType).map((questionType) => (
            <option value={questionType} key={questionType}>
              {capitalize(
                humanReadableInputTypes[questionType] || questionType
              )}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="secondary remove"
          onClick={props.remove}
        >
          Remove
        </button>
      </div>
      {props.question.type === CUCustomQuestionType.select &&
        props.question.options.map((option, i) => (
          <div className="option" key={i}>
            <input
              type="text"
              placeholder="Multiple Choice Option"
              value={option.name}
              onChange={(evt) => updateOption(evt.target.value, i)}
            />
            <button
              type="button"
              className="secondary remove"
              onClick={() => removeOption(i)}
            >
              Remove
            </button>
          </div>
        ))}
      {props.question.type === CUCustomQuestionType.select && (
        <div className="option">
          <button
            type="button"
            className="secondary remove"
            onClick={addOption}
          >
            Add Option
          </button>
        </div>
      )}
    </>
  );

  function addOption() {
    props.setQuestion({
      ...props.question,
      options: props.question.options.concat({ name: "", value: "" }),
    });
  }

  function removeOption(index) {
    props.setQuestion({
      ...props.question,
      options: props.question.options.filter((q, i) => i !== index),
    });
  }

  function updateOption(value, index) {
    props.setQuestion({
      ...props.question,
      options: props.question.options.map((q, i) =>
        i === index ? { name: value, value } : q
      ),
    });
  }
}

export function sanitizeCustomServiceQuestionRequest(
  question: CUCustomQuestion
) {
  const result = {
    ...question,
    options:
      question.type === CUCustomQuestionType.select
        ? question.options.filter((o) => o.name.trim().length > 0)
        : null,
  };

  if (String(question.id).startsWith("new-")) {
    delete question.id;
  }

  return result;
}
