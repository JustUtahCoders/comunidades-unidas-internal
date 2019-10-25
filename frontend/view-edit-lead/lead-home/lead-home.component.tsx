import React from "react";
import { SingleLead } from "../view-lead.component";

export default function LeadHome(props: LeadHomeProps) {
  return <div style={{ marginBottom: "3.2rem" }}></div>;
}

type LeadHomeProps = {
  path: string;
  lead: SingleLead;
  setLead(newLead: SingleLead): any;
};
