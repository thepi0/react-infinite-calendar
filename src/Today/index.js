import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Today.scss';

export const DIRECTION_UP = 1;
export const DIRECTION_DOWN = -1;
const CHEVRON = "m33.36 20l-13.36 13.36-13.36-13.36 2.421666666666667-2.3433333333333337 9.296666666666667 9.296666666666667v-20.313333333333333h3.2833333333333314v20.313333333333336l9.373333333333335-9.296666666666667z";

export default class Today extends PureComponent {
  static propTypes = {
    scrollToDate: PropTypes.func,
    show: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    theme: PropTypes.object,
    todayLabel: PropTypes.string,
  };

  scrollToToday = () => {
    let {scrollToDate} = this.props;

    scrollToDate(new Date(), -40, true);
  };

  render() {
    let {todayLabel, show, theme} = this.props;
    return (
      <div
        className={classNames(styles.root, {
          [styles.show]: show,
          [styles.chevronUp]: show === DIRECTION_UP,
          [styles.chevronDown]: show === DIRECTION_DOWN,
        })}
        style={{
          backgroundColor: theme.floatingNav.background,
          color: theme.floatingNav.color,
        }}
        onClick={this.scrollToToday}
        ref="node"
      >
        {/*<svg
          className={styles.chevron}
          x="0px"
          y="0px"
          width="14px"
          height="14px"
          viewBox="0 0 512 512"
        >
          <path
            fill={theme.floatingNav.chevron || theme.floatingNav.color}
            d={CHEVRON}
          />
        </svg>*/}
        <svg fill="currentColor" className={styles.chevron} width="24" height="24" viewBox="0 0 40 40" style={{verticalAlign: 'middle', display: 'inline-block', fill: '#FFF'}} size="50" preserveAspectRatio="xMidYMid meet">
            <g>
                <path d="m33.36 20l-13.36 13.36-13.36-13.36 2.421666666666667-2.3433333333333337 9.296666666666667 9.296666666666667v-20.313333333333333h3.2833333333333314v20.313333333333336l9.373333333333335-9.296666666666667z">
                </path>
            </g>
        </svg>
      </div>
    );
  }
}
