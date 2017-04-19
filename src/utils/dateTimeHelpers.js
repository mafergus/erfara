import {
  isToday,
  isYesterday,
  format,
} from "date-fns";

export function getShortMonth(date) {
  const month = date.getMonth();
  switch (month) {
    case 0: return "JAN";
    case 1: return "FEB";
    case 2: return "MAR";
    case 3: return "APR";
    case 4: return "MAY";
    case 5: return "JUN";
    case 6: return "JUL";
    case 7: return "AUG";
    case 8: return "SEP";
    case 9: return "OCT";
    case 10: return "NOV";
    case 11: return "DEC";
    default: return "NA";
  }
}

export function getErfaraDate(date) {
  if (isToday(date)) {
    return formatTime(date);
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return format(date, "MM/DD/YYYY");
}

/**
 * Convert a date to a locale time string e.g. 12:45 PM
 * @param  {Date} date Date to convert
 * @return {String}    Time in hour:minute locale format
 */
export function formatTime(date) {
  return format(date, "h:mm A");
}

/**
 * Convert a date to a date name or string
 * @param  {Date}     date        Date to convert
 * @param  {boolean}  formatOnly  If true do not use today or yesterday
 * @return {String}    'Today', 'Yesterday' or formatted date
 */
export function formatDate(date, formatOnly) {
  if (!formatOnly) {
    if (isToday(date)) {
      return "Today";
    }
    if (isYesterday(date)) {
      return "Yesterday";
    }
  }
  return format(date, "MM/DD/YYYY");
}

/**
 * Convert a date to a locale date and time string e.g. 12/15/2016 12:45pm
 * @param  {Date}     date        Date/Time to convert
 * @param  {boolean}  formatOnly  If true do not use today or yesterday
 * @return {String}    Date time string
 */
export function formatDateTime(date, formatOnly) {
  return `${formatDate(date, formatOnly)} ${formatTime(date)}`;
}

/**
 * Convert a Unix Timestamp (in seconds) to a Javascript Date
 * @param  {Number} ts Timestamp in seconds since Unix Epoch
 * @return {Date}      Date instance
 */
export function unixToDate(ts) {
  return new Date(ts * 1000);
}

/**
 * Convert a unix timestamp to a locale time string e.g. 12:45 PM
 * @param  {Number} ts Timestamp in seconds since Unix Epoch
 * @return {String}    Time in hour:minute locale format
 */
export function unixFormatTime(ts) {
  return formatTime(unixToDate(ts));
}

/**
 * Convert a unix timestamp to a date name or string
 * @param  {Number} ts Timestamp in seconds since Unix Epoch
 * @return {String}    'Today', 'Yesterday' or formatted date
 */
export function unixFormatDate(ts) {
  return formatDate(unixToDate(ts));
}
