export function formatPercentage(
  numerator: number,
  denominator: number
): string {
  return ((numerator / denominator) * 100).toFixed(1) + "%";
}

export function formatDuration(duration) {
  let [hours, minutes, seconds] = duration.split(":");
  hours = Number(hours).toLocaleString();
  minutes = Number(minutes);
  seconds = Number(seconds);

  const hoursStr = hours === "1" ? "1 hour" : `${hours} hours`;
  const minutesStr =
    minutes === 0 ? "" : `, ${minutes} minute${minutes === 1 ? "" : "s"}`;

  return hoursStr + minutesStr;
}

export function capitalize(str: string) {
  return str.length === 0 ? str : str.charAt(0).toUpperCase() + str.slice(1);
}
