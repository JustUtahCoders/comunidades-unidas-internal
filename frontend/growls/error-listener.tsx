import { showGrowl, GrowlType } from "./growls.component";
import { navigate } from "@reach/router";

window.addEventListener("error", function (evt: ErrorEvent) {
  showGrowl({
    type: GrowlType.error,
    action: reportIssue,
    actionText: "Report",
    message: "An error has occurred",
  });

  function reportIssue() {
    prepopulateError({
      error:
        evt.error instanceof Error
          ? evt.error.message + "\n" + evt.error.stack
          : evt.error,
      message: evt.message,
      filename: evt.filename,
      lineno: evt.lineno,
      colno: evt.colno,
    });
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
