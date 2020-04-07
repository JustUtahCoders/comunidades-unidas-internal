import React from "react";
import Modal from "../util/modal.component";
import easyFetch from "../util/easy-fetch";
import { showGrowl, GrowlType } from "../growls/growls.component";
import { useCss } from "kremling";
import queryString from "query-string";
import { startCase, entries } from "lodash-es";

export default function BulkSmsModal(props: BulkSmsModalProps) {
  const [step, setStep] = React.useState<Step>(Step.intro);
  const [smsCheck, setSmsCheck] = React.useState(null);
  const [checkingSms, setCheckingSms] = React.useState(false);
  const [sendingTexts, setSendingTexts] = React.useState(false);
  const [smsBody, setSmsBody] = React.useState("");
  const scope = useCss(css);

  const primaryActions = {
    [Step.intro]() {
      setStep(Step.query);
    },
    [Step.query]() {
      setStep(Step.previewRecipients);
      setCheckingSms(true);
    },
    [Step.previewRecipients]() {
      if (!smsCheck || smsCheck.recipients.uniquePhoneNumbers === 0) {
        props.close();
      } else {
        setStep(Step.draft);
      }
    },
    [Step.draft]() {
      if (smsBody.trim().length > 0) {
        setStep(Step.previewMessage);
      }
    },
    [Step.previewMessage]() {
      setStep(Step.confirmation);
      setSendingTexts(true);
    },
    [Step.confirmation]() {
      props.close();
    },
  };

  React.useEffect(() => {
    if (checkingSms) {
      const abortController = new AbortController();

      easyFetch(`/api/check-bulk-texts${window.location.search}`, {
        method: "POST",
        signal: abortController.signal,
      }).then((data) => {
        setSmsCheck(data);
        setCheckingSms(false);
      });

      return () => {
        abortController.abort();
      };
    }
  }, [checkingSms]);

  React.useEffect(() => {
    if (sendingTexts) {
      const abortController = new AbortController();

      easyFetch(`/api/bulk-texts${window.location.search}`, {
        method: "POST",
        signal: abortController.signal,
        body: {
          smsBody,
        },
      })
        .then((data) => {
          setSendingTexts(false);
          showGrowl({
            type: GrowlType.success,
            message: `Sent ${data.recipients.uniquePhoneNumbers.toLocaleString()} text messages.`,
          });
        })
        .catch((err) => {
          showGrowl({
            type: GrowlType.error,
            message: `Failed to send text messages`,
          });
        });

      return () => {
        abortController.abort();
      };
    }
  }, [sendingTexts]);

  return (
    <Modal
      close={props.close}
      headerText={headerText[step]}
      primaryText={
        typeof primaryText[step] === "function"
          ? primaryText[step](
              smsCheck ? smsCheck.recipients.uniquePhoneNumbers : 0
            )
          : primaryText[step]
      }
      primaryAction={primaryActions[step]}
    >
      <div {...scope}>{content(step)}</div>
    </Modal>
  );

  function content(step: Step) {
    switch (step) {
      case Step.intro:
        return (
          <>
            <p>Bulk text messages are sent to both clients and leads.</p>
            <p>
              You can choose which people receive the text message by doing an
              Advanced Search. The clients and leads who will receive the text
              message are those who (1) indicated that they want to receive text
              messages and (2) match the Advanced Search.
            </p>
            <p>
              You do not need to click on any checkboxes - all clients and leads
              that match the search and want to receive texts will receive the
              text.
            </p>
            <p>
              If you would like to see a new way of selecting clients and leads,
              please file an issue.
            </p>
          </>
        );
      case Step.query:
        const queryValues = queryString.parse(window.location.search);
        delete queryValues.sortField;
        delete queryValues.sortOrder;
        delete queryValues.page;
        return (
          <>
            <p>Does the following Advanced Search look correct?</p>
            {Object.keys(queryValues).length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Search value</th>
                  </tr>
                </thead>
                <tbody>
                  {entries(queryValues).map((entry) => {
                    const [name, value] = entry;
                    return (
                      <tr key={name}>
                        <td>{startCase(name)}</td>
                        <td>{value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="warning-all">All clients and leads are selected</p>
            )}
          </>
        );
      case Step.previewRecipients:
        if (!smsCheck) return <div>Loading...</div>;

        return (
          <>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Clients</th>
                  <th>Leads</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Advanced Search:</th>
                  <td>{smsCheck.searchMatch.clients.toLocaleString()}</td>
                  <td>{smsCheck.searchMatch.leads.toLocaleString()}</td>
                </tr>
                <tr>
                  <th>And have phone</th>
                  <td>{smsCheck.withPhone.clients.toLocaleString()}</td>
                  <td>{smsCheck.withPhone.leads.toLocaleString()}</td>
                </tr>
                <tr>
                  <th>And have given SMS consent</th>
                  <td>{smsCheck.recipients.clients.toLocaleString()}</td>
                  <td>{smsCheck.recipients.leads.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <p className="warning-all">
              {smsCheck.recipients.uniquePhoneNumbers.toLocaleString()} unique
              phone number
              {smsCheck.recipients.uniquePhoneNumbers === 1 ? "" : "s"} will
              receive a text.
            </p>
          </>
        );
      case Step.draft:
        return (
          <>
            <div className="bulk-text-content-top">
              <label htmlFor="bulk-text-content">
                Write your bulk text here.
              </label>
              <div>{smsBody.length} characters</div>
            </div>
            <textarea
              id="bulk-text-content"
              value={smsBody}
              onChange={(evt) => setSmsBody(evt.target.value)}
              placeholder="Put your bulk text here"
            />
          </>
        );
      case Step.previewMessage:
        return (
          <>
            <p className="preview-message">
              You are about to send a bulk text message to the following people:
            </p>
            <p>{smsCheck.recipients.clients.toLocaleString()} Client(s)</p>
            <p>{smsCheck.recipients.leads.toLocaleString()} Lead(s)</p>
            <p>
              {smsCheck.recipients.uniquePhoneNumbers.toLocaleString()} unique
              phone number(s)
            </p>
            <h3>Message</h3>
            <p>{smsBody}</p>
          </>
        );
      case Step.confirmation:
        return (
          <div>
            {sendingTexts
              ? "Sending..."
              : `${smsCheck.recipients.uniquePhoneNumbers} text messages were sent!`}
          </div>
        );
      default:
        throw Error();
    }
  }
}

type BulkSmsModalProps = {
  close(shouldRefetch?: boolean): any;
};

enum Step {
  intro = "intro",
  query = "query",
  previewRecipients = "previewRecipients",
  draft = "draft",
  previewMessage = "previewMessage",
  confirmation = "confirmation",
}

const headerText = {
  [Step.intro]: "Send a bulk text (SMS)",
  [Step.query]: "Confirm Advanced Search",
  [Step.previewRecipients]: "Bulk text recipients",
  [Step.draft]: "Draft text message",
  [Step.previewMessage]: "Preview",
  [Step.confirmation]: "Confirmation",
};

const primaryText: any = {
  [Step.intro]: "Begin",
  [Step.query]: "Next step",
  [Step.previewRecipients]: (numPhones) =>
    numPhones === 0 ? "Change search" : "Next step",
  [Step.draft]: "Preview message",
  [Step.previewMessage]: (numPhones) =>
    `Send ${numPhones.toLocaleString()} bulk text${numPhones > 1 ? "s" : ""}`,
  [Step.confirmation]: "Done",
};

const css = `
& textarea {
  width: 100%;
  height: 18rem;
}

& .warning-all {
  text-decoration: underline;
  font-style: italic;
  color: var(--brand-color);
  text-align: center;
}

& table {
  margin: 0 auto;
}

& table td, & table th {
  padding: .8rem;
  text-align: center;
}

& #bulk-text-content {
  margin: .8rem 0;
  padding: .8rem;
}

& .bulk-text-content-top {
  display: flex;
  justify-content: space-between;
}

& .preview-message {
  font-style: italic;
}
`;
