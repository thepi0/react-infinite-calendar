import _withState from 'recompose/withState';
import _withPropsOnChange from 'recompose/withPropsOnChange';
import _withProps from 'recompose/withProps';
import _compose from 'recompose/compose';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import classNames from 'classnames';
import { withDefaultProps } from './';
import { withImmutableProps } from '../utils';
import isBefore from 'date-fns/is_before';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import addMonths from 'date-fns/add_months';
import eachDay from 'date-fns/each_day';
import differenceInDays from 'date-fns/difference_in_days';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import isWithinRange from 'date-fns/is_within_range';
import isWeekend from 'date-fns/is_weekend';
import isSaturday from 'date-fns/is_saturday';
import isSunday from 'date-fns/is_sunday';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
var styles = {
    'root': 'Cal__Day__root',
    'vacationCircle': 'Cal__Day__vacationCircle',
    'beforelast': 'Cal__Day__beforelast',
    'weekend': 'Cal__Day__weekend',
    'holiday': 'Cal__Day__holiday',
    'noReservation': 'Cal__Day__noReservation',
    'disabled': 'Cal__Day__disabled',
    'preselected': 'Cal__Day__preselected',
    'nextselected': 'Cal__Day__nextselected',
    'prevselected': 'Cal__Day__prevselected',
    'nextdifferentiates': 'Cal__Day__nextdifferentiates',
    'prevdifferentiates': 'Cal__Day__prevdifferentiates',
    'purple': 'Cal__Day__purple',
    'blue': 'Cal__Day__blue',
    'green': 'Cal__Day__green',
    'orange': 'Cal__Day__orange',
    'enabled': 'Cal__Day__enabled',
    'highlighted': 'Cal__Day__highlighted',
    'today': 'Cal__Day__today',
    'selected': 'Cal__Day__selected',
    'selection': 'Cal__Day__selection',
    'nextdisabled': 'Cal__Day__nextdisabled',
    'prevdisabled': 'Cal__Day__prevdisabled',
    'preselecteddisabled': 'Cal__Day__preselecteddisabled',
    'preselectedenabled': 'Cal__Day__preselectedenabled',
    'day': 'Cal__Day__day',
    'month': 'Cal__Day__month',
    'hide': 'Cal__Day__hide',
    'range': 'Cal__Day__range',
    'start': 'Cal__Day__start',
    'nextnotpreselected': 'Cal__Day__nextnotpreselected',
    'prevnotpreselected': 'Cal__Day__prevnotpreselected',
    'betweenRange': 'Cal__Day__betweenRange',
    'end': 'Cal__Day__end'
};


var isTouchDevice = is_touch_device();
var preSelectedSelected = false;
var touchDate = null;
var selectedArrayFinal = [];
var lastSelectionBeforeLastDisabled = false;
var latestUpdate = new Date();
var savedSelectionType = null;

export var EVENT_TYPE = {
    END: 3,
    HOVER: 2,
    START: 1
};

var PositionTypes = {
    START: 'START',
    RANGE: 'RANGE',
    END: 'END'
};

// Enhance Day component to display selected state based on an array of selected dates
export var enhanceDay = _withPropsOnChange(['selected'], function (_ref) {
    var _classNames, _classNames2, _classNames3;

    var date = _ref.date,
        selected = _ref.selected,
        selectionArray = _ref.selectionArray,
        originalDisabledDates = _ref.originalDisabledDates,
        preselected = _ref.preselected;

    var isSelected = false;
    var isArraySelected = false;
    var isStart = false;
    var isEnd = false;
    var isRange = false;
    var isArrayStart = false;
    var isArrayEnd = false;
    var isArrayRange = false;
    var isWeekend = false;
    if (selected && selected.start_time && selected.end_time) {
        isSelected = date >= selected.start_time && date <= selected.end_time;
        isStart = date === selected.start_time;
        isEnd = date === selected.end_time;
        isRange = !(isStart && isEnd);
    }
    if (selectionArray && selectionArray.length) {
        isArraySelected = selectionArray.includes(format(date, 'YYYY-MM-DD'));
        isArrayStart = !selectionArray.includes(format(subDays(date, 1), 'YYYY-MM-DD'));
        isArrayEnd = !selectionArray.includes(format(addDays(date, 1), 'YYYY-MM-DD'));
        isArrayRange = !(isArrayStart && isArrayEnd);
    }
    isWeekend = isSaturday(date) || isSunday(date);
    var positionOfDate = determineIfDateAlreadySelected(date, preselected, originalDisabledDates);
    var isPreSelected = !!positionOfDate.value;
    var isPreStart = positionOfDate.value === PositionTypes.START;
    var isPreEnd = positionOfDate.value === PositionTypes.END;
    var isNextSelected = positionOfDate.nextselected;
    var isPrevSelected = positionOfDate.prevselected;
    var isNextPreSelected = positionOfDate.nextpreselected;
    var isPrevPreSelected = positionOfDate.prevpreselected;
    var isNextCountDifferent = positionOfDate.nextcountdifferentiates;
    var isPrevCountDifferent = positionOfDate.prevcountdifferentiates;
    var isPreSelectedValue = preSelectedSelected;
    var isNextPreDifferent = isNextPreSelected;
    var isPrevPreDifferent = isPrevPreSelected;
    var vacationObject = {
        vacation: positionOfDate.vacation,
        vacation_type: positionOfDate.vacation_type,
        hide: positionOfDate.hide
    };

    var dayClasses = isSelected && isRange && classNames(styles.range, (_classNames = {}, _classNames[styles.start] = isStart, _classNames[styles.betweenRange] = !isStart && !isEnd, _classNames[styles.end] = isEnd, _classNames[styles.nextselected] = isNextSelected, _classNames[styles.prevselected] = isPrevSelected, _classNames[styles.nextdifferentiates] = isNextCountDifferent, _classNames[styles.prevdifferentiates] = isPrevCountDifferent, _classNames[styles.nextpreselected] = isPreSelectedValue && isNextPreDifferent, _classNames[styles.prevpreselected] = isPreSelectedValue && isPrevPreDifferent, _classNames[styles.nextnotpreselected] = isPreSelectedValue && !isNextPreDifferent, _classNames[styles.prevnotpreselected] = isPreSelectedValue && !isPrevPreDifferent, _classNames)) || isArraySelected && isArrayRange && classNames(styles.range, (_classNames2 = {}, _classNames2[styles.start] = isArrayStart, _classNames2[styles.betweenRange] = !isArrayStart && !isArrayEnd, _classNames2[styles.end] = isArrayEnd, _classNames2[styles.nextselected] = isNextSelected, _classNames2[styles.prevselected] = isPrevSelected, _classNames2[styles.nextdifferentiates] = isNextCountDifferent, _classNames2[styles.prevdifferentiates] = isPrevCountDifferent, _classNames2[styles.nextpreselected] = isPreSelectedValue && isNextPreDifferent, _classNames2[styles.prevpreselected] = isPreSelectedValue && isPrevPreDifferent, _classNames2[styles.nextnotpreselected] = isPreSelectedValue && !isNextPreDifferent, _classNames2[styles.prevnotpreselected] = isPreSelectedValue && !isPrevPreDifferent, _classNames2)) || isPreSelected && classNames(styles.range, (_classNames3 = {}, _classNames3[styles.prestart] = isPreStart, _classNames3[styles.preend] = isPreEnd, _classNames3[styles.nextselected] = isNextSelected, _classNames3[styles.prevselected] = isPrevSelected, _classNames3[styles.nextdifferentiates] = isNextCountDifferent, _classNames3[styles.prevdifferentiates] = isPrevCountDifferent, _classNames3));

    return {
        className: dayClasses,
        isPreSelected: isPreSelected,
        isSelected: isSelected,
        isArraySelected: isArraySelected,
        isWeekend: isWeekend,
        vacationObject: vacationObject
    };
});

// Enhancer to handle selecting and displaying multiple dates
var withRange = _compose(withDefaultProps, _withState('scrollDate', 'setScrollDate', getInitialDate), _withState('displayKey', 'setDisplayKey', getInitialDate), _withState('updateFromController', 'setUpdateFromController', new Date()), _withState('selectionStart', 'setSelectionStart', null), _withState('selectionArray', 'setSelectionArray', []), _withState('preselectedDates', 'setPreselectedDates', []), _withState('selectionType', 'setSelectionType', 'none'), _withState('selectionDone', 'setSelectionDone', false), _withState('stopPropagation', 'setStopPropagation', false), withImmutableProps(function (_ref2) {
    var DayComponent = _ref2.DayComponent;
    return {
        DayComponent: enhanceDay(DayComponent)
    };
}), _withProps(function (_ref3) {
    var displayKey = _ref3.displayKey,
        passThrough = _ref3.passThrough,
        selected = _ref3.selected,
        preselected = _ref3.preselected,
        originalDisabledDates = _ref3.originalDisabledDates,
        setDisplayKey = _ref3.setDisplayKey,
        props = _objectWithoutProperties(_ref3, ['displayKey', 'passThrough', 'selected', 'preselected', 'originalDisabledDates', 'setDisplayKey']);

    return {
        /* eslint-disable sort-keys */
        passThrough: _extends({}, passThrough, {
            Day: {
                onClear: function onClear() {
                    return clearSelection(_extends({ selected: selected }, props));
                },
                onSelectionStart: function onSelectionStart(date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop) {
                    return handleSelectionStart(date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop, _extends({ selected: selected, preselected: preselected }, props));
                },
                onSelectionEnd: function onSelectionEnd(e, date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop) {
                    return handleSelectionEnd(e, date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop, _extends({ selected: selected, preselected: preselected }, props));
                },
                handlers: {
                    onMouseMove: !isTouchDevice && props.selectionStart ? function (e) {
                        return handleSelectionMove(e, _extends({ selected: selected, preselected: preselected }, props));
                    } : null,
                    onTouchMove: isTouchDevice && props.selectionStart ? function (e) {
                        return handleSelectionMove(e, _extends({ selected: selected, preselected: preselected }, props));
                    } : null
                }
            },
            selectionArray: props.selectionArray,
            preselectedDates: props.preselectedDates,
            selectionType: props.selectionType,
            selectionDone: props.selectionDone,
            updateFromController: props.updateFromController
        }),
        preselected: preselected && preselected.length ? handlePreselected(preselected) : [],
        startDays: preselected && preselected.length ? getStartDays(preselected) : [],
        selected: {
            start_time: selected && format(selected.start_time, 'YYYY-MM-DD'),
            end_time: selected && format(selected.end_time, 'YYYY-MM-DD')
        }
    };
}));

export { withRange };
function getStartDays(preselected) {

    var starts = [];

    preselected = preselected ? preselected : [];

    for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
        var dayStart = format(preselected[i].start_time, 'YYYY-MM-DD');
        if (!starts.includes(dayStart)) {
            starts.push(dayStart);
        }
    }

    return starts;
}

function handlePreselected(preselected) {

    preselected = preselected ? preselected : [];

    var days = [];
    var starts = [];
    var colors = [];

    for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
        var dayStart = format(preselected[i].start_time, 'YYYY-MM-DD');
        var dayEnd = format(preselected[i].end_time, 'YYYY-MM-DD');
        var dayChild = preselected[i].child;

        var pushThis = {
            color: preselected[i].color,
            start_time: dayStart,
            end_time: dayEnd,
            child: preselected[i].child,
            original_start: preselected[i].start_time,
            original_end: preselected[i].end_time,
            count: 1,
            nextselected: false,
            prevselected: false,
            nextpreselected: false,
            prevpreselected: false,
            nextcountdifferentiates: false,
            prevcountdifferentiates: false,
            nextpreselecteddifferentiates: false,
            prevpreselecteddifferentiates: false,
            preselected: true
        };

        if (starts.includes(dayStart)) {
            for (var y = 0, dayy = days.length; y < dayy; ++y) {
                if (days[y].start_time == dayStart && days[y].child !== dayChild) {
                    pushThis.count += 1;
                    days[y].count += 1;
                }
            }
        }

        colors.push({ date: dayStart, colors: preselected[i].color });
        starts.push(dayStart);
        days.push(pushThis);
    }

    var colorArray = [];

    if (colors && colors.length) {
        colors.forEach(function (a) {
            if (!this[a.date]) {
                this[a.date] = { date: a.date, colors: [] };
                colorArray.push(this[a.date]);
            }
            this[a.date].colors.push(a.colors);
        }, Object.create(null));
    }

    for (var x = 0, day = days.length; x < day; ++x) {
        for (var m = 0, col = colorArray.length; m < col; ++m) {
            if (days[x].start_time === colorArray[m].date) {
                days[x].colors = colorArray[m].colors;
            }
        }
    }

    var _loop = function _loop(k, _day) {
        var dayStart = format(days[k].start_time, 'YYYY-MM-DD');
        var nextDayStart = format(addDays(dayStart, 1), 'YYYY-MM-DD');
        var prevDayStart = format(subDays(dayStart, 1), 'YYYY-MM-DD');

        if (starts.includes(nextDayStart)) {
            days[k].nextselected = true;
            var nextday = days.filter(function (date) {
                return date.start_time === nextDayStart;
            });

            if (nextday && nextday[0] && nextday[0].count && (nextday[0].count !== days[k].count || !areArraysEqual(nextday[0].colors, days[k].colors))) {
                days[k].nextcountdifferentiates = true;
            }

            if (nextday && nextday[0] && nextday[0].preselected) {
                days[k].nextpreselected = true;
            }

            if (nextday && nextday[0] && nextday[0].preselected && nextday[0].preselected !== days[k].preselected) {
                days[k].nextpreselecteddifferentiates = true;
            }
        }

        if (starts.includes(prevDayStart)) {
            days[k].prevselected = true;
            var prevday = days.filter(function (date) {
                return date.end_time === prevDayStart;
            });

            if (prevday && prevday[0] && prevday[0].count && (prevday[0].count !== days[k].count || !areArraysEqual(prevday[0].colors, days[k].colors))) {
                days[k].prevcountdifferentiates = true;
            }

            if (prevday && prevday[0] && prevday[0].preselected) {
                days[k].prevpreselected = true;
            }

            if (prevday && prevday[0] && prevday[0].preselected && prevday[0].preselected !== days[k].preselected) {
                days[k].prevpreselecteddifferentiates = true;
            }
        }
    };

    for (var k = 0, _day = days.length; k < _day; ++k) {
        _loop(k, _day);
    }

    return days;
}

function areArraysEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (a == null || b == null) {
        return false;
    }
    if (a.length != b.length) {
        return false;
    }

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

function getSortedSelection(_ref4) {
    var start_time = _ref4.start_time,
        end_time = _ref4.end_time;

    return isBefore(start_time, end_time) ? { start_time: start_time, end_time: end_time } : { start_time: end_time, end_time: start_time };
}

function clearSelection(_ref5) {
    var onSelect = _ref5.onSelect,
        selected = _ref5.selected,
        setSelectionType = _ref5.setSelectionType,
        setSelectionDone = _ref5.setSelectionDone,
        setSelectionStart = _ref5.setSelectionStart,
        setSelectionArray = _ref5.setSelectionArray,
        setStopPropagation = _ref5.setStopPropagation;

    setStopPropagation(true);
    selected = null;
    touchDate = null;
    selectedArrayFinal = [];
    setSelectionStart(null);
    setSelectionType('none');
    setSelectionDone(false);
    setSelectionArray([]);
    onSelect({
        eventType: EVENT_TYPE.END,
        start_time: null,
        end_time: null,
        before_last: false,
        selected_array: [],
        selections: null,
        date_offset: 0,
        eventProp: 'clear'
    });
}

function handleSelectionStart(date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop, _ref6) {
    var onSelect = _ref6.onSelect,
        lastUpdate = _ref6.lastUpdate,
        selected = _ref6.selected,
        preselected = _ref6.preselected,
        preselectedDates = _ref6.preselectedDates,
        setPreselectedDates = _ref6.setPreselectedDates,
        selectionType = _ref6.selectionType,
        setSelectionType = _ref6.setSelectionType,
        selectionDone = _ref6.selectionDone,
        setSelectionDone = _ref6.setSelectionDone,
        selectionStart = _ref6.selectionStart,
        setSelectionStart = _ref6.setSelectionStart,
        setSelectionArray = _ref6.setSelectionArray,
        setUpdateFromController = _ref6.setUpdateFromController,
        setStopPropagation = _ref6.setStopPropagation;

    setStopPropagation(false);
    touchDate = date;

    if (lastSelectionBeforeLastDisabled || latestUpdate !== lastUpdate) {
        selected = null;
        selectedArrayFinal = [];
        setSelectionStart(null);
        setSelectionType('none');
        setSelectionDone(false);
        setSelectionArray([]);
        lastSelectionBeforeLastDisabled = false;
        latestUpdate = lastUpdate;
        savedSelectionType = null;
    }

    preselected = preselected && preselected[0] ? preselected : [];

    if (!isPreSelected) {
        if (preselected && preselected[0]) {
            var returnable = preselected.map(function (dateObj) {
                return { date: format(dateObj.start_time, 'YYYY-MM-DD'), type: 'preselect' };
            });
            setPreselectedDates(returnable);
        }
        setSelectionType('not_preselected');
    } else {
        setPreselectedDates([]);
        setSelectionType('preselected');
    }

    var includeDate = selectedArrayFinal.indexOf(format(date, 'YYYY-MM-DD'));

    if (includeDate !== -1 && !beforeLastDisabled) {
        var _onSelect;

        savedSelectionType = selectionType;
        setSelectionType('selected');
        selectedArrayFinal.splice(includeDate, 1);

        if (!selectedArrayFinal.length) {
            selectedArrayFinal = [];
            setSelectionStart(null);
            setSelectionType('none');
            setSelectionDone(true);
            setSelectionArray([]);

            onSelect({
                eventType: EVENT_TYPE.END,
                start_time: null,
                end_time: null,
                before_last: false,
                selected_array: [],
                selections: { data: [], days_count: 0 },
                date_offset: 0,
                eventProp: 'clear'
            });

            setStopPropagation(true);
            setUpdateFromController(new Date());
            return;
        }

        onSelect((_onSelect = {
            eventType: EVENT_TYPE.END,
            start_time: null,
            end_time: null,
            before_last: false,
            selections: null
        }, _onSelect['selections'] = getPreselectedWithinRange(selectedArrayFinal, preselected), _onSelect.selected_array = selectedArrayFinal, _onSelect.date_offset = null, _onSelect.eventProp = 'end', _onSelect));

        setUpdateFromController(new Date());
    }

    if (beforeLastDisabled && !isPreSelected) {
        setStopPropagation(true);
        return;
    } else if (beforeLastDisabled && isPreSelected) {
        setStopPropagation(true);
        selected = null;
        selectedArrayFinal = [];
        setSelectionStart(null);
        setSelectionType('none');
        setSelectionDone(false);
        setSelectionArray([]);

        selectedArrayFinal = selectedArrayFinal.concat(format(date, 'YYYY-MM-DD'));
        setSelectionArray(selectedArrayFinal);
        setSelectionDone(true);
        onSelect({
            eventType: EVENT_TYPE.END,
            start_time: null,
            end_time: null,
            before_last: true,
            selections: getPreselectedWithinRange(selectedArrayFinal, preselected),
            selected_array: selectedArrayFinal,
            date_offset: fromTop,
            eventProp: 'end'
        });

        lastSelectionBeforeLastDisabled = true;
        setUpdateFromController(new Date());
    } else if (selectionStart) {
        if (selectionType === 'preselected') {
            setSelectionStart(date);
            onSelect({
                eventType: EVENT_TYPE.START,
                start_time: date,
                end_time: date,
                eventProp: 'start'
            });
        } else if (selectionType === 'not_preselected') {
            setSelectionStart(date);
            onSelect({
                eventType: EVENT_TYPE.START,
                start_time: date,
                end_time: date,
                eventProp: 'start'
            });
        }
    } else {
        onSelect({
            eventType: EVENT_TYPE.START,
            start_time: date,
            end_time: date,
            eventProp: 'start'
        });
        setSelectionStart(date);
        if (isPreSelected) {
            preSelectedSelected = true;
        } else {
            preSelectedSelected = false;
        }
        setSelectionDone(false);
    }
}

function handleSelectionMove(e, _ref7) {
    var onSelect = _ref7.onSelect,
        preselected = _ref7.preselected,
        selectionStart = _ref7.selectionStart,
        setSelectionArray = _ref7.setSelectionArray,
        testSelectionStart = _ref7.testSelectionStart,
        testSetSelectionStart = _ref7.testSetSelectionStart,
        testSelectionEnd = _ref7.testSelectionEnd,
        testSetSelectionEnd = _ref7.testSetSelectionEnd,
        testSetSelectedArray = _ref7.testSetSelectedArray,
        stopPropagation = _ref7.stopPropagation,
        selectionType = _ref7.selectionType,
        setUpdateFromController = _ref7.setUpdateFromController,
        setSelectionStart = _ref7.setSelectionStart,
        setSelectionType = _ref7.setSelectionType,
        setSelectionDone = _ref7.setSelectionDone;


    if (stopPropagation) {
        return;
    }

    var target = void 0;
    if (e.changedTouches && e.changedTouches[0]) {
        target = document.elementFromPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    } else {
        target = e.target;
    }

    if (!target) {
        return;
    }

    var targetDate = parse(target.getAttribute('data-date'));
    var isDisabled = target.getAttribute('data-disabled');

    var lastDate = format(touchDate, 'YYYY-MM-DD');
    var thisDate = format(targetDate, 'YYYY-MM-DD');

    if (lastDate === thisDate) {
        return;
    }

    if (selectionType === 'selected') {
        var includeDate = selectedArrayFinal.indexOf(thisDate);

        if (includeDate >= 0) {
            var _onSelect2;

            preselected = preselected && preselected[0] ? preselected : [];

            selectedArrayFinal.splice(includeDate, 1);

            setUpdateFromController(new Date());
            if (!selectedArrayFinal.length) {
                selectedArrayFinal = [];
                setSelectionStart(null);
                setSelectionDone(false);
                setSelectionArray([]);
                lastSelectionBeforeLastDisabled = false;
            }

            onSelect((_onSelect2 = {
                eventType: EVENT_TYPE.END,
                start_time: null,
                end_time: null,
                before_last: false,
                selections: null
            }, _onSelect2['selections'] = getPreselectedWithinRange(selectedArrayFinal, preselected), _onSelect2.selected_array = selectedArrayFinal, _onSelect2.date_offset = null, _onSelect2.eventProp = 'end', _onSelect2));

            touchDate = targetDate;
        }

        return;
    } else if (isDisabled !== 'true') {

        touchDate = targetDate;

        var selection_start = isBefore(thisDate, selectionStart) ? thisDate : selectionStart;
        var selection_end = isBefore(thisDate, selectionStart) ? selectionStart : thisDate;

        onSelect({
            eventType: EVENT_TYPE.HOVER,
            start_time: selection_start,
            end_time: selection_end,
            eventProp: 'move'
        });
    }
}

function handleSelectionEnd(e, date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop, _ref8) {
    var onSelect = _ref8.onSelect,
        selected = _ref8.selected,
        preselected = _ref8.preselected,
        preselectedDates = _ref8.preselectedDates,
        setPreselectedDates = _ref8.setPreselectedDates,
        selectionType = _ref8.selectionType,
        setSelectionType = _ref8.setSelectionType,
        selectionDone = _ref8.selectionDone,
        setSelectionDone = _ref8.setSelectionDone,
        selectionStart = _ref8.selectionStart,
        setSelectionStart = _ref8.setSelectionStart,
        setSelectionArray = _ref8.setSelectionArray,
        setUpdateFromController = _ref8.setUpdateFromController,
        stopPropagation = _ref8.stopPropagation;


    var target = void 0;
    if (e.changedTouches && e.changedTouches[0]) {
        target = document.elementFromPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    } else {
        target = e.target;
    }

    if (!target) {
        return;
    }

    var targetDate = parse(target.getAttribute('data-date'));

    date = format(targetDate, 'YYYY-MM-DD');

    if (stopPropagation) {
        return;
    }

    preselected = preselected && preselected[0] ? preselected : [];

    if (beforeLastDisabled) {
        setSelectionArray([]);
        selected = null;
        setSelectionStart(null);
        setSelectionDone(true);
        setSelectionType('none');

        onSelect({
            eventType: EVENT_TYPE.END,
            start_time: null,
            end_time: null,
            before_last: false,
            selections: getPreselectedWithinRange(selectedArrayFinal, preselected),
            selected_array: [],
            date_offset: null,
            eventProp: 'end'
        });

        return;
    }

    if (selectionType === 'selected') {

        selected = null;
        setSelectionStart(null);
        setSelectionDone(true);
        //setSelectionType('none');

        var includeDate = selectedArrayFinal.indexOf(touchDate);

        if (includeDate >= 0) {
            selectedArrayFinal.splice(includeDate, 1);
        }

        setSelectionArray(selectedArrayFinal);

        onSelect({
            eventType: EVENT_TYPE.END,
            start_time: null,
            end_time: null,
            before_last: false,
            selections: getPreselectedWithinRange(selectedArrayFinal, preselected),
            selected_array: selectedArrayFinal,
            date_offset: fromTop,
            eventProp: 'end'
        });

        setSelectionType(savedSelectionType);
    } else if (selectionType === 'preselected') {
        selectionStart = format(selectionStart, 'YYYY-MM-DD');
        var daysArray = [];
        var daysBetween = isBefore(date, selectionStart) ? eachDay(date, selectionStart, 1) : eachDay(selectionStart, date, 1);
        for (var i = 0, length = daysBetween.length; i < length; ++i) {
            var dayBetween = format(daysBetween[i], 'YYYY-MM-DD');
            var shouldRemove = isSaturday(dayBetween) || isSunday(dayBetween);
            var alreadyIncluded = selectedArrayFinal.includes(dayBetween);
            if (!shouldRemove && !alreadyIncluded) {
                for (var b = 0, _length = preselected.length; b < _length; ++b) {
                    if (format(preselected[b].start_time, 'YYYY-MM-DD') === dayBetween) {
                        daysArray.push(dayBetween);
                        break;
                    }
                }
            }
        }

        selectedArrayFinal = selectedArrayFinal.concat(daysArray);

        selectedArrayFinal.sort(function (a, b) {
            return a.replace(/-/g, "") - b.replace(/-/g, "");
        });

        setSelectionArray(selectedArrayFinal);

        selected = null;
        setSelectionStart(null);
        setSelectionDone(true);
        onSelect({
            eventType: EVENT_TYPE.END,
            start_time: null,
            end_time: null,
            before_last: false,
            selections: getPreselectedWithinRange(selectedArrayFinal, preselected),
            selected_array: selectedArrayFinal,
            date_offset: fromTop,
            eventProp: 'end'
        });
    } else {

        var _daysArray = [];
        var _daysBetween = isBefore(date, selectionStart) ? eachDay(date, selectionStart, 1) : eachDay(selectionStart, date, 1);
        for (var _i = 0, _length2 = _daysBetween.length; _i < _length2; ++_i) {
            var _dayBetween = format(_daysBetween[_i], 'YYYY-MM-DD');
            var _shouldRemove = isSaturday(_dayBetween) || isSunday(_dayBetween);
            var _alreadyIncluded = selectedArrayFinal.includes(_dayBetween);
            if (!_shouldRemove && !_alreadyIncluded) {
                _daysArray.push(_dayBetween);
            }
        }

        for (var y = 0, lengthd = _daysArray.length; y < lengthd; ++y) {
            for (var j = 0, lengthp = preselectedDates.length; j < lengthp; ++j) {
                if (_daysArray[y] === preselectedDates[j].date) {
                    _daysArray.splice(y, 1);
                    --y;
                }
            }
        }

        for (var t = 0, lengthdays = _daysArray.length; t < lengthdays; ++t) {
            for (var s = 0, lengthdis = originalDisabledDates.length; s < lengthdis; ++s) {
                if (_daysArray[t] === originalDisabledDates[s].date && (originalDisabledDates[s].type === 'holiday' || originalDisabledDates[s].type === 'no-reservation')) {
                    _daysArray.splice(t, 1);
                    --t;
                }
            }
        }

        selectedArrayFinal = selectedArrayFinal.concat(_daysArray);

        selectedArrayFinal.sort(function (a, b) {
            return a.replace(/-/g, "") - b.replace(/-/g, "");
        });

        setSelectionArray(selectedArrayFinal);

        selected = null;
        setSelectionStart(null);
        setSelectionDone(true);
        onSelect({
            eventType: EVENT_TYPE.END,
            start_time: null,
            end_time: null,
            before_last: false,
            selections: { data: [], days_count: selectedArrayFinal.length },
            selected_array: selectedArrayFinal,
            date_offset: fromTop,
            eventProp: 'end'
        });
    }

    touchDate = null;
}

function getPreselectedWithinDate(date, preselected) {
    var returnableDates = [];
    var thisDate = format(date, 'YYYY-MM-DD');
    for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
        var dayStart = format(preselected[i].start_time, 'YYYY-MM-DD');
        if (thisDate === dayStart) {
            returnableDates.push(preselected[i]);
        }
    }

    return { days_count: 1, data: returnableDates };
}

function getPreselectedWithinRange(selectedArray, preselected) {
    var returnableDates = [];
    var days = void 0;

    for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
        if (selectedArray.includes(format(preselected[i].start_time, 'YYYY-MM-DD'))) {
            returnableDates.push(preselected[i]);
        }
    }

    return { days_count: selectedArray.length, data: returnableDates };
}

function getInitialDate(_ref9) {
    var selected = _ref9.selected,
        initialSelectedDate = _ref9.initialSelectedDate,
        scrollOffset = _ref9.scrollOffset;

    if (scrollOffset !== null) {
        return scrollOffset;
    } else {
        return initialSelectedDate || selected && selected.start_time || new Date();
    }
}

function determineIfDateAlreadySelected(date, selected, originalDisabledDates) {
    var returnVal = {
        index: -1,
        value: '',
        count: 1,
        nextselected: false,
        prevselected: false,
        nextpreselected: false,
        nextcountdifferentiates: false,
        prevcountdifferentiates: false,
        nextpreselecteddifferentiates: false,
        prevpreselecteddifferentiates: false,
        preselected: false,
        vacation: false,
        vacation_type: ''
    };

    var selected_date = date;
    var selected_array = selected;

    for (var i = 0, len = selected_array.length; i < len; ++i) {
        if (selected_date === selected_array[i].start_time) {
            returnVal.value = PositionTypes.START;
            returnVal.index = selected_array[i];
            returnVal.count = selected_array[i].count;
            returnVal.nextselected = selected_array[i].nextselected;
            returnVal.prevselected = selected_array[i].prevselected;
            returnVal.nextpreselected = selected_array[i].nextpreselected;
            returnVal.prevpreselected = selected_array[i].prevpreselected;
            returnVal.nextcountdifferentiates = selected_array[i].nextcountdifferentiates;
            returnVal.prevcountdifferentiates = selected_array[i].prevcountdifferentiates;
            returnVal.nextpreselecteddifferentiates = selected_array[i].nextpreselecteddifferentiates;
            returnVal.prevpreselecteddifferentiates = selected_array[i].prevpreselecteddifferentiates;
        }
    }

    for (var j = 0, _len = originalDisabledDates.length; j < _len; ++j) {
        if (date === originalDisabledDates[j].date) {
            returnVal.vacation = true;
            returnVal.vacation_type = originalDisabledDates[j].type;
            returnVal.hide = originalDisabledDates[j].hide;
        }
    }

    return returnVal;
}

function is_touch_device() {
    return 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}