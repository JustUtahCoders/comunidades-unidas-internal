import React from "react";
import PageHeader from "../page-header.component";
import { useFullWidth } from "../navbar/use-full-width.hook";
import { Router, Redirect } from "@reach/router";
import SelectReport from "./select-report.component";
import { useCss } from "kremling";
import InteractionHoursByClientParams from "./interaction-hours-by-client/interaction-hours-by-client-params.component";
import InteractionHoursByClientResults from "./interaction-hours-by-client/interaction-hours-by-client-results.component";
import InteractionsByServiceParams from "./interactions-by-service/interactions-by-service-params.component";
import InteractionsByServiceResults from "./interactions-by-service/interactions-by-service-results.component";
import PovertyLineParams from "./poverty-line/poverty-line-params.component";
import PovertyLineResults from "./poverty-line/poverty-line-results.component";
import EnglishLevelsParams from "./english-levels/english-levels-params.component";
import EnglishLevelsResults from "./english-levels/english-levels-results.component";
import CountryOfOriginParams from "./country-of-origin/country-of-origin-params.component";
import CountryOfOriginResults from "./country-of-origin/country-of-origin-results.component";
import ClientSourcesParams from "./client-sources/client-sources-params.component";
import ClientSourcesResults from "./client-sources/client-sources-results.component";
import AgesAndGendersParams from "./ages-and-genders/ages-and-genders-params.component";
import AgesAndGendersResults from "./ages-and-genders/ages-and-genders-results.components";
import ClientZipcodeParams from "./client-zipcode/client-zipcode-params.component";
import ClientZipcodeResults from "./client-zipcode/client-zipcode-results.component";
import ServiceInterestsParams from "./service-interests/service-interests-params.component";
import ServiceInterestsResults from "./service-interests/service-interests-results.component";
import OutstandingInvoicesParams from "./outstanding-invoices/outstanding-invoices-params.component";
import OutstandingInvoicesResults from "./outstanding-invoices/outstanding-invoices-results.component";
import RevenueByServiceParams from "./revenue-by-service/revenue-by-service-params.component";
import RevenueByServiceResults from "./revenue-by-service/revenue-by-service-results.component";
import ReferralsByServiceParams from "./referrals-by-service/referrals-by-service-params.component";
import ReferralsByServiceResults from "./referrals-by-service/referrals-by-service-results.component";
import CustomInteractionQuestionParams from "./custom-interaction-questions/custom-interaction-questions-params.component";
import CustomInteractionQuestionResults from "./custom-interaction-questions/custom-interaction-questions-results.component";
import EventAttendanceParams from "./event-attendance/event-attendance-params.component";
import EventAttendanceResults from "./event-attendance/event-attendance-results.component";

export default function Reports(props: ReportsProps) {
  useFullWidth();
  const scope = useCss(css);

  return (
    <>
      <PageHeader title="Reports" fullScreen />
      <div className="card padding-0" {...scope}>
        <SelectReport>
          <Router>
            <Redirect
              from="/"
              to="/reports/interaction-hours-by-client"
              replace
              noThrow
            />
            <InteractionHoursByClientParams
              path="interaction-hours-by-client"
              title="Interaction Hours By Client"
            />
            <InteractionHoursByClientResults path="interaction-hours-by-client/results" />
            <InteractionsByServiceParams
              path="interactions-by-service"
              title="Interactions by Program / Service"
            />
            <InteractionsByServiceResults path="interactions-by-service/results" />
            <ServiceInterestsParams
              path="service-interests"
              title="Interest in Programs / Services"
            />
            <ServiceInterestsResults path="service-interests/results" />
            <PovertyLineParams
              path="poverty-line"
              title="Client Poverty Line"
            />
            <PovertyLineResults path="poverty-line/results" />
            <EnglishLevelsParams
              path="english-levels"
              title="Client English Levels"
            />
            <EnglishLevelsResults path="english-levels/results" />
            <CountryOfOriginParams
              path="countries-of-origin"
              title="Client Countries of Origin"
            />
            <CountryOfOriginResults path="countries-of-origin/results" />
            <ClientSourcesParams path="client-sources" title="Client Sources" />
            <ClientSourcesResults path="client-sources/results" />
            <AgesAndGendersParams
              path="ages-and-genders"
              title="Ages and Genders"
            />
            <AgesAndGendersResults path="ages-and-genders/results" />
            <ClientZipcodeParams
              path="client-zipcodes"
              title="Client Zip Codes"
            />
            <ClientZipcodeResults path="client-zipcodes/results" />
            <OutstandingInvoicesParams
              path="outstanding-invoices"
              title="Outstanding Invoices"
            />
            <OutstandingInvoicesResults path="outstanding-invoices/results" />
            <RevenueByServiceParams
              path="revenue-by-service"
              title="Revenue By Programs / Services"
            />
            <RevenueByServiceResults path="revenue-by-service/results" />
            <ReferralsByServiceParams
              path="referrals-by-service"
              title="Referrals By Service"
            />
            <ReferralsByServiceResults path="referrals-by-service/results" />
            <CustomInteractionQuestionParams
              path="custom-interaction-questions"
              title="Custom Interaction Questions"
            />
            <CustomInteractionQuestionResults path="custom-interaction-questions/results" />
            <EventAttendanceParams
              path="event-attendance"
              title="Event Attendance"
            />
            <EventAttendanceResults path="event-attendance/results" />
          </Router>
        </SelectReport>
      </div>
    </>
  );
}

type ReportsProps = {
  path: string;
};

const css = `
& .report-input {
  display: flex;
  align-items: center;
  padding: 1.6rem 3.2rem 0 3.2rem;
}

& .report-input label {
  margin-right: .8rem;
}

& .report-input.indent {
  margin-left: 2.4rem;
}

& .report-input input[type=number] {
  width: 8rem;
}

& .actions {
  display: flex;
  justify-content: center;
  padding: 1.6rem 0;
}
`;
