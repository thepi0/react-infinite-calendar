'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('../utils');

var _format = require('date-fns/format');

var _format2 = _interopRequireDefault(_format);

var _parse = require('date-fns/parse');

var _parse2 = _interopRequireDefault(_parse);

var _get_day = require('date-fns/get_day');

var _get_day2 = _interopRequireDefault(_get_day);

var _add_days = require('date-fns/add_days');

var _add_days2 = _interopRequireDefault(_add_days);

var _sub_days = require('date-fns/sub_days');

var _sub_days2 = _interopRequireDefault(_sub_days);

var _is_before = require('date-fns/is_before');

var _is_before2 = _interopRequireDefault(_is_before);

var _is_after = require('date-fns/is_after');

var _is_after2 = _interopRequireDefault(_is_after);

var _is_date = require('date-fns/is_date');

var _is_date2 = _interopRequireDefault(_is_date);

var _is_same_year = require('date-fns/is_same_year');

var _is_same_year2 = _interopRequireDefault(_is_same_year);

var _is_this_month = require('date-fns/is_this_month');

var _is_this_month2 = _interopRequireDefault(_is_this_month);

var _is_this_year = require('date-fns/is_this_year');

var _is_this_year2 = _interopRequireDefault(_is_this_year);

var _is_within_range = require('date-fns/is_within_range');

var _is_within_range2 = _interopRequireDefault(_is_within_range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
    'rows': 'Cal__Month__rows',
    'row': 'Cal__Month__row',
    'partial': 'Cal__Month__partial',
    'indicator': 'Cal__Month__indicator',
    'display': 'Cal__Month__display',
    'month': 'Cal__Month__month',
    'year': 'Cal__Month__year',
    'indicatorCurrent': 'Cal__Month__indicatorCurrent',
    'label': 'Cal__Month__label',
    'partialFirstRow': 'Cal__Month__partialFirstRow'
};

var Month = function (_PureComponent) {
    _inherits(Month, _PureComponent);

    function Month() {
        _classCallCheck(this, Month);

        return _possibleConstructorReturn(this, _PureComponent.apply(this, arguments));
    }

    Month.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        var differentLastUpdate = nextProps.lastUpdate !== this.props.lastUpdate;
        var differentSelection = nextProps.selected !== this.props.selected;
        return differentLastUpdate || differentSelection;
    };

    Month.prototype.renderRows = function renderRows() {
        var _props = this.props,
            DayComponent = _props.DayComponent,
            disabledDates = _props.disabledDates,
            originalDisabledDates = _props.originalDisabledDates,
            lastSelectableDate = _props.lastSelectableDate,
            disabledDays = _props.disabledDays,
            monthDate = _props.monthDate,
            lastUpdate = _props.lastUpdate,
            locale = _props.locale,
            maxDate = _props.maxDate,
            minDate = _props.minDate,
            rowHeight = _props.rowHeight,
            rows = _props.rows,
            selected = _props.selected,
            preselected = _props.preselected,
            getDateOffset = _props.getDateOffset,
            today = _props.today,
            passThrough = _props.passThrough;

        var year = monthDate.getFullYear();
        var month = monthDate.getMonth();
        var monthRows = [];
        var lastDate = (0, _format2.default)((0, _sub_days2.default)(lastSelectableDate, 1), 'YYYY-MM-DD', { locale: locale.locale });
        var day = 0;
        var isDisabled = false;
        var nextDisabled = false;
        var beforeLastDisabled = false;
        var prevDisabled = false;
        var isToday = false;
        var dateDisabled = { date: null, type: null };
        var isDateVacation = false;
        var preselectedDates = passThrough.preselectedDates;
        var selectionType = passThrough.selectionType;
        var selectionDone = passThrough.selectionDone;
        var date = void 0,
            nextDate = void 0,
            prevDate = void 0,
            days = void 0,
            dow = void 0,
            nextdow = void 0,
            prevdow = void 0,
            row = void 0;
        var nextDateObject = null;
        var prevDateObject = null;

        // Used for faster comparisons
        var _today = (0, _format2.default)(today, 'YYYY-MM-DD');
        var _minDate = (0, _format2.default)(minDate, 'YYYY-MM-DD');
        var _maxDate = (0, _format2.default)(maxDate, 'YYYY-MM-DD');
        var initialDisabledDatesArray = originalDisabledDates && originalDisabledDates[0] ? originalDisabledDates : [];

        /* TODO: These can be moved to withRange and return from there */
        var disabledDatesArray = originalDisabledDates && originalDisabledDates[0] ? originalDisabledDates : [];
        var enabledDatesArray = preselected && preselected[0] ? preselected.map(function (dateObj) {
            return { date: (0, _format2.default)(dateObj.start_time, 'YYYY-MM-DD'), type: 'preselect' };
        }) : null;
        var reallyDisabledDatesArray = originalDisabledDates && originalDisabledDates[0] ? originalDisabledDates.filter(function (object) {
            return object.type === 'holiday';
        }) : [];

        if (selectionType === 'not_preselected' && disabledDatesArray != null && disabledDatesArray.length) {
            disabledDatesArray = disabledDatesArray.concat(preselectedDates);
            reallyDisabledDatesArray = reallyDisabledDatesArray.concat(preselectedDates);
        } else if (selectionType === 'preselected' && enabledDatesArray != null && enabledDatesArray.length) {
            enabledDatesArray = enabledDatesArray.concat(preselectedDates);

            if (selected && selected.start_time && (0, _is_date2.default)(lastSelectableDate) && (0, _is_before2.default)((0, _format2.default)(selected.start_time, 'YYYY-MM-DD'), lastDate)) {
                enabledDatesArray = enabledDatesArray.filter(function (date) {
                    return (0, _is_before2.default)(date.date, lastDate);
                });
            } else if (selected && selected.start_time && (0, _is_date2.default)(lastSelectableDate) && (0, _is_before2.default)(lastDate, (0, _format2.default)(selected.start_time, 'YYYY-MM-DD'))) {
                enabledDatesArray = enabledDatesArray.filter(function (date) {
                    return (0, _is_before2.default)(lastDate, date.date);
                });
            }
        } else {
            disabledDatesArray = disabledDatesArray;
        }

        for (var i = 0, len = rows.length; i < len; i++) {
            var _classNames;

            row = rows[i];
            days = [];
            dow = (0, _get_day2.default)(new Date(year, month, row[0]));
            dow === 0 ? dow = 7 : dow;

            for (var k = 0, _len = row.length; k < _len; k++) {
                isDateVacation = false;
                dateDisabled = { date: null, type: null };
                day = row[k];
                nextDateObject = null;
                prevDateObject = null;
                date = (0, _utils.getDateString)(year, month, day);
                nextDate = (0, _format2.default)((0, _add_days2.default)(date, 1), 'YYYY-MM-DD');
                prevDate = (0, _format2.default)((0, _sub_days2.default)(date, 1), 'YYYY-MM-DD');
                nextDateObject = { date: (0, _format2.default)((0, _add_days2.default)(date, 1), 'YYYY-MM-DD'), type: 'holiday' };
                prevDateObject = { date: (0, _format2.default)((0, _sub_days2.default)(date, 1), 'YYYY-MM-DD'), type: 'holiday' };
                isToday = date === _today;
                nextdow = dow + 1;
                prevdow = dow === 1 ? 7 : dow - 1;

                for (var x = 0, _len2 = initialDisabledDatesArray.length; x < _len2; x++) {
                    if (initialDisabledDatesArray[x].date === date && initialDisabledDatesArray[x].type === 'vacation' && !(0, _is_before2.default)(date, lastDate)) {
                        isDateVacation = true;
                        break;
                    }
                }

                if (selectionType === 'none' || selectionType === 'not_preselected') {
                    for (var j = 0, _len3 = initialDisabledDatesArray.length; j < _len3; j++) {
                        if ((0, _format2.default)(initialDisabledDatesArray[j].date, 'YYYY-MM-DD', { locale: locale.locale }) === (0, _format2.default)(date, 'YYYY-MM-DD') && initialDisabledDatesArray[j].type === 'holiday') {
                            dateDisabled = initialDisabledDatesArray[j];
                            break;
                        }
                    }
                } else if (selectionType === 'preselected') {
                    for (var _j = 0, _len4 = enabledDatesArray.length; _j < _len4; _j++) {
                        if ((0, _format2.default)(enabledDatesArray[_j].date, 'YYYY-MM-DD', { locale: locale.locale }) === (0, _format2.default)(date, 'YYYY-MM-DD')) {
                            dateDisabled = enabledDatesArray[_j];
                            break;
                        }
                    }
                }

                isDisabled = minDate && date < _minDate || maxDate && date > _maxDate || disabledDays && disabledDays.length && disabledDays.indexOf(dow) !== -1 || initialDisabledDatesArray && selectionType === 'none' && initialDisabledDatesArray.indexOf(dateDisabled) !== -1 || disabledDatesArray && selectionType === 'not_preselected' && (disabledDatesArray.map(function (e) {
                    return e.date;
                }).indexOf(dateDisabled.date) !== -1 || initialDisabledDatesArray.map(function (e) {
                    return e.date;
                }).indexOf(dateDisabled.date) !== -1 || reallyDisabledDatesArray && reallyDisabledDatesArray.length && reallyDisabledDatesArray.map(function (e) {
                    return e.date;
                }).indexOf(date) !== -1 || (0, _is_date2.default)(lastSelectableDate) && (0, _is_before2.default)(date, lastDate)) || enabledDatesArray && selectionType === 'preselected' && (enabledDatesArray.map(function (e) {
                    return e.date;
                }).indexOf(dateDisabled.date) === -1 || initialDisabledDatesArray.map(function (e) {
                    return { date: e.date, type: e.type };
                }).indexOf(dateDisabled) !== -1);

                prevDisabled = disabledDays && disabledDays.length && disabledDays.indexOf(prevdow) !== -1 || reallyDisabledDatesArray && reallyDisabledDatesArray.length && reallyDisabledDatesArray.map(function (e) {
                    return e.date;
                }).indexOf(prevDateObject.date) !== -1;

                nextDisabled = disabledDays && disabledDays.length && disabledDays.indexOf(nextdow) !== -1 || reallyDisabledDatesArray && reallyDisabledDatesArray.length && reallyDisabledDatesArray.map(function (e) {
                    return e.date;
                }).indexOf(nextDateObject.date) !== -1;

                beforeLastDisabled = (0, _is_date2.default)(lastSelectableDate) && (0, _is_before2.default)(date, lastDate);

                days[k] = _react2.default.createElement(DayComponent, _extends({
                    key: 'day-' + day,
                    date: date,
                    day: day,
                    isVacation: isDateVacation,
                    originalDisabledDates: originalDisabledDates,
                    beforeLastDisabled: beforeLastDisabled,
                    selected: selected,
                    preselected: preselected,
                    nextDisabled: nextDisabled,
                    prevDisabled: prevDisabled,
                    isDisabled: isDisabled,
                    isToday: isToday
                }, passThrough.Day));

                dow += 1;
            }
            monthRows[i] = _react2.default.createElement(
                'ul',
                {
                    key: 'Row-' + i,
                    className: (0, _classnames2.default)(styles.row, (_classNames = {}, _classNames[styles.partial] = row.length !== 7, _classNames)),
                    style: { height: rowHeight },
                    role: 'row',
                    'aria-label': 'Week ' + (i + 1)
                },
                days
            );
        }

        return monthRows;
    };

    Month.prototype.render = function render() {
        var _classNames2;

        var _props2 = this.props,
            locale = _props2.locale.locale,
            monthDate = _props2.monthDate,
            today = _props2.today,
            rows = _props2.rows,
            rowHeight = _props2.rowHeight,
            style = _props2.style;

        var dateFormat = (0, _is_same_year2.default)(monthDate, today) ? 'MMMM' : 'MMMM YYYY';
        var isCurrentMonth = (0, _is_this_month2.default)(monthDate) && (0, _is_this_year2.default)(monthDate);

        return _react2.default.createElement(
            'div',
            { className: styles.root, style: _extends({}, style, { lineHeight: rowHeight + 'px' }) },
            _react2.default.createElement(
                'div',
                { className: (0, _classnames2.default)(styles.indicator, (_classNames2 = {}, _classNames2[styles.indicatorCurrent] = isCurrentMonth, _classNames2)) },
                _react2.default.createElement(
                    'div',
                    { className: styles.display },
                    _react2.default.createElement(
                        'span',
                        { className: 'month' },
                        (0, _format2.default)(monthDate, 'MMMM', { locale: locale })
                    ),
                    _react2.default.createElement(
                        'span',
                        { className: 'year' },
                        (0, _format2.default)(monthDate, 'YYYY', { locale: locale })
                    )
                )
            ),
            _react2.default.createElement(
                'div',
                { className: styles.rows },
                this.renderRows()
            )
        );
    };

    return Month;
}(_react.PureComponent);

exports.default = Month;
module.exports = exports['default'];