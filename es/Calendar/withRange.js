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
    'disabled': 'Cal__Day__disabled',
    'vacationCircle': 'Cal__Day__vacationCircle',
    'beforelast': 'Cal__Day__beforelast',
    'weekend': 'Cal__Day__weekend',
    'holiday': 'Cal__Day__holiday',
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
        vacation_type: positionOfDate.vacation_type
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

    var _loop = function _loop() {
        var dayStart = format(days[x].start_time, 'YYYY-MM-DD');
        var nextDayStart = format(addDays(dayStart, 1), 'YYYY-MM-DD');
        var prevDayStart = format(subDays(dayStart, 1), 'YYYY-MM-DD');

        if (starts.includes(nextDayStart)) {
            days[x].nextselected = true;
            var nextday = days.filter(function (date) {
                return date.start_time === nextDayStart;
            });

            if (nextday && nextday[0] && nextday[0].count && (nextday[0].count !== days[x].count || !areArraysEqual(nextday[0].colors, days[x].colors))) {
                days[x].nextcountdifferentiates = true;
            }

            if (nextday && nextday[0] && nextday[0].preselected) {
                days[x].nextpreselected = true;
            }

            if (nextday && nextday[0] && nextday[0].preselected && nextday[0].preselected !== days[x].preselected) {
                days[x].nextpreselecteddifferentiates = true;
            }
        }

        if (starts.includes(prevDayStart)) {
            days[x].prevselected = true;
            var prevday = days.filter(function (date) {
                return date.end_time === prevDayStart;
            });

            if (prevday && prevday[0] && prevday[0].count && (prevday[0].count !== days[x].count || !areArraysEqual(prevday[0].colors, days[x].colors))) {
                days[x].prevcountdifferentiates = true;
            }

            if (prevday && prevday[0] && prevday[0].preselected) {
                days[x].prevpreselected = true;
            }

            if (prevday && prevday[0] && prevday[0].preselected && prevday[0].preselected !== days[x].preselected) {
                days[x].prevpreselecteddifferentiates = true;
            }
        }
    };

    for (var x = 0, day = days.length; x < day; ++x) {
        _loop();
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

    console.log('clearSelection');
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

    console.log('handleSelectionStart');

    console.log(beforeLastDisabled);
    console.log(isPreSelected);

    if (lastSelectionBeforeLastDisabled || latestUpdate !== lastUpdate) {
        console.log('selection start - last selection was beforelast');
        selected = null;
        selectedArrayFinal = [];
        setSelectionStart(null);
        setSelectionType('none');
        setSelectionDone(false);
        setSelectionArray([]);
        lastSelectionBeforeLastDisabled = false;
        latestUpdate = lastUpdate;
    }

    preselected = preselected && preselected[0] ? preselected : [];

    var includeDate = selectedArrayFinal.indexOf(format(date, 'YYYY-MM-DD'));

    if (includeDate !== -1 && !beforeLastDisabled) {
        console.log('selection start - already selected');
        setStopPropagation(true);
        if (selectionType === 'preselected') {
            selectedArrayFinal.splice(includeDate, 1);
            setUpdateFromController(new Date());
            onSelect({
                eventType: EVENT_TYPE.END,
                start_time: null,
                end_time: null,
                before_last: false,
                selected_array: selectedArrayFinal,
                selections: getPreselectedWithinRange(selectedArrayFinal, preselected),
                date_offset: fromTop,
                eventProp: 'remove'
            });
            if (!selectedArrayFinal.length) {
                selected = null;
                selectedArrayFinal = [];
                setSelectionStart(null);
                setSelectionType('none');
                setSelectionDone(false);
                setSelectionArray([]);
                lastSelectionBeforeLastDisabled = false;
            }
            return;
        } else {
            selectedArrayFinal.splice(includeDate, 1);
            setUpdateFromController(new Date());
            onSelect({
                eventType: EVENT_TYPE.END,
                start_time: null,
                end_time: null,
                before_last: false,
                selected_array: selectedArrayFinal,
                selections: null,
                date_offset: fromTop,
                eventProp: 'remove'
            });
            if (!selectedArrayFinal.length) {
                selected = null;
                selectedArrayFinal = [];
                setSelectionStart(null);
                setSelectionType('none');
                setSelectionDone(false);
                setSelectionArray([]);
                lastSelectionBeforeLastDisabled = false;
            }
            return;
        }
    }

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

    if (beforeLastDisabled && !isPreSelected) {
        console.log('selection start - before last and is not preselected');
        setStopPropagation(true);
        return;
    } else if (beforeLastDisabled && isPreSelected) {
        console.log('selection start - before last and is preselected');
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
        console.log('selection start - has selection start');
        if (selectionType === 'preselected') {
            setSelectionStart(date);
            onSelect({
                eventType: EVENT_TYPE.START,
                start_time: date,
                end_time: date,
                eventProp: 'start'
            });
        } else {
            setSelectionStart(date);
            onSelect({
                eventType: EVENT_TYPE.START,
                start_time: date,
                end_time: date,
                eventProp: 'start'
            });
        }
    } else {
        console.log('selection start - else');
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
        selectionStart = _ref7.selectionStart,
        preselected = _ref7.preselected,
        setSelectionArray = _ref7.setSelectionArray,
        testSelectionStart = _ref7.testSelectionStart,
        testSetSelectionStart = _ref7.testSetSelectionStart,
        testSelectionEnd = _ref7.testSelectionEnd,
        testSetSelectionEnd = _ref7.testSetSelectionEnd,
        testSetSelectedArray = _ref7.testSetSelectedArray,
        stopPropagation = _ref7.stopPropagation;

    e.preventDefault();

    console.log('handleSelectionMove');

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

    if (isDisabled !== 'true') {

        console.log('selection move - gets through');

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


    console.log('handleSelectionEnd');

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

    console.log('selection end - gets through');

    if (selectionType === 'preselected') {
        var daysArray = [];
        var daysBetween = isBefore(date, selectionStart) ? eachDay(date, selectionStart, 1) : eachDay(selectionStart, date, 1);
        for (var i = 0, length = daysBetween.length; i < length; ++i) {
            var shouldRemove = isSaturday(daysBetween[i]) || isSunday(daysBetween[i]);
            daysBetween[i] = format(daysBetween[i], 'YYYY-MM-DD');
            var alreadyIncluded = selectedArrayFinal.includes(daysBetween[i]);
            if (!shouldRemove && !alreadyIncluded) {
                for (var b = 0, length = preselected.length; b < length; ++b) {
                    if (format(preselected[b].start_time, 'YYYY-MM-DD') === daysBetween[i]) {
                        daysArray.push(daysBetween[i]);
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
        for (var i = 0, length = _daysBetween.length; i < length; ++i) {
            var _shouldRemove = isSaturday(_daysBetween[i]) || isSunday(_daysBetween[i]);
            var formattedDate = format(_daysBetween[i], 'YYYY-MM-DD');
            var _alreadyIncluded = selectedArrayFinal.includes(formattedDate);
            if (!_shouldRemove && !_alreadyIncluded) {
                _daysArray.push(formattedDate);
            }
        }

        for (var y = 0, length = _daysArray.length; y < length; ++y) {
            for (var j = 0, length = preselectedDates.length; j < length; ++j) {
                if (_daysArray[y] === preselectedDates[j].date) {
                    _daysArray.splice(y, 1);
                    --y;
                }
            }
        }

        for (var y = 0, length = _daysArray.length; y < length; ++y) {
            for (var j = 0, length = originalDisabledDates.length; j < length; ++j) {
                if (_daysArray[y] === originalDisabledDates[j].date && originalDisabledDates[j].type === 'holiday') {
                    _daysArray.splice(y, 1);
                    --y;
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
            selections: null,
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

    for (var j = 0, len = originalDisabledDates.length; j < len; ++j) {
        if (date === originalDisabledDates[j].date) {
            returnVal.vacation = true;
            returnVal.vacation_type = originalDisabledDates[j].type;
        }
    }

    return returnVal;
}

function is_touch_device() {
    return 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}