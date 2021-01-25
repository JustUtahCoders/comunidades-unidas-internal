import React from "react";
import { Router, Link } from "@reach/router";
import { useCss, always } from "kremling";
import easyFetch from "../util/easy-fetch";
import PageHeader from "../page-header.component";
import StickySecondaryNav from "../navbar/sticky-secondary-nav.component";
import EventHome from "./event-home/event-home.component";
import homeImgUrl from "../../icons/148705-essential-collection/svg/home.svg";
import leadsImgUrl from "../../icons/148705-essential-collection/svg/archive-1.svg";

export default function ViewEvent(props: ViewEventProps) {
  const [event, setEvent] = React.useState<SingleEvent>(null);
  const [error, setError] = React.useState(null);
  const [eventIsStale, setEventIsStale] = React.useState(false);
  const eventId = props.eventId;

  const scope = useCss(css);

  React.useEffect(() => {
    return fetchEvent();
  }, [eventId]);

  React.useEffect(() => {
    if (eventIsStale) {
      return fetchEvent();
    }
  }, [eventIsStale]);

  const childProps = {
    event,
    setEvent,
    eventId,
    refetchEvent: () => setEventIsStale(true),
  };

  return (
    <>
      <PageHeader
        title={getHeaderTitle()}
        withSecondaryNav={event ? true : false}
      />
      {event && (
        <StickySecondaryNav>
          <div className="nav-container" {...scope}>
            <ul>
              <li>
                <Link to={`/events/${eventId}`} getProps={getLinkProps}>
                  <img
                    src={homeImgUrl}
                    alt="home icon"
                    title={event.eventName + " home"}
                  />
                </Link>
              </li>
              <li>
                <Link
                  to={`/lead-list?event=${eventId}`}
                  getProps={getLinkProps}
                >
                  <img
                    src={leadsImgUrl}
                    alt="lead icon"
                    title={event.eventName + " leads list"}
                  />
                </Link>
              </li>
            </ul>
          </div>
        </StickySecondaryNav>
      )}
      <Router>
        <EventHome path="/" {...childProps} />
      </Router>
    </>
  );

  function getHeaderTitle() {
    if (error && error.status === 404) {
      return `Could not find event ${eventId}`;
    } else if (error && error.status === 400) {
      return `Invalid event id '${eventId}'`;
    } else if (event) {
      return `${event.eventName} (#${event.id})`;
    } else {
      return "Loading event...";
    }
  }

  function getLinkProps({ isCurrent }) {
    return {
      className: always("secondary-nav-link").maybe("active", isCurrent),
    };
  }

  function fetchEvent() {
    const abortController = new AbortController();

    easyFetch(`/api/events/${eventId}`, { signal: abortController.signal })
      .then((data) => {
        setEvent(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setEventIsStale(false);
      });

    return () => abortController.abort();
  }
}

export type SingleEvent = {
  id?: number;
  eventName?: string;
  eventDate?: string;
  eventLocation?: string;
  totalAttendance?: number;
  totalLeads?: number;
  totalConvertedToClients?: number;
  leadGenders?: any;
  clientGenders?: any;
  leads?: any;
  materialsDistributed: MaterialDistributed[];
};

export type MaterialDistributed = {
  materialId: number;
  name: number;
  quantityDistributed: number;
};

type ViewEventProps = {
  path?: string;
  eventId?: string;
};

const css = `
& .secondary-nav-link img {
  height: 40%;
}

& .nav-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
`;
