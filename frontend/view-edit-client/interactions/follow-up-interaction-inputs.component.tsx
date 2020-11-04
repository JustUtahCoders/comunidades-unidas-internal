import React, { useEffect, useReducer, useRef } from "react";
import { CUService, CUServicesList } from "../../add-client/services.component";
import FullRichTextEditor from "../../rich-text/full-rich-text-editor.component";
import Modal from "../../util/modal.component";
import IntakeServicesInputs from "../../util/services-inputs.component";
import {
  InteractionInputsRef,
  InteractionInputsProps,
} from "./single-interaction-slat.component";

const FollowUpInteractionInputs = React.forwardRef<
  InteractionInputsRef,
  InteractionInputsProps
>((props, ref) => {
  const [state, dispatch] = useReducer<Reducer, State>(
    reducer,
    null,
    getInitialState
  );
  const intakeServicesInputsRef = useRef(null);

  useEffect(() => {
    props.setName(
      state.services.length > 0
        ? state.services.map((service) => service.serviceName).join(", ")
        : "Follow Up"
    );
  }, [state.services]);

  return (
    <>
      <label htmlFor={`title-${props.interactionIndex}`}>Title:</label>
      <input
        id={`title-${props.interactionIndex}`}
        type="text"
        onChange={(evt) =>
          dispatch({ type: ActionType.setTitle, title: evt.target.value })
        }
      />
      <label htmlFor={`contact-date-${props.interactionIndex}`}>
        Date of Contact:
      </label>
      <input type="date" />
      <label htmlFor={`provided-service-${props.interactionIndex}`}>
        Services discussed:
      </label>
      <div>
        <button
          id={`provided-service-${props.interactionIndex}`}
          type="button"
          className="primary"
          onClick={() => dispatch({ type: ActionType.openServicesModal })}
        >
          Select
        </button>
      </div>
      {state.showingServicesModal && (
        <Modal
          headerText="What services were discussed?"
          close={closeServices}
          primaryAction={() =>
            dispatch({
              type: ActionType.setServices,
              services: intakeServicesInputsRef.current.checkedServices,
            })
          }
          primaryText="Update services"
          secondaryAction={closeServices}
          secondaryText="Cancel"
        >
          <IntakeServicesInputs
            ref={intakeServicesInputsRef}
            services={props.servicesResponse.services}
            checkedServices={state.services}
          />
        </Modal>
      )}
      <label htmlFor={`appointment-date-${props.interactionIndex}`}>
        Future Appointment:
      </label>
      <input type="date" />
      <label htmlFor={`description-${props.interactionIndex}`}>
        Description
      </label>
      <FullRichTextEditor
        placeholder="Describe the follow up"
        initialHTML={null}
      />
    </>
  );

  function closeServices() {
    dispatch({ type: ActionType.closeServicesModal });
  }

  function getInitialState() {
    return {
      servicesResponse: props.servicesResponse,
      showingServicesModal: false,
      services: [],
      appointmentDate: null,
      dateOfContact: null,
      description: null,
      title: null,
    };
  }
});

function reducer(oldState: State, action: Action): State {
  switch (action.type) {
    case ActionType.setServices:
      return {
        ...oldState,
        services: action.services,
        showingServicesModal: false,
      };
    case ActionType.closeServicesModal:
      return {
        ...oldState,
        showingServicesModal: false,
      };
    case ActionType.openServicesModal:
      return {
        ...oldState,
        showingServicesModal: true,
      };
    case ActionType.setTitle:
      return {
        ...oldState,
        title: action.title,
      };
    default:
      throw Error();
  }
}

type State = {
  servicesResponse: CUServicesList;
  showingServicesModal: boolean;
  services: CUService[];
  title: string;
  description: string;
  dateOfContact: string;
  appointmentDate: string;
};

type SetServices = {
  type: ActionType.setServices;
  services: CUService[];
};

type CloseServicesModal = {
  type: ActionType.closeServicesModal;
};

type OpenServicesModal = {
  type: ActionType.openServicesModal;
};

type SetTitle = {
  type: ActionType.setTitle;
  title: string;
};

type Action = SetServices | CloseServicesModal | OpenServicesModal | SetTitle;

enum ActionType {
  setServices = "setServices",
  closeServicesModal = "closeServicesModal",
  openServicesModal = "openServicesModal",
  setTitle = "setTitle",
}

type Reducer = (oldState: State, action: Action) => State;

export default FollowUpInteractionInputs;
