import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {scrollbarSize} from '../utils';
import styles from './Weekdays.scss';

export default class Weekdays extends PureComponent {
  static propTypes = {
    locale: PropTypes.object,
    theme: PropTypes.object,
  };

  render() {
    const {weekdays, weekStartsOn, theme, miniCalendar} = this.props;
    let orderedWeekdays;
    if (miniCalendar) {
        orderedWeekdays = [...weekdays.slice(weekStartsOn, 6), ...weekdays.slice(1, weekStartsOn)];
    } else {
        orderedWeekdays = [...weekdays.slice(weekStartsOn, 7), ...weekdays.slice(0, weekStartsOn)];
    }
    
    return (
        <div className={styles.wrapper} style={{backgroundColor: (miniCalendar ? theme.miniweekdayBackground : theme.weekdayBackground), height:  (miniCalendar ? theme.miniWeekdaysHeight : theme.weekdaysHeight)}}>
          <ul
            className={classNames(styles.root, {[styles.mini]: miniCalendar})}
            style={{
              backgroundColor: (miniCalendar ? theme.miniWeekdayColor : theme.weekdayColor),
              color: theme.textColor.weekday,
              paddingRight: scrollbarSize,
            }}
            aria-hidden={true}
          >
            {orderedWeekdays.map((val, index) => (
              <li key={`Weekday-${index}`} className={styles.day}>{val}</li>
            ))}
          </ul>
      </div>
    );
  }
}
