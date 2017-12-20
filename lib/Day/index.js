'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _parse = require('date-fns/parse');

var _parse2 = _interopRequireDefault(_parse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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


var isPreSelection = false;

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
          disabledDays = _this$props.disabledDays,
          isDisabled = _this$props.isDisabled,
          isPreSelected = _this$props.isPreSelected,
          onClick = _this$props.onClick,
          originalDisabledDates = _this$props.originalDisabledDates;


      console.log('handleClick()');
      console.log(disabledDays);

      isPreSelection = isPreSelected;

      if (beforeLastDisabled && !isPreSelected && typeof onClick === 'function') {
        //onClick(parse(date), beforeLastDisabled, isPreSelected, originalDisabledDates);
      } else if (!isDisabled && typeof onClick === 'function') {
        onClick((0, _parse2.default)(date), beforeLastDisabled, isPreSelected, originalDisabledDates, disabledDays);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Day.prototype.renderSelection = function renderSelection(selectionColor) {
    var _props = this.props,
        day = _props.day,
        date = _props.date,
        isToday = _props.isToday,
        isDisabled = _props.isDisabled,
        todayLabel = _props.locale.todayLabel,
        monthShort = _props.monthShort,
        textColor = _props.theme.textColor,
        selectionStyle = _props.selectionStyle;


    return _react2.default.createElement('div', {
      className: styles.selection,
      'data-date': date,
      'data-disabled': isDisabled ? isDisabled : false
    });
  };

  Day.prototype.render = function render() {
    var _classNames;

    var _props2 = this.props,
        className = _props2.className,
        currentYear = _props2.currentYear,
        date = _props2.date,
        day = _props2.day,
        beforeLastDisabled = _props2.beforeLastDisabled,
        originalDisabledDates = _props2.originalDisabledDates,
        disabledDays = _props2.disabledDays,
        handlers = _props2.handlers,
        selected = _props2.selected,
        isDisabled = _props2.isDisabled,
        isHighlighted = _props2.isHighlighted,
        isToday = _props2.isToday,
        isSelected = _props2.isSelected,
        isPreSelected = _props2.isPreSelected,
        prevDisabled = _props2.prevDisabled,
        nextDisabled = _props2.nextDisabled,
        monthShort = _props2.monthShort;


    return _react2.default.createElement(
      'li',
      _extends({
        className: (0, _classnames2.default)(styles.root, (_classNames = {}, _classNames[styles.today] = isToday, _classNames[styles.highlighted] = isHighlighted, _classNames[styles.selected] = isSelected, _classNames[styles.preselected] = isPreSelected, _classNames[styles.prevdisabled] = prevDisabled, _classNames[styles.nextdisabled] = nextDisabled, _classNames[styles.disabled] = isDisabled || beforeLastDisabled && !isPreSelected, _classNames[styles.enabled] = !isDisabled, _classNames[styles.beforelast] = beforeLastDisabled, _classNames), className),
        onClick: this.handleClick,
        'data-date': date,
        'data-disabled': isDisabled ? isDisabled : false
      }, handlers),
      day,
      isSelected && this.renderSelection()
    );
  };

  return Day;
}(_react.PureComponent);

exports.default = Day;
module.exports = exports['default'];