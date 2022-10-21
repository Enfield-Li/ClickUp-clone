export function calculateTime(originalDate: Date, isSuccinct?: boolean) {
  const current = new Date().getTime();
  const previous = new Date(originalDate).getTime();
  return timeDifference(current, previous, isSuccinct);
}

function timeDifference(
  current: number,
  previous: number,
  isSuccinct?: boolean
) {
  const milliSecondsPerMinute = 60 * 1000;
  const milliSecondsPerHour = milliSecondsPerMinute * 60;
  const milliSecondsPerDay = milliSecondsPerHour * 24;
  const milliSecondsPerMonth = milliSecondsPerDay * 30;
  const milliSecondsPerYear = milliSecondsPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < milliSecondsPerMinute / 3) {
    return isSuccinct ? "now" : "just now";
  }

  if (elapsed < milliSecondsPerMinute) {
    return isSuccinct ? "now" : "less than 1 min ago";
  } else if (elapsed < milliSecondsPerHour) {
    return (
      Math.round(elapsed / milliSecondsPerMinute) +
      (isSuccinct ? "m" : " mins ago")
    );
  } else if (elapsed < milliSecondsPerDay) {
    return (
      Math.round(elapsed / milliSecondsPerHour) +
      (isSuccinct ? "h" : " hours ago")
    );
  } else if (elapsed < milliSecondsPerMonth) {
    return (
      Math.round(elapsed / milliSecondsPerDay) +
      (isSuccinct ? "d" : " days ago")
    );
  } else if (elapsed < milliSecondsPerYear) {
    return (
      Math.round(elapsed / milliSecondsPerMonth) +
      (isSuccinct ? "m" : " months ago")
    );
  } else {
    return (
      Math.round(elapsed / milliSecondsPerYear) +
      (isSuccinct ? "yr" : " years ago")
    );
  }
}
