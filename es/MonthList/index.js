var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VirtualList from 'react-tiny-virtual-list';
import classNames from 'classnames';
import { emptyFn, getMonth, getMiniMonth, getWeek, getWeeksInMonth, getWeeksInMiniMonth, animate } from '../utils';
import parse from 'date-fns/parse';
import differenceInCalendarMonths from 'date-fns/difference_in_calendar_months';
import startOfMonth from 'date-fns/start_of_month';
import Month from '../Month';
var styles = {
  'root': 'Cal__MonthList__root',
  'scrolling': 'Cal__MonthList__scrolling'
};


var AVERAGE_ROWS_PER_MONTH = 5;

var MonthList = function (_Component) {
  _inherits(MonthList, _Component);

  function MonthList() {
    var _temp, _this, _ret;

    _classCallCheck(this, MonthList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
      scrollTop: _this.getDateOffset(_this.props.scrollDate)
    }, _this.cache = {}, _this.memoize = function (param) {
      if (!this.cache[param]) {
        if (this.props.miniCalendar) {
          var _props = this.props,
              weekStartsOn = _props.locale.weekStartsOn,
              min = _props.min,
              max = _props.max;

          var _param$split = param.split(':'),
              year = _param$split[0],
              month = _param$split[1];

          var result = getMiniMonth(year, month, weekStartsOn, min, max);
          var finalRows = result.rows.filter(function (value) {
            return Object.keys(value).length !== 0;
          });
          var returnable = { date: result.date, rows: finalRows };
          this.cache[param] = returnable;
        } else {
          var _weekStartsOn = this.props.locale.weekStartsOn;

          var _param$split2 = param.split(':'),
              _year = _param$split2[0],
              _month = _param$split2[1];

          var _result = getMonth(_year, _month, _weekStartsOn);
          this.cache[param] = _result;
        }
      }
      return this.cache[param];
    }, _this.monthHeights = [], _this._getRef = function (instance) {
      _this.VirtualList = instance;
    }, _this.getMonthHeight = function (index) {
      if (_this.props.miniCalendar) {
        var _this$props = _this.props,
            weekStartsOn = _this$props.locale.weekStartsOn,
            months = _this$props.months,
            rowHeight = _this$props.rowHeight,
            max = _this$props.max,
            min = _this$props.min;
        var _months$index = months[index],
            month = _months$index.month,
            year = _months$index.year;

        var monthCount = differenceInCalendarMonths(max, min);

        var weeks = getWeeksInMiniMonth(month, year, weekStartsOn, index === months.length - 1, max, min);
        var height = weeks * rowHeight;

        _this.monthHeights[index] = height;
      } else {
        if (!_this.monthHeights[index]) {
          var _this$props2 = _this.props,
              _weekStartsOn2 = _this$props2.locale.weekStartsOn,
              _months = _this$props2.months,
              _rowHeight = _this$props2.rowHeight;
          var _months$index2 = _months[index],
              _month2 = _months$index2.month,
              _year2 = _months$index2.year;

          var _weeks = getWeeksInMonth(_month2, _year2, _weekStartsOn2, index === _months.length - 1);
          var _height = _weeks * _rowHeight;
          _this.monthHeights[index] = _height;
        }
      }

      return _this.monthHeights[index];
    }, _this.scrollToDate = function (date) {
      for (var _len2 = arguments.length, rest = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        rest[_key2 - 2] = arguments[_key2];
      }

      var _this2;

      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var offsetTop = _this.getDateOffset(date);
      (_this2 = _this).scrollTo.apply(_this2, [offsetTop + offset].concat(rest));
    }, _this.scrollTo = function () {
      var scrollTop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var shouldAnimate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var onScrollEnd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFn;

      var onComplete = function onComplete() {
        return setTimeout(function () {
          _this.scrollEl.style.overflowY = 'auto';
          onScrollEnd();
        });
      };

      // Interrupt iOS Momentum scroll
      _this.scrollEl.style.overflowY = 'hidden';

      if (shouldAnimate) {
        /* eslint-disable sort-keys */
        animate({
          fromValue: _this.scrollEl.scrollTop,
          toValue: scrollTop,
          onUpdate: function onUpdate(scrollTop, callback) {
            return _this.setState({ scrollTop: scrollTop }, callback);
          },
          onComplete: onComplete
        });
      } else {
        window.requestAnimationFrame(function () {
          _this.scrollEl.scrollTop = scrollTop;
          onComplete();
        });
      }
    }, _this.renderMonth = function (_ref) {
      var index = _ref.index,
          style = _ref.style;
      var _this$props3 = _this.props,
          DayComponent = _this$props3.DayComponent,
          lastSelectableDate = _this$props3.lastSelectableDate,
          disabledDates = _this$props3.disabledDates,
          lastUpdate = _this$props3.lastUpdate,
          originalDisabledDates = _this$props3.originalDisabledDates,
          disabledDays = _this$props3.disabledDays,
          locale = _this$props3.locale,
          maxDate = _this$props3.maxDate,
          minDate = _this$props3.minDate,
          months = _this$props3.months,
          min = _this$props3.min,
          max = _this$props3.max,
          passThrough = _this$props3.passThrough,
          miniCalendar = _this$props3.miniCalendar,
          rowHeight = _this$props3.rowHeight,
          selected = _this$props3.selected,
          preselected = _this$props3.preselected,
          startDays = _this$props3.startDays,
          showOverlay = _this$props3.showOverlay,
          theme = _this$props3.theme,
          today = _this$props3.today;
      var _months$index3 = months[index],
          month = _months$index3.month,
          year = _months$index3.year;

      var key = year + ':' + month;

      var _this$memoize = _this.memoize(key),
          date = _this$memoize.date,
          rows = _this$memoize.rows;

      return React.createElement(Month, _extends({
        key: key,
        selected: selected,
        preselected: preselected,
        lastUpdate: lastUpdate,
        startDays: startDays,
        DayComponent: DayComponent,
        monthDate: date,
        lastSelectableDate: lastSelectableDate,
        disabledDates: disabledDates,
        originalDisabledDates: originalDisabledDates,
        miniCalendar: miniCalendar,
        disabledDays: disabledDays,
        min: min,
        max: max,
        maxDate: maxDate,
        minDate: minDate,
        rows: rows,
        rowHeight: rowHeight,
        isScrolling: false,
        showOverlay: showOverlay,
        today: today,
        theme: theme,
        style: style,
        locale: locale,
        passThrough: passThrough
      }, passThrough.Month));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  MonthList.prototype.componentDidMount = function componentDidMount() {
    this.scrollEl = this.VirtualList.rootNode;
  };

  MonthList.prototype.getDateOffset = function getDateOffset(date) {
    if (!isNaN(parseFloat(date)) && !isNaN(date - 0)) {
      return date;
    } else {
      var _props2 = this.props,
          min = _props2.min,
          rowHeight = _props2.rowHeight,
          weekStartsOn = _props2.locale.weekStartsOn,
          height = _props2.height;

      var weeks = getWeek(startOfMonth(min), parse(date), weekStartsOn);

      return weeks * rowHeight - (height - rowHeight / 2) / 2;
    }
  };

  MonthList.prototype.render = function render() {
    var _classNames;

    var _props3 = this.props,
        height = _props3.height,
        isScrolling = _props3.isScrolling,
        onScroll = _props3.onScroll,
        overscanMonthCount = _props3.overscanMonthCount,
        months = _props3.months,
        rowHeight = _props3.rowHeight,
        miniCalendar = _props3.miniCalendar,
        width = _props3.width;


    var itemSizes = miniCalendar ? rowHeight : rowHeight * AVERAGE_ROWS_PER_MONTH;

    return React.createElement(VirtualList, {
      ref: this._getRef,
      width: width,
      height: height,
      itemCount: months.length,
      itemSize: this.getMonthHeight,
      estimatedItemSize: itemSizes,
      renderItem: this.renderMonth,
      onScroll: onScroll,
      scrollOffset: this.state.scrollTop,
      className: classNames(styles.root, (_classNames = {}, _classNames[styles.scrolling] = isScrolling, _classNames)),
      style: { lineHeight: rowHeight + 'px' },
      overscanCount: overscanMonthCount
    });
  };

  return MonthList;
}(Component);

export { MonthList as default };
process.env.NODE_ENV !== "production" ? MonthList.propTypes = {
  lastSelectableDate: PropTypes.instanceOf(Date),
  disabledDates: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  originalDisabledDates: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  disabledDays: PropTypes.arrayOf(PropTypes.number),
  preselected: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isScrolling: PropTypes.bool,
  locale: PropTypes.object,
  maxDate: PropTypes.instanceOf(Date),
  min: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  months: PropTypes.arrayOf(PropTypes.object),
  onDaySelect: PropTypes.func,
  onScroll: PropTypes.func,
  overscanMonthCount: PropTypes.number,
  rowHeight: PropTypes.number,
  selectedDate: PropTypes.instanceOf(Date),
  showOverlay: PropTypes.bool,
  theme: PropTypes.object,
  today: PropTypes.instanceOf(Date),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
} : void 0;