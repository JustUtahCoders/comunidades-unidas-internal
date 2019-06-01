export function formatPhone(phone) {
  if (phone) {
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(
        6,
        10
      )}`;
    } else {
      return phone;
    }
  } else {
    return "";
  }
}
