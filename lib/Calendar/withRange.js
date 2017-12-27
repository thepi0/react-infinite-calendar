'use strict';

exports.__esModule = true;
exports.withRange = exports.enhanceDay = exports.EVENT_TYPE = undefined;

var _withState2 = require('recompose/withState');

var _withState3 = _interopRequireDefault(_withState2);

var _withPropsOnChange2 = require('recompose/withPropsOnChange');

var _withPropsOnChange3 = _interopRequireDefault(_withPropsOnChange2);

var _withProps2 = require('recompose/withProps');

var _withProps3 = _interopRequireDefault(_withProps2);

var _compose2 = require('recompose/compose');

var _compose3 = _interopRequireDefault(_compose2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ = require('./');

var _utils = require('../utils');

var _is_before = require('date-fns/is_before');

var _is_before2 = _interopRequireDefault(_is_before);

var _add_days = require('date-fns/add_days');

var _add_days2 = _interopRequireDefault(_add_days);

var _sub_days = require('date-fns/sub_days');

var _sub_days2 = _interopRequireDefault(_sub_days);

var _add_months = require('date-fns/add_months');

var _add_months2 = _interopRequireDefault(_add_months);

var _each_day = require('date-fns/each_day');

var _each_day2 = _interopRequireDefault(_each_day);

var _difference_in_days = require('date-fns/difference_in_days');

var _difference_in_days2 = _interopRequireDefault(_difference_in_days);

var _difference_in_calendar_days = require('date-fns/difference_in_calendar_days');

var _difference_in_calendar_days2 = _interopRequireDefault(_difference_in_calendar_days);

var _is_within_range = require('date-fns/is_within_range');

var _is_within_range2 = _interopRequireDefault(_is_within_range);

var _is_weekend = require('date-fns/is_weekend');

var _is_weekend2 = _interopRequireDefault(_is_weekend);

var _withRange = require('../Header/withRange');

var _withRange2 = _interopRequireDefault(_withRange);

var _format = require('date-fns/format');

var _format2 = _interopRequireDefault(_format);

var _parse = require('date-fns/parse');

var _parse2 = _interopRequireDefault(_parse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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
    'multiple': 'Cal__Day__multiple',
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

var EVENT_TYPE = exports.EVENT_TYPE = {
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
var enhanceDay = exports.enhanceDay = (0, _withPropsOnChange3.default)(['selected'], function (_ref) {
    var _classNames, _classNames2;

    var date = _ref.date,
        selected = _ref.selected,
        preselected = _ref.preselected;

    var isSelected = date >= selected.start_time && date <= selected.end_time;
    var isStart = date === selected.start_time;
    var isEnd = date === selected.end_time;
    var isRange = !(isStart && isEnd);
    var positionOfDate = determineIfDateAlreadySelected(date, preselected);
    var isPreSelected = !!positionOfDate.value;
    var isPreStart = positionOfDate.value === PositionTypes.START;
    var isPreEnd = positionOfDate.value === PositionTypes.END;
    var isMultipleChildren = positionOfDate.count > 1;
    var isNextSelected = positionOfDate.nextselected;
    var isPrevSelected = positionOfDate.prevselected;
    var isNextPreSelected = positionOfDate.nextpreselected;
    var isPrevPreSelected = positionOfDate.prevpreselected;
    var isNextCountDifferent = positionOfDate.nextcountdifferentiates;
    var isPrevCountDifferent = positionOfDate.prevcountdifferentiates;
    var isPreSelectedValue = preSelectedSelected;
    var isNextPreDifferent = isNextPreSelected;
    var isPrevPreDifferent = isPrevPreSelected;

    var dayClasses = isSelected && isRange && (0, _classnames2.default)(styles.range, (_classNames = {}, _classNames[styles.start] = isStart, _classNames[styles.betweenRange] = !isStart && !isEnd, _classNames[styles.end] = isEnd, _classNames[styles.multiple] = isMultipleChildren, _classNames[styles.single] = !isMultipleChildren, _classNames[styles.nextselected] = isNextSelected, _classNames[styles.prevselected] = isPrevSelected, _classNames[styles.nextdifferentiates] = isNextCountDifferent, _classNames[styles.prevdifferentiates] = isPrevCountDifferent, _classNames[styles.nextpreselected] = isPreSelectedValue && isNextPreDifferent, _classNames[styles.prevpreselected] = isPreSelectedValue && isPrevPreDifferent, _classNames[styles.nextnotpreselected] = isPreSelectedValue && !isNextPreDifferent, _classNames[styles.prevnotpreselected] = isPreSelectedValue && !isPrevPreDifferent, _classNames)) || isPreSelected && (0, _classnames2.default)(styles.range, (_classNames2 = {}, _classNames2[styles.prestart] = isPreStart, _classNames2[styles.preend] = isPreEnd, _classNames2[styles.multiple] = isMultipleChildren, _classNames2[styles.single] = !isMultipleChildren, _classNames2[styles.nextselected] = isNextSelected, _classNames2[styles.prevselected] = isPrevSelected, _classNames2[styles.nextdifferentiates] = isNextCountDifferent, _classNames2[styles.prevdifferentiates] = isPrevCountDifferent, _classNames2));

    return {
        className: dayClasses,
        isPreSelected: isPreSelected,
        isSelected: isSelected
    };
});

// Enhancer to handle selecting and displaying multiple dates
var withRange = (0, _compose3.default)(_.withDefaultProps, (0, _withState3.default)('scrollDate', 'setScrollDate', getInitialDate), (0, _withState3.default)('displayKey', 'setDisplayKey', getInitialDate), (0, _withState3.default)('selectionStart', 'setSelectionStart', null), (0, _withState3.default)('preselectedDates', 'setPreselectedDates', []), (0, _withState3.default)('selectionType', 'setSelectionType', 'none'), (0, _withState3.default)('selectionDone', 'setSelectionDone', false), (0, _utils.withImmutableProps)(function (_ref2) {
    var DayComponent = _ref2.DayComponent;
    return {
        DayComponent: enhanceDay(DayComponent)
    };
}), (0, _withProps3.default)(function (_ref3) {
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
                onClick: function onClick(date, beforeLastDisabled, isPreSelected, originalDisabledDates) {
                    return handleSelect(date, beforeLastDisabled, isPreSelected, originalDisabledDates, _extends({ selected: selected, preselected: preselected }, props));
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
            start_time: selected && (0, _format2.default)(selected.start_time, 'YYYY-MM-DD'),
            end_time: selected && (0, _format2.default)(selected.end_time, 'YYYY-MM-DD')
        }
    };
}));

exports.withRange = withRange;
function getStartDays(preselected) {

    var starts = [];

    preselected = preselected ? preselected : [];

    for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
        var dayStart = (0, _format2.default)(preselected[i].start_time, 'YYYY-MM-DD');
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

    for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
        var dayStart = (0, _format2.default)(preselected[i].start_time, 'YYYY-MM-DD');
        var dayEnd = (0, _format2.default)(preselected[i].end_time, 'YYYY-MM-DD');
        var dayChild = preselected[i].child;

        var pushThis = {
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

            pushThis.count += 1;

            for (var y = 0, dayy = days.length; y < dayy; ++y) {
                if (days[y].start_time == dayStart) {
                    days[y].count += 1;
                }
            }
        }

        starts.push(dayStart);
        days.push(pushThis);
    }

    var _loop = function _loop() {
        var dayStart = (0, _format2.default)(days[x].start_time, 'YYYY-MM-DD');
        var nextDayStart = (0, _format2.default)((0, _add_days2.default)(dayStart, 1), 'YYYY-MM-DD');
        var prevDayStart = (0, _format2.default)((0, _sub_days2.default)(dayStart, 1), 'YYYY-MM-DD');

        if (starts.includes(nextDayStart)) {
            days[x].nextselected = true;
            var nextday = days.filter(function (date) {
                return date.start_time === nextDayStart;
            });

            if (nextday[0].count !== days[x].count) {
                days[x].nextcountdifferentiates = true;
            }

            if (nextday[0].preselected) {
                days[x].nextpreselected = true;
            }

            if (nextday[0].preselected !== days[x].preselected) {
                days[x].nextpreselecteddifferentiates = true;
            }
        }

        if (starts.includes(prevDayStart)) {
            days[x].prevselected = true;
            var prevday = days.filter(function (date) {
                return date.end_time === prevDayStart;
            });

            if (prevday[0].count !== days[x].count) {
                days[x].prevcountdifferentiates = true;
            }

            if (prevday[0].preselected) {
                days[x].prevpreselected = true;
            }

            if (prevday[0].preselected !== days[x].preselected) {
                days[x].prevpreselecteddifferentiates = true;
            }
        }
    };

    for (var x = 0, day = days.length; x < day; ++x) {
        _loop();
    }

    return days;
}

function getSortedSelection(_ref4) {
    var start_time = _ref4.start_time,
        end_time = _ref4.end_time;

    return (0, _is_before2.default)(start_time, end_time) ? { start_time: start_time, end_time: end_time } : { start_time: end_time, end_time: start_time };
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

function handleSelect(date, beforeLastDisabled, isPreSelected, originalDisabledDates, _ref6) {
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


    if (!isPreSelected) {
        if (preselected && preselected[0]) {
            var returnable = preselected.map(function (dateObj) {
                return { date: (0, _format2.default)(dateObj.start_time, 'YYYY-MM-DD'), type: 'preselect' };
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
    var date = dateStr && (0, _parse2.default)(dateStr);

    if (!date) {
        return;
    }

    if (saveHoverDate !== dateStr && isDisabled != 'true') {
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
    var thisDate = (0, _format2.default)(date, 'YYYY-MM-DD');
    for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
        var dayStart = (0, _format2.default)(preselected[i].start_time, 'YYYY-MM-DD');
        if (thisDate === dayStart) {
            returnableDates.push(preselected[i]);
        }
    }

    return { days_count: 1, data: returnableDates };
}

function getPreselectedWithinRange(start_date, end_date, preselected, selected, originalDisabledDates) {
    var returnableDates = void 0;
    var startDate = (0, _format2.default)(start_date, 'YYYY-MM-DD');
    var endDate = (0, _format2.default)(end_date, 'YYYY-MM-DD');
    var days = 0;
    if (preSelectedSelected && preselected) {
        returnableDates = [];
        for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
            var dayStart = (0, _format2.default)(preselected[i].start_time, 'YYYY-MM-DD');
            var withinRange = (0, _is_before2.default)(startDate, endDate) ? (0, _is_within_range2.default)(dayStart, startDate, endDate) : (0, _is_within_range2.default)(dayStart, endDate, startDate);
            if (withinRange) {
                returnableDates.push(preselected[i]);
            }
        }

        var test = [];

        for (var j = 0, returnables = returnableDates.length; j < returnables; ++j) {
            var returnable_start = (0, _format2.default)(returnableDates[j].start_time, "YYYY-MM-DD");
            if (!test.includes(returnable_start)) {
                test.push(returnable_start);
            }
        }

        days = test.length;
    } else if (selected) {
        returnableDates = [];
        var start = start_date;
        while (start <= end_date) {
            var thesame = false;
            for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
                var preselected_start = (0, _format2.default)(preselected[i].start_time, 'YYYY-MM-DD');
                if (preselected_start === (0, _format2.default)(start, 'YYYY-MM-DD')) {
                    thesame = true;
                    break;
                }
            }
            if (!thesame) {
                for (var i = 0, disabled = originalDisabledDates.length; i < disabled; ++i) {
                    var disabled_start = (0, _format2.default)(originalDisabledDates[i].date, 'YYYY-MM-DD');
                    if (disabled_start === (0, _format2.default)(start, 'YYYY-MM-DD')) {
                        thesame = true;
                        break;
                    }
                }
            }
            if (!thesame && !(0, _is_weekend2.default)(start)) {
                returnableDates.push({ start_time: (0, _format2.default)(start, 'YYYY-MM-DD'), end_time: (0, _format2.default)(start, 'YYYY-MM-DD') });
                days += 1;
            }
            start = (0, _add_days2.default)(start, 1);
        }
    }

    return { days_count: days, data: returnableDates };
}

function getDates(startDate, stopDate, preselected) {
    var dateArray = [];
    var currentDate = startDate;
    var stopDate = stopDate;
    while (currentDate <= stopDate) {
        if (preselected.includes()) dateArray.push({ start_time: (0, _format2.default)(currentDate, 'YYYY-MM-DD'), end_time: (0, _format2.default)(currentDate, 'YYYY-MM-DD') });
        currentDate = (0, _add_days2.default)(currentDate, 1);
    }
    return dateArray;
}

function getInitialDate(_ref8) {
    var selected = _ref8.selected,
        initialSelectedDate = _ref8.initialSelectedDate;

    return initialSelectedDate || selected && selected.start_time || new Date();
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