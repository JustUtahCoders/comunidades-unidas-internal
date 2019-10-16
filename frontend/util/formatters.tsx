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

export function formatDateWithoutTime(timestamp) {
  if (timestamp) {
    if (timestamp.length === 24) {
      return `${timestamp.slice(0, 10)}`;
    }
  }
}
