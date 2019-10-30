// REMOVE THIS FILE WHEN TESTING IS DONE
// REMOVE FROM ROUTER ON ROOT COMPONENT ALSO
import React from "react";
import { useCss } from "kremling";
import easyFetch from "../util/easy-fetch";
import PageHeader from "../page-header.component";

export default function TempAddLeadPage(props: TempAddLeadPageProps) {
  const scope = useCss(css);

  const fakeLeads = [
    {
      dateOfSignUp: "2019-10-10",
      eventSources: [2, 3],
      firstName: "Test",
      lastName: "One",
      phone: "5555555555",
      smsConsent: true,
      zip: "55555",
      age: 18,
      gender: "female",
      leadServices: [22, 24, 35]
    },
    {
      dateOfSignUp: "2019-10-10",
      eventSources: [2, 3],
      firstName: "Test",
      lastName: "Two",
      phone: "5555555555",
      smsConsent: true,
      zip: "55555",
      age: 18,
      gender: "female",
      leadServices: [5, 31, 35]
    },
    {
      dateOfSignUp: "2019-10-10",
      eventSources: [2, 3],
      firstName: "Test",
      lastName: "Three",
      phone: "5555555555",
      smsConsent: true,
      zip: "55555",
      age: 18,
      gender: "female",
      leadServices: [10, 25, 9]
    }
  ];

  function addFakeLeads(data) {
    const abortController = new AbortController();

    easyFetch("/api/leads", {
      method: "POST",
      signal: abortController.signal,
      body: {
        leads: data
      }
    });
  }

  return (
    <>
      <PageHeader title="test add lead" fullScreen />
      <div className="test-div" {...scope}>
        <div className="test-button" onClick={() => addFakeLeads(fakeLeads)}>
          Add All the Leads
        </div>
      </div>
    </>
  );
}

const css = `

	& .test-div {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	& .test-button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 30rem;
		height: 10rem;
		background-color: red;
		color: white;
		font-size: 3rem;
	}
`;

type TempAddLeadPageProps = {
  path: string;
};
