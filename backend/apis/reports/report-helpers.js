exports.toDuration = function (allSecs) {
  const hrs = Math.floor(allSecs / (60 * 60));
  const mins = Math.floor((allSecs - hrs * 60 * 60) / 60);
  const secs = allSecs - hrs * 60 * 60 - mins * 60;

  return `${atLeastTwoDigits(hrs)}:${atLeastTwoDigits(mins)}:${atLeastTwoDigits(
    secs
  )}`;
};

function atLeastTwoDigits(num) {
  return num.toString().padStart(2, "0");
}
