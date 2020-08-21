import { showGrowl, GrowlType } from "./growls.component";
import { navigate } from "@reach/router";
import { FetchError } from "../util/easy-fetch";

window.addEventListener("error", function (evt: ErrorEvent) {
  showGrowl({
    type: GrowlType.error,
    action: reportIssue,
    actionText: "Report",
    message: "An error has occurred",
  });

  function reportIssue() {
    const errorInfo = {
      error:
        evt.error instanceof Error
          ? evt.error.message + "\n" + evt.error.stack
          : evt.error,
      message: evt.message,
      filename: evt.filename,
      lineno: evt.lineno,
      colno: evt.colno,
      networkresponse: undefined,
    };
    if (evt.error instanceof FetchError && evt.error.body) {
      // it's unlikely that this will ever throw an error but we want to ensure we don't break error reporting
      try {
        errorInfo.networkresponse = JSON.stringify(evt.error.body);
      } catch (e) {
        // do nothing
      }
    }
    prepopulateError(errorInfo);
  }
});

window.addEventListener("unhandledrejection", function (event) {
  showGrowl({
    type: GrowlType.error,
    action: reportIssue,
    actionText: "Report",
    message: "An error has occurred",
  });

  function reportIssue() {
    prepopulateError({
      reason: event.reason,
    });
  }
});

function prepopulateError(data) {
  const state = { prepopulatedDescription: data };
  try {
    navigate("/report-issue", { state });
  } catch (err) {
    navigate("/report-issue", {
      state: { prepopulatedDescription: data.toString() },
    });
  }
  window.dispatchEvent(new PopStateEvent("popstate", { state }));
}
