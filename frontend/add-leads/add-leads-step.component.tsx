import React, { useReducer } from "react";
import { useFullWidth } from "../navbar/use-full-width.hook";
import { useCss } from "kremling";
import AddLeadsTable from "./add-leads-table.component";
import AddLeadStepHeader from "./add-lead-step-header.component";
import easyFetch from "../util/easy-fetch";
import { showGrowl, GrowlType } from "../growls/growls.component";
import dayjs from "dayjs";
import imgUrl from "../../icons/148705-essential-collection/svg/archive.svg";

let uniqueId = 0;

export default function AddLeadsStep(props: AddLeadsStepProps) {
  const scope = useCss(css);
  useFullWidth();
  const [event, setEvent] = React.useState(null);

  const [state, dispatch] = useReducer(reducer, {
    leads: [{ uuid: uniqueId }]
  });

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
        imgAlt="Icon of a woman's face"
      />
      <AddLeadsTable
        leads={state.leads}
        deleteLead={index => dispatch({ type: "deleteLead", index })}
        updateLead={(index, field, value) =>
          dispatch({ type: "updateLead", index, field, value })
        }
      />
    </div>
  );

  function headerText() {
    return `Leads are people who have shown interest in CU but have not yet filled out the intake.`;
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
    padding: 0;
  }
`;
