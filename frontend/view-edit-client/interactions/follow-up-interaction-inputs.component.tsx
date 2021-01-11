import dayjs from "dayjs";
import React, {
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from "react";
import { CUService, CUServicesList } from "../../add-client/services.component";
import FullRichTextEditor from "../../rich-text/full-rich-text-editor.component";
import easyFetch from "../../util/easy-fetch";
import Modal from "../../util/modal.component";
import IntakeServicesInputs from "../../util/services-inputs.component";
import TimeDurationInput, {
  TimeDuration,
} from "../../util/time-duration-input.component";
import { CUObjectAudit } from "../invoices/edit-invoice.component";
import {
  InteractionInputsRef,
  InteractionInputsProps,
} from "./single-interaction-slat.component";

const FollowUpInteractionInputs = React.forwardRef<
  FollowUpInputsRef,
  InteractionInputsProps
>((props, ref) => {
  const [state, dispatch] = useReducer<Reducer, State>(
    reducer,
    null,
    getInitialState
  );
  const intakeServicesInputsRef = useRef(null);
  const descrRef = useRef(null);

  useEffect(() => {
    props.setName(
      state.services.length > 0
        ? state.services.map((service) => service.serviceName).join(", ")
        : "Follow Up"
    );
  }, [state.services]);

  useImperativeHandle(ref, () => {
    return {
      save(signal) {
        return easyFetch(`/api/clients/${props.clientId}/follow-ups`, {
          method: "POST",
          signal,
          body: {
            serviceIds: state.services.map((s) => s.id),
            title: state.title,
            description: descrRef.current.getHTML(),
            duration: state.duration.stringValue,
            dateOfContact: state.dateOfContact,
            appointmentDate: state.appointmentDate || null,
          },
        });
      },
      getFollowUp,
    };

    function getFollowUp() {
      return {
        id: props.initialFollowUp ? props.initialFollowUp.id : null,
        serviceIds: state.services.map((s) => s.id),
        title: state.title,
        description: descrRef.current.getHTML(),
        duration: state.duration.stringValue,
        dateOfContact: state.dateOfContact,
        appointmentDate: state.appointmentDate || null,
      };
    }
  });

  return (
    <>
      <label htmlFor={`title-${props.interactionIndex}`}>Title:</label>
      <input
        id={`title-${props.interactionIndex}`}
        type="text"
        value={state.title}
        onChange={(evt) =>
          dispatch({ type: ActionType.setTitle, title: evt.target.value })
        }
        required
      />
      <label htmlFor={`contact-date-${props.interactionIndex}`}>
        Date of Contact:
      </label>
      <input
        type="date"
        required
        value={state.dateOfContact}
        onChange={(evt) =>
          dispatch({
            type: ActionType.setDateOfContact,
            dateOfContact: evt.target.value,
          })
        }
      />
      <label htmlFor={`duration-${props.interactionIndex}`}>Duration</label>
      <TimeDurationInput
        duration={state.duration}
        setDuration={(duration) =>
          dispatch({ type: ActionType.setDuration, duration })
        }
        labelId={`duration-${props.interactionIndex}`}
      />
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
      <input
        type="date"
        value={state.appointmentDate || ""}
        onChange={(evt) =>
          dispatch({
            type: ActionType.setAppointmentDate,
            appointmentDate: evt.target.value,
          })
        }
      />
      <label htmlFor={`description-${props.interactionIndex}`}>
        Description
      </label>
      <FullRichTextEditor
        placeholder="Describe the follow up"
        initialHTML={state.description}
        ref={descrRef}
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
      services:
        props.initialFollowUp && props.initialFollowUp.services
          ? props.initialFollowUp.services
          : [],
      appointmentDate: props.initialFollowUp
        ? props.initialFollowUp.appointmentDate
        : null,
      dateOfContact: props.initialFollowUp
        ? props.initialFollowUp.dateOfContact
        : dayjs().format("YYYY-MM-DD"),
      description: props.initialFollowUp
        ? props.initialFollowUp.description
        : null,
      title: props.initialFollowUp ? props.initialFollowUp.title : "",
      duration: props.initialFollowUp
        ? {
            stringValue: props.initialFollowUp.duration,
            hours: null,
            minutes: null,
          }
        : {
            stringValue: "00:30:00",
            hours: 0,
            minutes: 0,
          },
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
    case ActionType.setDuration:
      return {
        ...oldState,
        duration: action.duration,
      };
    case ActionType.setDateOfContact:
      return {
        ...oldState,
        dateOfContact: action.dateOfContact,
      };
    case ActionType.setAppointmentDate:
      return {
        ...oldState,
        appointmentDate: action.appointmentDate,
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
  duration: TimeDuration;
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

type SetDateOfContact = {
  type: ActionType.setDateOfContact;
  dateOfContact: string;
};

type SetAppointmentDate = {
  type: ActionType.setAppointmentDate;
  appointmentDate: string;
};

type SetDuration = {
  type: ActionType.setDuration;
  duration: TimeDuration;
};

type Action =
  | SetServices
  | CloseServicesModal
  | OpenServicesModal
  | SetTitle
  | SetDuration
  | SetDateOfContact
  | SetAppointmentDate;

enum ActionType {
  setServices = "setServices",
  closeServicesModal = "closeServicesModal",
  openServicesModal = "openServicesModal",
  setTitle = "setTitle",
  setDuration = "setDuration",
  setDateOfContact = "setDateOfContact",
  setAppointmentDate = "setAppointmentDate",
}

type Reducer = (oldState: State, action: Action) => State;

export type FollowUp = {
  id: number;
  serviceIds: number[];
  services?: CUService[];
  title: string;
  description: string;
  dateOfContact: string;
  duration: string;
  appointmentDate: string;
  createdBy?: CUObjectAudit;
  lastUpdatedBy?: CUObjectAudit;
};

export type FollowUpInputsRef = InteractionInputsRef & {
  getFollowUp?(): FollowUp;
};

export default FollowUpInteractionInputs;
