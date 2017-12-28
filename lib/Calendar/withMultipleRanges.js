'use strict';

exports.__esModule = true;
exports.withMultipleRanges = exports.enhanceDay = exports.EVENT_TYPES = undefined;

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

var _withMultipleRanges = require('../Header/withMultipleRanges');

var _withMultipleRanges2 = _interopRequireDefault(_withMultipleRanges);

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
  'two': 'Cal__Day__two',
  'three': 'Cal__Day__three',
  'moreThanFour': 'Cal__Day__moreThanFour',
  'foreOrMore': 'Cal__Day__foreOrMore',
  'enabled': 'Cal__Day__enabled',
  'highlighted': 'Cal__Day__highlighted',
  'today': 'Cal__Day__today',
  'multiple': 'Cal__Day__multiple',
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

var EVENT_TYPES = exports.EVENT_TYPES = {
  DELETE: 4,
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
  var _classNames;

  var date = _ref.date,
      selected = _ref.selected,
      theme = _ref.theme;

  var positionOfDate = determineIfDateAlreadySelected(date, selected);
  var isSelected = !!positionOfDate.value;
  var isStart = positionOfDate.value === PositionTypes.START;
  var isEnd = positionOfDate.value === PositionTypes.END;
  var isRange = !(isStart && isEnd);

  var style = isRange && (isStart && {} || isEnd && {});

  return {
    className: isSelected && isRange && (0, _classnames2.default)(styles.range, (_classNames = {}, _classNames[styles.start] = isStart, _classNames[styles.betweenRange] = !isStart && !isEnd, _classNames[styles.end] = isEnd, _classNames)),
    isSelected: isSelected,
    selectionStyle: style
  };
});

// Enhancer to handle selecting and displaying multiple dates
var withMultipleRanges = (0, _compose3.default)(_.withDefaultProps, (0, _withState3.default)('displayIndex', 'setDisplayIndex', 0), (0, _withState3.default)('scrollDate', 'setScrollDate', getInitialDate), (0, _withState3.default)('displayKey', 'setDisplayKey', getInitialDate), (0, _withState3.default)('selectionStart', 'setSelectionStart', null), (0, _withState3.default)('selectionStartIdx', 'setSelectionStartIdx', null), (0, _utils.withImmutableProps)(function (_ref2) {
  var DayComponent = _ref2.DayComponent,
      HeaderComponent = _ref2.HeaderComponent,
      YearsComponent = _ref2.YearsComponent;
  return {
    DayComponent: enhanceDay(DayComponent),
    HeaderComponent: (0, _withMultipleRanges2.default)(HeaderComponent)
  };
}), (0, _withProps3.default)(function (_ref3) {
  var displayKey = _ref3.displayKey,
      passThrough = _ref3.passThrough,
      selected = _ref3.selected,
      setDisplayKey = _ref3.setDisplayKey,
      setDisplayIndex = _ref3.setDisplayIndex,
      displayIndex = _ref3.displayIndex,
      props = _objectWithoutProperties(_ref3, ['displayKey', 'passThrough', 'selected', 'setDisplayKey', 'setDisplayIndex', 'displayIndex']);

  return {
    /* eslint-disable sort-keys */
    passThrough: _extends({}, passThrough, {
      Day: {
        onClick: function onClick(date) {
          return handleSelect(date, _extends({ selected: selected, setDisplayIndex: setDisplayIndex }, props));
        },
        handlers: {
          onMouseOver: !isTouchDevice && props.selectionStart ? function (e) {
            return handleMouseOver(e, _extends({ selected: selected }, props));
          } : null
        }
      },
      Years: {
        selected: selected[displayIndex] && (0, _parse2.default)(selected[displayIndex][displayKey]),
        onSelect: function onSelect(date, e, callback) {
          return handleYearSelect(date, callback);
        }
      },
      Header: {
        setDisplayIndex: setDisplayIndex,
        displayIndex: displayIndex,
        onYearClick: function onYearClick(date, e, key) {
          return setDisplayKey(key || 'start');
        }
      }
    }),
    preselected: preselected.map(function (dateObj) {
      return {
        start: (0, _format2.default)(dateObj.start, 'YYYY-MM-DD'),
        end: (0, _format2.default)(dateObj.end, 'YYYY-MM-DD'),
        child: dateObj.child
      };
    }),
    selected: selected.map(function (dateObj) {
      return {
        start: (0, _format2.default)(dateObj.start, 'YYYY-MM-DD'),
        end: (0, _format2.default)(dateObj.end, 'YYYY-MM-DD'),
        child: dateObj.child
      };
    })
  };
}));

exports.withMultipleRanges = withMultipleRanges;
function getSortedSelection(_ref4) {
  var start = _ref4.start,
      end = _ref4.end;

  return (0, _is_before2.default)(start, end) ? { start: start, end: end } : { start: end, end: start };
}

function handleSelect(date, _ref5) {
  var onSelect = _ref5.onSelect,
      selected = _ref5.selected,
      selectionStart = _ref5.selectionStart,
      setSelectionStart = _ref5.setSelectionStart,
      selectionStartIdx = _ref5.selectionStartIdx,
      setSelectionStartIdx = _ref5.setSelectionStartIdx,
      setDisplayIndex = _ref5.setDisplayIndex;

  var positionOfDate = determineIfDateAlreadySelected(date, selected);
  var funcs = { onSelect: onSelect, setSelectionStart: setSelectionStart, setSelectionStartIdx: setSelectionStartIdx, setDisplayIndex: setDisplayIndex };

  if (positionOfDate.value && !selectionStart) {
    //selecting an already defined range
    //const selectedDate = selected[positionOfDate.index];//not clone so modding this is modding selected
    //selectedDate.end = date; //not possible to have start/end reversed when clicking on already set range

    //updateSelectedState(positionOfDate.index, selectedDate.start, positionOfDate.index, selected, funcs);//grab index of selected and set in state
    console.log('already selected date range clicked');
  } else if (selectionStart) {
    //ending date range selection
    if (positionOfDate.value === PositionTypes.START && !(date < selectionStart)) {
      //if in process and selecting start, assume they want to cancel
      var displayIdx = positionOfDate.index > 0 ? positionOfDate.index - 1 : 0;
      updateSelectedState(displayIdx, null, null, [].concat(selected.slice(0, positionOfDate.index), selected.slice(positionOfDate.index + 1)), funcs);
    } else {
      selected[selectionStartIdx] = _extends({}, getSortedSelection({
        start: selectionStart,
        end: date
      }));
      updateSelectedState(positionOfDate.index, null, null, selected, funcs);
    }
  } else {
    //starting new date range
    updateSelectedState(selected.length, date, selected.length, selected.concat({ eventType: EVENT_TYPES.START, start: date, end: date }), funcs); //length accounts for increase due to concat
  }
}

function updateSelectedState(displayIdx, selectStart, selectStartIdx, selected, _ref6) {
  var onSelect = _ref6.onSelect,
      setSelectionStart = _ref6.setSelectionStart,
      setSelectionStartIdx = _ref6.setSelectionStartIdx,
      setDisplayIndex = _ref6.setDisplayIndex;

  onSelect(selected, { eventType: selectStart ? EVENT_TYPES.START : EVENT_TYPES.END, modifiedDateIndex: displayIdx });
  setDisplayIndex(displayIdx);
  setSelectionStart(selectStart);
  setSelectionStartIdx(selectStartIdx);
}

function handleMouseOver(e, _ref7) {
  var onSelect = _ref7.onSelect,
      selectionStart = _ref7.selectionStart,
      selectionStartIdx = _ref7.selectionStartIdx,
      selected = _ref7.selected;

  var dateStr = e.target.getAttribute('data-date');
  var date = dateStr && (0, _parse2.default)(dateStr);

  if (!date) {
    return;
  }
  if (selectionStartIdx === null) {
    return;
  }

  selected[selectionStartIdx] = _extends({
    eventType: EVENT_TYPES.HOVER
  }, getSortedSelection({
    start: selectionStart,
    end: date
  }));
  onSelect(selected);
}

function handleYearSelect(date, callback) {
  callback((0, _parse2.default)(date));
}

function getInitialDate(_ref8) {
  var selected = _ref8.selected,
      initialSelectedDate = _ref8.initialSelectedDate;
  //add
  return initialSelectedDate || selected && selected.length && selected[0].start || new Date();
}

if (typeof window !== 'undefined') {
  window.addEventListener('touchstart', function onTouch() {
    isTouchDevice = true;

    window.removeEventListener('touchstart', onTouch, false);
  });
}

function determineIfDateAlreadySelected(date, selected) {
  var returnVal = {
    index: -1,
    value: ''
  };
  selected.forEach(function (dateObj, idx) {
    if (date < dateObj.start || date > dateObj.end) return;
    if ((0, _format2.default)(date, 'YYYY-MM-DD') === (0, _format2.default)(dateObj.start, 'YYYY-MM-DD')) {
      returnVal.value = PositionTypes.START;
      returnVal.index = idx;
      return;
    }
    if ((0, _format2.default)(date, 'YYYY-MM-DD') === (0, _format2.default)(dateObj.end, 'YYYY-MM-DD')) {
      returnVal.value = PositionTypes.END;
      returnVal.index = idx;
      return;
    }
    if (!returnVal.value) {
      returnVal.value = PositionTypes.RANGE;
      returnVal.index = idx;
      return;
    }
  });
  return returnVal;
}