function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
var styles = {
  'root': 'Cal__Today__root',
  'show': 'Cal__Today__show',
  'chevron': 'Cal__Today__chevron',
  'chevronUp': 'Cal__Today__chevronUp',
  'chevronDown': 'Cal__Today__chevronDown'
};


export var DIRECTION_UP = 1;
export var DIRECTION_DOWN = -1;
var CHEVRON = "m33.36 20l-13.36 13.36-13.36-13.36 2.421666666666667-2.3433333333333337 9.296666666666667 9.296666666666667v-20.313333333333333h3.2833333333333314v20.313333333333336l9.373333333333335-9.296666666666667z";

var Today = function (_PureComponent) {
  _inherits(Today, _PureComponent);

  function Today() {
    var _temp, _this, _ret;

    _classCallCheck(this, Today);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _PureComponent.call.apply(_PureComponent, [this].concat(args))), _this), _this.scrollToToday = function () {
      var scrollToDate = _this.props.scrollToDate;


      scrollToDate(new Date(), -40, true);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Today.prototype.render = function render() {
    var _classNames;

    var _props = this.props,
        todayLabel = _props.todayLabel,
        showObject = _props.showObject,
        theme = _props.theme;


    return React.createElement(
      'div',
      {
        className: classNames(styles.root, (_classNames = {}, _classNames[styles.show] = showObject.show === true, _classNames[styles.chevronUp] = showObject.direction === DIRECTION_UP, _classNames[styles.chevronDown] = showObject.direction === DIRECTION_DOWN, _classNames)),
        style: {
          backgroundColor: theme.floatingNav.background,
          color: theme.floatingNav.color
        },
        onClick: this.scrollToToday,
        ref: 'node'
      },
      React.createElement(
        'svg',
        { fill: 'currentColor', className: styles.chevron, width: '24', height: '24', viewBox: '0 0 40 40', style: { verticalAlign: 'middle', display: 'inline-block', fill: '#FFF' }, size: '50', preserveAspectRatio: 'xMidYMid meet' },
        React.createElement(
          'g',
          null,
          React.createElement('path', { d: 'm33.36 20l-13.36 13.36-13.36-13.36 2.421666666666667-2.3433333333333337 9.296666666666667 9.296666666666667v-20.313333333333333h3.2833333333333314v20.313333333333336l9.373333333333335-9.296666666666667z' })
        )
      )
    );
  };

  return Today;
}(PureComponent);

export { Today as default };
process.env.NODE_ENV !== "production" ? Today.propTypes = {
  scrollToDate: PropTypes.func,
  show: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  theme: PropTypes.object,
  todayLabel: PropTypes.string
} : void 0;