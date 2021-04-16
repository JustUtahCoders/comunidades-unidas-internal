import React, { useEffect, useState } from "react";
import { useQueryParamState } from "../../util/use-query-param-state.hook";
import { Link } from "@reach/router";
import easyFetch from "../../util/easy-fetch";
import { handlePromiseError } from "../../util/error-helpers";
import { groupBy } from "lodash-es";

export default function EnglishLevelsParams(props) {
  const [startDate, setStartDate] = useQueryParamState("start", "");
  const [endDate, setEndDate] = useQueryParamState("end", "");
  const [serviceId, setServiceId] = useQueryParamState("serviceId", "");
  const [services, setServices] = useState([]);
  const [questionId, setQuestionId] = useQueryParamState("questionId", "");

  useEffect(() => {
    const ac = new AbortController();

    easyFetch("/api/services", { signal: ac.signal })
      .then((json) => {
        setServices(json.services);
        setServiceId(json.services[0].id);

        if (json.services[0].questions.length > 0) {
          setQuestionId(json.services[0].questions[0].id);
        }
      })
      .catch(handlePromiseError);

    return () => {
      ac.abort();
    };
  }, []);

  const groupedServices = groupBy(services, "programName");

  const selectedService = services.find((s) => s.id === Number(serviceId));

  const hasQuestions = selectedService && selectedService.questions.length > 0;

  useEffect(() => {
    if (selectedService && selectedService.questions.length > 0) {
      setQuestionId(String(selectedService.questions[0].id));
    }
  }, [selectedService]);

  return (
    <>
      <div className="report-input">
        <label htmlFor="service">CU Service</label>
        <select
          id="service"
          value={serviceId}
          onChange={(evt) => setServiceId(evt.target.value)}
        >
          {Object.keys(groupedServices).map((programName) => (
            <optgroup label={programName} key={programName}>
              {groupedServices[programName].map((service) => (
                <option value={service.id} key={service.id}>
                  {service.serviceName}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      {hasQuestions ? (
        <div className="report-input">
          <label htmlFor="custom-question">Question</label>
          <select
            id="custom-question"
            value={questionId}
            onChange={(evt) => setQuestionId(evt.target.value)}
          >
            {selectedService.questions.map((q) => (
              <option value={q.id} key={q.id}>
                {q.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="report-input">This service has no Custom Questions</div>
      )}
      <div className="report-input">
        <label htmlFor="start-date">Start date:</label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(evt) => setStartDate(evt.target.value)}
        />
      </div>
      <div className="report-input">
        <label htmlFor="end-date">End date:</label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(evt) => setEndDate(evt.target.value)}
        />
      </div>
      {hasQuestions && (
        <div className="actions">
          <Link
            className="primary button"
            to={`${window.location.pathname}/results${window.location.search}`}
          >
            Run report
          </Link>
        </div>
      )}
    </>
  );
}
