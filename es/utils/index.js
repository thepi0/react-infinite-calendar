import _withPropsOnChange from 'recompose/withPropsOnChange';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import getScrollbarSize from 'dom-helpers/util/scrollbarSize';
import getDaysInMonth from 'date-fns/get_days_in_month';
import getDay from 'date-fns/get_day';
import isAfter from 'date-fns/is_after';
import isBefore from 'date-fns/is_before';
import isSameDay from 'date-fns/is_same_day';
import endOfDay from 'date-fns/end_of_day';
import startOfDay from 'date-fns/start_of_day';
import endOfMonth from 'date-fns/end_of_month';
import startOfMonth from 'date-fns/start_of_month';
import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';


export var keyCodes = {
  command: 91,
  control: 17,
  down: 40,
  enter: 13,
  escape: 27,
  left: 37,
  right: 39,
  shift: 16,
  up: 38
};

/**
 * Given a year and a month, returns the rows for that month to be iterated over
 * @param {Number} year - the year number
 * @param {Number} month - the index of the month
 * @param {Number} weekStartsOn - the index of the first day of the week (from 0 to 6)
 * @return {Object} - Returns the first day of the month and the rows of that month
 */
export function getMonth(year, month, weekStartsOn) {
  var rows = [];
  var monthDate = new Date(year, month, 1);
  var daysInMonth = getDaysInMonth(monthDate);
  var weekEndsOn = getEndOfWeekIndex(weekStartsOn);

  var dow = getDay(new Date(year, month, 1));
  var week = 0;

  for (var day = 1; day <= daysInMonth; day++) {
    if (!rows[week]) {
      rows[week] = [];
    }

    rows[week].push(day);

    if (dow === weekEndsOn) {
      week++;
    }

    dow = dow < 6 ? dow + 1 : 0;
  }

  return {
    date: monthDate,
    rows: rows
  };
}

export function getMiniMonth(year, month, weekStartsOn, min, max) {
  var rows = [];
  var monthDate = new Date(year, month, 1);
  var daysInMonth = getDaysInMonth(monthDate);
  var weekEndsOn = getEndOfWeekIndex(weekStartsOn);

  var minDay = format(min, 'D');
  var maxDay = format(max, 'D');
  var minMonth = (format(min, 'M') - 1).toString();
  var maxMonth = (format(max, 'M') - 1).toString();

  var intMonth = parseInt(month, 10);
  minMonth = parseInt(minMonth, 10);
  maxMonth = parseInt(maxMonth, 10);

  //console.log('month: ' + intMonth);
  //console.log('minMonth: ' + minMonth);
  //console.log('maxMonth: ' + maxMonth);

  var endOfMin = void 0;
  var startOfMax = void 0;
  var monthStartDate = void 0;
  var monthEndDate = void 0;

  var dow = getDay(new Date(year, intMonth, 1));
  var week = 0;

  if (minMonth === maxMonth) {
    monthEndDate = maxDay;
    monthStartDate = minDay;
  } else {
    if (intMonth <= maxMonth && minMonth >= intMonth) {
      monthEndDate = format(endOfMonth(new Date(year, month, minDay)), 'D');
      monthEndDate = parseInt(monthEndDate, 10);
      monthStartDate = minDay;
    } else if (intMonth >= minMonth && intMonth <= maxMonth) {
      monthStartDate = format(startOfMonth(new Date(year, month, maxDay)), 'D');
      monthStartDate = parseInt(monthStartDate, 10);
      monthEndDate = maxDay;
    }
  }

  for (var day = 1; day <= daysInMonth; day++) {
    if (!rows[week]) {
      rows[week] = [];
    }

    if (day >= monthStartDate && day <= monthEndDate && dow !== 6 && dow !== 0) {
      rows[week].push(day);
    }

    if (dow === weekEndsOn) {
      week++;
    }

    dow = dow < 6 ? dow + 1 : 0;
  }

  return {
    date: monthDate,
    rows: rows
  };
}

export function getWeek(yearStart, date, weekStartsOn) {
  var yearStartDate = typeof yearStart === 'number' ? new Date(yearStart, 0, 1) // 1st Jan of the Year
  : yearStart;

  return Math.ceil((Math.round((date - yearStartDate) / (60 * 60 * 24 * 1000)) + yearStartDate.getDay() + 1 - weekStartsOn) / 7);
}

/**
 * Get the number of weeks in a given month to be able to calculate the height of that month
 * @param {Number} year - the year number
 * @param {Number} month - the index of the month
 * @param {Number} weekStartsOn - the index of the first day of the week (from 0 to 6)
 * @return {Number} - Returns the number of weeks for the given month
 */
export function getWeeksInMonth(month) {
  var year = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date().getFullYear();
  var weekStartsOn = arguments[2];
  var isLastDisplayedMonth = arguments[3];

  var weekEndsOn = getEndOfWeekIndex(weekStartsOn);

  var firstOfMonth = new Date(year, month, 1);
  var firstWeekNumber = getWeek(year, firstOfMonth, weekStartsOn);

  var lastOfMonth = new Date(year, month + 1, 0); // Last date of the Month
  var lastWeekNumber = getWeek(year, lastOfMonth, weekStartsOn);

  var rowCount = lastWeekNumber - firstWeekNumber;

  // If the last week contains 7 days, we need to add an extra row
  if (lastOfMonth.getDay() === weekEndsOn || isLastDisplayedMonth) {
    rowCount++;
  }

  return rowCount;
}

export function getWeeksInMiniMonth(month) {
  var year = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date().getFullYear();
  var weekStartsOn = arguments[2];
  var isLastDisplayedMonth = arguments[3];
  var max = arguments[4];
  var min = arguments[5];

  var weekEndsOn = getEndOfWeekIndex(weekStartsOn);

  var firstOfMonth = new Date(year, month, 1);
  var firstWeekNumber = getWeek(year, firstOfMonth, weekStartsOn);

  var lastOfMonth = new Date(year, month + 1, 0); // Last date of the Month
  var lastWeekNumber = getWeek(year, lastOfMonth, weekStartsOn);

  var rowCount = 2;

  var minDay = format(min, 'D');
  var maxDay = format(max, 'D');
  var minMonth = (format(min, 'M') - 1).toString();
  var maxMonth = (format(max, 'M') - 1).toString();

  var endOfMin = void 0;
  var startOfMax = void 0;
  var monthStartDate = void 0;
  var monthEndDate = void 0;
  var totalDaysBetween = void 0;

  var intMonth = parseInt(month, 10);
  minMonth = parseInt(minMonth, 10);
  maxMonth = parseInt(maxMonth, 10);

  if (minMonth === maxMonth) {
    rowCount = 2;
  } else {

    if (intMonth <= maxMonth && minMonth >= intMonth) {
      monthEndDate = format(endOfMonth(new Date(year, month, minDay)), 'D');
      monthEndDate = parseInt(monthEndDate, 10);
      monthStartDate = minDay;
      totalDaysBetween = differenceInCalendarDays(new Date(year, month, monthEndDate), new Date(year, month, monthStartDate));
    } else if (intMonth >= minMonth && intMonth <= maxMonth) {
      monthStartDate = format(startOfMonth(new Date(year, month, maxDay)), 'D');
      monthStartDate = parseInt(monthStartDate, 10);
      monthEndDate = maxDay;
      totalDaysBetween = differenceInCalendarDays(new Date(year, month, monthEndDate), new Date(year, month, monthStartDate));
    }

    totalDaysBetween = totalDaysBetween + 1;

    if (totalDaysBetween < 6) {
      rowCount = 0;
    } else {
      rowCount = 1;
    }
  }

  // If the last week contains 7 days, we need to add an extra row
  /*if (lastOfMonth.getDay() === weekEndsOn || isLastDisplayedMonth) {
    rowCount++;
  }*/

  return rowCount;
}

/**
 * Helper to find out what day the week ends on given the localized start of the week
 * @param {Number} weekStartsOn - the index of the first day of the week (from 0 to 6)
 * @return {Number} - Returns the index of the day the week ends on
 */
function getEndOfWeekIndex(weekStartsOn) {
  var weekEndsOn = weekStartsOn === 0 ? 6 : weekStartsOn - 1;

  return weekEndsOn;
}

export var ScrollSpeed = function () {
  function ScrollSpeed() {
    var _this = this;

    _classCallCheck(this, ScrollSpeed);

    this.clear = function () {
      _this.lastPosition = null;
      _this.delta = 0;
    };
  }

  ScrollSpeed.prototype.getScrollSpeed = function getScrollSpeed(scrollOffset) {
    if (this.lastPosition != null) {
      this.delta = scrollOffset - this.lastPosition;
    }
    this.lastPosition = scrollOffset;

    clearTimeout(this._timeout);
    this._timeout = setTimeout(this.clear, 50);

    return this.delta;
  };

  return ScrollSpeed;
}();

export var scrollbarSize = getScrollbarSize();

export function emptyFn() {
  /* no-op */
}

export function sanitizeDate(date, _ref) {
  var _ref$disabledDates = _ref.disabledDates,
      disabledDates = _ref$disabledDates === undefined ? [] : _ref$disabledDates,
      _ref$disabledDays = _ref.disabledDays,
      disabledDays = _ref$disabledDays === undefined ? [] : _ref$disabledDays,
      minDate = _ref.minDate,
      maxDate = _ref.maxDate;

  // Selected date should not be disabled or outside the selectable range
  if (!date || disabledDates.some(function (disabledDate) {
    return isSameDay(disabledDate, date);
  }) || disabledDays && disabledDays.indexOf(getDay(date)) !== -1 || minDate && isBefore(date, startOfDay(minDate)) || maxDate && isAfter(date, endOfDay(maxDate))) {
    return null;
  }

  return date;
}

export function getDateString(year, month, date) {
  return year + '-' + ('0' + (month + 1)).slice(-2) + '-' + ('0' + date).slice(-2);
}

export function getMonthsForYear(year) {
  var day = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  return Array.apply(null, Array(12)).map(function (val, index) {
    return new Date(year, index, day);
  });
}

export var withImmutableProps = function withImmutableProps(props) {
  return _withPropsOnChange(function () {
    return false;
  }, props);
};

export function debounce(callback, wait) {
  var _this2 = this;

  var timeout = null;
  var callbackArgs = null;

  var later = function later() {
    return callback.apply(_this2, callbackArgs);
  };

  return function () {
    callbackArgs = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function range(start, stop) {
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range = Array(length);

  for (var i = 0; i < length; i++, start += step) {
    range[i] = start;
  }

  return range;
};

export { default as animate } from './animate';