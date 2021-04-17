import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import React, { useEffect, useState } from "react";
import { useQueryParamState } from "../../util/use-query-param-state.hook";
import queryString from "query-string";

dayjs.extend(weekday);
dayjs.extend(quarterOfYear);

const format = "YYYY-MM-DD";

export default function DatePresetInputs(props: DatePresetInputsProps) {
  const startParam = props.startDateQueryParamName || "start";
  const endParam = props.endDateQueryParamName || "end";
  const [startDate, setStartDate] = useQueryParamState(startParam, "");
  const [endDate, setEndDate] = useQueryParamState(endParam, "");
  const [dateRange, setDateRange] = useState(getInitialDateRange);

  useEffect(() => {
    setBothDates(dateRange, setDates);
    const timeoutId = setTimeout(props.forceUpdate);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [dateRange]);

  return (
    <>
      <div className="report-input">
        <label>Date range:</label>
        <div>
          <div>
            <input
              id="today"
              type="radio"
              name="date-range"
              value="today"
              checked={dateRange === "today"}
              onChange={handleChange}
            />
            <label htmlFor="today">Today</label>
          </div>
          <div>
            <input
              id="yesterday"
              type="radio"
              name="date-range"
              value="yesterday"
              checked={dateRange === "yesterday"}
              onChange={handleChange}
            />
            <label htmlFor="yesterday">Yesterday</label>
          </div>
          <div>
            <input
              id="this-week"
              type="radio"
              name="date-range"
              value="this-week"
              checked={dateRange === "this-week"}
              onChange={handleChange}
            />
            <label htmlFor="this-week">This Week</label>
          </div>
          <div>
            <input
              id="last-week"
              type="radio"
              name="date-range"
              value="last-week"
              checked={dateRange === "last-week"}
              onChange={handleChange}
            />
            <label htmlFor="last-week">Last Week</label>
          </div>
          <div>
            <input
              id="this-month"
              type="radio"
              name="date-range"
              value="this-month"
              checked={dateRange === "this-month"}
              onChange={handleChange}
            />
            <label htmlFor="this-month">This Month</label>
          </div>
          <div>
            <input
              id="last-month"
              type="radio"
              name="date-range"
              value="last-month"
              checked={dateRange === "last-month"}
              onChange={handleChange}
            />
            <label htmlFor="last-month">Last Month</label>
          </div>
          <div>
            <input
              id="this-quarter"
              type="radio"
              name="date-range"
              value="this-quarter"
              checked={dateRange === "this-quarter"}
              onChange={handleChange}
            />
            <label htmlFor="this-quarter">This Quarter</label>
          </div>
          <div>
            <input
              id="last-quarter"
              type="radio"
              name="date-range"
              value="last-quarter"
              checked={dateRange === "last-quarter"}
              onChange={handleChange}
            />
            <label htmlFor="last-quarter">Last Quarter</label>
          </div>
          <div>
            <input
              id="this-year"
              type="radio"
              name="date-range"
              value="this-year"
              checked={dateRange === "this-year"}
              onChange={handleChange}
            />
            <label htmlFor="this-year">This Year</label>
          </div>
          <div>
            <input
              id="last-year"
              type="radio"
              name="date-range"
              value="last-year"
              checked={dateRange === "last-year"}
              onChange={handleChange}
            />
            <label htmlFor="last-year">Last Year</label>
          </div>
          <div>
            <input
              id="all-dates"
              type="radio"
              name="date-range"
              value="all-dates"
              checked={dateRange === "all-dates"}
              onChange={handleChange}
            />
            <label htmlFor="all-dates">All Dates</label>
          </div>
          <div>
            <input
              id="custom"
              type="radio"
              name="date-range"
              value="custom"
              checked={dateRange === "custom"}
              onChange={handleChange}
            />
            <label htmlFor="custom">Custom Date Range</label>
          </div>
        </div>
      </div>
      {dateRange === "custom" && (
        <>
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
        </>
      )}
    </>
  );

  function handleChange(evt) {
    setDateRange(evt.target.value);
  }

  function setDates(start, end) {
    if (start) {
      setStartDate(start.format(format));
    } else {
      setStartDate("");
    }

    if (end) {
      setEndDate(end.format(format));
    } else {
      setEndDate("");
    }
  }

  function getInitialDateRange() {
    const queryParams = queryString.parse(window.location.search);

    const start = queryParams[startParam];
    const end = queryParams[endParam];
    const defaultRange = "this-quarter";

    if (!start && !end) {
      return defaultRange;
    } else {
      const range = [
        "today",
        "yesterday",
        "this-week",
        "last-week",
        "this-month",
        "last-month",
        "this-quarter",
        "last-quarter",
        "this-year",
        "last-year",
      ].find((r) => {
        let expectedStart, expectedEnd;

        setBothDates(r, setDates);

        return expectedStart === start && expectedEnd === end;

        function setDates(s, e) {
          if (s) {
            expectedStart = s.format(format);
          } else {
            expectedStart = "";
          }

          if (e) {
            expectedEnd = e.format(format);
          } else {
            expectedEnd = "";
          }
        }
      });

      return range || "custom";
    }
  }
}

type DatePresetInputsProps = {
  forceUpdate(): any;
  startDateQueryParamName?: string;
  endDateQueryParamName?: string;
};

function setBothDates(dateRange, setDates) {
  const now = dayjs();
  let startMonth, endMonth;

  switch (dateRange) {
    case "today":
      setDates(now, now);
      break;
    case "yesterday":
      const yesterday = now.subtract(1, "day");
      setDates(yesterday, yesterday);
      break;
    case "this-week":
      setDates(now.weekday(0), now.weekday(6));
      break;
    case "last-week":
      setDates(now.weekday(-7), now.weekday(-1));
      break;
    case "this-month":
      setDates(now.date(1), now.date(now.daysInMonth()));
      break;
    case "last-month":
      const lastMonth = now.subtract(1, "month");
      setDates(lastMonth.date(1), lastMonth.date(lastMonth.daysInMonth()));
      break;
    case "this-quarter":
      startMonth = (now.quarter() - 1) * 3;
      endMonth = startMonth + 2;
      setDates(
        now.month(startMonth).date(1),
        now.month(endMonth).date(now.month(endMonth).daysInMonth())
      );
      break;
    case "last-quarter":
      const lastQuarter = now.subtract(1, "quarter");
      startMonth = (lastQuarter.quarter() - 1) * 3;
      endMonth = startMonth + 2;
      setDates(
        lastQuarter.month(startMonth).date(1),
        lastQuarter
          .month(endMonth)
          .date(lastQuarter.month(endMonth).daysInMonth())
      );
      break;
    case "this-year":
      setDates(now.month(0).date(1), now.month(11).date(31));
      break;
    case "last-year":
      const lastYear = now.subtract(1, "year");
      setDates(lastYear.month(0).date(1), lastYear.month(11).date(31));
      break;
    case "all-dates":
      setDates(null, null);
      break;
  }
}
