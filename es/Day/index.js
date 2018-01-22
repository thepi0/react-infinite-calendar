var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
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

var Day = function (_PureComponent) {
  _inherits(Day, _PureComponent);

  function Day() {
    var _temp, _this, _ret;

    _classCallCheck(this, Day);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _PureComponent.call.apply(_PureComponent, [this].concat(args))), _this), _this.handleClick = function () {
      var _this$props = _this.props,
          date = _this$props.date,
          beforeLastDisabled = _this$props.beforeLastDisabled,
          isDisabled = _this$props.isDisabled,
          isPreSelected = _this$props.isPreSelected,
          onClick = _this$props.onClick,
          onClear = _this$props.onClear,
          originalDisabledDates = _this$props.originalDisabledDates;


      var fromTop = ReactDOM.findDOMNode(_this).getBoundingClientRect().top;

      if (isDisabled) {
        onClear();
      } else if (!(beforeLastDisabled && !isPreSelected) && !isDisabled && typeof onClick === 'function') {
        onClick(parse(date), beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop);
      }
    }, _this.getDayColors = function (date, preselected) {
      if (!preselected || !preselected.length) {
        return;
      }

      var returnable = {
        purple: false,
        blue: false,
        green: false,
        orange: false
      };

      var classes = {
        '#ca569a': 'purple',
        '#2cb1d8': 'blue',
        '#85bd4c': 'green',
        '#ea992f': 'orange'
      };

      for (var j = 0, len = preselected.length; j < len; ++j) {
        if (date === preselected[j].start_time) {
          for (var x = 0, col = preselected[j].colors.length; x < col; ++x) {
            returnable[classes[preselected[j].colors[x]]] = true;
          }
          break;
        }
      }

      return returnable;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /*handleMouseDown = () => {
      let {date, beforeLastDisabled, isDisabled, isPreSelected, onMouseDown, originalDisabledDates} = this.props;
       if (!(beforeLastDisabled && !isPreSelected) && !isDisabled && typeof onMouseDown === 'function') {
        onMouseDown(parse(date), beforeLastDisabled, isPreSelected, originalDisabledDates);
      }
  };*/

  Day.prototype.renderSelection = function renderSelection(selectionColor) {
    var _props = this.props,
        day = _props.day,
        date = _props.date,
        isToday = _props.isToday,
        isDisabled = _props.isDisabled;


    return React.createElement('div', {
      className: styles.selection,
      'data-date': date,
      'data-disabled': isDisabled ? isDisabled : false
    });
  };

  Day.prototype.render = function render() {
    var _classNames;

    var _props2 = this.props,
        className = _props2.className,
        date = _props2.date,
        day = _props2.day,
        beforeLastDisabled = _props2.beforeLastDisabled,
        originalDisabledDates = _props2.originalDisabledDates,
        handlers = _props2.handlers,
        isVacation = _props2.isVacation,
        selected = _props2.selected,
        preselected = _props2.preselected,
        isDisabled = _props2.isDisabled,
        isHighlighted = _props2.isHighlighted,
        isToday = _props2.isToday,
        isSelected = _props2.isSelected,
        isPreSelected = _props2.isPreSelected,
        prevDisabled = _props2.prevDisabled,
        nextDisabled = _props2.nextDisabled,
        monthShort = _props2.monthShort;


    var colors = isPreSelected ? this.getDayColors(date, preselected) : {
      purple: false,
      blue: false,
      green: false,
      orange: false
    };

    return React.createElement(
      'li',
      _extends({
        className: classNames(styles.root, (_classNames = {}, _classNames[styles.today] = isToday, _classNames[styles.highlighted] = isHighlighted, _classNames[styles.selected] = isSelected, _classNames[styles.preselected] = isPreSelected, _classNames[styles.prevdisabled] = prevDisabled, _classNames[styles.nextdisabled] = nextDisabled, _classNames[styles.disabled] = isDisabled || beforeLastDisabled && !isPreSelected, _classNames[styles.enabled] = !isDisabled, _classNames[styles.beforelast] = beforeLastDisabled, _classNames[styles.purple] = isPreSelected && colors.purple, _classNames[styles.blue] = isPreSelected && colors.blue, _classNames[styles.green] = isPreSelected && colors.green, _classNames[styles.orange] = isPreSelected && colors.orange, _classNames), className),
        onClick: this.handleClick,
        'data-date': date,
        'data-disabled': isDisabled ? isDisabled : false
      }, handlers),
      day,
      !beforeLastDisabled && isVacation ? React.createElement('div', { className: styles.vacationCircle }) : null,
      isSelected && this.renderSelection()
    );
  };

  return Day;
}(PureComponent);

export { Day as default };