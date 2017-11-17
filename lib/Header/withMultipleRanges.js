'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

var _defaultSelectionRenderer = require('./defaultSelectionRenderer');

var _defaultSelectionRenderer2 = _interopRequireDefault(_defaultSelectionRenderer);

var _Slider = require('./Slider');

var _Slider2 = _interopRequireDefault(_Slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
  'root': 'Cal__Header__root',
  'landscape': 'Cal__Header__landscape',
  'dateWrapper': 'Cal__Header__dateWrapper',
  'day': 'Cal__Header__day',
  'wrapper': 'Cal__Header__wrapper',
  'blank': 'Cal__Header__blank',
  'active': 'Cal__Header__active',
  'year': 'Cal__Header__year',
  'date': 'Cal__Header__date',
  'range': 'Cal__Header__range'
};
exports.default = (0, _utils.withImmutableProps)(function (_ref) {
  var renderSelection = _ref.renderSelection;
  return {
    renderSelection: function renderSelection(values, props) {
      if (!values.length || !values[0].start && !values[0].end) {
        return null;
      }

      var dates = values.sort(function (a, b) {
        return a.start > b.start;
      });
      var index = props.displayIndex;

      var dateFormat = props.locale && props.locale.headerFormat || 'MMM Do';

      var dateElements = values.map(function (value, idx) {
        if (value.start === value.end) {
          return (0, _defaultSelectionRenderer2.default)(value.start, _extends({}, props, { key: value.start + idx }));
        } else {
          return _react2.default.createElement(
            'div',
            { key: value.start + idx, className: styles.range, style: { color: props.theme.headerColor } },
            (0, _defaultSelectionRenderer2.default)(value.start, _extends({}, props, { dateFormat: dateFormat, idx: idx, key: 'start', shouldAnimate: false })),
            (0, _defaultSelectionRenderer2.default)(value.end, _extends({}, props, { dateFormat: dateFormat, idx: idx, key: 'end', shouldAnimate: false }))
          );
        }
      });
      return _react2.default.createElement(
        _Slider2.default,
        {
          index: index !== -1 ? index : dates.length - 1,
          onChange: function onChange(chIndex) {
            return props.setDisplayIndex(chIndex, function () {
              return setTimeout(function () {
                return props.scrollToDate(dates[chIndex].start, 0, true);
              }, 50);
            });
          }
        },
        dateElements
      );
    }
  };
});
module.exports = exports['default'];