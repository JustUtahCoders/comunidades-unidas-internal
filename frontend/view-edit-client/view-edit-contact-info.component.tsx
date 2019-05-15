import React from "react";
import ClientSection from "./client-section.component";
import { SingleClient } from "./view-client.component";
import { useCss } from "kremling";
import editImg from "../../icons/148705-essential-collection/svg/edit.svg";

export default function ViewEditContactInfo(props: ViewEditContactInfoProps) {
  const scope = useCss(css);
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <ClientSection title="Contact information">
      {isEditing ? (
        <div>Editing</div>
      ) : (
        <div {...scope} className="contact-information">
          <div>
            <div>{props.client.homeAddress.street}</div>
            <div>
              {props.client.homeAddress.city}, {props.client.homeAddress.state}{" "}
              {props.client.homeAddress.zip}
            </div>
            <div>{formattedPhone()}</div>
            <div>{props.client.email}</div>
          </div>
          <div>
            <button className="icon" onClick={() => setIsEditing(true)}>
              <img src={editImg} alt="Edit Basic Information" />
            </button>
          </div>
        </div>
      )}
    </ClientSection>
  );

  function formattedPhone() {
    const { phone } = props.client;
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
}

type ViewEditContactInfoProps = {
  client: SingleClient;
  clientUpdated(newClient: SingleClient): void;
};

const css = `
& .contact-information {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
}
`;
