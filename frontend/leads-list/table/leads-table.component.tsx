import React from "react";
import dateformat from "dateformat";
import { useIsMobile } from "../../util/use-is-mobile.hook";
import { LeadListLead } from "../lead-list.component";
import DesktopLeadsTable from "./desktop-leads-table.component";
import MobileLeadsTable from "./mobile-leads-table.component";

export default function LeadsTable(props: LeadsTableProps) {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileLeadsTable {...props} />
  ) : (
    <DesktopLeadsTable {...props} />
  );
}

export function determineLeadStatus(
  leadStatus,
  clientId,
  contactStage,
  inactivityReason
) {
  if (leadStatus === "convertedToClient") {
    return `Converted to client (see client #${clientId})`;
  } else if (leadStatus === "active") {
    if (contactStage.first === null) {
      return "Not yet contacted";
    } else {
      if (contactStage.second === null) {
        return `First contact attempt made on ${dateformat(
          contactStage.first,
          "m/d/yyyy"
        )}`;
      } else {
        if (contactStage.third === null) {
          return `Second contact attempt made on ${dateformat(
            contactStage.second,
            "m/d/yyyy"
          )}`;
        } else {
          return `Third contact attempt made on ${dateformat(
            contactStage.third,
            "m/d/yyyy"
          )}`;
        }
      }
    }
  } else if (leadStatus === "inactive") {
    switch (inactivityReason) {
      case "doNotCallRequest":
        return "Do not call request";
        break;
      case "threeAttemptsNoResponse":
        return "Three attempts made, no response";
        break;
      case "wrongNumber":
        return "Wrong number";
        break;
      case "noLongerInterested":
        return "No longer interested";
        break;
      case "relocated":
        return "No longer in Utah";
        break;
      default:
        return "Inactive - no reason provided";
        break;
    }
  } else {
    return "Status unknown";
  }
}

export function leadStatusColor(leadStatus) {
  if (leadStatus === "active") {
    return {
      color: "#000000"
    };
  } else if (leadStatus === "inactive") {
    return {
      color: "#B30000"
    };
  } else if (leadStatus === "convertedToClient") {
    return {
      color: "#006600"
    };
  }
}

export type LeadsTableProps = {
  leads: LeadListLead[];
  fetchingLeads: boolean;
  page: number;
};
