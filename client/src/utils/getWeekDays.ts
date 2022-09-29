// https://stackoverflow.com/a/50293232/16648127
export function getWeekDays() {
  const currentWeekDay = new Date()
    .toLocaleTimeString("en-us", { weekday: "long" })
    .split(" ")[0]
    .toUpperCase();
  const nextWeekDay = getNextWeekDay();

  return {
    currentWeekDay,
    nextWeekDay,
  };
}

// https://stackoverflow.com/a/1579109/16648127
function getNextWeekDay() {
  var now = new Date();
  now.setDate(now.getDate() + ((7 - now.getDay() - 1) % 7));
  return now;
}
