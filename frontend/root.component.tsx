import React from "react";
import { Router } from "@reach/router";
import AddClient from "./add-client/add-client.component";
import Navbars from "./navbar/navbars.component";
import Styleguide from "./styleguide.component";
import PageLoader from "./util/page-loader.component";
import UserContext from "./util/user.context";
import "form-request-submit-polyfill";
import UserModeContext from "./util/user-mode.context";
import Growls from "./growls/growls.component";
import AdminSettings from "./admin/admin-settings.component";
import Partners from "./admin/partners/partners.component";
import UserPermissions from "./admin/user-permissions/user-permissions.component";

const Home = React.lazy(() => import("./home/home.component"));
const ReportIssue = React.lazy(
  () => import("./report-issue/report-issue.component")
);
const ReportIssueSuccess = React.lazy(
  () => import("./report-issue/report-issue-success.component")
);
const ViewClient = React.lazy(
  () => import("./view-edit-client/view-client.component")
);
const ClientList = React.lazy(
  () => import("./client-list/client-list.component")
);
const AddCaseNote = React.lazy(
  () => import("./view-edit-client/case-notes/add-case-note.component")
);
const AddClientInteraction = React.lazy(
  () =>
    import("./view-edit-client/interactions/add-client-interaction.component")
);
const AddLeads = React.lazy(() => import("./add-leads/add-leads.component"));
const LeadList = React.lazy(() => import("./leads-list/lead-list.component"));
const ViewLead = React.lazy(
  () => import("./view-edit-lead/view-lead.component")
);
const Reports = React.lazy(() => import("./reports/reports.components"));
const NotFound = React.lazy(() => import("./not-found/not-found.component"));
const ViewEvent = React.lazy(
  () => import("./view-edit-events/view-event.component")
);
const EventList = React.lazy(() => import("./event-list/event-list.component"));
const ConvertLead = React.lazy(
  () => import("./view-edit-lead/convert-lead-to-client.component")
);
const ProgramsAndServices = React.lazy(
  () => import("./programs-and-services/programs-and-services.component")
);
const DetachedInvoices = React.lazy(
  () => import("./view-edit-client/invoices/detached-invoices.component")
);

export default function Root() {
  return (
    <UserContext>
      <UserModeContext>
        <Styleguide>
          <Navbars>
            <React.Suspense fallback={<PageLoader />}>
              <Router basepath="/" primary>
                <NotFound path="*" />
                <Home path="/" />
                <AddClient path="add-client" />
                <ClientList path="client-list" />
                <AddClientInteraction
                  isGlobalAdd
                  path="add-client-interaction"
                />
                <ViewClient path="clients/:clientId/*" />
                <AddCaseNote isGlobalAdd path="add-case-note" />
                <LeadList path="lead-list" />
                <ViewLead path="leads/:leadId" />
                <ConvertLead path="leads/:leadId/convert-to-client" />
                <ReportIssue path="report-issue" />
                <ReportIssueSuccess path="report-issue/:issueId" />
                <AddLeads path="add-leads/*" />
                <Reports path="reports/*" />
                <ViewEvent path="events/:eventId" />
                <EventList path="event-list" />
                <AdminSettings path="admin-settings" />
                <ProgramsAndServices path="programs-and-services" />
                <Partners path="partners" />
                <UserPermissions path="user-permissions" />
                <DetachedInvoices path="invoices" />
              </Router>
            </React.Suspense>
          </Navbars>
          <Growls />
        </Styleguide>
      </UserModeContext>
    </UserContext>
  );
}
