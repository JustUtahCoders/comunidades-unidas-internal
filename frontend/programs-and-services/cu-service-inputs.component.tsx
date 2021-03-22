import React, { FormEvent } from "react";
import {
  CUService,
  CUProgram,
  CustomQuestion,
  CustomQuestionType,
} from "../add-client/services.component";
import { useCss } from "kremling";
import { cloneDeep, differenceBy, isEmpty } from "lodash-es";
import {
  InteractionType,
  InteractionLocation,
} from "../view-edit-client/interactions/single-interaction-slat.component";
import TimeDurationInput, {
  TimeDuration,
} from "../util/time-duration-input.component";
import easyFetch from "../util/easy-fetch";

export default function CUServiceInputs(props: CUServiceInputsProps) {
  const scope = useCss(css);
  const [lineItemRate, setLineItemRate] = React.useState(
    props.service.defaultLineItemRate
      ? props.service.defaultLineItemRate.toFixed(2)
      : ""
  );
  const [
    defaultInteractionDuration,
    setDefaultInteractionDuration,
  ] = React.useState<TimeDuration>({
    stringValue: props.service.defaultInteractionDuration,
    hours: null,
    minutes: null,
  });

  const [customQuestions, setCustomQuestions] = React.useState<
    CustomQuestion[]
  >(props.service.customQuestions || []);

  const [questionsBeingEdited, setQuestionsBeingEdited] = React.useState<
    CustomQuestion[]
  >([]);

  React.useEffect(() => {
    if (
      !isEmpty(lineItemRate) &&
      Number(lineItemRate) !== props.service.defaultLineItemRate
    ) {
      props.setService({
        ...props.service,
        defaultLineItemRate: Number(lineItemRate),
      });
    }
  }, [lineItemRate, props.service.defaultLineItemRate]);

  React.useEffect(() => {
    if (
      defaultInteractionDuration.stringValue !==
      props.service.defaultInteractionDuration
    ) {
      props.setService({
        ...props.service,
        defaultInteractionDuration: defaultInteractionDuration.stringValue,
      });
    }
  }, [
    defaultInteractionDuration.stringValue,
    props.service.defaultInteractionDuration,
  ]);

  return (
    <form onSubmit={handleSubmit} ref={props.formRef} {...scope}>
      <div className="form-group">
        <label htmlFor="service-name">Service name:</label>
        <input
          type="text"
          value={props.service.serviceName}
          onChange={(evt) =>
            props.setService({
              ...props.service,
              serviceName: evt.target.value,
            })
          }
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="service-description">Service description:</label>
        <input
          type="text"
          value={props.service.serviceDescription}
          onChange={(evt) =>
            props.setService({
              ...props.service,
              serviceDescription: evt.target.value,
            })
          }
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="service-program">Part of Program:</label>
        <select
          value={props.service.programId || ""}
          onChange={(evt) =>
            props.setService({
              ...props.service,
              programId: Number(evt.target.value),
            })
          }
        >
          {props.programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.programName}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="service-active">Is Active:</label>
        <input
          id="service-active"
          type="checkbox"
          checked={props.service.isActive}
          onChange={(evt) =>
            props.setService({
              ...props.service,
              isActive: evt.target.checked,
            })
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="line-item-name">Line Item Name:</label>
        <input
          id="line-item-name"
          type="text"
          value={props.service.defaultLineItemName || ""}
          onChange={(evt) =>
            props.setService({
              ...props.service,
              defaultLineItemName: isEmpty(evt.target.value)
                ? null
                : evt.target.value,
            })
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="line-item-description">Line Item Description:</label>
        <input
          id="line-item-description"
          type="text"
          value={props.service.defaultLineItemDescription || ""}
          onChange={(evt) =>
            props.setService({
              ...props.service,
              defaultLineItemDescription: isEmpty(evt.target.value)
                ? null
                : evt.target.value,
            })
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="line-item-rate">Line Item Rate:</label>
        <input
          id="line-item-rate"
          type="number"
          value={lineItemRate}
          onChange={(evt) => setLineItemRate(evt.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="interaction-type">Interaction Type:</label>
        <select
          id="interaction-type"
          value={props.service.defaultInteractionType || ""}
          onChange={(evt) => {
            props.setService({
              ...props.service,
              defaultInteractionType: evt.target.value as InteractionType,
            });
          }}
        >
          <option value="">None</option>
          {Object.keys(InteractionType).map((interactionType) => (
            <option key={interactionType} value={interactionType}>
              {InteractionType[interactionType]}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="interaction-location">Interaction Location:</label>
        <select
          id="interaction-location"
          value={props.service.defaultInteractionLocation || ""}
          onChange={(evt) => {
            props.setService({
              ...props.service,
              defaultInteractionLocation: evt.target
                .value as InteractionLocation,
            });
          }}
        >
          <option value="">None</option>
          {Object.keys(InteractionLocation).map((interactionLocation) => (
            <option key={interactionLocation} value={interactionLocation}>
              {InteractionLocation[interactionLocation]}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label id="interaction-duration">Interaction Duration:</label>
        <TimeDurationInput
          labelId="interaction-duration"
          duration={defaultInteractionDuration}
          setDuration={(duration) => {
            setDefaultInteractionDuration(duration);
          }}
        />
      </div>
      <h3>Custom Interaction Questions</h3>
      {customQuestions.map((customQuestion) => {
        const editedQuestion = questionsBeingEdited.find(
          (q) => q.id === customQuestion.id
        );

        return (
          <div
            className={editedQuestion ? "edit-custom-question" : "form-group"}
            key={customQuestion.id}
          >
            {editedQuestion ? (
              <>
                <label htmlFor={`custom-question-type-${editedQuestion.id}`}>
                  Type:{" "}
                </label>
                <select
                  value={editedQuestion.type}
                  id={`custom-question-type-${editedQuestion.id}`}
                  onChange={(evt) =>
                    updateQuestionToEdit({
                      ...editedQuestion,
                      type: evt.target.value,
                    })
                  }
                >
                  <option value={CustomQuestionType.text}>Text</option>
                  <option value={CustomQuestionType.number}>Number</option>
                  <option value={CustomQuestionType.select}>Dropdown</option>
                  <option value={CustomQuestionType.boolean}>Yes / No</option>
                  <option value={CustomQuestionType.date}>Date</option>
                </select>
                <label
                  htmlFor={`custom-question-label-${editedQuestion.id}`}
                  style={{ paddingLeft: "1.6rem" }}
                >
                  Label:{" "}
                </label>
                <input
                  type="text"
                  value={editedQuestion.label}
                  id={`custom-question-label-${editedQuestion.id}`}
                  className="custom-question-label-input"
                  onChange={(evt) =>
                    updateQuestionToEdit({
                      ...editedQuestion,
                      label: evt.target.value,
                    })
                  }
                />
                <button
                  className="secondary delete"
                  type="button"
                  onClick={() => cancelEditQuestion(editedQuestion)}
                >
                  Cancel
                </button>
                <button
                  className="secondary"
                  type="button"
                  onClick={() => finishEditQuestion(editedQuestion)}
                >
                  Update
                </button>
              </>
            ) : (
              <>
                <label id={`custom-question-${customQuestion.id}`}>
                  {customQuestion.label || "(No Label)"}
                </label>
                <button
                  className="secondary delete"
                  onClick={() => deleteQuestion(customQuestion)}
                  type="button"
                >
                  Delete
                </button>
                <button
                  className="secondary"
                  type="button"
                  onClick={() => editQuestion(customQuestion)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        );

        function updateQuestionToEdit(newQuestion: CustomQuestion) {
          setQuestionsBeingEdited(
            questionsBeingEdited.map((question) =>
              question.id === newQuestion.id ? newQuestion : question
            )
          );
        }
      })}
      {customQuestions.length === 0 && <p>(No Custom Questions)</p>}
      <div>
        <button className="secondary" type="button" onClick={addCustomQuestion}>
          Add Custom Question
        </button>
      </div>
    </form>
  );

  function deleteQuestion(questionToDelete: CustomQuestion) {
    setCustomQuestions(
      customQuestions.filter(
        (customQuestion) => customQuestion.id !== questionToDelete.id
      )
    );
  }

  function editQuestion(questionToEdit: CustomQuestion) {
    setQuestionsBeingEdited(
      cloneDeep(questionsBeingEdited.concat(questionToEdit))
    );
  }

  function cancelEditQuestion(question: CustomQuestion) {
    setQuestionsBeingEdited(
      questionsBeingEdited.filter((q) => q.id !== question.id)
    );
  }

  function finishEditQuestion(editedQuestion: CustomQuestion) {
    setCustomQuestions(
      customQuestions.map((question) =>
        question.id === editedQuestion.id ? editedQuestion : question
      )
    );
    cancelEditQuestion(editedQuestion);
  }

  function addCustomQuestion() {
    const newId = Math.floor(Math.random() * 10000) * -1;
    const newQuestion = {
      id: newId,
      label: "",
      type: CustomQuestionType.text,
      serviceId: props.service.id,
    };
    setCustomQuestions(customQuestions.concat(newQuestion));
    setQuestionsBeingEdited(questionsBeingEdited.concat(newQuestion));
  }

  function handleSubmit(evt) {
    props.handleSubmit(evt, (serviceId: number, ac: AbortController) => {
      const oldQuestions = props.service.customQuestions || [];

      const createOrUpdatePromises = customQuestions.map((customQuestion) => {
        const alreadyExists = oldQuestions.some(
          (oldQuestion) => oldQuestion.id === customQuestion.id
        );

        if (alreadyExists) {
          // PATCH
          return easyFetch(
            `/api/custom-service-questions/${customQuestion.id}`,
            {
              method: "PATCH",
              signal: ac.signal,
              body: customQuestion,
            }
          );
        } else {
          const body = cloneDeep(customQuestion);
          delete body.id;

          // POST
          return easyFetch(`/api/custom-service-questions`, {
            method: "POST",
            signal: ac.signal,
            body,
          });
        }
      });

      const deletePromises = differenceBy(
        oldQuestions,
        customQuestions,
        "id"
      ).map((questionToDelete) =>
        easyFetch(`/api/custom-service-questions/${questionToDelete.id}`, {
          method: "DELETE",
          signal: ac.signal,
        })
      );

      return Promise.all(createOrUpdatePromises.concat(deletePromises));
    });
  }
}

type CUServiceInputsProps = {
  service: CUService;
  setService(service: CUService): any;
  handleSubmit(
    evt: FormEvent,
    saveQuestions: (serviceId: number, ac: AbortController) => Promise<any>
  ): any;
  formRef: React.RefObject<HTMLFormElement>;
  programs: CUProgram[];
};

const css = `
& .form-group label {
  display: inline-block;
  margin: 1.6rem;
  min-width: 20rem;
}

& .secondary.delete {
  color: var(--medium-red);
}

& .edit-custom-question {
  display: flex;
  align-items: center;
  padding: 0 .8rem;
}

& .edit-custom-question label {
  padding-right: .8rem;
}

& .custom-question-label-input {
  width: 100%;
  flex-grow: 1;
  margin-right: .8rem;
}
`;
