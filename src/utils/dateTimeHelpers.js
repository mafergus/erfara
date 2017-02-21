import pluralize from "pluralize";
import {
  endOfDay,
  isEqual,
  isSameDay,
  isToday,
  isYesterday,
  format,
  startOfDay,
  differenceInDays,
} from "date-fns";

export function getDayString(day) {
  switch (day) {
    case 0: return "Sunday";
    case 1: return "Monday";
    case 2: return "Tuesday";
    case 3: return "Wednesday";
    case 4: return "Thursday";
    case 5: return "Friday";
    case 6: return "Saturday";
    default: return "Uh oh";
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

export function getDateString(date) {
  const dayStr = getDayString(date.getDay());
  return format(date, "h:mm A") + " on " + dayStr + ", " + date.toLocaleDateString();
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

/**
 * Generates a string describing the specified time range
 * @param  {Date} start Range start
 * @param  {Date} end   Range end
 * @return {String}     Range description text
 */
export function formatTimeRange(start, end) {
  const rangeIsSameDay = isSameDay(start, end);
  const rangeIsStartOfDay = isEqual(start, startOfDay(start));
  const rangeIsEndOfDay = isEqual(end, endOfDay(end));
  const rangeIsFullDays = rangeIsStartOfDay && rangeIsEndOfDay;
  let endStr = formatDate(end);

  if (rangeIsSameDay) {
    return rangeIsFullDays ? endStr : `${endStr} ${formatTime(start)} - ${formatTime(end)}`;
  }

  const diffDays = differenceInDays(end, start);

  if (rangeIsFullDays && isToday(end) && diffDays < 29) {
    return `Last ${pluralize("day", diffDays, true)}`;
  }

  const startStr = rangeIsStartOfDay ? formatDate(start) : formatDateTime(start);
  endStr = rangeIsEndOfDay ? endStr : formatDateTime(end);

  return `${startStr} - ${endStr}`;
}
