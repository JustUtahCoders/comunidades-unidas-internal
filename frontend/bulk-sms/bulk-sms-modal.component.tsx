import React from "react";
import Modal from "../util/modal.component";
import easyFetch from "../util/easy-fetch";
import { showGrowl, GrowlType } from "../growls/growls.component";
import { useCss } from "kremling";

export default function BulkSmsModal(props: BulkSmsModalProps) {
  const [step, setStep] = React.useState<Step>(Step.intro);
  const [smsCheck, setSmsCheck] = React.useState(null);
  const [checkingSms, setCheckingSms] = React.useState(false);
  const [sendingTexts, setSendingTexts] = React.useState(false);
  const [smsBody, setSmsBody] = React.useState("");
  const scope = useCss(css);

  const primaryActions = {
    [Step.intro]() {
      setStep(Step.preview);
      setCheckingSms(true);
    },
    [Step.preview]() {
      setStep(Step.draft);
    },
    [Step.draft]() {
      if (smsBody.trim().length > 0) {
        setStep(Step.confirmation);
        setSendingTexts(true);
      }
    }
  };

  React.useEffect(() => {
    if (checkingSms) {
      const abortController = new AbortController();

      easyFetch(`/api/check-bulk-texts${window.location.search}`, {
        method: "POST",
        signal: abortController.signal
      }).then(data => {
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
          smsBody
        }
      })
        .then(data => {
          setSendingTexts(false);
          showGrowl({
            type: GrowlType.success,
            message: `Sent ${data.uniquePhoneNumbers.toLocaleString()} text messages.`
          });
        })
        .catch(err => {
          showGrowl({
            type: GrowlType.error,
            message: `Failed to send text messages`
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
          ? primaryText[step](smsCheck.uniquePhoneNumbers)
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
        return <div>You can send text messages to both clients and leads</div>;
      case Step.preview:
        return smsCheck ? (
          <>
            <div>Number of clients: {smsCheck.clientsMatched}</div>
            <div>Number of leads: {smsCheck.leadsMatched}</div>
            <div>
              Number of unique phone numbers: {smsCheck.uniquePhoneNumbers}
            </div>
          </>
        ) : (
          <div>Loading...</div>
        );
      case Step.draft:
        return (
          <textarea
            value={smsBody}
            onChange={evt => setSmsBody(evt.target.value)}
            placeholder="Put your bulk text here"
          />
        );
      case Step.confirmation:
        return (
          <div>
            {sendingTexts
              ? "Sending..."
              : `${smsCheck.uniquePhoneNumbers} text messages were sent!`}
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
  preview = "preview",
  draft = "draft",
  confirmation = "confirmation"
}

const headerText = {
  [Step.intro]: "Send a bulk text (SMS)",
  [Step.preview]: "Bulk text preview",
  [Step.draft]: "Draft text message",
  [Step.confirmation]: "Confirmation"
};

const primaryText: any = {
  [Step.intro]: "Begin",
  [Step.preview]: "Start text message",
  [Step.draft]: numPhones =>
    `Send ${numPhones.toLocaleString()} bulk text${numPhones > 1 ? "s" : ""}`,
  [Step.confirmation]: "Done"
};

const css = `
& textarea {
  width: 100%;
  height: 18rem;
}
`;
