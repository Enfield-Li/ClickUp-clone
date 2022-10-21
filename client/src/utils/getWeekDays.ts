// https://stackoverflow.com/a/50293232/16648127
// Get today and tomorrow week days:
//     { todayWeekDay: "TUESDAY", tomorrowWeekDay: "THURSDAY" }
export function getWeekDays() {
  const todayWeekDay = getUppercaseWeekDayString(new Date());
  const tomorrowWeekDay = getUppercaseWeekDayString(getNextWeekDay());

  return {
    todayWeekDay, // TUESDAY 2
    tomorrowWeekDay, // THURSDAY 3
  };
}

// https://stackoverflow.com/a/1579109/16648127
// Today is: Mon Oct 10 2022 09:02:24 GMT+0800 (China Standard Time)
// Get next day result: Tue Oct 11 2022 09:02:24 GMT+0800 (China Standard Time)
export function getNextWeekDay() {
  var date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
}

// From: Mon Oct 10 2022 09:02:24 GMT+0800 (China Standard Time)
// To: MONDAY
function getUppercaseWeekDayString(date: Date) {
  return date
    .toLocaleTimeString("en-us", { weekday: "long" })
    .split(" ")[0]
    .toUpperCase();
}

export function getNextNWeekDayString(nDaysLater: number) {
  var date = new Date();
  date.setDate(date.getDate() + nDaysLater);
  return toYYYYMMDDString(date);
}

export function getNextNWeekDay(nDaysLater: number) {
  var date = new Date();
  date.setDate(date.getDate() + nDaysLater);
  return date;
}

// return yyyy-mm-dd
export function getTodayYMDString() {
  return toYYYYMMDDString(new Date());
}

function toYYYYMMDDString(date: Date) {
  return date
    .toLocaleTimeString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split(",")[0];
}

/* 
  eg:
  [
    "10/10/2022",
    "10/11/2022",
    "10/12/2022",
    "10/13/2022",
    "10/14/2022",
    "10/15/2022",
    "10/16/2022"
  ]
 */
export function getOneWholeWeekLocalDateString() {
  const dateList: string[] = [];
  for (let i = 0; i < 7; i++) {
    dateList.push(getNextNWeekDayString(i));
  }
  return dateList;
}

// eg today is "10/11/2022"
// return yesterday: "10/10/2022"
export function getYesterdayLocalDateString() {
  var date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toLocaleDateString();
}

// eg today is "10/11/2022"
// return one week after: "10/18/2022"
export function getOneWeekAfterLocalDateString() {
  var date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toLocaleDateString();
}

export function getDaysBefore(days: number) {
  var date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}
