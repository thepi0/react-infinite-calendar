'use strict';

exports.__esModule = true;
exports.animate = exports.withImmutableProps = exports.scrollbarSize = exports.ScrollSpeed = exports.keyCodes = undefined;

var _withPropsOnChange2 = require('recompose/withPropsOnChange');

var _withPropsOnChange3 = _interopRequireDefault(_withPropsOnChange2);

exports.getMonth = getMonth;
exports.getMiniMonth = getMiniMonth;
exports.getWeek = getWeek;
exports.getWeeksInMonth = getWeeksInMonth;
exports.getWeeksInMiniMonth = getWeeksInMiniMonth;
exports.emptyFn = emptyFn;
exports.sanitizeDate = sanitizeDate;
exports.getDateString = getDateString;
exports.getMonthsForYear = getMonthsForYear;
exports.debounce = debounce;
exports.range = range;

var _animate = require('./animate');

Object.defineProperty(exports, 'animate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_animate).default;
  }
});

var _scrollbarSize = require('dom-helpers/util/scrollbarSize');

var _scrollbarSize2 = _interopRequireDefault(_scrollbarSize);

var _get_days_in_month = require('date-fns/get_days_in_month');

var _get_days_in_month2 = _interopRequireDefault(_get_days_in_month);

var _get_day = require('date-fns/get_day');

var _get_day2 = _interopRequireDefault(_get_day);

var _is_after = require('date-fns/is_after');

var _is_after2 = _interopRequireDefault(_is_after);

var _is_before = require('date-fns/is_before');

var _is_before2 = _interopRequireDefault(_is_before);

var _is_same_day = require('date-fns/is_same_day');

var _is_same_day2 = _interopRequireDefault(_is_same_day);

var _end_of_day = require('date-fns/end_of_day');

var _end_of_day2 = _interopRequireDefault(_end_of_day);

var _start_of_day = require('date-fns/start_of_day');

var _start_of_day2 = _interopRequireDefault(_start_of_day);

var _end_of_month = require('date-fns/end_of_month');

var _end_of_month2 = _interopRequireDefault(_end_of_month);

var _start_of_month = require('date-fns/start_of_month');

var _start_of_month2 = _interopRequireDefault(_start_of_month);

var _format = require('date-fns/format');

var _format2 = _interopRequireDefault(_format);

var _difference_in_calendar_days = require('date-fns/difference_in_calendar_days');

var _difference_in_calendar_days2 = _interopRequireDefault(_difference_in_calendar_days);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var keyCodes = exports.keyCodes = {
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
function getMonth(year, month, weekStartsOn) {
  var rows = [];
  var monthDate = new Date(year, month, 1);
  var daysInMonth = (0, _get_days_in_month2.default)(monthDate);
  var weekEndsOn = getEndOfWeekIndex(weekStartsOn);

  var dow = (0, _get_day2.default)(new Date(year, month, 1));
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

function getMiniMonth(year, month, weekStartsOn, min, max) {
  var rows = [];
  var monthDate = new Date(year, month, 1);
  var daysInMonth = (0, _get_days_in_month2.default)(monthDate);
  var weekEndsOn = getEndOfWeekIndex(weekStartsOn);

  var minDay = (0, _format2.default)(min, 'D');
  var maxDay = (0, _format2.default)(max, 'D');
  var minMonth = ((0, _format2.default)(min, 'M') - 1).toString();
  var maxMonth = ((0, _format2.default)(max, 'M') - 1).toString();

  var intMonth = parseInt(month, 10);
  minMonth = parseInt(minMonth, 10);
  maxMonth = parseInt(maxMonth, 10);

  var endOfMin = void 0;
  var startOfMax = void 0;
  var monthStartDate = void 0;
  var monthEndDate = void 0;

  var dow = (0, _get_day2.default)(new Date(year, intMonth, 1));
  var week = 0;

  if (minMonth === maxMonth) {
    monthEndDate = maxDay;
    monthStartDate = minDay;
  } else {
    if (intMonth <= maxMonth && minMonth >= intMonth) {
      monthEndDate = (0, _format2.default)((0, _end_of_month2.default)(new Date(year, month, minDay)), 'D');
      monthEndDate = parseInt(monthEndDate, 10);
      monthStartDate = minDay;
    } else if (intMonth >= minMonth && intMonth <= maxMonth) {
      monthStartDate = (0, _format2.default)((0, _start_of_month2.default)(new Date(year, month, maxDay)), 'D');
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

function getWeek(yearStart, date, weekStartsOn) {
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
function getWeeksInMonth(month) {
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

function getWeeksInMiniMonth(month) {
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

  var minDay = (0, _format2.default)(min, 'D');
  var maxDay = (0, _format2.default)(max, 'D');
  var minMonth = ((0, _format2.default)(min, 'M') - 1).toString();
  var maxMonth = ((0, _format2.default)(max, 'M') - 1).toString();

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
      monthEndDate = (0, _format2.default)((0, _end_of_month2.default)(new Date(year, month, minDay)), 'D');
      monthEndDate = parseInt(monthEndDate, 10);
      monthStartDate = minDay;
      totalDaysBetween = (0, _difference_in_calendar_days2.default)(new Date(year, month, monthEndDate), new Date(year, month, monthStartDate));
    } else if (intMonth >= minMonth && intMonth <= maxMonth) {
      monthStartDate = (0, _format2.default)((0, _start_of_month2.default)(new Date(year, month, maxDay)), 'D');
      monthStartDate = parseInt(monthStartDate, 10);
      monthEndDate = maxDay;
      totalDaysBetween = (0, _difference_in_calendar_days2.default)(new Date(year, month, monthEndDate), new Date(year, month, monthStartDate));
    }

    totalDaysBetween = totalDaysBetween + 1;

    if (totalDaysBetween < 6) {
      rowCount = 0;
    } else {
      rowCount = 1;
    }
  }

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

var ScrollSpeed = exports.ScrollSpeed = function () {
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

var scrollbarSize = exports.scrollbarSize = (0, _scrollbarSize2.default)();

function emptyFn() {
  /* no-op */
}

function sanitizeDate(date, _ref) {
  var _ref$disabledDates = _ref.disabledDates,
      disabledDates = _ref$disabledDates === undefined ? [] : _ref$disabledDates,
      _ref$disabledDays = _ref.disabledDays,
      disabledDays = _ref$disabledDays === undefined ? [] : _ref$disabledDays,
      minDate = _ref.minDate,
      maxDate = _ref.maxDate;

  // Selected date should not be disabled or outside the selectable range
  if (!date || disabledDates.some(function (disabledDate) {
    return (0, _is_same_day2.default)(disabledDate, date);
  }) || disabledDays && disabledDays.indexOf((0, _get_day2.default)(date)) !== -1 || minDate && (0, _is_before2.default)(date, (0, _start_of_day2.default)(minDate)) || maxDate && (0, _is_after2.default)(date, (0, _end_of_day2.default)(maxDate))) {
    return null;
  }

  return date;
}

function getDateString(year, month, date) {
  return year + '-' + ('0' + (month + 1)).slice(-2) + '-' + ('0' + date).slice(-2);
}

function getMonthsForYear(year) {
  var day = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  return Array.apply(null, Array(12)).map(function (val, index) {
    return new Date(year, index, day);
  });
}

var withImmutableProps = exports.withImmutableProps = function withImmutableProps(props) {
  return (0, _withPropsOnChange3.default)(function () {
    return false;
  }, props);
};

function debounce(callback, wait) {
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

function range(start, stop) {
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range = Array(length);

  for (var i = 0; i < length; i++, start += step) {
    range[i] = start;
  }

  return range;
};