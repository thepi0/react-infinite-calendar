'use strict';

exports.__esModule = true;
exports.default = exports.withDefaultProps = undefined;

var _defaultProps2 = require('recompose/defaultProps');

var _defaultProps3 = _interopRequireDefault(_defaultProps2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp, _initialiseProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('../utils');

var _defaultDisplayOptions = require('../utils/defaultDisplayOptions');

var _defaultDisplayOptions2 = _interopRequireDefault(_defaultDisplayOptions);

var _defaultLocale = require('../utils/defaultLocale');

var _defaultLocale2 = _interopRequireDefault(_defaultLocale);

var _defaultTheme = require('../utils/defaultTheme');

var _defaultTheme2 = _interopRequireDefault(_defaultTheme);

var _Today = require('../Today');

var _Today2 = _interopRequireDefault(_Today);

var _Header = require('../Header');

var _Header2 = _interopRequireDefault(_Header);

var _MonthList = require('../MonthList');

var _MonthList2 = _interopRequireDefault(_MonthList);

var _Weekdays = require('../Weekdays');

var _Weekdays2 = _interopRequireDefault(_Weekdays);

var _Years = require('../Years');

var _Years2 = _interopRequireDefault(_Years);

var _Day = require('../Day');

var _Day2 = _interopRequireDefault(_Day);

var _parse = require('date-fns/parse');

var _parse2 = _interopRequireDefault(_parse);

var _format = require('date-fns/format');

var _format2 = _interopRequireDefault(_format);

var _start_of_day = require('date-fns/start_of_day');

var _start_of_day2 = _interopRequireDefault(_start_of_day);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  container: {
    'root': 'Cal__Container__root',
    'landscape': 'Cal__Container__landscape',
    'wrapper': 'Cal__Container__wrapper',
    'listWrapper': 'Cal__Container__listWrapper'
  },
  day: {
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
  }
};

var lastUpdateDate = new Date();

var withDefaultProps = exports.withDefaultProps = (0, _defaultProps3.default)({
  autoFocus: true,
  DayComponent: _Day2.default,
  display: 'days',
  displayOptions: {},
  HeaderComponent: _Header2.default,
  scrollOffset: null,
  height: 500,
  keyboardSupport: true,
  max: new Date(2050, 11, 31),
  maxDate: new Date(2050, 11, 31),
  min: new Date(1980, 0, 1),
  preselected: {},
  selected: null,
  originalDisabledDates: {},
  lastSelectableDate: new Date(),
  lastUpdate: new Date(),
  minDate: new Date(1980, 0, 1),
  onHighlightedDateChange: _utils.emptyFn,
  onScroll: _utils.emptyFn,
  onScrollEnd: _utils.emptyFn,
  onSelect: _utils.emptyFn,
  passThrough: {},
  rowHeight: 56,
  tabIndex: 1,
  width: 400,
  YearsComponent: _Years2.default
});

var Calendar = (_temp = _class = function (_Component) {
  _inherits(Calendar, _Component);

  function Calendar(props) {
    _classCallCheck(this, Calendar);

    var _this = _possibleConstructorReturn(this, _Component.apply(this, arguments));

    _initialiseProps.call(_this);

    _this.updateYears(props);
    _this.updatePreSelected(props);
    _this.updateSelected(props);
    _this.updateLastUpdated(props);
    _this.updateOriginalDisabledDates(props);
    _this.updatelastSelectableDate(props);

    _this.state = {
      display: props.display,
      showToday: { hide: false, direction: null }
    };
    return _this;
  }

  Calendar.prototype.componentDidMount = function componentDidMount() {
    var autoFocus = this.props.autoFocus;


    this.setInitialTodayHelperPosition(this.props);

    if (autoFocus) {
      this.node.focus();
    }
  };

  Calendar.prototype.componentWillUpdate = function componentWillUpdate(nextProps, nextState) {
    if (nextProps.display !== this.props.display) {
      this.setState({ display: nextProps.display });
    }

    if (nextProps.selected !== this.state.selected) {
      this.updateSelected(nextProps);
    }

    if (nextProps.lastUpdate !== this.state.lastUpdate) {
      this.updateLastUpdated(nextProps);
      this.updatePreSelected(nextProps);
      this.updateOriginalDisabledDates(nextProps);
      this.updatelastSelectableDate(nextProps);
    }
  };

  Calendar.prototype.updateLastUpdated = function updateLastUpdated() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

    var lastUpdate = props.lastUpdate;
    this.lastUpdate = lastUpdate;
  };

  Calendar.prototype.updateSelected = function updateSelected() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

    var selected = props.selected;
    this.selected = selected;
  };

  Calendar.prototype.updatePreSelected = function updatePreSelected() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

    var preselected = props.preselected;
    this.preselected = preselected;
  };

  Calendar.prototype.updateOriginalDisabledDates = function updateOriginalDisabledDates() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

    var originalDisabledDates = props.originalDisabledDates;
    this.originalDisabledDates = originalDisabledDates;
  };

  Calendar.prototype.updatelastSelectableDate = function updatelastSelectableDate() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

    var lastSelectableDate = props.lastSelectableDate;
    this.lastSelectableDate = lastSelectableDate;
  };

  Calendar.prototype.updateYears = function updateYears() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

    this._min = (0, _parse2.default)(props.min);
    this._max = (0, _parse2.default)(props.max);
    this._minDate = (0, _parse2.default)(props.minDate);
    this._maxDate = (0, _parse2.default)(props.maxDate);

    var min = this._min.getFullYear();
    var minMonth = this._min.getMonth();
    var max = this._max.getFullYear();
    var maxMonth = this._max.getMonth();

    var months = [];
    var year = void 0,
        month = void 0;
    for (year = min; year <= max; year++) {
      for (month = 0; month < 12; month++) {
        if (year === min && month < minMonth || year === max && month > maxMonth) {
          continue;
        }

        months.push({ month: month, year: year });
      }
    }

    this.months = months;
  };

  Calendar.prototype.getDisabledDates = function getDisabledDates(disabledDates) {
    return disabledDates && disabledDates.map(function (date) {
      return (0, _format2.default)((0, _parse2.default)(date.date), 'YYYY-MM-DD');
    });
  };

  Calendar.prototype.getDisplayOptions = function getDisplayOptions() {
    var displayOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.displayOptions;

    return Object.assign(this._displayOptions, _defaultDisplayOptions2.default, displayOptions);
  };

  Calendar.prototype.getLocale = function getLocale() {
    return Object.assign(this._locale, _defaultLocale2.default, this.props.locale);
  };

  Calendar.prototype.getTheme = function getTheme() {
    return Object.assign(this._theme, _defaultTheme2.default, this.props.theme);
  };

  Calendar.prototype.render = function render() {
    var _classNames,
        _this2 = this;

    var _props = this.props,
        className = _props.className,
        passThrough = _props.passThrough,
        DayComponent = _props.DayComponent,
        disabledDays = _props.disabledDays,
        originalDisabledDates = _props.originalDisabledDates,
        displayDate = _props.displayDate,
        height = _props.height,
        HeaderComponent = _props.HeaderComponent,
        rowHeight = _props.rowHeight,
        scrollDate = _props.scrollDate,
        selected = _props.selected,
        preselected = _props.preselected,
        tabIndex = _props.tabIndex,
        width = _props.width,
        YearsComponent = _props.YearsComponent;

    var _getDisplayOptions = this.getDisplayOptions(),
        hideYearsOnSelect = _getDisplayOptions.hideYearsOnSelect,
        layout = _getDisplayOptions.layout,
        overscanMonthCount = _getDisplayOptions.overscanMonthCount,
        shouldHeaderAnimate = _getDisplayOptions.shouldHeaderAnimate,
        showHeader = _getDisplayOptions.showHeader,
        showMonthsForYears = _getDisplayOptions.showMonthsForYears,
        showOverlay = _getDisplayOptions.showOverlay,
        showTodayHelper = _getDisplayOptions.showTodayHelper,
        showWeekdays = _getDisplayOptions.showWeekdays;

    var _state = this.state,
        display = _state.display,
        isScrolling = _state.isScrolling,
        showToday = _state.showToday;

    var disabledDates = this.getDisabledDates(this.props.disabledDates);
    var locale = this.getLocale();
    var theme = this.getTheme();
    var today = this.today = (0, _start_of_day2.default)(new Date());

    return _react2.default.createElement(
      'div',
      _extends({
        tabIndex: tabIndex,
        className: (0, _classnames2.default)(className, styles.container.root, (_classNames = {}, _classNames[styles.container.landscape] = layout === 'landscape', _classNames)),
        style: { color: theme.textColor.default, width: width },
        'aria-label': 'Calendar',
        ref: function ref(node) {
          _this2.node = node;
        }
      }, passThrough.rootNode),
      _react2.default.createElement(
        'div',
        { className: styles.container.wrapper },
        showWeekdays && _react2.default.createElement(_Weekdays2.default, { weekdays: locale.weekdays, weekStartsOn: locale.weekStartsOn, theme: theme }),
        _react2.default.createElement(
          'div',
          { className: styles.container.listWrapper },
          showTodayHelper && _react2.default.createElement(_Today2.default, {
            scrollToDate: this.scrollToDate,
            showObject: showToday,
            today: today,
            theme: theme,
            todayLabel: locale.todayLabel.long
          }),
          this.months && this.months.length && _react2.default.createElement(_MonthList2.default, {
            ref: function ref(instance) {
              _this2._MonthList = instance;
            },
            DayComponent: DayComponent,
            disabledDates: disabledDates,
            lastUpdate: this.lastUpdate,
            originalDisabledDates: this.originalDisabledDates,
            lastSelectableDate: this.lastSelectableDate,
            disabledDays: disabledDays,
            height: height,
            isScrolling: isScrolling,
            locale: locale,
            maxDate: this._maxDate,
            min: this._min,
            minDate: this._minDate,
            months: this.months,
            onScroll: this.handleScroll,
            overscanMonthCount: overscanMonthCount,
            passThrough: passThrough,
            theme: theme,
            today: today,
            rowHeight: rowHeight,
            selected: this.selected,
            preselected: this.preselected,
            scrollDate: scrollDate,
            showOverlay: showOverlay,
            width: width
          })
        )
      )
    );
  };

  return Calendar;
}(_react.Component), _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this._displayOptions = {};
  this._locale = {};
  this._theme = {};

  this.getCurrentOffset = function () {
    return _this3.scrollTop;
  };

  this.getDateOffset = function (date) {
    return _this3._MonthList && _this3._MonthList.getDateOffset(date);
  };

  this.scrollTo = function (offset) {
    return _this3._MonthList && _this3._MonthList.scrollTo(offset);
  };

  this.scrollToDate = function () {
    var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
    var offset = arguments[1];
    var shouldAnimate = arguments[2];
    var display = _this3.props.display;


    return _this3._MonthList && _this3._MonthList.scrollToDate(date, offset, shouldAnimate && display === 'days', function () {
      return _this3.setState({ isScrolling: false });
    });
  };

  this.getScrollSpeed = new _utils.ScrollSpeed().getScrollSpeed;

  this.handleScroll = function (scrollTop, e) {
    var _props2 = _this3.props,
        onScroll = _props2.onScroll,
        rowHeight = _props2.rowHeight;
    var isScrolling = _this3.state.isScrolling;

    var _getDisplayOptions2 = _this3.getDisplayOptions(),
        showTodayHelper = _getDisplayOptions2.showTodayHelper,
        showOverlay = _getDisplayOptions2.showOverlay;

    var scrollSpeed = _this3.scrollSpeed = Math.abs(_this3.getScrollSpeed(scrollTop));
    _this3.scrollTop = scrollTop;

    if (showTodayHelper) {
      _this3.updateTodayHelperPosition(scrollSpeed);
    }

    onScroll(scrollTop, e);
    _this3.handleScrollEnd();
  };

  this.handleScrollEnd = (0, _utils.debounce)(function () {
    var onScrollEnd = _this3.props.onScrollEnd;
    var isScrolling = _this3.state.isScrolling;

    var _getDisplayOptions3 = _this3.getDisplayOptions(),
        showTodayHelper = _getDisplayOptions3.showTodayHelper;

    if (isScrolling) {
      _this3.setState({ isScrolling: false });
    }

    if (showTodayHelper) {
      _this3.updateTodayHelperPosition(0);
    }

    onScrollEnd(_this3.scrollTop);
  }, 150);

  this.setInitialTodayHelperPosition = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this3.props;

    var today = _this3.today;
    var scrollTop = props.scrollOffset;
    var showToday = _this3.state.showToday;
    var _props3 = _this3.props,
        height = _props3.height,
        rowHeight = _props3.rowHeight;

    var _getDisplayOptions4 = _this3.getDisplayOptions(),
        todayHelperRowOffset = _getDisplayOptions4.todayHelperRowOffset;

    var newState = { hide: false, direction: null };

    if (!_this3._todayOffset) {
      _this3._todayOffset = _this3.getDateOffset(today);
    }

    if (scrollTop >= _this3._todayOffset + (height - rowHeight) / 2 + rowHeight * todayHelperRowOffset) {
      if (showToday.direction !== _Today.DIRECTION_UP) {
        newState = { hide: false, direction: _Today.DIRECTION_UP };
      }
    }
    // Today is below the fold
    else if (scrollTop <= _this3._todayOffset - height / 2 - rowHeight * (todayHelperRowOffset + 1)) {
        if (showToday.direction !== _Today.DIRECTION_DOWN) {
          newState = { hide: false, direction: _Today.DIRECTION_DOWN };
        }
      } else if (showToday && (scrollTop >= _this3._todayOffset - height / 2 - rowHeight * (todayHelperRowOffset + 1) || scrollTop <= _this3._todayOffset + (height - rowHeight) / 2 + rowHeight * todayHelperRowOffset)) {

        newState = { hide: true, direction: null };
      }

    if (newState != null) {
      _this3.setState({ showToday: newState });
    }
  };

  this.updateTodayHelperPosition = function (scrollSpeed) {
    var today = _this3.today;
    var scrollTop = _this3.scrollTop;
    var showToday = _this3.state.showToday;
    var _props4 = _this3.props,
        height = _props4.height,
        rowHeight = _props4.rowHeight;

    var _getDisplayOptions5 = _this3.getDisplayOptions(),
        todayHelperRowOffset = _getDisplayOptions5.todayHelperRowOffset;

    var newState = void 0;

    if (!_this3._todayOffset) {
      _this3._todayOffset = _this3.getDateOffset(today);
    }

    if (scrollTop >= _this3._todayOffset + (height - rowHeight) / 2 + rowHeight * todayHelperRowOffset) {
      if (showToday.direction !== _Today.DIRECTION_UP) {
        newState = { hide: false, direction: _Today.DIRECTION_UP };
      }
    }
    // Today is below the fold
    else if (scrollTop <= _this3._todayOffset - height / 2 - rowHeight * (todayHelperRowOffset + 1)) {
        if (showToday.direction !== _Today.DIRECTION_DOWN) {
          newState = { hide: false, direction: _Today.DIRECTION_DOWN };
        }
      } else if (showToday && (scrollTop >= _this3._todayOffset - height / 2 - rowHeight * (todayHelperRowOffset + 1) || scrollTop <= _this3._todayOffset + (height - rowHeight) / 2 + rowHeight * todayHelperRowOffset)) {

        newState = { hide: true, direction: null };
      }

    if (newState != null) {
      _this3.setState({ showToday: newState });
    }
  };

  this.setDisplay = function (display) {
    _this3.setState({ display: display });
  };
}, _temp);
exports.default = Calendar;
process.env.NODE_ENV !== "production" ? Calendar.propTypes = {
  autoFocus: _propTypes2.default.bool,
  className: _propTypes2.default.string,
  DayComponent: _propTypes2.default.func,
  lastSelectableDate: _propTypes2.default.instanceOf(Date),
  disabledDates: _propTypes2.default.arrayOf(_propTypes2.default.instanceOf(Date)),
  originalDisabledDates: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.array]),
  disabledDays: _propTypes2.default.arrayOf(_propTypes2.default.number),
  display: _propTypes2.default.oneOf(['years', 'days']),
  displayOptions: _propTypes2.default.shape({
    hideYearsOnSelect: _propTypes2.default.bool,
    layout: _propTypes2.default.oneOf(['portrait', 'landscape']),
    overscanMonthCount: _propTypes2.default.number,
    shouldHeaderAnimate: _propTypes2.default.bool,
    showHeader: _propTypes2.default.bool,
    showMonthsForYears: _propTypes2.default.bool,
    showOverlay: _propTypes2.default.bool,
    showTodayHelper: _propTypes2.default.bool,
    showWeekdays: _propTypes2.default.bool,
    todayHelperRowOffset: _propTypes2.default.number
  }),
  height: _propTypes2.default.number,
  keyboardSupport: _propTypes2.default.bool,
  locale: _propTypes2.default.shape({
    blank: _propTypes2.default.string,
    headerFormat: _propTypes2.default.string,
    todayLabel: _propTypes2.default.shape({
      long: _propTypes2.default.string,
      short: _propTypes2.default.string
    }),
    weekdays: _propTypes2.default.arrayOf(_propTypes2.default.string),
    weekStartsOn: _propTypes2.default.oneOf([0, 1, 2, 3, 4, 5, 6])
  }),
  max: _propTypes2.default.instanceOf(Date),
  maxDate: _propTypes2.default.instanceOf(Date),
  min: _propTypes2.default.instanceOf(Date),
  preselected: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.array]),
  minDate: _propTypes2.default.instanceOf(Date),
  lastUpdate: _propTypes2.default.instanceOf(Date),
  onScroll: _propTypes2.default.func,
  onScrollEnd: _propTypes2.default.func,
  onSelect: _propTypes2.default.func,
  rowHeight: _propTypes2.default.number,
  tabIndex: _propTypes2.default.number,
  theme: _propTypes2.default.shape({
    floatingNav: _propTypes2.default.shape({
      background: _propTypes2.default.string,
      chevron: _propTypes2.default.string,
      color: _propTypes2.default.string
    }),
    headerColor: _propTypes2.default.string,
    selectionColor: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
    textColor: _propTypes2.default.shape({
      active: _propTypes2.default.string,
      default: _propTypes2.default.string
    }),
    todayColor: _propTypes2.default.string,
    weekdayColor: _propTypes2.default.string,
    weekdaysHeight: _propTypes2.default.string
  }),
  width: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  YearsComponent: _propTypes2.default.func
} : void 0;
;