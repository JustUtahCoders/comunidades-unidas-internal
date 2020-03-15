import React, { useReducer } from "react";
import { useFullWidth } from "../navbar/use-full-width.hook";
import { useCss } from "kremling";
import AddLeadsTable from "./add-leads-table.component";
import AddLeadStepHeader from "./add-lead-step-header.component";
import easyFetch from "../util/easy-fetch";
import { showGrowl, GrowlType } from "../growls/growls.component";
import imgUrl from "../../icons/148705-essential-collection/svg/archive.svg";
import { navigate } from "@reach/router";

let uniqueId = 0;

export default function AddLeadsStep(props: AddLeadsStepProps) {
  const scope = useCss(css);
  useFullWidth();
  const [event, setEvent] = React.useState(null);

  const [state, dispatch] = useReducer(reducer, {
    leads: [{ uuid: uniqueId }],
    isCreating: false
  });

  React.useEffect(() => {
    if (state.isCreating) {
      const abortController = new AbortController();

      const leads = state.leads.slice(0, state.leads.length - 1).map(l => ({
        dateOfSignUp: "2019-09-17",
        firstName: l.firstName,
        lastName: l.lastName,
        phone: l.phone,
        smsConsent: Boolean(l.smsConsent),
        zip: l.zip,
        age: l.age,
        gender: !l.gender || l.gender === "unknown" ? null : l.gender,
        eventSources: [props.eventId],
        leadServices: (l.leadServices || []).map(s => s.id)
      }));

      easyFetch(`/api/leads`, {
        method: "POST",
        signal: abortController.signal,
        body: leads
      })
        .then(() => {
          showGrowl({
            type: GrowlType.success,
            message: `${leads.length} lead${
              leads.length > 1 ? "s were" : " was"
            } created`
          });
          navigate(`/lead-list`);
        })
        .catch(err => {
          dispatch({ type: "doneCreating" });
          setTimeout(() => {
            throw err;
          });
        });

      return () => {
        abortController.abort();
      };
    }
  }, [state.isCreating]);

  React.useEffect(() => {
    const abortController = new AbortController();

    easyFetch(`/api/events/${props.eventId}`)
      .then(event => {
        setEvent(event);
      })
      .catch(err => {
        if (err.status === 404) {
          showGrowl({
            type: GrowlType.info,
            message: "Please select a valid event to add the leads to."
          });
          // @ts-ignore
          props.navigate(`/add-leads/event`);
        } else {
          setTimeout(() => {
            throw err;
          });
        }
      });

    return () => {
      abortController.abort();
    };
  }, [props.eventId]);

  return (
    <div {...scope}>
      <AddLeadStepHeader
        text={headerText()}
        imgSrc={imgUrl}
        imgAlt="Filing cabinet icon"
      />
      <form onSubmit={handleSubmit}>
        <div className="well">
          <AddLeadsTable
            leads={state.leads}
            deleteLead={index => dispatch({ type: "deleteLead", index })}
            updateLead={(index, field, value) =>
              dispatch({ type: "updateLead", index, field, value })
            }
          />
        </div>
        <div className="actions">
          <button type="button" className="secondary">
            Back
          </button>
          <button type="submit" className="primary">
            Create leads
          </button>
        </div>
      </form>
    </div>
  );

  function headerText() {
    return `Leads are people who have shown interest in CU but have not yet filled out the intake.`;
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch({ type: "createLeads" });
  }
}

function reducer(state, action) {
  let leads;
  switch (action.type) {
    case "updateLead":
      leads = [...state.leads];
      leads[action.index] = {
        ...leads[action.index],
        [action.field]: action.value
      };
      if (action.index === leads.length - 1) {
        leads.push({ uuid: ++uniqueId });
      }
      return {
        ...state,
        leads
      };
    case "deleteLead":
      leads = [...state.leads];
      leads.splice(action.index, 1);
      return {
        ...state,
        leads
      };
    case "createLeads":
      return {
        ...state,
        isCreating: true
      };
    case "doneCreating":
      return {
        ...state,
        isCreating: false
      };
    default:
      throw Error();
  }
}

type AddLeadsStepProps = {
  path: string;
  eventId?: string;
};

const css = `
& table {
  border-spacing: 0;
  table-layout: fixed;
}

& table td, & table th {
  border-collapse: collapse;
  padding: .4rem;
}

& .well {
  margin-top: 2.4rem;
  background-color: var(--colored-well);
  border-radius: .5rem;
  padding: .8rem;
}

& .actions {
  display: flex;
  justify-content: center;
  margin-top: 2.4rem;
}
`;
