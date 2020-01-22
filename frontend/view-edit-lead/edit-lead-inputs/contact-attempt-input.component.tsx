import React from "react";
import dateformat from "dateformat";
import { useCss } from "kremling";
import editIcon from "../../../icons/148705-essential-collection/svg/edit.svg";
import cancelIcon from "../../../icons/148705-essential-collection/svg/add-1.svg";
import dayjs from "dayjs";

export default function ContactAttemptInput(props: ContactStatusInputProps) {
  const { contactAttempt, setContactAttempt } = props;
  const [editAttempt, setEditAttempt] = React.useState(false);

  const attemptDate = dayjs(contactAttempt);

  const scope = useCss(css);

  return (
    <tr {...scope}>
      <td className="attempt-name">{props.rowName}</td>
      {editAttempt ? (
        <td className="attempt-input">
          <div>
            <label>
              <input
                type="date"
                value={attemptDate.format("YYYY-MM-DD")}
                onChange={updateDate}
              />
              <input
                type="time"
                value={attemptDate.format("HH:mm")}
                onChange={updateTime}
              />
            </label>
            <img
              alt="cancel icon"
              className="cancel-icon"
              onClick={() => setEditAttempt(!editAttempt)}
              src={cancelIcon}
              title="cancel edit"
            />
          </div>
        </td>
      ) : (
        <td>
          {dateformat(contactAttempt, "mm/dd/yyyy hh:MM TT")}
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

  function updateDate(evt) {
    const [year, month, day] = evt.target.value.split("-");
    const date = new Date(contactAttempt);
    date.setFullYear(year, month - 1, day);
    setContactAttempt(date.toISOString());
  }

  function updateTime(evt) {
    const [hours, mins] = evt.target.value.split(":");
    const date = new Date(contactAttempt);
    date.setHours(hours, mins);
    setContactAttempt(date.toISOString());
  }
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
