var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { getDateString } from '../utils';
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

import isWithinRange from 'date-fns/is_within_range';

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
            today = _props.today,
            passThrough = _props.passThrough;

        var year = monthDate.getFullYear();
        var month = monthDate.getMonth();
        var monthShort = format(monthDate, 'MMM', { locale: locale.locale });
        var monthRows = [];
        var lastDate = format(subDays(lastSelectableDate, 1), 'YYYY-MM-DD', { locale: locale.locale });
        var day = 0;
        var isDisabled = false;
        var nextDisabled = false;
        var beforeLastDisabled = false;
        var prevDisabled = false;
        var nextSelected = false;
        var prevSelected = false;
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
        var preselectedDays = preselected.days;
        var preselectedColors = preselected.colors;

        // Used for faster comparisons
        var _today = format(today, 'YYYY-MM-DD');
        var _minDate = format(minDate, 'YYYY-MM-DD');
        var _maxDate = format(maxDate, 'YYYY-MM-DD');
        var initialDisabledDatesArray = originalDisabledDates && originalDisabledDates[0] ? originalDisabledDates : [];

        /* TODO: These can be moved to withRange and return from there */
        var disabledDatesArray = originalDisabledDates && originalDisabledDates[0] ? originalDisabledDates : [];
        var enabledDatesArray = preselectedDays && preselectedDays[0] ? preselectedDays.map(function (dateObj) {
            return { date: format(dateObj.start_time, 'YYYY-MM-DD'), type: 'preselect' };
        }) : null;
        var reallyDisabledDatesArray = originalDisabledDates && originalDisabledDates[0] ? originalDisabledDates.filter(function (object) {
            return object.type === 'holiday';
        }) : [];

        if (selectionType === 'not_preselected' && disabledDatesArray != null && disabledDatesArray.length) {
            disabledDatesArray = disabledDatesArray.concat(preselectedDates);
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
        } else {
            disabledDatesArray = disabledDatesArray;
        }

        for (var i = 0, len = rows.length; i < len; i++) {
            var _classNames;

            row = rows[i];
            days = [];
            dow = getDay(new Date(year, month, row[0]));

            for (var k = 0, _len = row.length; k < _len; k++) {
                isDateVacation = false;
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

                /* TODO: This should be passed from withRange */
                for (var x = 0, _len2 = initialDisabledDatesArray.length; x < _len2; x++) {
                    if (initialDisabledDatesArray[x].date === date && initialDisabledDatesArray[x].type === 'vacation' && !isBefore(date, lastDate)) {
                        isDateVacation = true;
                        break;
                    }
                }

                if (selectionType === 'none' || selectionType === 'not_preselected') {
                    for (var j = 0, _len3 = initialDisabledDatesArray.length; j < _len3; j++) {
                        if (format(initialDisabledDatesArray[j].date, 'YYYY-MM-DD', { locale: locale.locale }) === format(date, 'YYYY-MM-DD') && initialDisabledDatesArray[j].type === 'holiday') {
                            dateDisabled = initialDisabledDatesArray[j];
                            break;
                        }
                    }
                } else if (selectionType === 'preselected') {
                    for (var _j = 0, _len4 = enabledDatesArray.length; _j < _len4; _j++) {
                        if (format(enabledDatesArray[_j].date, 'YYYY-MM-DD', { locale: locale.locale }) === format(date, 'YYYY-MM-DD')) {
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
                }).indexOf(date) !== -1 || isDate(lastSelectableDate) && isBefore(date, lastDate)) || enabledDatesArray && selectionType === 'preselected' && (enabledDatesArray.map(function (e) {
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

                beforeLastDisabled = isDate(lastSelectableDate) && isBefore(date, lastDate);

                days[k] = React.createElement(DayComponent, _extends({
                    key: 'day-' + day,
                    date: date,
                    day: day,
                    isVacation: isDateVacation,
                    originalDisabledDates: originalDisabledDates,
                    beforeLastDisabled: beforeLastDisabled,
                    selected: selected,
                    preselected: preselectedDays,
                    preselectedColors: preselectedColors,
                    nextDisabled: nextDisabled,
                    prevDisabled: prevDisabled,
                    isDisabled: isDisabled,
                    isToday: isToday
                }, passThrough.Day));

                dow += 1;
            }
            monthRows[i] = React.createElement(
                'ul',
                {
                    key: 'Row-' + i,
                    className: classNames(styles.row, (_classNames = {}, _classNames[styles.partial] = row.length !== 7, _classNames)),
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

        var dateFormat = isSameYear(monthDate, today) ? 'MMMM' : 'MMMM YYYY';
        var isCurrentMonth = isThisMonth(monthDate) && isThisYear(monthDate);

        return React.createElement(
            'div',
            { className: styles.root, style: _extends({}, style, { lineHeight: rowHeight + 'px' }) },
            React.createElement(
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
            ),
            React.createElement(
                'div',
                { className: styles.rows },
                this.renderRows()
            )
        );
    };

    return Month;
}(PureComponent);

export { Month as default };