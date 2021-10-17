import React from "react";
import PageHeader from "../../page-header.component";
import easyFetch from "../../util/easy-fetch";
import { handlePromiseError } from "../../util/error-helpers";
import IntakeSetting, { IntakeQuestion } from "./intake-setting.component";
import css from "./client-intake-settings.css";
import { useCss } from "kremling";
import { GrowlType, showGrowl } from "../../growls/growls.component";

export default function ClientIntakeSettings(props) {
  const [intakeSettings, setIntakeSettings] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    const ac = new AbortController();

    easyFetch(`/api/client-intake-questions`, {
      signal: ac.signal,
    })
      .then((d) => setIntakeSettings(d.sections))
      .catch(handlePromiseError);

    return () => {
      ac.abort();
    };
  }, []);

  React.useEffect(() => {
    if (isSaving) {
      const ac = new AbortController();

      easyFetch(`/api/client-intake-questions`, {
        method: "PUT",
        signal: ac.signal,
        body: {
          sections: intakeSettings,
        },
      })
        .then(() => {
          showGrowl({
            type: GrowlType.success,
            message: "Client Intake updated!",
          });
        })
        .catch(handlePromiseError)
        .finally(() => {
          setIsSaving(false);
        });

      return () => {
        ac.abort();
      };
    }
  }, [isSaving]);

  return (
    <>
      <PageHeader title="Client Intake Settings" />
      <div className="card" {...useCss(css)}>
        <div className="actions">
          <button
            type="button"
            className="primary"
            disabled={!intakeSettings}
            onClick={() => setIsSaving(true)}
          >
            Save Changes
          </button>
        </div>
        {intakeSettings ? (
          Object.keys(intakeSettings).map((setting) => {
            const questions = intakeSettings[setting];
            return (
              <IntakeSetting
                key={setting}
                name={setting}
                questions={questions}
                reorder={reorder}
                updateQuestion={updateQuestion}
              />
            );

            function reorder(sourceIndex: number, destIndex: number) {
              const newQuestions = [...questions];
              const [removedItem] = newQuestions.splice(sourceIndex, 1);
              newQuestions.splice(destIndex, 0, removedItem);
              setIntakeSettings({
                ...intakeSettings,
                [setting]: newQuestions,
              });
            }

            function updateQuestion(index: number, question: IntakeQuestion) {
              const newQuestions = [...questions];
              newQuestions.splice(index, 1, question);
              setIntakeSettings({
                ...intakeSettings,
                [setting]: newQuestions,
              });
            }
          })
        ) : (
          <div>Loading intake settings...</div>
        )}
      </div>
    </>
  );
}

export interface ClientIntakeSettings {
  [section: string]: IntakeQuestion[];
}
