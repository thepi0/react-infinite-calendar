var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { getDateString, getWeek } from '../utils';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import getDay from 'date-fns/get_day';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import isBefore from 'date-fns/is_before';
import isAfter from 'date-fns/is_after';
import isDate from 'date-fns/is_date';
import isSameYear from 'date-fns/is_same_year';
import isThisMonth from 'date-fns/is_this_month';
import isThisYear from 'date-fns/is_this_year';
var styles = {
    'rows': 'Cal__Month__rows',
    'mini': 'Cal__Month__mini',
    'row': 'Cal__Month__row',
    'partial': 'Cal__Month__partial',
    'indicator': 'Cal__Month__indicator',
    'display': 'Cal__Month__display',
    'month': 'Cal__Month__month',
    'year': 'Cal__Month__year',
    'indicatorCurrent': 'Cal__Month__indicatorCurrent',
    'label': 'Cal__Month__label',
    'partialFirstRow': 'Cal__Month__partialFirstRow',
    'weekNumber': 'Cal__Month__weekNumber'
};

import isWithinRange from 'date-fns/is_within_range';
import getISOWeek from 'date-fns/get_iso_week';
import startOfYear from 'date-fns/start_of_year';
import startOfWeek from 'date-fns/start_of_week';

var Month = function (_PureComponent) {
    _inherits(Month, _PureComponent);

    function Month() {
        _classCallCheck(this, Month);

        return _possibleConstructorReturn(this, _PureComponent.apply(this, arguments));
    }

    Month.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        var differentLastUpdate = nextProps.lastUpdate !== this.props.lastUpdate;
        var differentSelectionStart = nextProps.selected.start_time !== this.props.selected.start_time;
        var differentSelectionEnd = nextProps.selected.end_time !== this.props.selected.end_time;
        var differentSelectionDone = nextProps.passThrough.selectionDone !== this.props.passThrough.selectionDone;
        var differentUpdateFromController = nextProps.passThrough.updateFromController !== this.props.passThrough.updateFromController;
        return differentLastUpdate || differentSelectionStart || differentSelectionEnd || differentSelectionDone || differentUpdateFromController;
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
            min = _props.min,
            max = _props.max,
            rowHeight = _props.rowHeight,
            rows = _props.rows,
            selected = _props.selected,
            miniCalendar = _props.miniCalendar,
            preselected = _props.preselected,
            getDateOffset = _props.getDateOffset,
            today = _props.today,
            passThrough = _props.passThrough;

        var year = monthDate.getFullYear();
        var month = monthDate.getMonth();
        var monthRows = [];
        var lastDate = format(subDays(lastSelectableDate, 1), 'YYYY-MM-DD', { locale: locale.locale });
        var day = 0;
        var isDisabled = false;
        var nextDisabled = false;
        var beforeLastDisabled = false;
        var prevDisabled = false;
        var isToday = false;
        var dateDisabled = { date: null, type: null };
        var selectionArray = passThrough.selectionArray;
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
        var isoWeek = null;
        var weekNumber = null;
        var dayDow = 0;
        var absoluteMin = format(min, 'YYYY-MM-DD');
        var absoluteMax = format(max, 'YYYY-MM-DD');

        // Used for faster comparisons
        var _today = format(today, 'YYYY-MM-DD');
        var _minDate = format(minDate, 'YYYY-MM-DD');
        var _maxDate = format(maxDate, 'YYYY-MM-DD');
        var initialDisabledDatesArray = originalDisabledDates && originalDisabledDates[0] ? originalDisabledDates : [];

        var enabledDatesArray = preselected && preselected[0] ? preselected.map(function (dateObj) {
            return { date: format(dateObj.start_time, 'YYYY-MM-DD'), type: 'preselect' };
        }) : null;
        var reallyDisabledDatesArray = originalDisabledDates && originalDisabledDates[0] ? originalDisabledDates.filter(function (object) {
            return object.type === 'holiday' || object.type === 'no-reservation';
        }) : [];

        if (selectionType === 'not_preselected') {
            reallyDisabledDatesArray = reallyDisabledDatesArray.concat(preselectedDates);
        } else if (selectionType === 'preselected' && enabledDatesArray != null && enabledDatesArray.length) {
            enabledDatesArray = enabledDatesArray.concat(preselectedDates);

            if (selected && selected.start_time && isDate(lastSelectableDate) && isBefore(format(selected.start_time, 'YYYY-MM-DD'), lastDate)) {
                enabledDatesArray = enabledDatesArray.filter(function (date) {
                    return isBefore(date.date, lastDate);
                });
            } else if (selected && selected.start_time && isDate(lastSelectableDate) && isBefore(lastDate, format(selected.start_time, 'YYYY-MM-DD'))) {
                enabledDatesArray = enabledDatesArray.filter(function (date) {
                    return isBefore(lastDate, date.date);
                });
            }
        }

        for (var i = 0, len = rows.length; i < len; i++) {
            row = rows[i];
            days = [];
            dow = getDay(new Date(year, month, row[0]));
            dow === 0 ? dow = 7 : dow;
            weekNumber = null;

            for (var k = 0, _len = row.length; k < _len; k++) {
                dateDisabled = { date: null, type: null };
                day = row[k];
                nextDateObject = null;
                prevDateObject = null;
                date = getDateString(year, month, day);
                nextDate = format(addDays(date, 1), 'YYYY-MM-DD');
                prevDate = format(subDays(date, 1), 'YYYY-MM-DD');
                nextDateObject = { date: format(addDays(date, 1), 'YYYY-MM-DD'), type: 'holiday' };
                prevDateObject = { date: format(subDays(date, 1), 'YYYY-MM-DD'), type: 'holiday' };
                isToday = date === _today;
                nextdow = dow + 1;
                prevdow = dow === 1 ? 7 : dow - 1;
                isoWeek = null;

                if (dow === 4) {
                    isoWeek = getISOWeek(date);
                    weekNumber = React.createElement(
                        'div',
                        { className: styles.weekNumber },
                        ' ',
                        isoWeek,
                        ' '
                    );
                }

                /*for (let x = 0, len = initialDisabledDatesArray.length; x < len; x++) {
                    if (initialDisabledDatesArray[x].date === date) {
                        isDateVacation = true;
                        break;
                    }
                }*/

                /*if (selectionType === 'none' || selectionType === 'not_preselected') {
                    for (let j = 0, len = initialDisabledDatesArray.length; j < len; j++) {
                        if (format(initialDisabledDatesArray[j].date, 'YYYY-MM-DD', {locale: locale.locale}) === format(date, 'YYYY-MM-DD') && initialDisabledDatesArray[j].type === 'holiday') {
                            dateDisabled = initialDisabledDatesArray[j];
                            break;
                        }
                    }
                } else if (selectionType === 'preselected') {
                    for (let j = 0, len = enabledDatesArray.length; j < len; j++) {
                        if (format(enabledDatesArray[j].date, 'YYYY-MM-DD', {locale: locale.locale}) === format(date, 'YYYY-MM-DD')) {
                            dateDisabled = enabledDatesArray[j];
                            break;
                        }
                    }
                }*/

                isDisabled = minDate && date < _minDate || maxDate && date > _maxDate || selectionArray.includes(format(date, 'YYYY-MM-DD')) || disabledDays && disabledDays.length && disabledDays.indexOf(dow) !== -1 ||
                //initialDisabledDatesArray && selectionType === 'none' && initialDisabledDatesArray.indexOf(dateDisabled) !== -1 ||
                /*initialDisabledDatesArray && selectionType === 'not_preselected' &&
                (
                    (
                    initialDisabledDatesArray.map((e) => { return e.date; }).indexOf(dateDisabled.date) !== -1
                    )
                )
                ||*/
                initialDisabledDatesArray && selectionType === 'preselected' && isDate(lastSelectableDate) && isBefore(date, lastDate)
                /*||
                initialDisabledDatesArray.map((e) => { return {date: e.date, type: e.type}; }).indexOf(dateDisabled) !== -1*/
                ;

                prevDisabled = disabledDays && disabledDays.length && disabledDays.indexOf(prevdow) !== -1 || reallyDisabledDatesArray && reallyDisabledDatesArray.length && reallyDisabledDatesArray.map(function (e) {
                    return e.date;
                }).indexOf(prevDateObject.date) !== -1;

                nextDisabled = disabledDays && disabledDays.length && disabledDays.indexOf(nextdow) !== -1 || reallyDisabledDatesArray && reallyDisabledDatesArray.length && reallyDisabledDatesArray.map(function (e) {
                    return e.date;
                }).indexOf(nextDateObject.date) !== -1;

                beforeLastDisabled = isDate(lastSelectableDate) && isBefore(date, lastDate);

                if (miniCalendar) {
                    if (!isBefore(date, absoluteMin) && !isAfter(date, absoluteMax) && dow !== 6 && dow !== 7) {
                        days[k] = React.createElement(DayComponent, _extends({
                            key: 'day-' + day,
                            date: date,
                            day: day,
                            originalDisabledDates: originalDisabledDates,
                            beforeLastDisabled: beforeLastDisabled,
                            selected: selected,
                            selectionArray: selectionArray,
                            preselected: preselected,
                            lastUpdate: lastUpdate,
                            nextDisabled: nextDisabled,
                            prevDisabled: prevDisabled,
                            isDisabled: isDisabled,
                            selectionType: selectionType,
                            isToday: isToday
                        }, passThrough.Day));
                    }
                    dow += 1;
                } else {
                    days[k] = React.createElement(DayComponent, _extends({
                        key: 'day-' + day,
                        date: date,
                        day: day,
                        originalDisabledDates: originalDisabledDates,
                        beforeLastDisabled: beforeLastDisabled,
                        selected: selected,
                        selectionArray: selectionArray,
                        preselected: preselected,
                        lastUpdate: lastUpdate,
                        nextDisabled: nextDisabled,
                        prevDisabled: prevDisabled,
                        isDisabled: isDisabled,
                        selectionType: selectionType,
                        isToday: isToday
                    }, passThrough.Day));

                    dow += 1;
                }
            }
            {
                var _classNames;

                days.length ? monthRows[i] = React.createElement(
                    'ul',
                    {
                        key: 'Row-' + i,
                        className: classNames(styles.row, (_classNames = {}, _classNames[styles.partial] = row.length !== 7, _classNames)),
                        style: { height: rowHeight },
                        role: 'row',
                        'aria-label': 'Week ' + (i + 1)
                    },
                    !miniCalendar ? weekNumber : null,
                    days
                ) : null;
            }
        }

        return monthRows;
    };

    Month.prototype.render = function render() {
        var _classNames2, _classNames3;

        var _props2 = this.props,
            locale = _props2.locale.locale,
            miniCalendar = _props2.miniCalendar,
            monthDate = _props2.monthDate,
            today = _props2.today,
            rows = _props2.rows,
            rowHeight = _props2.rowHeight,
            style = _props2.style;

        var dateFormat = isSameYear(monthDate, today) ? 'MMMM' : 'MMMM YYYY';
        var isCurrentMonth = isThisMonth(monthDate) && isThisYear(monthDate);

        return React.createElement(
            'div',
            { className: styles.root, style: _extends({}, style, { lineHeight: rowHeight + 'px' }) },
            !miniCalendar ? React.createElement(
                'div',
                { className: classNames(styles.indicator, (_classNames2 = {}, _classNames2[styles.indicatorCurrent] = isCurrentMonth, _classNames2)) },
                React.createElement(
                    'div',
                    { className: styles.display },
                    React.createElement(
                        'span',
                        { className: 'month' },
                        format(monthDate, 'MMMM', { locale: locale })
                    ),
                    React.createElement(
                        'span',
                        { className: 'year' },
                        format(monthDate, 'YYYY', { locale: locale })
                    )
                )
            ) : null,
            React.createElement(
                'div',
                { className: classNames(styles.rows, (_classNames3 = {}, _classNames3[styles.mini] = miniCalendar, _classNames3)) },
                this.renderRows()
            )
        );
    };

    return Month;
}(PureComponent);

export { Month as default };