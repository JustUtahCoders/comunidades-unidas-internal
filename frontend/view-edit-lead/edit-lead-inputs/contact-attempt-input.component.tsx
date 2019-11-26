import React from "react";
import dateformat from "dateformat";
import { useCss } from "kremling";
import DateInput from "../../util/date-input.component";
import editIcon from "../../../icons/148705-essential-collection/svg/edit.svg";
import cancelIcon from "../../../icons/148705-essential-collection/svg/add-1.svg";

export default function ContactStatusInput(props: ContactStatusInputProps) {
  const { contactAttempt } = props;
  const [editAttempt, setEditAttempt] = React.useState(false);
  console.log("contact attempt input");
  console.log(contactAttempt);

  const scope = useCss(css);

  return (
    <tr {...scope}>
      <td className="attempt-name">{props.rowName}</td>
      {editAttempt ? (
        <td className="attempt-input">
          <DateInput date={props.contactAttempt} labelName="" withTime={true} />
          <img
            alt="cancel icon"
            className="cancel-icon"
            onClick={() => setEditAttempt(!editAttempt)}
            src={cancelIcon}
            title="cancel edit"
          />
        </td>
      ) : (
        <td>
          {dateformat(contactAttempt, "mm/dd/yyyy hh:MM:ss")}
          <img
            alt="edit icon"
            className="edit-icon"
            onClick={() => setEditAttempt(!editAttempt)}
            src={editIcon}
          />
        </td>
      )}
    </tr>
  );
}

const css = `
	& .attempt-name {
		border-right: var(--light-gray) solid 1px;
	}	

	& .edit-icon {
		height: 1.5rem;
		filter: invert(70%) opacity(50%);
		margin-left: 1rem;
	}

	& .edit-icon:hover {
		filter: invert(70%) opacity(100%);
	}

	& .cancel-icon {
		height: 1.5rem;
		filter: hue-rotate(75deg);
		opacity: 50%;
		transform: rotate(45deg);
		margin-left: 1rem;
	}

	& .cancel-icon:hover {
		filter: hue-rotate(75deg);
		opacity: 100%;
	}

	& .attempt-input {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
`;

type ContactStatusInputProps = {
  contactAttempt?: string;
  setContactAttempt(contactAttempt);
  rowName?: string;
};
