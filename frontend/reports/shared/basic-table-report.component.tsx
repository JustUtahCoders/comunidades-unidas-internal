import React from "react";
import { useCss } from "kremling";

export default function BasicTableReport(props: BasicTableReportProps) {
  const scope = useCss(css);

  return (
    <div className="report" {...scope}>
      {props.title && <h2>{props.title}</h2>}
      {props.subtitle && <div>{props.subtitle}</div>}
      <table style={props.tableStyle}>
        <thead>{props.headerRows}</thead>
        <tbody>{props.contentRows}</tbody>
        {props.footerRows && <tfoot>{props.footerRows}</tfoot>}
      </table>
      {props.notes && (
        <>
          <h3>How to read this report</h3>
          <ul className="notes">
            {props.notes.map((note, i) => (
              <li key={typeof note === "string" ? note : i}>{note}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

const css = `
& .report {
  display: flex;
  flex-direction: column;
  align-items: center;
}

& .report table {
  table-layout: fixed;
  border-collapse: collapse;
  border: .3rem solid black;
  margin-top: 1.6rem;
}

& .report table th, & .report table td {
  padding: 1.6rem;
  border: .1rem solid black;
  text-align: center;
}

& .report table tbody tr:nth-child(even) {
  background-color: var(--very-light-gray);
}

& .report table tbody tr:nth-child(odd) {
  background-color: white;
}

& .report table tfoot tr {
  border-top: .2rem solid black;
  background-color: var(--colored-well);
}

& .report table thead tr {
  background-color: darkgray;
  border-bottom: .2rem solid black;
}

& .report table th {
  font-weight: 400;
}

& .report table thead th {
  font-size: 2rem;
  font-weight: bold;
}

& .report h2 {
  font-size: 2.8rem;
}

& .report h3 {
  font-size: 2.4rem;
  margin: 2.4rem 0 0 0;
}

& .notes {
  width: 40%;
}
`;

type BasicTableReportProps = {
  tableStyle?: any;
  title?: string;
  subtitle?: string;
  headerRows: JSX.Element | JSX.Element[];
  contentRows: JSX.Element | JSX.Element[];
  footerRows?: JSX.Element | JSX.Element[];
  notes?: (string | JSX.Element)[];
};
