var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import { withImmutableProps } from '../utils';
import defaultSelectionRenderer from './defaultSelectionRenderer';
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

import Slider from './Slider';

export default withImmutableProps(function (_ref) {
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
          return defaultSelectionRenderer(value.start, _extends({}, props, { key: value.start + idx }));
        } else {
          return React.createElement(
            'div',
            { key: value.start + idx, className: styles.range, style: { color: props.theme.headerColor } },
            defaultSelectionRenderer(value.start, _extends({}, props, { dateFormat: dateFormat, idx: idx, key: 'start', shouldAnimate: false })),
            defaultSelectionRenderer(value.end, _extends({}, props, { dateFormat: dateFormat, idx: idx, key: 'end', shouldAnimate: false }))
          );
        }
      });
      return React.createElement(
        Slider,
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