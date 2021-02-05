import React from "react";
import { InvoiceStatus } from "./client-invoices.component";
import { SingleClient } from "../view-client.component";
import userIconUrl from "../../../icons/148705-essential-collection/svg/user.svg";
import { useCss } from "kremling";
import css from "./edit-invoice.css";
import { CUService } from "../../add-client/services.component";
import { groupBy, cloneDeep, sumBy, padStart } from "lodash-es";
import CloseIconButton from "../../util/close-icon-button.component";
import dayjs from "dayjs";
import FullRichTextEditor from "../../rich-text/full-rich-text-editor.component";
import MultiClientSelect, {
  MultiClientSelectRef,
} from "../../util/multi-client-select.component";

const EditInvoice = React.forwardRef(function (props: EditInvoiceProps, ref) {
  const [newLineItems, setNewLineItems] = React.useState<Array<LineItem>>(() =>
    props.invoice.lineItems.length === 0 ? [emptyLineItem()] : []
  );
  const [modifiedInvoice, setModifiedInvoice] = React.useState(() =>
    cloneDeep(props.invoice)
  );
  const subtotal = sumBy(
    modifiedInvoice.lineItems.concat(newLineItems),
    (li) => li.rate * li.quantity || 0
  );
  const [totalOwed, setTotalOwed] = React.useState(subtotal);
  const groupedServices = groupBy(props.services, "programName");
  const richTextRef = React.useRef(null);
  const clientRef = React.useRef<MultiClientSelectRef>();

  React.useImperativeHandle(ref, () => ({
    getInvoiceToSave,
    getInvoiceId() {
      return props.invoice.id;
    },
  }));

  React.useEffect(() => {
    setTotalOwed(subtotal);
  }, [subtotal]);

  const totalPaid = sumBy(modifiedInvoice.payments, "amountTowardsInvoice");

  return (
    <div {...useCss(css)}>
      <div className="header">
        {props.isDetached ? (
          <div className="clients input-block">
            <label htmlFor="detached-client-name">Bill To:</label>
            <input
              type="text"
              value={modifiedInvoice.billTo || ""}
              onChange={(evt) =>
                setModifiedInvoice({
                  ...modifiedInvoice,
                  billTo: evt.target.value,
                })
              }
            />
          </div>
        ) : (
          <div className="clients input-block">
            <MultiClientSelect
              initialClients={props.clients || []}
              ref={clientRef}
            />
          </div>
        )}
        <div className="input-block">
          <label htmlFor="invoice-number">Invoice #</label>
          <input
            required
            type="text"
            id="invoice-number"
            autoComplete="new-password"
            value={modifiedInvoice.invoiceNumber}
            onChange={(evt) =>
              setModifiedInvoice({
                ...modifiedInvoice,
                invoiceNumber: evt.target.value,
              })
            }
          />
        </div>
        <div className="input-block">
          <label htmlFor="invoice-date">Invoice Date</label>
          <input
            required
            type="date"
            id="invoice-date"
            autoComplete="new-password"
            value={dayjs(modifiedInvoice.invoiceDate).format("YYYY-MM-DD")}
            onChange={(evt) =>
              setModifiedInvoice({
                ...modifiedInvoice,
                invoiceDate: evt.target.value,
              })
            }
          />
        </div>
      </div>
      <div className="line-items">
        <table>
          <thead>
            <tr>
              <th style={{ width: "15%" }}>Service</th>
              <th style={{ width: "25%" }}>Name</th>
              <th style={{ width: "30%" }}>Description</th>
              <th style={{ width: "7%", textAlign: "center" }}>Qty</th>
              <th style={{ width: "10%", textAlign: "center" }}>Rate</th>
              <th style={{ width: "13%", textAlign: "center" }}>Amount</th>
              <th style={{ width: "5%" }}></th>
            </tr>
          </thead>
          <tbody>
            {modifiedInvoice.lineItems.map((li, i) =>
              renderLineItem(
                modifiedInvoice.lineItems,
                setModifiedLineItems,
                li,
                i
              )
            )}
            {newLineItems.map((li, i) =>
              renderLineItem(newLineItems, setNewLineItems, li, i)
            )}
          </tbody>
          <tfoot>
            {props.isEditing ? (
              <>
                {subtotalRows()}
                <tr>
                  <td colSpan={5} style={{ textAlign: "end" }}>
                    Total Paid:
                  </td>
                  <td style={{ textAlign: "center" }}>
                    ${totalPaid.toFixed(2)}
                  </td>
                </tr>
                <tr>{totalOwedRows(5)}</tr>
                <tr>
                  <td colSpan={4} style={{ textAlign: "start" }}>
                    <button
                      className="secondary"
                      type="button"
                      onClick={addLineItem}
                    >
                      Add Line Item
                    </button>
                  </td>
                  <td style={{ textAlign: "end" }}>Balance:</td>
                  <td style={{ textAlign: "center" }}>
                    {totalOwed - totalPaid < 0 && "("}$
                    {Math.abs(totalOwed - totalPaid).toFixed(2)}
                    {totalOwed - totalPaid < 0 && ")"}
                  </td>
                </tr>
              </>
            ) : (
              <>
                {subtotalRows()}
                <tr>
                  <td colSpan={3} style={{ textAlign: "start" }}>
                    <button
                      className="secondary"
                      type="button"
                      onClick={addLineItem}
                    >
                      Add Line Item
                    </button>
                  </td>
                  {totalOwedRows(2)}
                </tr>
              </>
            )}
          </tfoot>
        </table>
      </div>
      <div className="client-note">
        <FullRichTextEditor
          placeholder="Client Note"
          initialHTML={modifiedInvoice.clientNote}
          ref={richTextRef}
        />
      </div>
    </div>
  );

  function serviceSelect(lineItem: LineItem, key: string, update) {
    let value: string = String(lineItem.serviceId) || "";

    return (
      <select
        name={key}
        value={value}
        onChange={handleChange}
        className="service-select"
      >
        <option value="">None</option>
        {Object.keys(groupedServices).map((programName) => (
          <optgroup label={programName} key={programName}>
            {groupedServices[programName].map((service) => (
              <option key={service.id} value={service.id}>
                {service.serviceName}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    );

    function handleChange(evt) {
      const serviceId =
        evt.target.value === "" || evt.target.value === "custom"
          ? null
          : Number(evt.target.value);
      let name = lineItem.name,
        description = lineItem.description,
        rate = lineItem.rate;
      if (serviceId) {
        const oldService = props.services.find(
          (s) => s.id === lineItem.serviceId
        );
        const newService = props.services.find((s) => s.id === serviceId);
        if (newService) {
          const defaultName =
            newService.defaultLineItemName || newService.serviceName;
          if (name) {
            name =
              !oldService || lineItem.name === oldService.serviceName
                ? defaultName
                : name;
          } else {
            name = defaultName;
          }

          const defaultDescription =
            newService.defaultLineItemDescription ||
            newService.serviceDescription;
          if (description) {
            description =
              !oldService ||
              lineItem.description === oldService.serviceDescription
                ? defaultDescription
                : description;
          } else {
            description = defaultDescription;
          }

          if (!lineItem.rate && newService.defaultLineItemRate) {
            rate = newService.defaultLineItemRate;
          }
        }
      }

      update(serviceId, name, description, rate);
    }
  }

  function subtotalRows(colSpan = 5) {
    const discount = subtotal - totalOwed;

    return (
      <>
        <tr>
          <td colSpan={colSpan} style={{ textAlign: "end" }}>
            Subtotal:
          </td>
          <td style={{ textAlign: "center" }}>
            ${Number(subtotal).toFixed(2)}
          </td>
        </tr>
        <tr>
          <td colSpan={colSpan} style={{ textAlign: "end" }}>
            Discount:
          </td>
          <td style={{ textAlign: "center" }}>
            {discount < 0 && "("}${Math.abs(discount).toFixed(2)}
            {discount < 0 && ")"}
          </td>
        </tr>
      </>
    );
  }

  function totalOwedRows(colSpan) {
    return (
      <>
        <td colSpan={colSpan} style={{ textAlign: "end" }}>
          Total Owed:
        </td>
        <td style={{ textAlign: "center" }}>
          <input
            type="number"
            value={totalOwed}
            onChange={({ target: { value } }) =>
              setTotalOwed((value as unknown) as number)
            }
          />
        </td>
      </>
    );
  }

  function addLineItem() {
    setNewLineItems(newLineItems.concat(emptyLineItem()));
  }

  function getInvoiceToSave() {
    const lineItems = modifiedInvoice.lineItems
      .concat(newLineItems)
      .filter((li) => li.name && li.rate && li.quantity)
      .map((li) => ({ ...li, rate: Number(li.rate) }));
    const clientIds = props.isDetached
      ? []
      : clientRef.current.getClients().map((c) => c.id);
    const result = {
      ...modifiedInvoice,
      lineItems,
      clients: clientIds,
      totalCharged: Number(totalOwed),
    };

    delete result.createdBy;
    delete result.modifiedBy;
    delete result.id;

    return result;
  }

  function renderLineItem(lineItems, setLineItems, li: LineItem, i: number) {
    const key = `new-${i}`;

    const updateField = (name) => (evt) => {
      setLineItems(
        lineItems.map((lineItem, index) =>
          index === i ? { ...li, [name]: evt.target.value } : lineItem
        )
      );
    };

    const updateService = (serviceId, name, description, rate) => {
      setLineItems(
        lineItems.map((lineItem, index) =>
          index === i ? { ...li, serviceId, name, description, rate } : lineItem
        )
      );
    };

    const removeLineItem = () => {
      setLineItems(
        lineItems
          .map((lineItem, index) => (index === i ? null : lineItem))
          .filter(Boolean)
      );
    };

    return (
      <tr key={key}>
        <td>{serviceSelect(li, key, updateService)}</td>
        <td>
          <input
            required
            type="text"
            value={li.name || ""}
            onChange={updateField("name")}
            autoComplete="new-password"
          />
        </td>
        <td>
          <input
            type="text"
            value={li.description || ""}
            onChange={updateField("description")}
            autoComplete="new-password"
          />
        </td>
        <td style={{ textAlign: "center" }}>
          <input
            required
            type="number"
            value={li.quantity || ""}
            onChange={updateField("quantity")}
            autoComplete="new-password"
            style={{ maxWidth: "5rem" }}
          />
        </td>
        <td style={{ textAlign: "center" }}>
          <input
            required
            type="number"
            value={li.rate || ""}
            onChange={updateField("rate")}
            autoComplete="new-password"
            style={{ maxWidth: "10rem" }}
          />
        </td>
        <td className="amount">${(li.quantity * li.rate).toFixed(2)}</td>
        <td>
          <CloseIconButton close={removeLineItem} />
        </td>
      </tr>
    );
  }

  function setModifiedLineItems(lineItems) {
    setModifiedInvoice({ ...modifiedInvoice, lineItems });
  }
});

export default EditInvoice;

function emptyLineItem(): LineItem {
  return {
    serviceId: null,
    name: null,
    description: null,
    quantity: 1,
    rate: null,
  };
}

type EditInvoiceProps = {
  invoice: FullInvoice;
  clients?: SingleClient[];
  services: CUService[];
  isEditing: boolean;
  isDetached?: boolean;
};

export type LineItem = {
  serviceId?: number;
  name: string;
  description: string;
  quantity: number;
  rate: number;
};

type InvoicePayment = {
  paymentId: number;
  paymentAmount: number;
  amountTowardsInvoice: number;
};

export type CUObjectAudit = {
  firstName: string;
  lastName: string;
  fullName: string;
  timestamp: string;
};

export type FullInvoice = {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  clientNote: string;
  totalCharged: number;
  createdBy: CUObjectAudit;
  status: InvoiceStatus;
  modifiedBy: CUObjectAudit;
  lineItems: LineItem[];
  payments: Array<InvoicePayment>;
  clients: Array<number>;
  redacted: boolean;
  billTo: null | string;
};
