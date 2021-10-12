import React from "react";
import { startCase } from "lodash-es";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useCss } from "kremling";
import Modal from "../../util/modal.component";

export default function IntakeSetting(props: IntakeSettingProps) {
  const [
    questionBeingEdited,
    setQuestionBeingEdited,
  ] = React.useState<QuestionBeingEdited>(null);

  const scope = useCss(css);
  return (
    <div {...scope}>
      <h3>{startCase(props.name)}</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="intake-form">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {props.questions.map((question, i) => {
                return (
                  <Draggable
                    key={question.id}
                    draggableId={String(question.id)}
                    index={i}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`question`}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          setQuestionBeingEdited({ index: i, question })
                        }
                      >
                        <div>{question.label}</div>
                        <sup>
                          {question.required ? "Required" : "Not required"}
                        </sup>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {questionBeingEdited && (
        <Modal
          close={() => setQuestionBeingEdited(null)}
          headerText={questionBeingEdited.question.label}
          primaryText="Done"
          primaryAction={updateDone}
          secondaryText="Cancel"
          secondaryAction={() => setQuestionBeingEdited(null)}
        >
          <div {...scope}>
            <h4>Modify the {questionBeingEdited.question.label} question</h4>
            <div className="form-group">
              <label htmlFor="question-label">Question Label:</label>
              <input
                id="question-label"
                type="text"
                value={questionBeingEdited.question.label}
                onChange={modifyQuestion("label")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="question-placeholder">Placeholder Value:</label>
              <input
                id="question-placeholder"
                type="text"
                value={questionBeingEdited.question.placeholder || ""}
                onChange={modifyQuestion("placeholder")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="question-required">
                Required to submit intake?
              </label>
              <input
                id="question-required"
                type="checkbox"
                checked={questionBeingEdited.question.required}
                onChange={modifyQuestion("required")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="question-disabled">Question is disabled?</label>
              <input
                id="question-disabled"
                type="checkbox"
                checked={questionBeingEdited.question.disabled}
                onChange={modifyQuestion("disabled")}
              />
            </div>
            <div className="form-group data-key">
              Data key: {questionBeingEdited.question.dataKey}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );

  function modifyQuestion(propertyName) {
    return (evt) => {
      setQuestionBeingEdited({
        ...questionBeingEdited,
        question: {
          ...questionBeingEdited.question,
          [propertyName]:
            evt.target.type === "checkbox"
              ? evt.target.checked
              : evt.target.value,
        },
      });
    };
  }

  function updateDone() {
    props.updateQuestion(
      questionBeingEdited.index,
      questionBeingEdited.question
    );
    setQuestionBeingEdited(null);
  }

  function onDragEnd(result: DropResult) {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    props.reorder(result.source.index, result.destination.index);
  }
}

const css = `
& .question {
  padding: 1.2rem .6rem;
  border: .1rem solid black;
  background-color: var(--light-gray);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

& .form-group label, & .data-key {
  font-size: 1.4rem;
  display: block;
}

& .form-group {
  margin-bottom: 1.6rem;
}
`;

interface IntakeSettingProps {
  name: string;
  questions: IntakeQuestion[];
  reorder(sourceIndex: number, destIndex: number): void;
  updateQuestion(index: number, newQuestion: IntakeQuestion): void;
}

export interface IntakeQuestion {
  id: number;
  dataKey: string;
  disabled: boolean;
  label: string;
  placeholder?: string;
  required: boolean;
  section: string;
  sectionOrder: number;
  type: IntakeQuestionType;
}

interface QuestionBeingEdited {
  question?: IntakeQuestion;
  index?: number;
}

enum IntakeQuestionType {
  builtin = "builtin",
}
