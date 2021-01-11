const dateTester = /^\d{4}-\d{2}-\d{2}$/g;

export function dateHasTime(date: string) {
  return !dateTester.test(date);
}
