import React from "react";
import BasicTableReport from "../../reports/shared/basic-table-report.component";
import { SingleEvent } from "../view-event.component";
import EventSection from "./event-section.component";

export default function ViewEditEventMaterials(
  props: ViewEditEventMaterialsProps
) {
  return (
    <EventSection title="Materials Distributed">
      {props.event.materialsDistributed.length > 0 ? (
        <BasicTableReport
          headerRows={
            <>
              <tr>
                <th>Material</th>
                <th>Quantity Distributed</th>
              </tr>
            </>
          }
          contentRows={
            <>
              {props.event.materialsDistributed.map((m) => (
                <tr key={m.materialId}>
                  <td>{m.name}</td>
                  <td>{m.quantityDistributed.toLocaleString()}</td>
                </tr>
              ))}
            </>
          }
        />
      ) : (
        <h5>(No materials distributed)</h5>
      )}
    </EventSection>
  );
}

type ViewEditEventMaterialsProps = {
  event: SingleEvent;
  eventUpdated(event: SingleEvent): void;
};
