import { useCss } from "kremling";
import React from "react";
import PageHeader from "../../page-header.component";
import BasicTableReport from "../../reports/shared/basic-table-report.component";
import CollapsibleTableRows, {
  ToggleCollapseButton,
} from "../../reports/shared/collapsible-table-rows.component";
import easyFetch from "../../util/easy-fetch";
import {
  LoggedInUser,
  UserAccessLevel,
  UserContext,
} from "../../util/user.context";
import CreateNewPartnerService from "./create-new-partner-service.component";
import CreateNewPartner from "./create-new-partner.component";
import EditablePartnerRow from "./editable-partner-row.component";
import EditablePartnerServiceRow from "./editable-partner-service-row.component";
import { formatPhone } from "../../util/formatters";
import css from "./partners.css";

export default function Partners(props) {
  const [showNewPartnerModal, setShowNewPartnerModal] = React.useState(false);
  const [showNewServiceModal, setShowNewServiceModal] = React.useState(false);
  const [shouldRefetchPartners, setShouldRefetchPartners] = React.useState(
    true
  );
  const [partners, setPartners] = React.useState<FullPartner[]>([]);
  const user = React.useContext<LoggedInUser>(UserContext);
  const canEdit = user.accessLevel === UserAccessLevel.Administrator;

  React.useEffect(() => {
    if (shouldRefetchPartners) {
      const ac = new AbortController();

      easyFetch(`/api/partners?includeInactive=true`, { signal: ac.signal })
        .then(setPartners)
        .catch((err) => {
          setTimeout(() => {
            throw err;
          });
        })
        .finally(() => {
          setShouldRefetchPartners(false);
        });

      return () => {
        ac.abort();
      };
    }
  }, [shouldRefetchPartners]);

  return (
    <>
      <PageHeader title="Partners" />
      <div className="card" {...useCss(css)}>
        <p>
          This is a list of all Comunidades Unidas partners and the services
          they provide. A partner is an external organization that provides
          direct services to clients. Comunidades Unidas sends referrals to
          these partners.
        </p>
        {canEdit && (
          <div className="actions">
            <button
              className="secondary"
              onClick={() => setShowNewPartnerModal(true)}
            >
              New Partner
            </button>
            <button
              className="primary"
              onClick={() => setShowNewServiceModal(true)}
            >
              New Partner Service
            </button>
          </div>
        )}
        <BasicTableReport
          tableStyle={{ width: "100%" }}
          headerRows={
            <tr>
              <th>Partner</th>
              <th>Service</th>
              <th style={{ minWidth: "18%", maxWidth: "18%", width: "18%" }}>
                Active?
              </th>
              <th>Phone</th>
            </tr>
          }
          contentRows={
            <>
              {partners.map((partner) => (
                <CollapsibleTableRows
                  key={partner.id}
                  onlyButtonClick
                  everpresentRow={
                    <EditablePartnerRow
                      canEdit={canEdit}
                      partner={partner}
                      refetch={refetch}
                    >
                      <td>{partner.name}</td>
                      <td>
                        <ToggleCollapseButton />
                      </td>
                      <td>{checkmark(partner.isActive)}</td>
                      <td>
                        {partner.phone ? formatPhone(partner.phone) : "—"}
                      </td>
                    </EditablePartnerRow>
                  }
                  collapsibleRows={partner.services.map((service) => (
                    <EditablePartnerServiceRow
                      key={service.id}
                      canEdit={canEdit}
                      partnerId={partner.id}
                      partnerService={service}
                      refetch={refetch}
                    >
                      <td>&mdash;</td>
                      <td>{service.name}</td>
                      <td>{checkmark(service.isActive)}</td>
                    </EditablePartnerServiceRow>
                  ))}
                />
              ))}
            </>
          }
        />
      </div>
      {showNewPartnerModal && (
        <CreateNewPartner
          close={() => setShowNewPartnerModal(false)}
          refetch={refetch}
        />
      )}
      {showNewServiceModal && (
        <CreateNewPartnerService
          close={() => setShowNewServiceModal(false)}
          refetch={refetch}
          partners={partners}
        />
      )}
    </>
  );

  function refetch() {
    setShouldRefetchPartners(true);
  }
}

function checkmark(condition) {
  return (
    <div style={{ fontSize: "3.2rem", color: condition ? "green" : "red" }}>
      {condition ? "\u2611" : "\u2612"}
    </div>
  );
}

export type FullPartner = Partner & {
  services: PartnerService[];
};

export type Partner = NewPartner & {
  id: number;
  dateAdded: string;
  addedBy: number;
  dateModified: string;
  modifiedBy: number;
};

export type NewPartner = {
  name: string;
  isActive: boolean;
  phone: string;
};

export type NewPartnerService = {
  name: string;
  isActive: boolean;
};

export type PartnerService = NewPartnerService & {
  id: number;
  dateAdded: string;
  addedBy: number;
  dateModified: string;
  modifiedBy: number;
};
