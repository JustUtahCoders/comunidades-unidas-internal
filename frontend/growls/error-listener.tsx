import { showGrowl, GrowlType } from "./growls.component";

window.addEventListener("error", function(evt: ErrorEvent) {
  showGrowl({
    type: GrowlType.error,
    action: reportIssue,
    actionText: "Report",
    message: "An error has occurred"
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
      colno: evt.colno
    });
  }
});

window.addEventListener("unhandledrejection", function(event) {
  showGrowl({
    type: GrowlType.error,
    action: reportIssue,
    actionText: "Report",
    message: "An error has occurred"
  });

  function reportIssue() {
    prepopulateError({
      reason: event.reason
    });
  }
});

function prepopulateError(data) {
  const state = { prepopulatedDescription: data };
  try {
    window.history.pushState(state, document.title, "/report-issue");
  } catch (err) {
    window.history.pushState(
      { prepopulatedDescription: data.toString() },
      document.title,
      "/report-issue"
    );
  }
  window.dispatchEvent(new PopStateEvent("popstate", { state }));
}
