// https://stackoverflow.com/a/69700710/16648127
export function convertUTCDateToLocalDate(date: Date) {
  var newDate = new Date(
    new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60 * 1000
  );
  return newDate;
}
