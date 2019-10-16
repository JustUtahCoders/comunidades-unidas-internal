import React from "react";
import { useFullWidth } from "../navbar/use-full-width.hook";
import PageHeader from "../page-header.component";
import ReportIssue from "../report-issue/report-issue.component";
import LeadsTable from "./table/leads-table.component";
import LeadsTableToolbar from "./toolbar/leads-table-toolbar.component";

export default function LeadList() {
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 8,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 9,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 10,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 11,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 12,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 13,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 14,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 15,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 16,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 17,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 18,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 19,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 20,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 21,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 22,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 23,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      }
    },
    {
      id: 24,
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
      firstName: "Joel",
      lastName: "Denning",
      fullName: "Joel Denning",
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
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
        timestamp: "2019-05-06T06:00:00.000Z"
      },
      lastUpdatedBy: {
        userId: 1,
        firstName: "Joel",
        lastName: "Denning",
        fullName: "Joel Denning",
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
