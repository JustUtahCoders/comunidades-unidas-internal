export function secondsToHours(seconds: number): number {
  return Math.floor(seconds / 3600);
}

export function secondsToRemainderMinutes(seconds: number): number {
  return Math.floor((seconds % 3600) / 60);
}
