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
import isWithinRange from 'date-fns/is_within_range';
import enhanceHeader from '../Header/withRange';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
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
  'betweenRange': 'Cal__Day__betweenRange',
  'end': 'Cal__Day__end',
  'day': 'Cal__Day__day',
  'month': 'Cal__Day__month'
};


var isTouchDevice = false;

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
      preselected = _ref.preselected,
      theme = _ref.theme;

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

  var isNextCountDifferent = positionOfDate.nextcountdifferentiates;
  var isPrevCountDifferent = positionOfDate.prevcountdifferentiates;

  var dayClasses = isSelected && isRange && classNames(styles.range, (_classNames = {}, _classNames[styles.start] = isStart, _classNames[styles.betweenRange] = !isStart && !isEnd, _classNames[styles.end] = isEnd, _classNames[styles.multiple] = isMultipleChildren, _classNames[styles.single] = !isMultipleChildren, _classNames[styles.nextselected] = isNextSelected, _classNames[styles.prevselected] = isPrevSelected, _classNames[styles.nextdifferentiates] = isNextCountDifferent, _classNames[styles.prevdifferentiates] = isPrevCountDifferent, _classNames)) || isPreSelected && classNames(styles.range, (_classNames2 = {}, _classNames2[styles.prestart] = isPreStart, _classNames2[styles.preend] = isPreEnd, _classNames2[styles.multiple] = isMultipleChildren, _classNames2[styles.single] = !isMultipleChildren, _classNames2[styles.nextselected] = isNextSelected, _classNames2[styles.prevselected] = isPrevSelected, _classNames2[styles.nextdifferentiates] = isNextCountDifferent, _classNames2[styles.prevdifferentiates] = isPrevCountDifferent, _classNames2));

  return {
    className: dayClasses,
    isPreSelected: isPreSelected,
    isSelected: isSelected
  };
});

// Enhancer to handle selecting and displaying multiple dates
var withRange = _compose(withDefaultProps, _withState('scrollDate', 'setScrollDate', getInitialDate), _withState('displayKey', 'setDisplayKey', getInitialDate), _withState('selectionStart', 'setSelectionStart', null), withImmutableProps(function (_ref2) {
  var DayComponent = _ref2.DayComponent;
  return {
    DayComponent: enhanceDay(DayComponent)
    //HeaderComponent: enhanceHeader(HeaderComponent),
  };
}), _withProps(function (_ref3) {
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
        onClick: function onClick(date, beforeLastDisabled) {
          return handleSelect(date, beforeLastDisabled, _extends({ selected: selected, preselected: preselected }, props));
        },
        handlers: {
          onMouseOver: !isTouchDevice && props.selectionStart ? function (e) {
            return handleMouseOver(e, _extends({ selected: selected, preselected: preselected }, props));
          } : null
        }
      }
      /*Years: {
        selected: selected && selected[displayKey],
        onSelect: (date) => handleYearSelect(date, {displayKey, selected, ...props}),
      },
      Header: {
        onYearClick: (date, e, key) => setDisplayKey( key || 'start'),
      },
      */
    }),
    preselected: handlePreselected(preselected),
    startDays: getStartDays(preselected),
    selected: {
      start_time: selected && format(selected.start_time, 'YYYY-MM-DD'),
      end_time: selected && format(selected.end_time, 'YYYY-MM-DD')
    }
  };
}));

export { withRange };
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

    var dayStart = format(day.start_time, 'YYYY-MM-DD');

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

    var dayStart = format(day.start_time, 'YYYY-MM-DD');
    var dayEnd = format(day.end_time, 'YYYY-MM-DD');
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
      nextcountdifferentiates: false,
      prevcountdifferentiates: false
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

    var dayStart = format(day.start_time, 'YYYY-MM-DD');
    var nextDayStart = format(addDays(dayStart, 1), 'YYYY-MM-DD');
    var prevDayStart = format(subDays(dayStart, 1), 'YYYY-MM-DD');

    if (starts.includes(nextDayStart)) {
      day.nextselected = true;
      var nextday = days.filter(function (date) {
        return date.start_time === nextDayStart;
      });

      if (nextday[0].count !== day.count) {
        day.nextcountdifferentiates = true;
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
    }
  });

  return days;
}

function getSortedSelection(_ref4) {
  var start_time = _ref4.start_time,
      end_time = _ref4.end_time;

  return isBefore(start_time, end_time) ? { start_time: start_time, end_time: end_time } : { start_time: end_time, end_time: start_time };
}

function handleSelect(date, beforeLastDisabled, _ref5) {
  var onSelect = _ref5.onSelect,
      selected = _ref5.selected,
      preselected = _ref5.preselected,
      selectionStart = _ref5.selectionStart,
      setSelectionStart = _ref5.setSelectionStart;


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
      //selections: getPreselectedWithinRange(date, date, preselected),
      eventProp: 'click'
    });
    setSelectionStart(date);
  }
}

function handleMouseOver(e, _ref6) {
  var onSelect = _ref6.onSelect,
      selectionStart = _ref6.selectionStart,
      preselected = _ref6.preselected;

  var dateStr = e.target.getAttribute('data-date');
  var date = dateStr && parse(dateStr);

  if (!date) {
    return;
  }

  onSelect(_extends({
    eventType: EVENT_TYPE.HOVER
  }, getSortedSelection({
    start_time: selectionStart,
    end_time: date
  }), {
    //selections: getPreselectedWithinRange(selectionStart, date, preselected),
    eventProp: 'hover'
  }));
}

function getPreselectedWithinRange(start_date, end_date, preselected) {
  var returnableDates = [];
  var startDate = format(start_date, 'YYYY-MM-DD');
  var endDate = format(end_date, 'YYYY-MM-DD');
  preselected.forEach(function (day, idx) {
    var dayStart = format(day.start_time, 'YYYY-MM-DD');
    var withinRange = isBefore(startDate, endDate) ? isWithinRange(dayStart, startDate, endDate) : isWithinRange(dayStart, endDate, startDate);
    if (withinRange) {
      returnableDates.push(day);
    }
  });
  return returnableDates;
}

function handleYearSelect(date, _ref7) {
  var _Object$assign;

  var displayKey = _ref7.displayKey,
      onSelect = _ref7.onSelect,
      selected = _ref7.selected,
      setScrollDate = _ref7.setScrollDate;


  setScrollDate(date);
  onSelect(getSortedSelection(Object.assign({}, selected, (_Object$assign = {}, _Object$assign[displayKey] = parse(date), _Object$assign))));
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
    nextcountdifferentiates: false
  };
  selected.forEach(function (dateObj, idx) {
    if (date < dateObj.start_time || date > dateObj.end_time) return;
    if (format(date, 'YYYY-MM-DD') === format(dateObj.start_time, 'YYYY-MM-DD')) {
      returnVal.value = PositionTypes.START;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
      returnVal.nextcountdifferentiates = dateObj.nextcountdifferentiates;
      returnVal.prevcountdifferentiates = dateObj.prevcountdifferentiates;
      return;
    }
    if (format(date, 'YYYY-MM-DD') === format(dateObj.end_time, 'YYYY-MM-DD')) {
      returnVal.value = PositionTypes.END;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
      returnVal.nextcountdifferentiates = dateObj.nextcountdifferentiates;
      returnVal.prevcountdifferentiates = dateObj.prevcountdifferentiates;
      return;
    }
    if (!returnVal.value) {
      returnVal.value = PositionTypes.RANGE;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
      returnVal.nextcountdifferentiates = dateObj.nextcountdifferentiates;
      returnVal.prevcountdifferentiates = dateObj.prevcountdifferentiates;
      return;
    }
  });
  return returnVal;
}

if (typeof window !== 'undefined') {
  window.addEventListener('touchstart', function onTouch() {
    isTouchDevice = true;

    window.removeEventListener('touchstart', onTouch, false);
  });
}