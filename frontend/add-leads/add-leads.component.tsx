import React from "react";
import AddEventStep from "./add-event-step.component";
import AddLeadsStep from "./add-leads-step.component";
import ReportIssue from "../report-issue/report-issue.component";
import PageHeader from "../page-header.component";

export default function AddLeads(props: AddLeadsProps) {
  const [state, dispatch] = React.useReducer(reducer, { step: Step.addEvent });
  const featureEnabled = localStorage.getItem("leads");
  const StepComponent = StepComponents[Step[state.step]];

  let content: JSX.Element = null;
  if (!featureEnabled) {
    content = <ReportIssue missingFeature hideHeader />;
  } else if (Step) {
    content = <StepComponent />;
  }

  return (
    <>
      <PageHeader title="Add new leads" />
      <div className="card">{content}</div>
    </>
  );
}

function reducer(state: AddLeadsState, action: AddLeadsAction) {
  switch (action.type) {
    case ActionTypes.changeStep:
      return { ...state, step: action.step };
    default:
      throw Error();
  }
}

type AddLeadsState = {
  step: Step;
};

type AddLeadsProps = {
  path: string;
};

type AddLeadsAction = ChangeStep;

type ChangeStep = {
  type: ActionTypes.changeStep;
  step: Step;
};

enum ActionTypes {
  changeStep = "changeStep"
}

enum Step {
  addEvent = "addEvent",
  addLeads = "addLeads"
}

const StepComponents = {
  [Step.addEvent]: AddEventStep,
  [Step.addLeads]: AddLeadsStep
};
