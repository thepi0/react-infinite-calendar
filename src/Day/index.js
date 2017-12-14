import React, {PureComponent} from 'react';
import classNames from 'classnames';
import parse from 'date-fns/parse';
import styles from './Day.scss';

let isPreSelection = false;

export default class Day extends PureComponent {

  handleClick = () => {
    let {date, beforeLastDisabled, isDisabled, isPreSelected, onClick} = this.props;

    isPreSelection = isPreSelected;

    if (!isDisabled && typeof onClick === 'function') {
      onClick(parse(date), beforeLastDisabled, isPreSelected);
    }
  };

  renderSelection(selectionColor) {
    const {
      day,
      date,
      isToday,
      locale: {todayLabel},
      monthShort,
      theme: {textColor},
      selectionStyle,
    } = this.props;

    return (
      <div
        className={styles.selection}
        data-date={date}
      >
      </div>
    );
  }

  render() {
    const {
      className,
      currentYear,
      date,
      day,
      beforeLastDisabled,
      lastDisabled,
      handlers,
      isDisabled,
      isHighlighted,
      isToday,
      isSelected,
      isPreselectedDate,
      isPreSelectedSelected,
      isPreSelected,
      prevDisabled,
      nextDisabled,
      monthShort,
      testing,
      theme: {selectionColor, todayColor},
      year,
    } = this.props;

    return (
      <li
        className={classNames(styles.root, {
          [styles.today]: isToday,
          [styles.highlighted]: isHighlighted,
          [styles.selected]: isSelected,
          [styles.preselected]: isPreSelected,
          [styles.prevdisabled]: prevDisabled,
          [styles.nextdisabled]: nextDisabled,
          /*[styles.disabled]:
          isDisabled ||
          (isPreSelectedSelected !== null && isPreSelectedSelected && !isPreselectedDate),*/
          [styles.disabled]: isDisabled,
          [styles.enabled]: !isDisabled,
          [styles.beforelast]: beforeLastDisabled
        }, className)}
        onClick={this.handleClick}
        data-date={date}
        {...handlers}
      >
        {/*{day === 1 && <span className={styles.month}>{monthShort}</span>}*/}
        {day}
        {/*{day === 1 &&
          currentYear !== year &&
          <span className={styles.year}>{year}</span>}*/}
        {isSelected && this.renderSelection()}
      </li>
    );
  }
}
