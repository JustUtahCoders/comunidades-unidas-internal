import React from "react";
import easyFetch from "../util/easy-fetch";
import { useFullWidth } from "../navbar/use-full-width.hook";
import PageHeader from "../page-header.component";
import ReportIssue from "../report-issue/report-issue.component";
import LeadsTable from "./table/leads-table.component";
import LeadsTableToolbar from "./toolbar/leads-table-toolbar.component";

// replace fake data with easyFetch call to leads api
// add pagination indicator to toolbar
// add links to view leads

export default function LeadList(props: LeadListProps) {
  const fakeData = [
    {
      id: 1,
      dateOfSignUp: "2019-09-17",
      leadStatus: "active",
      contactStage: {
        first: "2019-05-06T06:00:00.000Z",
        second: null,
        third: null
      },
      inactivityReason: null,
      eventSource: {
        eventId: 1,
        eventName: "Health Fair",
        eventLocation: "Saint Marks"
      },
      firstName: "Test",
      lastName: "Client",
      fullName: "Test Client",
      phone: "5555555555",
      smsConsent: true,
      zip: "84115",
      age: 25,
      gender: "male",
      leadServices: [
        {
          id: 1,
          serviceName: "Citizenship"
        }
      ],
      clientId: 1,
      isDeleted: false,
      createdBy: {
        userId: 1,
        firstName: "Test",
        lastName: "Client",
        fullName: "Test Client",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Test",
        lastName: "Client",
        fullName: "Test Client",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 2,
      dateOfSignUp: "2019-09-17",
      leadStatus: "active",
      contactStage: {
        first: "2019-05-06T06:00:00.000Z",
        second: "2019-05-08T06:00:00.000Z",
        third: null
      },
      inactivityReason: null,
      eventSource: {
        eventId: 1,
        eventName: "Health Fair",
        eventLocation: "Saint Marks"
      },
      firstName: "Test",
      lastName: "Client",
      fullName: "Test Client",
      phone: "5555555555",
      smsConsent: true,
      zip: "84115",
      age: 25,
      gender: "male",
      leadServices: [
        {
          id: 1,
          serviceName: "Citizenship"
        }
      ],
      clientId: 1,
      isDeleted: false,
      createdBy: {
        userId: 1,
        firstName: "Test",
        lastName: "Client",
        fullName: "Test Client",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Test",
        lastName: "Client",
        fullName: "Test Client",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 3,
      dateOfSignUp: "2019-09-17",
      leadStatus: "active",
      contactStage: {
        first: "2019-05-06T06:00:00.000Z",
        second: "2019-05-08T06:00:00.000Z",
        third: "2019-05-10T06:00:00.000Z"
      },
      inactivityReason: null,
      eventSource: {
        eventId: 1,
        eventName: "Health Fair",
        eventLocation: "Saint Marks"
      },
      firstName: "Test",
      lastName: "Client",
      fullName: "Test Client",
      phone: "5555555555",
      smsConsent: true,
      zip: "84115",
      age: 25,
      gender: "male",
      leadServices: [
        {
          id: 1,
          serviceName: "Citizenship"
        }
      ],
      clientId: 1,
      isDeleted: false,
      createdBy: {
        userId: 1,
        firstName: "Test",
        lastName: "Client",
        fullName: "Test Client",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Test",
        lastName: "Client",
        fullName: "Test Client",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 4,
      dateOfSignUp: "2019-09-17",
      leadStatus: "active",
      contactStage: {
        first: null,
        second: null,
        third: null
      },
      inactivityReason: null,
      eventSource: {
        eventId: 1,
        eventName: "Health Fair",
        eventLocation: "Saint Marks"
      },
      firstName: "Test",
      lastName: "Client",
      fullName: "Test Client",
      phone: "5555555555",
      smsConsent: true,
      zip: "84115",
      age: 25,
      gender: "male",
      leadServices: [
        {
          id: 1,
          serviceName: "Citizenship"
        }
      ],
      clientId: 1,
      isDeleted: false,
      createdBy: {
        userId: 1,
        firstName: "Test",
        lastName: "Client",
        fullName: "Test Client",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Test",
        lastName: "Client",
        fullName: "Test Client",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 5,
      dateOfSignUp: "2019-09-17",
      leadStatus: "convertedToClient",
      contactStage: {
        first: "2019-05-06T06:00:00.000Z",
        second: null,
        third: null
      },
      inactivityReason: null,
      eventSource: {
        eventId: 1,
        eventName: "Health Fair",
        eventLocation: "Saint Marks"
      },
      firstName: "Test",
      lastName: "Client",
      fullName: "Test Client",
      phone: "5555555555",
      smsConsent: true,
      zip: "84115",
      age: 25,
      gender: "male",
      leadServices: [
        {
          id: 1,
          serviceName: "Citizenship"
        }
      ],
      clientId: 1,
      isDeleted: false,
      createdBy: {
        userId: 1,
        firstName: "Test",
        lastName: "Client",
        fullName: "Test Client",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Test",
        lastName: "Client",
        fullName: "Test Client",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 6,
      dateOfSignUp: "2019-09-17",
      leadStatus: "inactive",
      contactStage: {
        first: "2019-05-06T06:00:00.000Z",
        second: null,
        third: null
      },
      inactivityReason: null,
      eventSource: {
        eventId: 1,
        eventName: "Health Fair",
        eventLocation: "Saint Marks"
      },
      firstName: "Test",
      lastName: "Client",
      fullName: "Test Client",
      phone: "5555555555",
      smsConsent: true,
      zip: "84115",
      age: 25,
      gender: "male",
      leadServices: [
        {
          id: 1,
          serviceName: "Citizenship"
        }
      ],
      clientId: 1,
      isDeleted: false,
      createdBy: {
        userId: 1,
        firstName: "Test",
        lastName: "Client",
        fullName: "Test Client",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Test",
        lastName: "Client",
        fullName: "Test Client",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 7,
      dateOfSignUp: "2019-09-17",
      leadStatus: "active",
      contactStage: {
        first: "2019-05-06T06:00:00.000Z",
        second: null,
        third: null
      },
      inactivityReason: null,
      eventSource: {
        eventId: 1,
        eventName: "Health Fair",
        eventLocation: "Saint Marks"
      },
      firstName: "Test",
      lastName: "Client",
      fullName: "Test Client",
      phone: "5555555555",
      smsConsent: true,
      zip: "84115",
      age: 25,
      gender: "male",
      leadServices: [
        {
          id: 1,
          serviceName: "Citizenship"
        }
      ],
      clientId: 1,
      isDeleted: false,
      createdBy: {
        userId: 1,
        firstName: "Test",
        lastName: "Client",
        fullName: "Test Client",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Test",
        lastName: "Client",
        fullName: "Test Client",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    }
  ];
  const fakePageLength = 100;
  const fakePage = Math.round(fakeData.length / fakePageLength);

  if (localStorage.getItem("leads") !== null) {
    useFullWidth();
  }

  return (
    <>
      <PageHeader title="Lead list" fullScreen />
      {localStorage.getItem("leads") ? (
        <>
          <LeadsTableToolbar
            page={fakePage}
            pageSize={fakePageLength}
            numLeads={fakeData.length}
          />
          <LeadsTable leads={fakeData} />
        </>
      ) : (
        <ReportIssue missingFeature hideHeader />
      )}
    </>
  );
}

type LeadListProps = {
  path: string;
};
