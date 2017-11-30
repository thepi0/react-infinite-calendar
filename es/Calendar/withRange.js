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
import enhanceHeader from '../Header/withRange';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
var styles = {
  'root': 'Cal__Day__root',
  'preselected': 'Cal__Day__preselected',
  'nextselected': 'Cal__Day__nextselected',
  'prevselected': 'Cal__Day__prevselected',
  'multiple': 'Cal__Day__multiple',
  'enabled': 'Cal__Day__enabled',
  'highlighted': 'Cal__Day__highlighted',
  'today': 'Cal__Day__today',
  'disabled': 'Cal__Day__disabled',
  'selected': 'Cal__Day__selected',
  'month': 'Cal__Day__month',
  'year': 'Cal__Day__year',
  'selection': 'Cal__Day__selection',
  'day': 'Cal__Day__day',
  'nextdisabled': 'Cal__Day__nextdisabled',
  'prevdisabled': 'Cal__Day__prevdisabled',
  'range': 'Cal__Day__range',
  'start': 'Cal__Day__start',
  'end': 'Cal__Day__end',
  'betweenRange': 'Cal__Day__betweenRange',
  'multipleSelections': 'Cal__Day__multipleSelections'
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

  var isSelected = date >= selected.start && date <= selected.end;
  var isStart = date === selected.start;
  var isEnd = date === selected.end;
  var isRange = !(isStart && isEnd);
  var style = isRange && (isStart && { backgroundColor: theme.accentColor } || isEnd && { borderColor: theme.accentColor });

  var positionOfDate = determineIfDateAlreadySelected(date, preselected);
  var isPreSelected = !!positionOfDate.value;
  var isPreStart = positionOfDate.value === PositionTypes.START;
  var isPreEnd = positionOfDate.value === PositionTypes.END;

  var isMultipleChildren = positionOfDate.count > 1;
  var isNextSelected = positionOfDate.nextselected;
  var isPrevSelected = positionOfDate.prevselected;

  var dayClasses = isSelected && isRange && classNames(styles.range, (_classNames = {}, _classNames[styles.start] = isStart, _classNames[styles.betweenRange] = !isStart && !isEnd, _classNames[styles.end] = isEnd, _classNames)) || isPreSelected && classNames(styles.range, (_classNames2 = {}, _classNames2[styles.prestart] = isPreStart, _classNames2[styles.preend] = isPreEnd, _classNames2[styles.multiple] = isMultipleChildren, _classNames2[styles.nextselected] = isNextSelected, _classNames2[styles.prevselected] = isPrevSelected, _classNames2));

  return {
    className: dayClasses,
    isPreSelected: isPreSelected,
    isSelected: isSelected,
    selectionStyle: style
  };
});

// Enhancer to handle selecting and displaying multiple dates
var withRange = _compose(withDefaultProps, _withState('scrollDate', 'setScrollDate', getInitialDate), _withState('displayKey', 'setDisplayKey', getInitialDate), _withState('selectionStart', 'setSelectionStart', null), withImmutableProps(function (_ref2) {
  var DayComponent = _ref2.DayComponent,
      HeaderComponent = _ref2.HeaderComponent,
      YearsComponent = _ref2.YearsComponent;
  return {
    DayComponent: enhanceDay(DayComponent),
    HeaderComponent: enhanceHeader(HeaderComponent)
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
        onClick: function onClick(date) {
          return handleSelect(date, _extends({ selected: selected }, props));
        },
        handlers: {
          onMouseOver: !isTouchDevice && props.selectionStart ? function (e) {
            return handleMouseOver(e, _extends({ selected: selected }, props));
          } : null
        }
      },
      Years: {
        selected: selected && selected[displayKey],
        onSelect: function onSelect(date) {
          return handleYearSelect(date, _extends({ displayKey: displayKey, selected: selected }, props));
        }
      },
      Header: {
        onYearClick: function onYearClick(date, e, key) {
          return setDisplayKey(key || 'start');
        }
      }
    }),
    preselected: handlePreselected(preselected),
    startDays: getStartDays(preselected),
    selected: {
      start: selected && format(selected.start, 'YYYY-MM-DD'),
      end: selected && format(selected.end, 'YYYY-MM-DD')
    }
  };
}));

export { withRange };
function getStartDays(preselected) {
  var returnable = preselected.map(function (dateObj) {
    return {
      start: dateObj.start,
      end: dateObj.end,
      child: dateObj.child
    };
  });

  var starts = [];

  returnable.forEach(function (day, idx) {

    var dayStart = format(day.start, 'YYYY-MM-DD');

    if (!starts.includes(dayStart)) {
      starts.push(dayStart);
    }
  });

  return starts;
}

function handlePreselected(preselected) {
  var returnable = preselected.map(function (dateObj) {
    return {
      start: dateObj.start,
      end: dateObj.end,
      child: dateObj.child
    };
  });

  var days = [];
  var starts = [];

  returnable.forEach(function (day, idx) {

    var dayStart = format(day.start, 'YYYY-MM-DD');
    var dayEnd = format(day.end, 'YYYY-MM-DD');
    var dayChild = day.child;

    var pushThis = {
      start: dayStart,
      end: dayEnd,
      child: day.child,
      original_start: day.start,
      original_end: day.end,
      count: 1,
      nextselected: false,
      prevselected: false
    };

    if (starts.includes(dayStart)) {

      pushThis.count += 1;

      for (var i = 0; i < days.length; i++) {
        if (days[i].start == dayStart) {
          days[i].count += 1;
        }
      }
    }

    starts.push(dayStart);
    days.push(pushThis);
  });

  days.forEach(function (day, idx) {

    var dayStart = format(day.start, 'YYYY-MM-DD');
    var nextDayStart = format(addDays(dayStart, 1), 'YYYY-MM-DD');
    var prevDayStart = format(subDays(dayStart, 1), 'YYYY-MM-DD');

    if (starts.includes(nextDayStart)) {
      day.nextselected = true;
    }

    if (starts.includes(prevDayStart)) {
      day.prevselected = true;
    }
  });

  return days;
}

function getSortedSelection(_ref4) {
  var start = _ref4.start,
      end = _ref4.end;

  return isBefore(start, end) ? { start: start, end: end } : { start: end, end: start };
}

function handleSelect(date, _ref5) {
  var onSelect = _ref5.onSelect,
      selected = _ref5.selected,
      selectionStart = _ref5.selectionStart,
      setSelectionStart = _ref5.setSelectionStart;

  if (selectionStart) {
    onSelect(_extends({
      eventType: EVENT_TYPE.END
    }, getSortedSelection({
      start: selectionStart,
      end: date
    })));
    setSelectionStart(null);
  } else {
    onSelect({ eventType: EVENT_TYPE.START, start: date, end: date });
    setSelectionStart(date);
  }
}

function handleMouseOver(e, _ref6) {
  var onSelect = _ref6.onSelect,
      selectionStart = _ref6.selectionStart;

  var dateStr = e.target.getAttribute('data-date');
  var date = dateStr && parse(dateStr);

  if (!date) {
    return;
  }

  onSelect(_extends({
    eventType: EVENT_TYPE.HOVER
  }, getSortedSelection({
    start: selectionStart,
    end: date
  })));
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

  return initialSelectedDate || selected && selected.start || new Date();
}

function determineIfDateAlreadySelected(date, selected) {
  var returnVal = {
    index: -1,
    value: '',
    count: 1,
    nextselected: false,
    prevselected: false
  };
  selected.forEach(function (dateObj, idx) {
    if (date < dateObj.start || date > dateObj.end) return;
    if (format(date, 'YYYY-MM-DD') === format(dateObj.start, 'YYYY-MM-DD')) {
      returnVal.value = PositionTypes.START;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
      return;
    }
    if (format(date, 'YYYY-MM-DD') === format(dateObj.end, 'YYYY-MM-DD')) {
      returnVal.value = PositionTypes.END;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
      return;
    }
    if (!returnVal.value) {
      returnVal.value = PositionTypes.RANGE;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
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