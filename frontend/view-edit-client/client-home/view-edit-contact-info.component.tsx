import React from "react";
import ClientSection from "./client-section.component";
import { SingleClient, AuditSummary } from "../view-client.component";
import { useCss } from "kremling";
import checkedUrl from "../../../icons/148705-essential-collection/svg/checked-1.svg";
import closeUrl from "../../../icons/148705-essential-collection/svg/close.svg";
import ContactInformationInputsComponent, {
  ContactInformationFormClient,
  HousingStatuses,
} from "../../add-client/form-inputs/contact-information-inputs.component";
import easyFetch from "../../util/easy-fetch";
import { formatPhone } from "../../util/formatters";

export default function ViewEditContactInfo(props: ViewEditContactInfoProps) {
  const { client } = props;
  const scope = useCss(css);
  const [isEditing, setIsEditing] = React.useState(false);
  const contactInfoInputsRef = React.useRef(null);
  const [apiStatus, dispatchApiStatus] = React.useReducer(updatingReducer, {
    isUpdating: false,
    newClientData: null,
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
          zip: data.zip,
        },
        housingStatus: data.housing,
        email: data.email,
        dateOfIntake: data.dateOfIntake,
      };

      easyFetch(`/api/clients/${client.id}`, {
        method: "PATCH",
        body: patch,
        signal: abortController.signal,
      })
        .then((responseData) => {
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
    <ClientSection
      title="Contact information"
      auditSection={props.auditSummary && props.auditSummary.contactInformation}
    >
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
            dateOfIntake: client.dateOfIntake,
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
        <>
          <table className="client-table" {...scope}>
            <tbody>
              <tr>
                <td>Phone:</td>
                <td>{formatPhone(client.phone)}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>
                  <div>{client.email ? client.email : "Not Provided"}</div>
                </td>
              </tr>
              <tr>
                <td>Address:</td>
                <td>
                  <div>{client.homeAddress.street}</div>
                  <div>
                    {client.homeAddress.city}, {client.homeAddress.state}{" "}
                    {client.homeAddress.zip}
                  </div>
                </td>
              </tr>
              <tr>
                <td>Wants texts:</td>
                <td>{smsConsent()}</td>
              </tr>
              <tr>
                <td>Housing:</td>
                <td>
                  {HousingStatuses[client.housingStatus] ||
                    client.housingStatus}
                </td>
              </tr>
            </tbody>
          </table>
          {props.editable && (
            <button
              className="secondary edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </>
      )}
    </ClientSection>
  );

  function smsConsent() {
    if (client.smsConsent) {
      return (
        <div className="sms-consent">
          Yes{" "}
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
          No{" "}
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
      newClientData: contactInfoInputsRef.current.getData(),
    });
  }
}

ViewEditContactInfo.defaultProps = {
  editable: true,
};

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
  clientUpdated?(newClient: SingleClient): void;
  auditSummary?: AuditSummary;
  editable?: boolean;
};

const css = `
& .sms-consent {
  display: flex;
  align-items: center;
}

& .sms-consent-icon {
  width: 1.6rem;
  margin-left: .8rem;
}
`;
