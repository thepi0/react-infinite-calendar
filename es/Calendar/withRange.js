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
import format from 'date-fns/format';
import parse from 'date-fns/parse';
var styles = {
    'root': 'Cal__Day__root',
    'vacationCircle': 'Cal__Day__vacationCircle',
    'beforelast': 'Cal__Day__beforelast',
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
    'range': 'Cal__Day__range',
    'start': 'Cal__Day__start',
    'nextnotpreselected': 'Cal__Day__nextnotpreselected',
    'prevnotpreselected': 'Cal__Day__prevnotpreselected',
    'betweenRange': 'Cal__Day__betweenRange',
    'end': 'Cal__Day__end',
    'day': 'Cal__Day__day',
    'month': 'Cal__Day__month'
};


var isTouchDevice = false;
var preSelectedSelected = false;

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
    var _classNames, _classNames2;

    var date = _ref.date,
        selected = _ref.selected,
        preselected = _ref.preselected;

    var isSelected = false;
    var isStart = false;
    var isEnd = false;
    var isRange = false;
    if (selected && selected.start_time && selected.end_time) {
        isSelected = date >= selected.start_time && date <= selected.end_time;
        isStart = date === selected.start_time;
        isEnd = date === selected.end_time;
        isRange = !(isStart && isEnd);
    }
    var positionOfDate = determineIfDateAlreadySelected(date, preselected);
    var isPreSelected = !!positionOfDate.value;
    var isPreStart = positionOfDate.value === PositionTypes.START;
    var isPreEnd = positionOfDate.value === PositionTypes.END;
    var twoChildren = positionOfDate.count > 1 && positionOfDate.count < 3;
    var threeChildren = positionOfDate.count > 2 && positionOfDate.count < 4;
    var foreOrMore = positionOfDate.count > 3;
    var isNextSelected = positionOfDate.nextselected;
    var isPrevSelected = positionOfDate.prevselected;
    var isNextPreSelected = positionOfDate.nextpreselected;
    var isPrevPreSelected = positionOfDate.prevpreselected;
    var isNextCountDifferent = positionOfDate.nextcountdifferentiates;
    var isPrevCountDifferent = positionOfDate.prevcountdifferentiates;
    var isPreSelectedValue = preSelectedSelected;
    var isNextPreDifferent = isNextPreSelected;
    var isPrevPreDifferent = isPrevPreSelected;

    var dayClasses = isSelected && isRange && classNames(styles.range, (_classNames = {}, _classNames[styles.start] = isStart, _classNames[styles.betweenRange] = !isStart && !isEnd, _classNames[styles.end] = isEnd, _classNames[styles.nextselected] = isNextSelected, _classNames[styles.prevselected] = isPrevSelected, _classNames[styles.nextdifferentiates] = isNextCountDifferent, _classNames[styles.prevdifferentiates] = isPrevCountDifferent, _classNames[styles.nextpreselected] = isPreSelectedValue && isNextPreDifferent, _classNames[styles.prevpreselected] = isPreSelectedValue && isPrevPreDifferent, _classNames[styles.nextnotpreselected] = isPreSelectedValue && !isNextPreDifferent, _classNames[styles.prevnotpreselected] = isPreSelectedValue && !isPrevPreDifferent, _classNames)) || isPreSelected && classNames(styles.range, (_classNames2 = {}, _classNames2[styles.prestart] = isPreStart, _classNames2[styles.preend] = isPreEnd, _classNames2[styles.nextselected] = isNextSelected, _classNames2[styles.prevselected] = isPrevSelected, _classNames2[styles.nextdifferentiates] = isNextCountDifferent, _classNames2[styles.prevdifferentiates] = isPrevCountDifferent, _classNames2));

    return {
        className: dayClasses,
        isPreSelected: isPreSelected,
        isSelected: isSelected
    };
});

// Enhancer to handle selecting and displaying multiple dates
var withRange = _compose(withDefaultProps, _withState('scrollDate', 'setScrollDate', getInitialDate), _withState('displayKey', 'setDisplayKey', getInitialDate), _withState('selectionStart', 'setSelectionStart', null), _withState('preselectedDates', 'setPreselectedDates', []), _withState('selectionType', 'setSelectionType', 'none'), _withState('selectionDone', 'setSelectionDone', false), withImmutableProps(function (_ref2) {
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
                    return clearSelect(_extends({ selected: selected }, props));
                },
                onClick: function onClick(date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop) {
                    return handleSelect(date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop, _extends({ selected: selected, preselected: preselected }, props));
                },
                handlers: {
                    onMouseOver: !isTouchDevice && props.selectionStart ? function (e) {
                        return handleMouseOver(e, _extends({ selected: selected, preselected: preselected }, props));
                    } : null
                }
            },
            preselectedDates: props.preselectedDates,
            selectionType: props.selectionType,
            selectionDone: props.selectionDone
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

        /*for (var m = 0, col = colorArray.length; m < col; ++m) {
            if (days[x].start_time === colorArray[m].date) {
                days[x].colors = colorArray[m].colors;
            }
        }*/

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

function clearSelect(_ref5) {
    var onSelect = _ref5.onSelect,
        selected = _ref5.selected,
        setSelectionType = _ref5.setSelectionType,
        setSelectionDone = _ref5.setSelectionDone,
        setSelectionStart = _ref5.setSelectionStart;

    selected = null;
    setSelectionStart(null);
    setSelectionType('none');
    setSelectionDone(true);
    onSelect({
        eventType: EVENT_TYPE.END,
        start_time: null,
        end_time: null,
        before_last: false,
        eventProp: 'click'
    });
}

function handleSelect(date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop, _ref6) {
    var onSelect = _ref6.onSelect,
        selected = _ref6.selected,
        preselected = _ref6.preselected,
        preselectedDates = _ref6.preselectedDates,
        setPreselectedDates = _ref6.setPreselectedDates,
        selectionType = _ref6.selectionType,
        setSelectionType = _ref6.setSelectionType,
        selectionDone = _ref6.selectionDone,
        setSelectionDone = _ref6.setSelectionDone,
        selectionStart = _ref6.selectionStart,
        setSelectionStart = _ref6.setSelectionStart;


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

    if (beforeLastDisabled) {
        onSelect(_extends({
            eventType: EVENT_TYPE.END
        }, getSortedSelection({
            start_time: date,
            end_time: date
        }), {
            before_last: true,
            selections: getPreselectedWithinDate(date, preselected),
            date_offset: fromTop,
            eventProp: 'click'
        }));
        setSelectionStart(null);
        setSelectionDone(true);
    } else if (selectionStart) {
        onSelect(_extends({
            eventType: EVENT_TYPE.END
        }, getSortedSelection({
            start_time: selectionStart,
            end_time: date
        }), {
            before_last: beforeLastDisabled,
            selections: getPreselectedWithinRange(selectionStart, date, preselected, selected, originalDisabledDates),
            date_offset: fromTop,
            eventProp: 'click'
        }));
        setSelectionStart(null);
        setSelectionDone(true);
    } else {
        onSelect({
            eventType: EVENT_TYPE.START,
            start_time: date,
            end_time: date,
            before_last: beforeLastDisabled,
            eventProp: 'click'
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

/*
* TODO: Mouse down and touch support
const EventListenerMode = {capture: true};

function preventGlobalMouseEvents() {
  document.body.style['pointer-events'] = 'none';
}

function restoreGlobalMouseEvents() {
  document.body.style['pointer-events'] = 'auto';
}

function mousemoveListener(e) {
  e.stopPropagation();
  // do whatever is needed while the user is moving the cursor around
}

function mouseupListener(e) {
  restoreGlobalMouseEvents();
  document.removeEventListener('mouseup',   mouseupListener,   EventListenerMode);
  document.removeEventListener('mousemove', mousemoveListener, EventListenerMode);
  e.stopPropagation();
}

function handleMouseDown(e) {
  preventGlobalMouseEvents();
  document.addEventListener('mouseup',   mouseupListener,   EventListenerMode);
  document.addEventListener('mousemove', mousemoveListener, EventListenerMode);
  e.preventDefault();
  e.stopPropagation();
}
*/

var saveHoverDate = void 0;

function handleMouseOver(e, _ref7) {
    var onSelect = _ref7.onSelect,
        selectionStart = _ref7.selectionStart;

    var dateStr = e.target.getAttribute('data-date');
    var isDisabled = e.target.getAttribute('data-disabled');
    var date = dateStr && parse(dateStr);

    if (!date) {
        return;
    }

    //if (saveHoverDate !== dateStr && isDisabled != 'true') {
    if (isDisabled != 'true') {
        onSelect(_extends({
            eventType: EVENT_TYPE.HOVER
        }, getSortedSelection({
            start_time: selectionStart,
            end_time: date
        }), {
            eventProp: 'hover'
        }));
    }
    saveHoverDate = dateStr;
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

function getPreselectedWithinRange(start_date, end_date, preselected, selected, originalDisabledDates) {
    var returnableDates = void 0;
    var startDate = format(start_date, 'YYYY-MM-DD');
    var endDate = format(end_date, 'YYYY-MM-DD');
    var days = 0;
    if (preSelectedSelected && preselected) {
        returnableDates = [];
        for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
            var dayStart = format(preselected[i].start_time, 'YYYY-MM-DD');
            var withinRange = isBefore(startDate, endDate) ? isWithinRange(dayStart, startDate, endDate) : isWithinRange(dayStart, endDate, startDate);
            if (withinRange) {
                returnableDates.push(preselected[i]);
            }
        }

        var test = [];

        for (var j = 0, returnables = returnableDates.length; j < returnables; ++j) {
            var returnable_start = format(returnableDates[j].start_time, "YYYY-MM-DD");
            if (!test.includes(returnable_start)) {
                test.push(returnable_start);
            }
        }

        days = test.length;
    } else if (selected) {
        returnableDates = [];

        var start = isBefore(start_date, end_date) ? start_date : end_date;
        var end = isBefore(start_date, end_date) ? end_date : start_date;

        while (start <= end) {
            var thesame = false;
            for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
                var preselected_start = format(preselected[i].start_time, 'YYYY-MM-DD');
                if (preselected_start === format(start, 'YYYY-MM-DD')) {
                    thesame = true;
                    break;
                }
            }
            if (!thesame) {
                for (var i = 0, disabled = originalDisabledDates.length; i < disabled; ++i) {
                    var disabled_start = format(originalDisabledDates[i].date, 'YYYY-MM-DD');
                    if (disabled_start === format(start, 'YYYY-MM-DD') && originalDisabledDates[i].type === 'holiday') {
                        thesame = true;
                        break;
                    }
                }
            }
            if (!thesame && !isWeekend(start)) {
                returnableDates.push({ start_time: format(start, 'YYYY-MM-DD'), end_time: format(start, 'YYYY-MM-DD') });
                days += 1;
            }
            start = addDays(start, 1);
        }
    }

    return { days_count: days, data: returnableDates };
}

function getInitialDate(_ref8) {
    var selected = _ref8.selected,
        initialSelectedDate = _ref8.initialSelectedDate,
        scrollOffset = _ref8.scrollOffset;

    if (scrollOffset !== null) {
        return scrollOffset;
    } else {
        return initialSelectedDate || selected && selected.start_time || new Date();
    }
}

function determineIfDateAlreadySelected(date, selected) {
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
        preselected: false
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

    return returnVal;
}

if (typeof window !== 'undefined') {
    window.addEventListener('touchstart', function onTouch() {
        isTouchDevice = true;

        window.removeEventListener('touchstart', onTouch, false);
    });
}