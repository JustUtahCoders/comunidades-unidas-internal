import React from "react";
import ClientSection from "./client-section.component";
import { SingleClient } from "./view-client.component";
import { useCss } from "kremling";
import checkedUrl from "../../icons/148705-essential-collection/svg/checked-1.svg";
import closeUrl from "../../icons/148705-essential-collection/svg/close.svg";
import ContactInformationInputsComponent, {
  ContactInformationFormClient,
  HousingStatuses
} from "../add-client/form-inputs/contact-information-inputs.component";
import easyFetch from "../util/easy-fetch";

export default function ViewEditContactInfo(props: ViewEditContactInfoProps) {
  const { client } = props;
  const scope = useCss(css);
  const [isEditing, setIsEditing] = React.useState(false);
  const contactInfoInputsRef = React.useRef(null);
  const [apiStatus, dispatchApiStatus] = React.useReducer(updatingReducer, {
    isUpdating: false,
    newClientData: null
  });

  React.useEffect(() => {
    if (apiStatus.isUpdating) {
      const abortController = new AbortController();
      const data: ContactInformationFormClient = apiStatus.newClientData;
      const patch: SingleClient = {
        phone: data.phone,
        smsConsent: data.smsConsent,
        homeAddress: {
          street: data.streetAddress,
          city: data.city,
          state: data.state,
          zip: data.zip
        },
        housingStatus: data.housing,
        email: data.email,
        dateOfIntake: data.dateOfIntake
      };

      easyFetch(`/api/clients/${client.id}`, {
        method: "PATCH",
        body: patch,
        signal: abortController.signal
      })
        .then(responseData => {
          props.clientUpdated(responseData.client);
          setIsEditing(false);
        })
        .finally(() => {
          dispatchApiStatus({ type: "reset" });
        });

      return () => abortController.abort();
    }
  }, [apiStatus]);

  return (
    <ClientSection title="Contact information">
      {isEditing ? (
        <ContactInformationInputsComponent
          ref={contactInfoInputsRef}
          client={{
            phone: client.phone,
            smsConsent: client.smsConsent,
            streetAddress: client.homeAddress.street,
            city: client.homeAddress.city,
            state: client.homeAddress.state,
            zip: client.homeAddress.zip,
            housing: client.housingStatus,
            email: client.email,
            dateOfIntake: client.dateOfIntake
          }}
          handleSubmit={handleSubmit}
        >
          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={() => setIsEditing(false)}
              disabled={apiStatus.isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary"
              disabled={apiStatus.isUpdating}
            >
              Update
            </button>
          </div>
        </ContactInformationInputsComponent>
      ) : (
        <div {...scope} className="view-edit-contact-information">
          <div className="view-contact-information">
            <div>{client.homeAddress.street}</div>
            <div>
              {client.homeAddress.city}, {client.homeAddress.state}{" "}
              {client.homeAddress.zip}
            </div>
            <div>
              Housing:{" "}
              {HousingStatuses[client.housingStatus] || client.housingStatus}
            </div>
            <div>{formattedPhone()}</div>
            {smsConsent()}
            <div>{client.email}</div>
          </div>
          <button
            className="secondary edit-button"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </div>
      )}
    </ClientSection>
  );

  function formattedPhone() {
    const { phone } = client;
    if (phone) {
      if (phone.length === 10) {
        return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(
          6,
          10
        )}`;
      } else {
        return phone;
      }
    } else {
      return "";
    }
  }

  function smsConsent() {
    if (client.smsConsent) {
      return (
        <div className="sms-consent">
          Wants texts{" "}
          <img
            src={checkedUrl}
            alt="wants text messages"
            title="wants text messages"
            className="sms-consent-icon"
          />
        </div>
      );
    } else {
      return (
        <div className="sms-consent">
          No texts{" "}
          <img
            src={closeUrl}
            alt="no text messages"
            title="no text messages"
            className="sms-consent-icon"
          />
        </div>
      );
    }
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatchApiStatus({
      type: "update",
      newClientData: contactInfoInputsRef.current.getData()
    });
  }
}

function updatingReducer(state, action: UpdateAction) {
  switch (action.type) {
    case "update":
      return { isUpdating: true, newClientData: action.newClientData };
    case "reset":
      return { isUpdating: false };
    default:
      throw Error();
  }
}

type UpdateAction = {
  type: string;
  newClientData?: ContactInformationFormClient;
};

type ViewEditContactInfoProps = {
  client: SingleClient;
  clientUpdated(newClient: SingleClient): void;
};

const css = `
& .view-edit-contact-information {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

& .view-contact-information {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

& .sms-consent {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

& .sms-consent-icon {
  width: 1.6rem;
  margin-left: .8rem;
}
`;
