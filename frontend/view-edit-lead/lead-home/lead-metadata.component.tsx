import React from "react";
import dayjs from "dayjs";

export default function LeadMetadata(props: LeadMetadataProps) {
  const { createdBy, lastUpdatedBy } = props;
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

export type LeadMetadataProps = {
  createdBy: {
    firstName: string;
    lastName: string;
    timestamp: string;
  };
  lastUpdatedBy: {
    firstName: string;
    lastName: string;
    timestamp: string;
  };
};
