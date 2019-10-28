import React, { useState, useReducer } from "react";
import { useFullWidth } from "../navbar/use-full-width.hook";
import { useCss } from "kremling";
import PageHeader from "../page-header.component";

// const services = [{"id":8,"serviceName":"Chronic Disease Screenings","serviceDescription":"Refer individuals to clinics where they can be tested for chronic diseases","programId":1,"programName":"Preventive Health"},{"id":15,"serviceName":"Chronic Care Guidance","serviceDescription":"Chronic Care Guidance","programId":1,"programName":"Preventive Health"},{"id":16,"serviceName":"Tobacco Prevention and Cessation","serviceDescription":"Tobacco Prevention and Cessation","programId":1,"programName":"Preventive Health"},{"id":17,"serviceName":"HIV / PrEP","serviceDescription":"HIV / PrEP","programId":1,"programName":"Preventive Health"},{"id":18,"serviceName":"Youth Groups / Leadership Development","serviceDescription":"Youth Groups / Leadership Development","programId":1,"programName":"Preventive Health"},{"id":19,"serviceName":"VDS Daily Attention","serviceDescription":"VDS Daily Attention","programId":1,"programName":"Preventive Health"},{"id":20,"serviceName":"VDS Mobile","serviceDescription":"VDS Mobile","programId":1,"programName":"Preventive Health"},{"id":21,"serviceName":"Saturday VDS","serviceDescription":"Saturday VDS","programId":1,"programName":"Preventive Health"},{"id":22,"serviceName":"Mobile Clinic","serviceDescription":"Mobile Clinic","programId":1,"programName":"Preventive Health"},{"id":7,"serviceName":"SNAP","serviceDescription":"Supplemental Nutritional Assistance Program provides nutrition benefits to supplement the food budget of families","programId":2,"programName":"Nutrition / CRYS / SNAP"},{"id":9,"serviceName":"Nutrition","serviceDescription":"A class that teaches nutrition","programId":2,"programName":"Nutrition / CRYS / SNAP"},{"id":10,"serviceName":"Grocery Store Tour","serviceDescription":"Walk through a grocery store as a group","programId":2,"programName":"Nutrition / CRYS / SNAP"},{"id":11,"serviceName":"Cooking Classes","serviceDescription":"Learn how to cook","programId":2,"programName":"Nutrition / CRYS / SNAP"},{"id":1,"serviceName":"Citizenship","serviceDescription":"Gain United States citizenship","programId":3,"programName":"Immigration"},{"id":2,"serviceName":"Family Petition - Adjustment of Status","serviceDescription":"Petition for certain family members to receive either a Green Card, a fiancé(e) visa or a K-3/K-4 visa","programId":3,"programName":"Immigration"},{"id":4,"serviceName":"DACA","serviceDescription":"Deferred Action for Childhood Arrivals allows individuals to defer action from deportation and become eligibile for a work permit","programId":3,"programName":"Immigration"},{"id":26,"serviceName":"General Consultation","serviceDescription":"General Consultation","programId":3,"programName":"Immigration"},{"id":27,"serviceName":"Translation","serviceDescription":"Translation","programId":3,"programName":"Immigration"},{"id":28,"serviceName":"Green Card Renewal","serviceDescription":"Green Card Renewal","programId":3,"programName":"Immigration"},{"id":29,"serviceName":"I-821 Temporary Protected Status (TPS)","serviceDescription":"I-821 Temporary Protected Status (TPS)","programId":3,"programName":"Immigration"},{"id":30,"serviceName":"I-765 Application for Employment Authorization","serviceDescription":"I-765 Application for Employment Authorization","programId":3,"programName":"Immigration"},{"id":31,"serviceName":"Freedom of Information Act (FOIA)","serviceDescription":"Freedom of Information Act (FOIA)","programId":3,"programName":"Immigration"},{"id":32,"serviceName":"Status Check","serviceDescription":"Status Check","programId":3,"programName":"Immigration"},{"id":33,"serviceName":"I-94 Request","serviceDescription":"I-94 Request","programId":3,"programName":"Immigration"},{"id":34,"serviceName":"Family Petition - Consular Processing","serviceDescription":"Family Petition - Consular Processing","programId":3,"programName":"Immigration"},{"id":36,"serviceName":"Free Consultation","serviceDescription":"Free consultation for available immigration services","programId":3,"programName":"Immigration"},{"id":13,"serviceName":"Financial Coach","serviceDescription":"Use an assigned financial coach to help you budget","programId":4,"programName":"Financial Education / Coaching"},{"id":14,"serviceName":"Financial Education","serviceDescription":"A class that teaches budgeting and financial options available to families","programId":4,"programName":"Financial Education / Coaching"},{"id":3,"serviceName":"Workers' Rights","serviceDescription":"Know your rights in the workplace","programId":5,"programName":"Workers' Rights"},{"id":38,"serviceName":"Workers' Safety","serviceDescription":"Know the safety protections you are entitled to at work","programId":5,"programName":"Workers' Rights"},{"id":23,"serviceName":"LDS Vouchers","serviceDescription":"LDS Vouchers","programId":6,"programName":"Family Support"},{"id":24,"serviceName":"Faxes","serviceDescription":"Sending faxes for people","programId":6,"programName":"Family Support"},{"id":5,"serviceName":"Youth Groups","serviceDescription":"Community events and groups for youth","programId":7,"programName":"Community Engagement and Organizing"},{"id":6,"serviceName":"Leadership Development - Monthly Meetings","serviceDescription":"Learn to become a leader within the community","programId":7,"programName":"Community Engagement and Organizing"},{"id":25,"serviceName":"Voter Registration","serviceDescription":"Voter Registration","programId":7,"programName":"Community Engagement and Organizing"},{"id":35,"serviceName":"Promotora","serviceDescription":"Promoter of Comunidades Unidas","programId":7,"programName":"Community Engagement and Organizing"},{"id":37,"serviceName":"Focus Groups","serviceDescription":"Focus Groups","programId":8,"programName":"Focus Groups"}];
// const groupedServices = groupBy(services, "programName");
//
// const Programs = () => (
//   Object.keys(groupedServices).sort().map((programName) => (
//     <Program programName={programName} services={groupedServices[programName]} />
//   ))
// )
//
// const Program = ({programName, services}) => (
//
// )

const LeadRow = ({lead, deleteLead, updateLead, canDelete}) => {
  const input = (field, label) => (
    <input
      style={{width:"100%"}}
      value={lead[field] || ""}
      onChange={(e) => updateLead(field, e.target.value)}
      aria-label={label}
    />
  );

  return (
    <tr>
      <td>{input("firstName", "First")}</td>
      <td>{input("lastName", "Last")}</td>
      <td>{input("phone", "Phone")}</td>
      <td>{input("zip", "Zip")}</td>
      <td>{input("age", "Age")}</td>
      <td><select style={{width:"100%"}}><option></option><option>Female</option><option>Male</option><option>Other</option></select></td>
      <td><input type="checkbox" /></td>
      <td></td>
      <td>{canDelete && <button onClick={deleteLead}>x</button>}</td>
    </tr>
  );
}

const LeadsTable = ({leads, deleteLead, updateLead}) => {
  const scope = useCss(`
    & table {
      border-spacing: 0;
      table-layout: fixed;
    }
    & table td, & table th {
      border-collapse: collapse;
      padding: 0;
    }

    & tr select {
      -webkit-appearance: none;
      font-size: 1.8rem;
      padding: .4rem .6rem;
      border-radius: 0;
    }

    & tr input, & tr select {
      background: rgba(255, 255, 255, 0.75);
      border: 1px solid rgb(238, 238, 238, 0.75);
    }

    & tr:focus-within input, & tr:hover input, & tr:focus-within select, & tr:hover select {
      background: white;
      border: 1px solid rgb(238, 238, 238);
    }
  `);

  return (
    <table style={{width: "100%"}} {...scope}>
      <thead>
        <tr>
          <th style={{width: "18%"}}>First</th>
          <th style={{width: "18%"}}>Last</th>
          <th style={{width: "12%"}}>Phone</th>
          <th style={{width: "8%"}}>Zip</th>
          <th style={{width: "5%"}}>Age</th>
          <th style={{width: "10%"}}>Gender</th>
          <th style={{width: "5%"}}>Texts?</th>
          <th style={{width: "20%"}}>Interests</th>
          <th style={{width: "4%"}}></th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead, i) => (
          <LeadRow
            key={lead.uuid}
            lead={lead}
            updateLead={(field, value) => updateLead(i, field, value)}
            deleteLead={() => deleteLead(i)}
            canDelete={leads.length > 1}
          />
        ))}
      </tbody>
    </table>
  )
}

let uniqueId = 0;
export default () => {
  const scope = useCss(`
    & table {
      border-spacing: 0;
      table-layout: fixed;
    }
    & table td, & table th {
      border-collapse: collapse;
      padding: 0;
    }
  `);
  useFullWidth();

  const [state, dispatch] = useReducer((state, action) => {
    let leads;
    switch (action.type) {
      case "updateLead":
        leads = [...state.leads];
        leads[action.index] = {
          ...leads[action.index],
          [action.field]: action.value
        }
        if (action.index === leads.length - 1) {
          leads.push({uuid: ++uniqueId})
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
  }, {leads: [{ uuid: uniqueId }]});

  return (
    <div {...scope}>
      <PageHeader title={
        <span>
          Add new leads
        </span>
      } fullScreen={true} />

      <LeadsTable
        leads={state.leads}
        deleteLead={(index) => dispatch({type: "deleteLead", index})}
        updateLead={(index, field, value) => dispatch({type: "updateLead", index, field, value})}
        addLead={()=>{}}
      />
    </div>
  )
}

type AddLeadsProps = {
  path: string;
};
