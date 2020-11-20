import React from "react";
import dayjs from "dayjs";

export default function LeadMetadata(props) {
  const { metadata } = props;
  const { createdBy, lastUpdatedBy } = metadata;
  return (
    <div className="lead-metadata">
      <div>
        Created By: {`${createdBy.firstName} ${createdBy.lastName}`} -{" "}
        {dayjs(createdBy.timestamp).format("YYYY-MM-DD")}
      </div>
      <div>
        Last updated By:{" "}
        {`${lastUpdatedBy.firstName} ${lastUpdatedBy.lastName}`} -{" "}
        {dayjs(lastUpdatedBy.timestamp).format("YYYY-MM-DD h:mm A")}
      </div>
    </div>
  );
}
