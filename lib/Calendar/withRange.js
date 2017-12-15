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

var _is_within_range = require('date-fns/is_within_range');

var _is_within_range2 = _interopRequireDefault(_is_within_range);

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
      preselected = _ref.preselected,
      theme = _ref.theme;

  var isSelected = date >= selected.start_time && date <= selected.end_time;
  var isStart = date === selected.start_time;
  var isEnd = date === selected.end_time;
  var isRange = !(isStart && isEnd);
  var positionOfDate = determineIfDateAlreadySelected(date, preselected);
  var isPreSelected = !!positionOfDate.value;
  //const isPreSelected = true;
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
var withRange = (0, _compose3.default)(_.withDefaultProps, (0, _withState3.default)('scrollDate', 'setScrollDate', getInitialDate), (0, _withState3.default)('displayKey', 'setDisplayKey', getInitialDate), (0, _withState3.default)('selectionStart', 'setSelectionStart', null), (0, _withState3.default)('preselectedDates', 'setPreselectedDates', false), (0, _withState3.default)('selectionType', 'setSelectionType', 'none'), (0, _utils.withImmutableProps)(function (_ref2) {
  var DayComponent = _ref2.DayComponent;
  return {
    DayComponent: enhanceDay(DayComponent)
  };
}), (0, _withProps3.default)(function (_ref3) {
  var displayKey = _ref3.displayKey,
      passThrough = _ref3.passThrough,
      selected = _ref3.selected,
      preselected = _ref3.preselected,
      setDisplayKey = _ref3.setDisplayKey,
      props = _objectWithoutProperties(_ref3, ['displayKey', 'passThrough', 'selected', 'preselected', 'setDisplayKey']);

  return {
    /* eslint-disable sort-keys */
    passThrough: _extends({}, passThrough, {
      Day: {
        onClick: function onClick(date, beforeLastDisabled, isPreSelected) {
          return handleSelect(date, beforeLastDisabled, isPreSelected, _extends({ selected: selected, preselected: preselected }, props));
        },
        handlers: {
          onMouseOver: !isTouchDevice && props.selectionStart ? function (e) {
            return handleMouseOver(e, _extends({ selected: selected, preselected: preselected }, props));
          } : null
        }
      },
      preselectedDates: props.preselectedDates,
      selectionType: props.selectionType
    }),
    preselected: handlePreselected(preselected),
    startDays: getStartDays(preselected),
    selected: {
      start_time: selected && (0, _format2.default)(selected.start_time, 'YYYY-MM-DD'),
      end_time: selected && (0, _format2.default)(selected.end_time, 'YYYY-MM-DD')
    }
  };
}));

exports.withRange = withRange;
function getStartDays(preselected) {
  var returnable = preselected.map(function (dateObj) {
    return {
      start_time: dateObj.start_time,
      end_time: dateObj.end_time,
      child: dateObj.child
    };
  });

  var starts = [];

  returnable.forEach(function (day, idx) {

    var dayStart = (0, _format2.default)(day.start_time, 'YYYY-MM-DD');

    if (!starts.includes(dayStart)) {
      starts.push(dayStart);
    }
  });

  return starts;
}

function handlePreselected(preselected) {
  var returnable = preselected.map(function (dateObj) {
    return {
      start_time: dateObj.start_time,
      end_time: dateObj.end_time,
      child: dateObj.child
    };
  });

  var days = [];
  var starts = [];

  returnable.forEach(function (day, idx) {

    var dayStart = (0, _format2.default)(day.start_time, 'YYYY-MM-DD');
    var dayEnd = (0, _format2.default)(day.end_time, 'YYYY-MM-DD');
    var dayChild = day.child;

    var pushThis = {
      start_time: dayStart,
      end_time: dayEnd,
      child: day.child,
      original_start: day.start_time,
      original_end: day.end_time,
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

      for (var i = 0; i < days.length; i++) {
        if (days[i].start_time == dayStart) {
          days[i].count += 1;
        }
      }
    }

    starts.push(dayStart);
    days.push(pushThis);
  });

  days.forEach(function (day, idx) {

    var dayStart = (0, _format2.default)(day.start_time, 'YYYY-MM-DD');
    var nextDayStart = (0, _format2.default)((0, _add_days2.default)(dayStart, 1), 'YYYY-MM-DD');
    var prevDayStart = (0, _format2.default)((0, _sub_days2.default)(dayStart, 1), 'YYYY-MM-DD');

    if (starts.includes(nextDayStart)) {
      day.nextselected = true;
      var nextday = days.filter(function (date) {
        return date.start_time === nextDayStart;
      });

      if (nextday[0].count !== day.count) {
        day.nextcountdifferentiates = true;
      }

      if (nextday[0].preselected) {
        day.nextpreselected = true;
      }

      if (nextday[0].preselected !== day.preselected) {
        day.nextpreselecteddifferentiates = true;
      }
    }

    if (starts.includes(prevDayStart)) {
      day.prevselected = true;
      var prevday = days.filter(function (date) {
        return date.end_time === prevDayStart;
      });

      if (prevday[0].count !== day.count) {
        day.prevcountdifferentiates = true;
      }

      if (prevday[0].preselected) {
        day.prevpreselected = true;
      }

      if (prevday[0].preselected !== day.preselected) {
        day.prevpreselecteddifferentiates = true;
      }
    }
  });

  return days;
}

function getSortedSelection(_ref4) {
  var start_time = _ref4.start_time,
      end_time = _ref4.end_time;

  return (0, _is_before2.default)(start_time, end_time) ? { start_time: start_time, end_time: end_time } : { start_time: end_time, end_time: start_time };
}

function handleSelect(date, beforeLastDisabled, isPreSelected, _ref5) {
  var onSelect = _ref5.onSelect,
      selected = _ref5.selected,
      preselected = _ref5.preselected,
      preselectedDates = _ref5.preselectedDates,
      setPreselectedDates = _ref5.setPreselectedDates,
      selectionType = _ref5.selectionType,
      setSelectionType = _ref5.setSelectionType,
      selectionStart = _ref5.selectionStart,
      setSelectionStart = _ref5.setSelectionStart;


  if (!isPreSelected) {
    var returnable = preselected.map(function (dateObj) {
      return (0, _format2.default)(dateObj.start_time, 'YYYY-MM-DD');
    });
    setPreselectedDates(returnable);
    setSelectionType('not_preselected');
  } else {
    setPreselectedDates(false);
    setSelectionType('preselected');
  }

  if (selectionStart) {
    onSelect(_extends({
      eventType: EVENT_TYPE.END
    }, getSortedSelection({
      start_time: selectionStart,
      end_time: date
    }), {
      before_last: beforeLastDisabled,
      selections: getPreselectedWithinRange(selectionStart, date, preselected),
      eventProp: 'click'
    }));
    setSelectionStart(null);
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
  }
}

function handleMouseOver(e, _ref6) {
  var onSelect = _ref6.onSelect,
      selectionStart = _ref6.selectionStart,
      preselected = _ref6.preselected;

  var dateStr = e.target.getAttribute('data-date');
  var date = dateStr && (0, _parse2.default)(dateStr);

  if (!date) {
    return;
  }

  onSelect(_extends({
    eventType: EVENT_TYPE.HOVER
  }, getSortedSelection({
    start_time: selectionStart,
    end_time: date
  }), {
    eventProp: 'hover'
  }));
}

function getPreselectedWithinRange(start_date, end_date, preselected) {
  var returnableDates = [];
  if (preSelectedSelected) {
    var startDate = (0, _format2.default)(start_date, 'YYYY-MM-DD');
    var endDate = (0, _format2.default)(end_date, 'YYYY-MM-DD');
    preselected.forEach(function (day, idx) {
      var dayStart = (0, _format2.default)(day.start_time, 'YYYY-MM-DD');
      var withinRange = (0, _is_before2.default)(startDate, endDate) ? (0, _is_within_range2.default)(dayStart, startDate, endDate) : (0, _is_within_range2.default)(dayStart, endDate, startDate);
      if (withinRange) {
        returnableDates.push(day);
      }
    });
  }
  return returnableDates;
}

function getInitialDate(_ref7) {
  var selected = _ref7.selected,
      initialSelectedDate = _ref7.initialSelectedDate;

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

  /*
   selected.forEach((dateObj, idx) => {
    if (date < dateObj.start_time || date > dateObj.end_time ) return;
     if (format(date, 'YYYY-MM-DD') === format(dateObj.start_time, 'YYYY-MM-DD')) {
      console.log('second option');
      returnVal.value = PositionTypes.START;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
      returnVal.nextpreselected = dateObj.nextpreselected;
      returnVal.prevpreselected = dateObj.prevpreselected;
      returnVal.nextcountdifferentiates = dateObj.nextcountdifferentiates;
      returnVal.prevcountdifferentiates = dateObj.prevcountdifferentiates;
      returnVal.nextpreselecteddifferentiates = dateObj.nextpreselecteddifferentiates;
      returnVal.prevpreselecteddifferentiates = dateObj.prevpreselecteddifferentiates;
      return;
    }
    if (format(date, 'YYYY-MM-DD') === format(dateObj.end_time, 'YYYY-MM-DD')) {
      console.log('third option');
      returnVal.value = PositionTypes.END;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
      returnVal.nextpreselected = dateObj.nextpreselected;
      returnVal.prevpreselected = dateObj.prevpreselected;
      returnVal.nextcountdifferentiates = dateObj.nextcountdifferentiates;
      returnVal.prevcountdifferentiates = dateObj.prevcountdifferentiates;
      returnVal.nextpreselecteddifferentiates = dateObj.nextpreselecteddifferentiates;
      returnVal.prevpreselecteddifferentiates = dateObj.prevpreselecteddifferentiates;
      return;
    }
    if (!returnVal.value) {
      console.log('fourth option');
      returnVal.value = PositionTypes.RANGE;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
      returnVal.nextpreselected = dateObj.nextpreselected;
      returnVal.prevpreselected = dateObj.prevpreselected;
      returnVal.nextcountdifferentiates = dateObj.nextcountdifferentiates;
      returnVal.prevcountdifferentiates = dateObj.prevcountdifferentiates;
      returnVal.nextpreselecteddifferentiates = dateObj.nextpreselecteddifferentiates;
      returnVal.prevpreselecteddifferentiates = dateObj.prevpreselecteddifferentiates;
      return;
    }
  });
  return returnVal;
  */
}

if (typeof window !== 'undefined') {
  window.addEventListener('touchstart', function onTouch() {
    isTouchDevice = true;

    window.removeEventListener('touchstart', onTouch, false);
  });
}